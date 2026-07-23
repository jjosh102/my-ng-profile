import { Routes } from '@angular/router';
import { DashboardSection } from './components/dashboard-section/dashboard-section';
import { NotFound } from './components/not-found/not-found';

export const routes: Routes = [
  {
    path: '',
    component: DashboardSection,
  },
  {
    path: '**',
    component: NotFound
  }
];
