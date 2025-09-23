import { Component } from '@angular/core';

@Component({
  selector: 'app-user-profile-card',
  imports: [],
  templateUrl: './user-profile-card.html'
})
export class UserProfileCard {
  user = {
    name: 'Josh J Piluden',
    bio: '.NET developer who enjoys tinkering with tech in my free time—always learning and building along the way.',
    githubUrl: 'https://github.com/jjosh102',
    email: 'joshuajpiluden@gmail.com',
    avatarUrl: 'https://avatars.githubusercontent.com/u/50490077?v=4'
  };
}
