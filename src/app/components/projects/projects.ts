import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { GithubService } from '../../services/github.service';
import { GithubRepo } from '../../models/github.model';
import { ProjectCard } from './project-card/project-card';
import { ProjectCardSkeleton } from "./project-card-skeleton/project-card-skeleton";
import { GetLanguageColorPipe } from '../../shared/pipes/get-language-color-pipe';

@Component({
  selector: 'app-projects',
  imports: [ProjectCard, ProjectCardSkeleton, GetLanguageColorPipe],
  templateUrl: './projects.html',
})
export class Projects implements OnInit {

  private githubService = inject(GithubService);
  private destroyRef = inject(DestroyRef);
  repos = signal<readonly GithubRepo[]>([]);
  isLoading = signal<boolean>(true);
  searchQuery = signal<string>('');
  selectedLanguage = signal<string | null>(null);

  languages = computed(() => {
    const langs = new Set<string>();
    this.repos().forEach(repo => {
      if (repo.language) langs.add(repo.language);
    });
    return Array.from(langs).sort();
  });

  filteredRepos = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const lang = this.selectedLanguage();
    
    let filtered = this.repos();

    if (lang) {
      filtered = filtered.filter(repo => repo.language === lang);
    }

    if (query) {
      filtered = filtered.filter(repo =>
        repo.name.toLowerCase().includes(query) ||
        repo.description?.toLowerCase().includes(query) ||
        repo.topics?.some(topic => topic.toLowerCase().includes(query)) ||
        repo.language?.toLowerCase().includes(query)
      );
    }

    return filtered;
  });

  ngOnInit() {
    const subscription = this.githubService.getReposToBeShown()
      .subscribe({
        next: (result) => {
          if (result.isSuccess && result.value) {
            this.repos.set(result.value);
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
