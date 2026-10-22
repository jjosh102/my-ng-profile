import { computed, DestroyRef, DOCUMENT, effect, inject, Injectable, signal } from '@angular/core';
import { Theme } from '../models/theme.model';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly storageKey = 'app-theme';
  private readonly media = this.document.defaultView?.matchMedia('(prefers-color-scheme: dark)');
  private readonly preference = signal<Theme | null>(this.readPreference());
  private readonly systemDark = signal(this.media?.matches ?? true);

  readonly theme = computed<Theme>(() => this.preference() ?? (this.systemDark() ? 'dark' : 'light'));
  readonly isDarkTheme = computed(() => this.theme() === 'dark');

  constructor() {
    const controller = new AbortController();
    this.media?.addEventListener('change', event => this.systemDark.set(event.matches), { signal: controller.signal });
    this.document.defaultView?.addEventListener('storage', event => {
      if (event.key === this.storageKey || event.key === null) this.preference.set(this.readPreference());
    }, { signal: controller.signal });
    inject(DestroyRef).onDestroy(() => controller.abort());

    effect(() => {
      const theme = this.theme();
      this.document.documentElement.classList.toggle('dark', theme === 'dark');
      this.document.documentElement.classList.toggle('light', theme === 'light');
      this.document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
        ?.setAttribute('content', theme === 'dark' ? '#141416' : '#FAFAFA');
    });
  }

  toggleTheme(): void {
    const next = this.theme() === 'dark' ? 'light' : 'dark';
    this.preference.set(next);
    try {
      this.document.defaultView?.localStorage.setItem(this.storageKey, next);
    } catch {
      // Keep the chosen theme for this session when storage is blocked.
    }
  }

  private readPreference(): Theme | null {
    try {
      const stored = this.document.defaultView?.localStorage.getItem(this.storageKey);
      if (stored === 'dark' || stored === 'light') return stored;
    } catch {
      // Follow the device when storage is unavailable.
    }
    return null;
  }
}
