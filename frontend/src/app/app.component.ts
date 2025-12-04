import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatBadgeModule
  ],
  template: `
    <mat-toolbar color="primary" class="app-toolbar">
      <button mat-button routerLink="/" class="brand">
        <mat-icon>work</mat-icon>
        <span class="app-title">MyJobs</span>
      </button>

      <span class="spacer"></span>

      <nav class="nav-links">
        <button mat-button routerLink="/job-offers" routerLinkActive="active">
          <mat-icon>business_center</mat-icon>
          <span class="nav-text">Ofertas Laborales</span>
        </button>
        <button mat-button routerLink="/worker-services" routerLinkActive="active">
          <mat-icon>engineering</mat-icon>
          <span class="nav-text">Servicios</span>
        </button>
      </nav>

      @if (currentUser$ | async; as user) {
        @if (user.role === 'MODERADOR') {
          <button mat-button routerLink="/moderator" routerLinkActive="active" class="moderator-btn">
            <mat-icon>admin_panel_settings</mat-icon>
            <span class="nav-text">Moderación</span>
          </button>
        }

        <button mat-button routerLink="/dashboard" routerLinkActive="active">
          <mat-icon>dashboard</mat-icon>
          <span class="nav-text">Dashboard</span>
        </button>

        <button mat-icon-button [matMenuTriggerFor]="userMenu" class="user-menu-btn">
          @if (user.profileImage) {
            <img [src]="user.profileImage" class="user-avatar" alt="Avatar">
          } @else {
            <mat-icon>account_circle</mat-icon>
          }
        </button>

        <mat-menu #userMenu="matMenu" xPosition="before">
          <div class="user-info">
            <strong>{{ user.firstName }} {{ user.lastName }}</strong>
            <span class="user-role">{{ getRoleLabel(user.role) }}</span>
          </div>
          <mat-divider></mat-divider>
          <button mat-menu-item routerLink="/profile">
            <mat-icon>person</mat-icon>
            <span>Mi Perfil</span>
          </button>
          <button mat-menu-item routerLink="/edit-profile">
            <mat-icon>edit</mat-icon>
            <span>Editar Perfil</span>
          </button>
          <mat-divider></mat-divider>
          @if (user.role === 'EMPLEADOR') {
            <button mat-menu-item routerLink="/create-job-offer">
              <mat-icon>add_circle</mat-icon>
              <span>Nueva Oferta</span>
            </button>
            <button mat-menu-item routerLink="/manage-applications">
              <mat-icon>inbox</mat-icon>
              <span>Aplicaciones</span>
            </button>
          }
          @if (user.role === 'TRABAJADOR') {
            <button mat-menu-item routerLink="/create-service">
              <mat-icon>add_circle</mat-icon>
              <span>Nuevo Servicio</span>
            </button>
          }
          <mat-divider></mat-divider>
          <button mat-menu-item (click)="logout()" class="logout-btn">
            <mat-icon>logout</mat-icon>
            <span>Cerrar Sesión</span>
          </button>
        </mat-menu>
      } @else {
        <button mat-button routerLink="/login" class="login-btn">
          <mat-icon>login</mat-icon>
          <span class="nav-text">Iniciar Sesión</span>
        </button>
        <button mat-raised-button color="accent" routerLink="/register" class="register-btn">
          <mat-icon>person_add</mat-icon>
          <span class="nav-text">Registrarse</span>
        </button>
      }
    </mat-toolbar>

    <main class="main-content">
      <router-outlet></router-outlet>
    </main>

    <footer class="app-footer">
      <div class="footer-content">
        <p>&copy; 2024 MyJobs - Portal de Empleos y Servicios Profesionales</p>
        <p class="footer-links">
          <a routerLink="/job-offers">Ofertas</a> |
          <a routerLink="/worker-services">Servicios</a> |
          <a routerLink="/register">Registrarse</a>
        </p>
      </div>
    </footer>
  `,
  styles: [`
    .app-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      padding: 0 16px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .app-title {
      font-weight: bold;
      font-size: 18px;
    }
    .spacer {
      flex: 1 1 auto;
    }
    .nav-links {
      display: flex;
      gap: 4px;
    }
    .nav-text {
      margin-left: 4px;
    }
    .active {
      background: rgba(255,255,255,0.1);
    }
    .moderator-btn {
      color: #ffeb3b;
    }
    .user-menu-btn {
      margin-left: 8px;
    }
    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
    }
    .user-info {
      padding: 12px 16px;
      display: flex;
      flex-direction: column;
    }
    .user-role {
      font-size: 12px;
      color: #666;
      margin-top: 4px;
    }
    .logout-btn {
      color: #f44336;
    }
    .login-btn, .register-btn {
      margin-left: 8px;
    }
    .main-content {
      min-height: calc(100vh - 64px - 80px);
    }
    .app-footer {
      background: #333;
      color: white;
      padding: 24px;
      text-align: center;
    }
    .footer-content p {
      margin: 4px 0;
    }
    .footer-links a {
      color: #90caf9;
      text-decoration: none;
      margin: 0 8px;
    }
    .footer-links a:hover {
      text-decoration: underline;
    }
    @media (max-width: 768px) {
      .nav-text {
        display: none;
      }
      .app-title {
        display: none;
      }
      .nav-links button, .login-btn, .register-btn {
        min-width: 40px;
        padding: 0 8px;
      }
    }
  `]
})
export class AppComponent {
  authService = inject(AuthService);
  currentUser$ = this.authService.currentUser$;

  logout(): void {
    this.authService.logout();
  }

  getRoleLabel(role: string): string {
    const labels: Record<string, string> = {
      'TRABAJADOR': 'Profesional',
      'EMPLEADOR': 'Empleador',
      'MODERADOR': 'Moderador'
    };
    return labels[role] || role;
  }
}
