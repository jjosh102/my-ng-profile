import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageCacheService {
  get<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    if (!item) {
      return null;
    }
    const { data, expiry } = JSON.parse(item);
    if (Date.now() > expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return data as T;
  }

  set<T>(key: string, data: T, duration: number): void {
    const expiry = Date.now() + duration;
    localStorage.setItem(key, JSON.stringify({ data, expiry }));
  }
}
