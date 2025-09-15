import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { GithubService } from '../../services/github.service';
import { GithubRepo } from '../../models/github.model';
import { ProjectCard } from './project-card/project-card';
import { ProjectCardSkeleton } from "./project-card-skeleton/project-card-skeleton";

@Component({
  selector: 'app-projects',
  imports: [ProjectCard, ProjectCardSkeleton],
  templateUrl: './projects.html',
  styleUrl: './projects.css'
})
export class Projects implements OnInit {

  private githubService = inject(GithubService);
  private destroyRef = inject(DestroyRef);
  repos = signal<readonly GithubRepo[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit() {
    const subscription = this.githubService.getReposToBeShown()
      .subscribe({
        next: (result) => {
          if (result.isSuccess && result.value) {
            this.repos.set(result.value);
          }
        },
        complete: () => {
          this.isLoading.set(false);
        },
        error: (error: Error) => {
          this.isLoading.set(false);
        }
      },);

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

}
