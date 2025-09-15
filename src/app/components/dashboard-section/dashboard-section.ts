import { Component, effect, inject, input, OnInit, signal } from '@angular/core';
import { Projects } from "../projects/projects";
import { Footer } from '../footer/footer';
import { UserProfileCard } from './user-profile-card/user-profile-card';
import { ThemeService } from '../../services/theme.service';
import { HeatMap } from "../charts/heat-map/heat-map";

@Component({
  selector: 'app-dashboard-section',
  imports: [Projects, UserProfileCard, Footer, HeatMap],
  templateUrl: './dashboard-section.html',
  styleUrl: './dashboard-section.css'
})
export class DashboardSection  {
  private themeService = inject(ThemeService);
  private username = 'jjosh102';

  public topLanguagesUrl = signal<string>('');
  public githubStatsUrl = signal<string>('');

  constructor() {
    effect(() => {
      const currentTheme = this.themeService.theme();
      const themeSuffix = `chartreuse-${currentTheme}`;

      this.topLanguagesUrl.set(`https://github-readme-stats.vercel.app/api/top-langs?username=${this.username}&count_private=true&show_icons=true&locale=en&layout=compact&theme=${themeSuffix}`);
      this.githubStatsUrl.set(`https://github-readme-stats.vercel.app/api?username=${this.username}&count_private=true&show_icons=true&locale=en&theme=${themeSuffix}`);
    });
  }
}
