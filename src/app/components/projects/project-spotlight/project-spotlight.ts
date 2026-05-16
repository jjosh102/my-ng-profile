import { Component, input } from '@angular/core';
import { GithubRepo } from '../../../models/github.model';
import { GetLanguageColorPipe } from '../../../shared/pipes/get-language-color-pipe';
import { FormatTimeAgoPipe } from '../../../shared/pipes/format-time-ago-pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-project-spotlight',
  imports: [FormatTimeAgoPipe, GetLanguageColorPipe, RouterLink],
  templateUrl: './project-spotlight.html',
})
export class ProjectSpotlight {
  repo = input.required<GithubRepo>();
}
