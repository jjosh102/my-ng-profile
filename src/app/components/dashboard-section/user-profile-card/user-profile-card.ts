import { Component, inject } from '@angular/core';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-profile-card',
  imports: [],
  templateUrl: './user-profile-card.html'
})
export class UserProfileCard {
  private userService = inject(UserService);
  user = this.userService.user();
}
