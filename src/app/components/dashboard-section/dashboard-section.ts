import { Component } from '@angular/core';
import { Projects } from '../projects/projects';
import { Footer } from '../footer/footer';
import { UserProfileCard } from './user-profile-card/user-profile-card';

@Component({
  selector: 'app-dashboard-section',
  standalone: true,
  imports: [Projects, UserProfileCard, Footer],
  templateUrl: './dashboard-section.html'
})
export class DashboardSection {}
