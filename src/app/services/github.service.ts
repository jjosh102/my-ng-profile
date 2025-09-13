import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, map, mergeMap, Observable, of, retry, retryWhen, tap, throwError, timer } from "rxjs";
import { FailureResult, Result, SuccessResult } from "../models/result.model";
import { LocalStorageCacheService } from "./localStorage.service";
import { CommitDisplay, GithubCommit, GithubContributions, GithubRepo } from "../models/github.model";

@Injectable({
  providedIn: 'root',
})
export class GithubService {

  private readonly BaseAddress = "https://api.github.com";
  //private readonly ProxyBaseAddress = "https://obaki-core.onrender.com";
  private readonly CommitsEndpoint = "commits";
  private readonly CodeFrequencyEndpoint = "code-frequency";
  private readonly LanguagesEndpoint = "languages";
  private readonly ProxyApi = "https://obaki-core.onrender.com/api/v1/github-proxy";
  private readonly ReposEndpoint = "repos";
  private readonly UserReposEndpoint = "users/jjosh102/repos";
  private readonly RepoEndpoint = "repos/jjosh102";
  private readonly ContributionsEndpoint = "api/v1/github-contributions";

  private httpClient = inject(HttpClient);
  private cache = inject(LocalStorageCacheService);

  public getLanguagesUsed(repoName: string): Observable<Result<Record<string, number>>> {
    const cacheKey = `${this.LanguagesEndpoint}-${repoName}`;
    const endpoint = `${this.RepoEndpoint}/${repoName}/${this.LanguagesEndpoint}`;
    return this.getAndCache<Record<string, number>>(cacheKey, endpoint, 30 * 24 * 60 * 60 * 1000);
  }

  public getContributions(): Observable<Result<GithubContributions>> {
    const cacheKey = `contributions-data`;
    return this.getAndCache<GithubContributions>(cacheKey, this.ContributionsEndpoint, 24 * 60 * 60 * 1000, true);
  }

  public getCommitsForRepo(repoName: string): Observable<Result<readonly CommitDisplay[]>> {
    const cacheKey = `${this.CommitsEndpoint}-${repoName}`;
    const endpoint = `${this.RepoEndpoint}/${repoName}/${this.CommitsEndpoint}`;

    return this.getAndCache<readonly GithubCommit[]>(cacheKey, endpoint, 60 * 60 * 1000).pipe(
      map(result => {
        if (result.isSuccess && result.value) {
          const commits: readonly CommitDisplay[] = result.value.map(c => ({
            authorName: c.commit.committer.name,
            authorAvatarUrl: c.author?.avatar_url || '',
            commitDate: new Date(c.commit.committer.date),
            message: c.commit.message,
            commitUrl: c.html_url
          }));
          return { isSuccess: true, value: commits } as SuccessResult<readonly CommitDisplay[]>;
        }
        return { isSuccess: false, error: 'Failed to fetch commits.' } as FailureResult;
      })
    );
  }

  public getReposToBeShown(): Observable<Result<readonly GithubRepo[]>> {
    const cacheKey = this.ReposEndpoint;
    const endpoint = this.UserReposEndpoint;
    return this.getAndCache<readonly GithubRepo[]>(endpoint, cacheKey, 60 * 60 * 1000).pipe(
      map(result => {
        if (result.isSuccess && result.value) {
          console.log(this.UserReposEndpoint);
          const repos = result.value
            .filter(t => t.topics.includes('show'))
            .map(repo => ({
              ...repo,
              topics: repo.topics.filter(topic => topic.toLowerCase() !== 'show')
            }))
            .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
          return { isSuccess: true, value: repos } as SuccessResult<readonly GithubRepo[]>;
        }
        return { isSuccess: false, error: 'Failed to fetch repositories.' } as FailureResult;
      })
    );
  }

  public getCodeFrequencyStats(repoName: string): Observable<Result<readonly number[][]>> {
    const cacheKey = `${this.CodeFrequencyEndpoint}-${repoName}`;
    const endpoint = `${this.RepoEndpoint}/${repoName}/${this.CodeFrequencyEndpoint}`;
    const maxRetries = 5;
    const baseDelayMs = 3000;

    return this.getAndCache<readonly number[][]>(endpoint, cacheKey, 3600000).pipe(
      tap(result => {
        if (result.isSuccess && !result.value) {
          throw new Error('Received an empty value, retrying...');
        }
      }),
      //We will try to fetch the data 5 times, allowing GitHub to process the stats data for the first time
      retry({
        count: maxRetries,
        delay: (error, retryCount) => {
          if (retryCount >= maxRetries) {
            return throwError(() => new Error('Max retries exceeded.'));
          }
          const delay = baseDelayMs * retryCount;
          return timer(delay);
        },
      }),
      catchError(err => {
        console.error('Final error caught after retries:', err);
        return of({ isSuccess: false, error: err.message } as FailureResult);
      })
    );
  }

  private getAndCache<T>(
    endpoint: string,
    cacheKey: string,
    cacheDuration: number,
    useProxy = false
  ): Observable<Result<T>> {
    const cachedData = this.cache.get<T>(cacheKey);
    if (cachedData) {
      return of({ isSuccess: true, value: cachedData } as SuccessResult<T>);
    }

    return this.fetchDataAndHandleErrors<T>(endpoint, useProxy).pipe(
      tap(data => {
        this.cache.set(cacheKey, data, cacheDuration);
      }),

      map(data => ({ isSuccess: true, value: data } as SuccessResult<T>)),
      catchError(err => {
        console.error('Final error caught:', err);
        return of({ isSuccess: false, error: err.message } as FailureResult);
      })
    );
  }

  private fetchDataAndHandleErrors<T>(endpoint: string, useProxy: boolean): Observable<T> {
    const url = useProxy
      ? `${this.ProxyApi}?url=${endpoint}`
      : `${this.BaseAddress}/${endpoint}`;

    return this.httpClient.get<{ data?: T } | T>(url, {
      observe: 'response'
    }).pipe(

      map(response => {
        const body = response.body;
        const data: T =
          (body as { data?: T })?.data !== undefined
            ? (body as { data?: T }).data as T
            : body as T;

        if (data === undefined || data === null) {
          throw new Error('Empty or invalid response body');
        }
        return data;
      }),

      catchError((error: HttpErrorResponse): Observable<T> => {
        const isRateLimited = error.status === 403 &&
          error.headers.has('X-RateLimit-Remaining') &&
          error.headers.get('X-RateLimit-Remaining') === '0';

        if (isRateLimited && !useProxy) {
          console.warn('Rate limit exceeded. Falling back to proxy...');
          return this.fetchDataAndHandleErrors<T>(endpoint, true);
        } else {
          console.error('HTTP Error:', error);
          return throwError(() => new Error(`HTTP Error: ${error.status} - ${error.message}`));
        }
      })
    );
  }
}
