import { Component, input } from '@angular/core';
import { GithubRepo } from '../../../models/github.model';
import { GetLanguageColorPipe } from '../../../shared/pipes/get-language-color-pipe';
import { FormatTimeAgoPipe } from '../../../shared/pipes/format-time-ago-pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-project-card',
  imports: [FormatTimeAgoPipe, GetLanguageColorPipe, RouterLink],
  templateUrl: './project-card.html',
})
export class ProjectCard {
  repo = input.required<GithubRepo>();
}
