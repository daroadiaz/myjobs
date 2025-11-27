import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from './services/auth.service';
import { User } from './models/user.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  template: `
    <mat-toolbar color="primary" class="app-toolbar">
      <button mat-button routerLink="/">
        <mat-icon>work</mat-icon>
        <span class="app-title">MyJobs</span>
      </button>

      <span class="spacer"></span>

      <button mat-button routerLink="/job-offers">Ofertas Laborales</button>
      <button mat-button routerLink="/worker-services">Servicios</button>

      @if (currentUser$ | async; as user) {
        @if (user.role === 'MODERADOR') {
          <button mat-button routerLink="/moderator">
            <mat-icon>admin_panel_settings</mat-icon>
            Moderación
          </button>
        }
        <button mat-button routerLink="/dashboard">Dashboard</button>
        <button mat-button [matMenuTriggerFor]="userMenu">
          <mat-icon>account_circle</mat-icon>
          {{ user.firstName }}
        </button>
        <mat-menu #userMenu="matMenu">
          <button mat-menu-item routerLink="/profile">
            <mat-icon>person</mat-icon>
            <span>Mi Perfil</span>
          </button>
          <button mat-menu-item (click)="logout()">
            <mat-icon>logout</mat-icon>
            <span>Cerrar Sesión</span>
          </button>
        </mat-menu>
      } @else {
        <button mat-button routerLink="/login">Iniciar Sesión</button>
        <button mat-raised-button color="accent" routerLink="/register">Registrarse</button>
      }
    </mat-toolbar>

    <router-outlet></router-outlet>
  `,
  styles: [`
    .app-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    .app-title {
      margin-left: 8px;
      font-weight: bold;
    }
    .spacer {
      flex: 1 1 auto;
    }
  `]
})
export class AppComponent {
  authService = inject(AuthService);
  currentUser$ = this.authService.currentUser$;

  logout(): void {
    this.authService.logout();
  }
}
