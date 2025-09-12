import { computed, DOCUMENT, effect, inject, Injectable, signal } from "@angular/core";
import { Theme } from "../models/theme.model";

@Injectable({
  providedIn: 'root',
})

export class ThemeService {
  private readonly _theme = signal<Theme>('light');
  private readonly STORAGE_KEY = 'app-theme';
  private readonly document = inject(DOCUMENT)

  readonly theme = this._theme.asReadonly();
  readonly isDarkTheme = computed(() => this.theme() === 'dark');

  constructor() {

    this.initializeTheme();

    effect(() => {
      localStorage.setItem(this.STORAGE_KEY, this.theme());
      this.document.body.classList.remove('dark', 'light');
      this.document.body.classList.add(`${this.theme()}`);
    });
  }

  toggleTheme(): void {
    this._theme.update(currentTheme => (currentTheme === 'light' ? 'dark' : 'light'));
  }

  private initializeTheme(): void {
    const storedTheme = localStorage.getItem(this.STORAGE_KEY) as Theme;

    if (storedTheme) {
      this._theme.set(storedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this._theme.set(prefersDark ? 'dark' : 'light');
    }
  }
}
