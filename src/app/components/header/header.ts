import { Component, inject } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { ThemeDirective } from '../../theme.directive';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule, ThemeDirective],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {

  themeService = inject(ThemeService);
  readonly isDarkTheme = this.themeService.isDarkTheme;

  onThemeToggle(): void {
    this.themeService.toggleTheme();
  }
}
