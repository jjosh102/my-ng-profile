import { Component, DestroyRef, effect, inject, input, OnInit, signal } from '@angular/core';
import { GithubService } from '../../../../services/github.service';
import { CommitDisplay } from '../../../../models/github.model';
import { CommonModule } from '@angular/common';
import { FormatTimeAgoPipe } from '../../../../shared/pipes/format-time-ago-pipe';

@Component({
  selector: 'app-project-history',
  imports: [CommonModule, FormatTimeAgoPipe],
  templateUrl: './project-history.html',
  styleUrl: './project-history.css'
})
export class ProjectHistory implements OnInit {
  private githubService = inject(GithubService);
  private destroyRef = inject(DestroyRef);

  isLoading = signal<boolean>(true);
  repoName = input.required<string>();
  commits = signal<readonly CommitDisplay[]>([]);
  showAll = signal<boolean>(false);
  visibleCommits = signal<readonly CommitDisplay[]>([]);

  constructor() {
    effect(() => {
      const allCommits = this.commits();
      const isShowAll = this.showAll();
      if (isShowAll) {
        this.visibleCommits.set(allCommits);
      } else {
        this.visibleCommits.set(allCommits.slice(0, 5));
      }
    });
  }
  ngOnInit() {
    const subscription = this.githubService.getCommitsForRepo(this.repoName())
      .subscribe({
        next: (result) => {
          if (result.isSuccess && result.value) {
            this.commits.set(result.value);
          }
        },
        error: () => {
          this.isLoading.set(false);
        },
        complete: () => {
          this.isLoading.set(false);
        }
      },);

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }


  toggleExpand(): void {
    this.showAll.update(value => !value);
  }
}
