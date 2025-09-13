import { Component, signal } from '@angular/core';
import { Header } from "./components/header/header";
import { UserProfileCard } from './components/user-profile-card/user-profile-card';
import { DashboardSection } from './components/dashboard-section/dashboard-section';

@Component({
  selector: 'app-root',
  imports: [Header, UserProfileCard, DashboardSection],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  user = {
    name: 'Josh J Piluden',
    bio: '.NET developer by day, tech tinkerer by night—always curious, always building, and loving every bit of the journey!',
    githubUrl: 'https://github.com/jjosh102',
    email: 'joshuajpiluden@gmail.com',
    avatarUrl: 'https://avatars.githubusercontent.com/u/50490077?v=4'
  };
}
