import { Component, inject, signal } from '@angular/core';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [],
  templateUrl: './skills.html'
})
export class Skills {
  private userService = inject(UserService);
  user = this.userService.user;

  selectedCategory = signal<string | null>(null);

  selectCategory(category: string | null): void {
    this.selectedCategory.set(category);
  }
}
