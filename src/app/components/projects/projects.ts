import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { GithubService } from '../../services/github.service';
import { GithubRepo } from '../../models/github.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-projects',
  imports: [DatePipe],
  templateUrl: './projects.html',
  styleUrl: './projects.css'
})
export class Projects implements OnInit {

  private githubService = inject(GithubService);
  private destroyRef = inject(DestroyRef);
  repos = signal<readonly GithubRepo[]>([]);

  ngOnInit() {

    const get = this.githubService.getReposToBeShown()
      .subscribe({
        next: (result) => {
          if (result.isSuccess && result.value) {
            this.repos.set(result.value);
          }
        },
        complete: () => {

        },
        error: (error: Error) => {

        }
      },);

    this.destroyRef.onDestroy(() => {
      get.unsubscribe();
    });
  }

}
