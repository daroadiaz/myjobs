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
  // Ofertas Laborales
  {
    path: 'job-offers',
    loadComponent: () => import('./pages/job-offers/job-offers.component').then(m => m.JobOffersComponent)
  },
  {
    path: 'job-offers/:id',
    loadComponent: () => import('./pages/job-offer-detail/job-offer-detail.component').then(m => m.JobOfferDetailComponent)
  },
  {
    path: 'create-job-offer',
    canActivate: [authGuard, roleGuard(['EMPLEADOR'])],
    loadComponent: () => import('./pages/create-job-offer/create-job-offer.component').then(m => m.CreateJobOfferComponent)
  },
  // Servicios de Trabajadores
  {
    path: 'worker-services',
    loadComponent: () => import('./pages/worker-services/worker-services.component').then(m => m.WorkerServicesComponent)
  },
  {
    path: 'worker-services/:id',
    loadComponent: () => import('./pages/worker-service-detail/worker-service-detail.component').then(m => m.WorkerServiceDetailComponent)
  },
  {
    path: 'create-service',
    canActivate: [authGuard, roleGuard(['TRABAJADOR'])],
    loadComponent: () => import('./pages/create-service/create-service.component').then(m => m.CreateServiceComponent)
  },
  // Dashboard y Perfil
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
    path: 'edit-profile',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/edit-profile/edit-profile.component').then(m => m.EditProfileComponent)
  },
  {
    path: 'user/:id',
    loadComponent: () => import('./pages/user-profile/user-profile.component').then(m => m.UserProfileComponent)
  },
  // Gestión de Aplicaciones
  {
    path: 'manage-applications',
    canActivate: [authGuard, roleGuard(['EMPLEADOR'])],
    loadComponent: () => import('./pages/manage-applications/manage-applications.component').then(m => m.ManageApplicationsComponent)
  },
  // Moderación
  {
    path: 'moderator',
    canActivate: [authGuard, roleGuard(['MODERADOR'])],
    loadComponent: () => import('./pages/moderator/moderator.component').then(m => m.ModeratorComponent)
  },
  { path: '**', redirectTo: '/home' }
];
