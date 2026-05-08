import { Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { GithubService } from '../../../../services/github.service';
import { GetLanguageColorPipe } from '../../../../shared/pipes/get-language-color-pipe';
import { KeyValuePipe } from '@angular/common';

@Component({
  selector: 'app-languages-used',
  imports: [GetLanguageColorPipe, KeyValuePipe],
  templateUrl: './languages-used.html',
})
export class LanguagesUsed implements OnInit {
  private githubService = inject(GithubService);
  private destroyRef = inject(DestroyRef);
  repoName = input.required<string>();
  languages = signal<Record<string, number> | null>(null)

  calculatePercentage(value: number): number {
    const langs = this.languages();
    if (!langs) return 0;
    const total = Object.values(langs).reduce((acc, curr) => acc + curr, 0);
    return total === 0 ? 0 : Math.round((value / total) * 100);
  }


  ngOnInit() {
    const subscription = this.githubService.getLanguagesUsed(this.repoName())
      .subscribe({
        next: (result) => {
          if (result.isSuccess && result.value) {
            const languagesData = result.value;
            this.languages.set(languagesData);
          }
        }
      },);

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
