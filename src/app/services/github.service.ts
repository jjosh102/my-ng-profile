import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, mergeMap, Observable, of, retry, retryWhen, tap, throwError, timer } from 'rxjs';
import { FailureResult, Result, SuccessResult } from '../models/result.model';
import { LocalStorageCacheService } from './localStorage.service';
import { CommitDisplay, Contribution, GithubCommit, GithubContributions, GithubRepo, GithubRepoStats } from '../models/github.model';

@Injectable({
  providedIn: 'root',
})
export class GithubService {

  private readonly BASE_ADDRESS = 'https://api.github.com';
  private readonly REPO_ENDPOINT = 'repos/jjosh102';
  private readonly CACHE_HOUR_MS  = 60 * 60 * 1000;

  private httpClient = inject(HttpClient);
  private cache = inject(LocalStorageCacheService);

  public getLanguagesUsed(repoName: string): Observable<Result<Record<string, number>>> {
    const cacheKey = `languages-${repoName}`;
    const endpoint = `${this.REPO_ENDPOINT}/${repoName}/languages`;
    return this.getAndCache<Record<string, number>>(endpoint, cacheKey, 30 * 24 * this.CACHE_HOUR_MS );
  }

  public getContributions(): Observable<Result<readonly Contribution[]>> {
    const cacheKey = 'contributions';
    const endpoint = 'https://obaki-core.onrender.com/api/v1/github-contributions';

    return this.getAndCache<GithubContributions>(endpoint, cacheKey, this.CACHE_HOUR_MS , true).pipe(
      map(result => {
        if (result.isSuccess && result.value?.contributions) {
          const contributions: readonly Contribution[] = result.value.contributions.map(c => ({
            date: new Date(c.date).toISOString(),
            contributionCount: Number(c.contributionCount)
          }));
          return { isSuccess: true, value: contributions } as SuccessResult<readonly Contribution[]>;
        }
        return { isSuccess: false, error: 'Failed to fetch contributions.' } as FailureResult;
      })
    );
  }

  public getCommitsForRepo(repoName: string): Observable<Result<readonly CommitDisplay[]>> {
    const cacheKey = `commits-${repoName}`;
    const endpoint = `${this.REPO_ENDPOINT}/${repoName}/commits`;

    return this.getAndCache<readonly GithubCommit[]>(endpoint, cacheKey, this.CACHE_HOUR_MS ).pipe(
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
    return this.getAndCache<readonly GithubRepo[]>('users/jjosh102/repos', 'repos', this.CACHE_HOUR_MS ).pipe(
      map(result => {
        if (result.isSuccess && result.value) {
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

  public getRepoStats(): Observable<Result<GithubRepoStats>> {
    return this.getAndCache<readonly GithubRepo[]>('users/jjosh102/repos', 'repo-stats', 7 * 24 * this.CACHE_HOUR_MS ).pipe(
      map(result => {
        if (!result.isSuccess || !result.value) {
          return { isSuccess: false, error: 'Failed to fetch repositories.' } as FailureResult;
        }

        const repos = result.value;

        const totalStars = repos.reduce((acc, r) => acc + r.stargazers_count, 0);
        const totalForks = repos.reduce((acc, r) => acc + r.forks_count, 0);
        const totalWatchers = repos.reduce((acc, r) => acc + r.watchers_count, 0);
        const totalOpenIssues = repos.reduce((acc, r) => acc + r.open_issues_count, 0);

        const topLanguages = Object.entries(
          repos.reduce<Record<string, number>>((map, r) => {
            if (r.language) {
              map[r.language] = (map[r.language] || 0) + 1;
            }
            return map;
          }, {}))
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([name, count]) => ({ name, count }));

        const stats: GithubRepoStats = {
          topLanguages,
          totalStars,
          totalForks,
          totalWatchers,
          totalOpenIssues
        };

        return { isSuccess: true, value: stats } as SuccessResult<GithubRepoStats>;
      })
    );
  }

  public getCodeFrequencyStats(repoName: string): Observable<Result<readonly number[][]>> {
    const cacheKey = `code-frequency-${repoName}`;
    const endpoint = `${this.REPO_ENDPOINT}/${repoName}/stats/code_frequency`;
    const maxRetries = 5;
    const baseDelayMs = 3000;

    return this.getAndCache<readonly number[][]>(endpoint, cacheKey, this.CACHE_HOUR_MS ).pipe(
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
    isCustomUrl = false
  ): Observable<Result<T>> {
    const cachedData = this.cache.get<T>(cacheKey);
    if (cachedData) {
      return of({ isSuccess: true, value: cachedData } as SuccessResult<T>);
    }

    return this.fetchDataAndHandleErrors<T>(endpoint, isCustomUrl).pipe(
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

  private fetchDataAndHandleErrors<T>(endpoint: string, isCustomUrl = false): Observable<T> {
    const requestUrl = isCustomUrl
      ? endpoint
      : `${this.BASE_ADDRESS}/${endpoint}`;

    return this.httpClient.get<{ data?: T } | T>(requestUrl, {
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

        if (isRateLimited) {
          console.warn('Rate limit exceeded. Falling back to proxy...');
          const proxyUrl = `https://obaki-core.onrender.com/api/v1/github-proxy?url=${this.BASE_ADDRESS}${endpoint}`;
          return this.fetchDataAndHandleErrors<T>(proxyUrl, true);
        } else {
          console.error('HTTP Error:', error);
          return throwError(() => new Error(`HTTP Error: ${error.status} - ${error.message}`));
        }
      })
    );
  }
}
