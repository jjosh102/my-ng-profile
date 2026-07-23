import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { FailureResult, Result, SuccessResult } from '../models/result.model';
import { GithubRepo } from '../models/github.model';
import { LocalStorageCacheService } from './localStorage.service';

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  private readonly baseAddress = 'https://api.github.com';
  private readonly cacheDuration = 60 * 60 * 1000;
  private readonly httpClient = inject(HttpClient);
  private readonly cache = inject(LocalStorageCacheService);

  getReposToBeShown(): Observable<Result<readonly GithubRepo[]>> {
    return this.getAndCache<readonly GithubRepo[]>('users/jjosh102/repos', 'repos').pipe(
      map(result => {
        if (!result.isSuccess || !result.value) {
          return { isSuccess: false, error: 'Failed to fetch repositories.' } as FailureResult;
        }

        const repos = result.value
          .filter(repo => repo.topics.includes('show'))
          .map(repo => ({
            ...repo,
            topics: repo.topics.filter(topic => topic.toLowerCase() !== 'show')
          }))
          .sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at));

        return { isSuccess: true, value: repos } as SuccessResult<readonly GithubRepo[]>;
      })
    );
  }

  private getAndCache<T>(endpoint: string, cacheKey: string): Observable<Result<T>> {
    const cachedData = this.cache.get<T>(cacheKey);
    if (cachedData) {
      return of({ isSuccess: true, value: cachedData } as SuccessResult<T>);
    }

    return this.httpClient.get<T>(`${this.baseAddress}/${endpoint}`).pipe(
      tap(data => this.cache.set(cacheKey, data, this.cacheDuration)),
      map(data => ({ isSuccess: true, value: data }) as SuccessResult<T>),
      catchError((error: HttpErrorResponse) => {
        const message = error.status === 0
          ? 'GitHub could not be reached.'
          : `GitHub returned HTTP ${error.status}.`;
        return of({ isSuccess: false, error: message } as FailureResult);
      })
    );
  }
}
