import { Routes } from '@angular/router';
import { DashboardSection } from './components/dashboard-section/dashboard-section';
import { NotFound } from './components/not-found/not-found';
import { Projects } from './components/projects/projects';
import { ProjectDetails } from './components/projects/project-details/project-details';

export const routes: Routes = [
  {
    path: '',
    component: DashboardSection,
  },
  {
    path: 'project/details/:projectId',
    component: ProjectDetails
  },
  {
    path: '**',
    component: NotFound
  }
];
