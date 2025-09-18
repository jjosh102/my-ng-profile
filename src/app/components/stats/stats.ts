import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { GithubService } from '../../services/github.service';
import { GithubRepoStats } from '../../models/github.model';
import { GetLanguageColorPipe } from '../../shared/pipes/get-language-color-pipe';

@Component({
  selector: 'app-stats',
  imports: [GetLanguageColorPipe],
  templateUrl: './stats.html',
})
export class Stats implements OnInit {

  private githubService = inject(GithubService);
  private destroyRef = inject(DestroyRef);
  stats = signal<GithubRepoStats | null>(null);
  isLoading = signal<boolean>(true);

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
