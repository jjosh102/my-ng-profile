import { Injectable, signal } from '@angular/core';
import { UserProfile } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly profile: UserProfile = {
    name: 'Josh J Piluden',
    title: '.NET Developer',
    bio: 'I’m a .NET developer working across web apps, automation, and legacy systems. I care about useful software, clear interfaces, and improvements people can actually measure.',
    githubUrl: 'https://github.com/jjosh102',
    email: 'joshuajpiluden@gmail.com',
    avatarUrl: 'josh-avatar.jpg',
    socialLinks: [
      { name: 'GitHub', url: 'https://github.com/jjosh102', icon: 'github' },
      { name: 'LinkedIn', url: 'https://www.linkedin.com/in/josh-piluden-b06798110/', icon: 'linkedin' },
      { name: 'Email', url: 'mailto:joshuajpiluden@gmail.com', icon: 'email' }
    ]
  };

  readonly user = signal(this.profile);
}
