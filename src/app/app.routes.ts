import { Routes } from '@angular/router';
import { DashboardSection } from './components/dashboard-section/dashboard-section';
import { NotFound } from './components/not-found/not-found';

export const routes: Routes = [

  {
    path: '',
    component: DashboardSection,
    children: [
      // {
      //   path: '',
      //   redirectTo: 'tasks',
      //   pathMatch: 'prefix'
      // },
      // {
      //   path: 'tasks',
      //   component: TasksComponent
      // },
      // {
      //   path: 'tasks/new',
      //   component: NewTaskComponent,
      //   canDeactivate: [canLeaveEditPage]
      // }
    ],
  },
  {
    path: '**',
    component: NotFound
  }
];
