import { computed, DOCUMENT, effect, inject, Injectable, signal } from '@angular/core';
import { Theme } from '../models/theme.model';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly storageKey = 'app-theme';
  private readonly themeValue = signal<Theme>(this.readInitialTheme());

  readonly theme = this.themeValue.asReadonly();
  readonly isDarkTheme = computed(() => this.theme() === 'dark');

  constructor() {
    effect(() => {
      const theme = this.theme();
      this.document.documentElement.classList.toggle('dark', theme === 'dark');
      this.document.documentElement.classList.toggle('light', theme === 'light');
      this.document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
        ?.setAttribute('content', theme === 'dark' ? '#141416' : '#FAFAFA');
      try {
        this.document.defaultView?.localStorage.setItem(this.storageKey, theme);
      } catch {
        // Storage may be blocked; the theme toggle should still work.
      }
    });
  }

  toggleTheme(): void {
    this.themeValue.update(theme => theme === 'dark' ? 'light' : 'dark');
  }

  private readInitialTheme(): Theme {
    try {
      const stored = this.document.defaultView?.localStorage.getItem(this.storageKey);
      if (stored === 'dark' || stored === 'light') return stored;
    } catch {
      // Fall back to the site's default dark palette.
    }
    return 'dark';
  }
}
