import { Component, input } from '@angular/core';
import { GithubRepo } from '../../../models/github.model';
import { DatePipe } from '@angular/common';
import { GetLanguageColorPipe } from '../../../shared/pipes/get-language-color-pipe';
import { FormatTimeAgoPipe } from '../../../shared/pipes/format-time-ago-pipe';

@Component({
  selector: 'app-project-card',
  imports: [FormatTimeAgoPipe, GetLanguageColorPipe],
  templateUrl: './project-card.html',
  styleUrl: './project-card.css'
})
export class ProjectCard {

  repo = input.required<GithubRepo>();


}
