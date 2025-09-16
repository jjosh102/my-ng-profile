import { Component } from '@angular/core';

@Component({
  selector: 'app-user-profile-card',
  imports: [],
  templateUrl: './user-profile-card.html'
})
export class UserProfileCard {
  user = {
    name: 'Josh J Piluden',
    bio: '.NET developer by day, tech tinkerer by night—always curious, always building, and loving every bit of the journey!',
    githubUrl: 'https://github.com/jjosh102',
    email: 'joshuajpiluden@gmail.com',
    avatarUrl: 'https://avatars.githubusercontent.com/u/50490077?v=4'
  };
}
