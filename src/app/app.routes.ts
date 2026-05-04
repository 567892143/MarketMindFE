import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/landing/landing.component')
        .then(m => m.LandingComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component')
        .then(m => m.DashboardComponent)
  },
  {
    path: 'sector/:name',
    loadComponent: () =>
      import('./pages/sector-detail/sector-detail.component')
        .then(m => m.SectorDetailComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];