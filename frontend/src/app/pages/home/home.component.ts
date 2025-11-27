import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatCardModule, MatIconModule],
  template: `
    <div class="hero">
      <div class="hero-content">
        <h1>Bienvenido a MyJobs</h1>
        <p>El portal donde encuentras trabajo y ofreces tus servicios profesionales</p>
        <div class="hero-buttons">
          <button mat-raised-button color="primary" routerLink="/job-offers">
            <mat-icon>work</mat-icon>
            Ver Ofertas Laborales
          </button>
          <button mat-raised-button color="accent" routerLink="/worker-services">
            <mat-icon>people</mat-icon>
            Ver Servicios
          </button>
        </div>
      </div>
    </div>

    <div class="container features">
      <h2>¿Cómo funciona?</h2>
      <div class="features-grid">
        <mat-card>
          <mat-card-header>
            <mat-icon color="primary">business</mat-icon>
            <mat-card-title>Para Empleadores</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            Publica ofertas laborales, recibe aplicaciones y encuentra el talento que necesitas.
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-header>
            <mat-icon color="accent">person</mat-icon>
            <mat-card-title>Para Trabajadores</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            Aplica a ofertas laborales y publica tus servicios profesionales para conseguir clientes.
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-header>
            <mat-icon color="primary">verified</mat-icon>
            <mat-card-title>Moderación</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            Todas las publicaciones son revisadas para garantizar calidad y seguridad.
          </mat-card-content>
        </mat-card>
      </div>

      <div class="cta">
        <h3>¿Listo para empezar?</h3>
        <button mat-raised-button color="primary" routerLink="/register">
          Regístrate Ahora
        </button>
      </div>
    </div>
  `,
  styles: [`
    .hero {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 100px 20px;
      text-align: center;
    }
    .hero-content h1 {
      font-size: 3rem;
      margin: 0 0 20px 0;
    }
    .hero-content p {
      font-size: 1.5rem;
      margin: 0 0 30px 0;
    }
    .hero-buttons {
      display: flex;
      gap: 20px;
      justify-content: center;
    }
    .features {
      padding: 60px 20px;
    }
    .features h2 {
      text-align: center;
      margin-bottom: 40px;
    }
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
      margin-bottom: 60px;
    }
    .cta {
      text-align: center;
    }
    .cta h3 {
      margin-bottom: 20px;
    }
  `]
})
export class HomeComponent {}
