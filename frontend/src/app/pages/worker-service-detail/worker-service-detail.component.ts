import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { WorkerServiceService } from '../../services/worker-service.service';
import { WorkerService } from '../../models/worker-service.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-worker-service-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="container">
      @if (service) {
        <mat-card class="service-card">
          <mat-card-header>
            <div mat-card-avatar class="service-avatar">
              <mat-icon>build</mat-icon>
            </div>
            <mat-card-title>{{ service.title }}</mat-card-title>
            <mat-card-subtitle>
              <span class="worker">{{ service.workerName }}</span>
              @if (service.location) {
                <span class="location">
                  <mat-icon inline>location_on</mat-icon>
                  {{ service.location }}
                </span>
              }
            </mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <div class="chips-row">
              <mat-chip-set>
                <mat-chip>
                  <mat-icon matChipAvatar>category</mat-icon>
                  {{ service.category }}
                </mat-chip>
                @if (service.experienceYears) {
                  <mat-chip>
                    <mat-icon matChipAvatar>work_history</mat-icon>
                    {{ service.experienceYears }}
                  </mat-chip>
                }
                @if (service.availability) {
                  <mat-chip>
                    <mat-icon matChipAvatar>schedule</mat-icon>
                    {{ service.availability }}
                  </mat-chip>
                }
                <mat-chip>
                  <mat-icon matChipAvatar>visibility</mat-icon>
                  {{ service.views }} vistas
                </mat-chip>
              </mat-chip-set>
            </div>

            @if (service.priceMin || service.priceMax) {
              <div class="price-section">
                <h3><mat-icon>payments</mat-icon> Precio</h3>
                <p class="price">
                  @if (service.priceMin && service.priceMax) {
                    ${{ service.priceMin | number }} - ${{ service.priceMax | number }}
                  } @else if (service.priceMin) {
                    Desde ${{ service.priceMin | number }}
                  } @else {
                    Hasta ${{ service.priceMax | number }}
                  }
                  @if (service.pricePeriod) {
                    <span class="period">/ {{ service.pricePeriod }}</span>
                  }
                </p>
              </div>
            }

            <mat-divider></mat-divider>

            <div class="section">
              <h3><mat-icon>description</mat-icon> Descripción del Servicio</h3>
              <p class="description">{{ service.description }}</p>
            </div>

            @if (service.skills) {
              <mat-divider></mat-divider>
              <div class="section">
                <h3><mat-icon>psychology</mat-icon> Habilidades</h3>
                <div class="skills-list">
                  @for (skill of getSkillsList(); track skill) {
                    <mat-chip>{{ skill }}</mat-chip>
                  }
                </div>
              </div>
            }

            @if (service.portfolio) {
              <mat-divider></mat-divider>
              <div class="section">
                <h3><mat-icon>folder_special</mat-icon> Portfolio / Trabajos Anteriores</h3>
                <p class="portfolio">{{ service.portfolio }}</p>
              </div>
            }

            <mat-divider></mat-divider>

            <div class="worker-section">
              <h3><mat-icon>person</mat-icon> Información del Profesional</h3>
              <p><strong>Nombre:</strong> {{ service.workerName }}</p>
              @if (service.workerEmail) {
                <p><strong>Contacto:</strong> {{ service.workerEmail }}</p>
              }
              <button mat-stroked-button color="primary" [routerLink]="['/user', service.workerId]">
                <mat-icon>person</mat-icon>
                Ver Perfil Completo
              </button>
            </div>

            <div class="meta-info">
              <small>Publicado: {{ service.createdAt | date:'longDate' }}</small>
            </div>
          </mat-card-content>

          <mat-card-actions align="end">
            <button mat-button routerLink="/worker-services">
              <mat-icon>arrow_back</mat-icon>
              Volver
            </button>
            @if (isAuthenticated && currentUser?.role === 'EMPLEADOR') {
              <a mat-raised-button color="primary" [href]="'mailto:' + service.workerEmail + '?subject=Interesado en su servicio: ' + service.title">
                <mat-icon>email</mat-icon>
                Contactar
              </a>
            }
            @if (!isAuthenticated) {
              <button mat-raised-button color="accent" routerLink="/login">
                <mat-icon>login</mat-icon>
                Iniciar sesión para contactar
              </button>
            }
          </mat-card-actions>
        </mat-card>
      } @else {
        <mat-card>
          <mat-card-content>
            <p>Cargando servicio...</p>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 900px;
      margin: 0 auto;
    }
    .service-card {
      padding: 20px;
    }
    .service-avatar {
      background-color: #4caf50;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      width: 48px;
      height: 48px;
    }
    .service-avatar mat-icon {
      color: white;
    }
    mat-card-subtitle {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      align-items: center;
      margin-top: 8px;
    }
    .worker {
      font-weight: 500;
      color: #333;
    }
    .location {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #666;
    }
    .location mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
    .chips-row {
      margin: 20px 0;
    }
    .price-section {
      background: #e8f5e9;
      padding: 16px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .price-section h3 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 8px;
      color: #2e7d32;
    }
    .price {
      font-size: 24px;
      font-weight: 600;
      color: #2e7d32;
      margin: 0;
    }
    .period {
      font-size: 16px;
      font-weight: normal;
      color: #666;
    }
    .section {
      padding: 20px 0;
    }
    .section h3 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 12px;
      color: #333;
    }
    .description, .portfolio {
      white-space: pre-line;
      line-height: 1.6;
      color: #555;
    }
    .skills-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .worker-section {
      background: #f5f5f5;
      padding: 16px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .worker-section h3 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 12px;
    }
    .worker-section p {
      margin: 8px 0;
    }
    .worker-section button {
      margin-top: 12px;
    }
    .meta-info {
      text-align: right;
      color: #999;
      margin-top: 20px;
    }
    mat-divider {
      margin: 0;
    }
  `]
})
export class WorkerServiceDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private workerServiceService = inject(WorkerServiceService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  service?: WorkerService;
  isAuthenticated = this.authService.isAuthenticated();
  currentUser = this.authService.getCurrentUser();

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.workerServiceService.getWorkerServiceById(+id).subscribe({
        next: (s) => this.service = s,
        error: () => {
          this.snackBar.open('Error al cargar el servicio', 'Cerrar', {
            duration: 5000
          });
        }
      });
    }
  }

  getSkillsList(): string[] {
    if (!this.service?.skills) return [];
    return this.service.skills.split(',').map(s => s.trim()).filter(s => s);
  }
}
