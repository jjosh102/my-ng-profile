import { Component, OnInit } from '@angular/core';
import { Projects } from "../projects/projects";
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-dashboard-section',
  imports: [Projects, Footer],
  templateUrl: './dashboard-section.html',
  styleUrl: './dashboard-section.css'
})
export class DashboardSection implements OnInit {

  username = 'jjosh102';
  theme = 'chartreuse-dark';

  topLanguagesUrl: string | undefined;
  githubStatsUrl: string | undefined;

  ngOnInit(): void {
    this.topLanguagesUrl = `https://github-readme-stats.vercel.app/api/top-langs?username=${this.username}&count_private=true&show_icons=true&locale=en&layout=compact&theme=${this.theme}`;
    this.githubStatsUrl = `https://github-readme-stats.vercel.app/api?username=${this.username}&count_private=true&show_icons=true&locale=en&theme=${this.theme}`;
  }
}
