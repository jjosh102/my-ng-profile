import { Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { GithubService } from '../../../services/github.service';
import { GithubRepo } from '../../../models/github.model';
import { GetLanguageColorPipe } from '../../../shared/pipes/get-language-color-pipe';
import { FormatSizePipe } from '../../../shared/pipes/format-size-pipe';
import { FormatTimeAgoPipe } from '../../../shared/pipes/format-time-ago-pipe';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-project-details',
  imports: [GetLanguageColorPipe, FormatSizePipe, FormatTimeAgoPipe, DatePipe],
  templateUrl: './project-details.html',
  styleUrl: './project-details.css'
})
export class ProjectDetails implements OnInit {
  private githubService = inject(GithubService);
  private destroyRef = inject(DestroyRef);
  projectId = input.required<string>();
  repo = signal<GithubRepo | undefined>(undefined);

  ngOnInit() {
    console.log(this.projectId());
    const get = this.githubService.getReposToBeShown()
      .subscribe({
        next: (result) => {
          if (result.isSuccess && result.value) {
            const repoData = result.value.find(repo => repo.id === Number(this.projectId()))
            this.repo.set(repoData);
          }
        }
      },);

    this.destroyRef.onDestroy(() => {
      get.unsubscribe();
    });
  }

}
