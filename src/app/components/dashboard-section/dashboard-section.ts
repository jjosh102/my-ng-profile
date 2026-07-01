import { Component, signal } from '@angular/core';
import { Projects } from "../projects/projects";
import { Footer } from '../footer/footer';
import { UserProfileCard } from './user-profile-card/user-profile-card';
import { Stats } from "./stats/stats";
import { Skills } from './skills/skills';
import { Experience } from './experience/experience';
import { CompatibilityAnalyzer } from './compatibility-analyzer/compatibility-analyzer';

@Component({
  selector: 'app-dashboard-section',
  standalone: true,
  imports: [
    Projects, 
    UserProfileCard, 
    Footer, 
    Stats, 
    Skills,
    Experience,
    CompatibilityAnalyzer
  ],
  templateUrl: './dashboard-section.html'
})
export class DashboardSection {
  activeTab = signal<'skills' | 'experience' | 'analyzer'>('skills');

  setActiveTab(tab: 'skills' | 'experience' | 'analyzer'): void {
    this.activeTab.set(tab);
  }
}
