import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly _user = {
    name: 'Josh J Piluden',
    bio: 'I\'m a .NET dev who loves building things and nerding out over new tech—always learning and hacking away.',
    githubUrl: 'https://github.com/jjosh102',
    email: 'joshuajpiluden@gmail.com',
    avatarUrl: 'https://avatars.githubusercontent.com/u/50490077?v=4'
  };

  user = signal(this._user);
}
