import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'job-offers',
    loadComponent: () => import('./pages/job-offers/job-offers.component').then(m => m.JobOffersComponent)
  },
  {
    path: 'job-offers/:id',
    loadComponent: () => import('./pages/job-offer-detail/job-offer-detail.component').then(m => m.JobOfferDetailComponent)
  },
  {
    path: 'worker-services',
    loadComponent: () => import('./pages/worker-services/worker-services.component').then(m => m.WorkerServicesComponent)
  },
  {
    path: 'worker-services/:id',
    loadComponent: () => import('./pages/worker-service-detail/worker-service-detail.component').then(m => m.WorkerServiceDetailComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'moderator',
    canActivate: [authGuard, roleGuard(['MODERADOR'])],
    loadComponent: () => import('./pages/moderator/moderator.component').then(m => m.ModeratorComponent)
  },
  { path: '**', redirectTo: '/home' }
];
