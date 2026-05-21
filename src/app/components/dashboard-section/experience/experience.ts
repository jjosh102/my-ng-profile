import { Component, inject, signal } from '@angular/core';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [],
  templateUrl: './experience.html'
})
export class Experience {
  private userService = inject(UserService);
  user = this.userService.user;

  expandedIndices = signal<Record<number, boolean>>({ 0: true });

  toggleExpand(index: number): void {
    this.expandedIndices.update(current => ({
      ...current,
      [index]: !current[index]
    }));
  }

  isExpanded(index: number): boolean {
    return !!this.expandedIndices()[index];
  }
}
