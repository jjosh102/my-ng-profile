import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.html',
})
export class Header {
  private readonly themeService = inject(ThemeService);

  onThemeToggle(): void {
    this.themeService.toggleTheme();
  }
}
