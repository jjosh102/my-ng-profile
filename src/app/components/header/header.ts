import { Component, inject } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { CommonModule } from '@angular/common';
import { ThemeDirective } from '../../shared/directives/theme.directive';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, ThemeDirective, RouterLink],
  templateUrl: './header.html',
})
export class Header {

  themeService = inject(ThemeService);
  readonly isDarkTheme = this.themeService.isDarkTheme;

  onThemeToggle(): void {
    this.themeService.toggleTheme();
  }
}
