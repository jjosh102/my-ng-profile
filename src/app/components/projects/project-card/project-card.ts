import { Component, input } from '@angular/core';
import { GithubRepo } from '../../../models/github.model';
import { FormatTimeAgoPipe } from '../../../shared/pipes/format-time-ago-pipe';

@Component({
  selector: 'app-project-card',
  imports: [FormatTimeAgoPipe],
  templateUrl: './project-card.html',
})
export class ProjectCard {
  readonly repo = input.required<GithubRepo>();
  readonly index = input.required<number>();
}
