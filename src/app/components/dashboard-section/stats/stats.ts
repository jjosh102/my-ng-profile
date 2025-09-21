import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { GetLanguageColorPipe } from '../../../shared/pipes/get-language-color-pipe';
import { GithubService } from '../../../services/github.service';
import { GithubRepoStats } from '../../../models/github.model';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-stats',
  imports: [GetLanguageColorPipe, NgStyle],
  templateUrl: './stats.html',
})
export class Stats implements OnInit {

  private githubService = inject(GithubService);
  private destroyRef = inject(DestroyRef);
  stats = signal<GithubRepoStats | null>(null);
  isLoading = signal<boolean>(true);
  hoveredItem: any | null = null;

  ngOnInit() {
    const subscription = this.githubService.getRepoStats()
      .subscribe({
        next: (result) => {
          if (result.isSuccess && result.value) {
            this.stats.set(result.value);
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

}
