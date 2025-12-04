import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { JobOfferService } from '../../services/job-offer.service';
import { JobOffer } from '../../models/job-offer.model';
import { AuthService } from '../../services/auth.service';
import { ApplyJobDialogComponent } from '../../components/apply-job-dialog/apply-job-dialog.component';

@Component({
  selector: 'app-job-offer-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  template: `
    <div class="container">
      @if (jobOffer) {
        <mat-card class="job-card">
          <mat-card-header>
            <div mat-card-avatar class="job-avatar">
              <mat-icon>work</mat-icon>
            </div>
            <mat-card-title>{{ jobOffer.title }}</mat-card-title>
            <mat-card-subtitle>
              <span class="company">{{ jobOffer.employerName }}</span>
              @if (jobOffer.location) {
                <span class="location">
                  <mat-icon inline>location_on</mat-icon>
                  {{ jobOffer.location }}
                </span>
              }
            </mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <div class="chips-row">
              <mat-chip-set>
                <mat-chip>
                  <mat-icon matChipAvatar>category</mat-icon>
                  {{ jobOffer.category }}
                </mat-chip>
                @if (jobOffer.jobType) {
                  <mat-chip>
                    <mat-icon matChipAvatar>schedule</mat-icon>
                    {{ jobOffer.jobType }}
                  </mat-chip>
                }
                <mat-chip>
                  <mat-icon matChipAvatar>visibility</mat-icon>
                  {{ jobOffer.views }} vistas
                </mat-chip>
              </mat-chip-set>
            </div>

            @if (jobOffer.salaryMin || jobOffer.salaryMax) {
              <div class="salary-section">
                <h3><mat-icon>payments</mat-icon> Salario</h3>
                <p class="salary">
                  @if (jobOffer.salaryMin && jobOffer.salaryMax) {
                    ${{ jobOffer.salaryMin | number }} - ${{ jobOffer.salaryMax | number }}
                  } @else if (jobOffer.salaryMin) {
                    Desde ${{ jobOffer.salaryMin | number }}
                  } @else {
                    Hasta ${{ jobOffer.salaryMax | number }}
                  }
                  @if (jobOffer.salaryPeriod) {
                    <span class="period">/ {{ jobOffer.salaryPeriod }}</span>
                  }
                </p>
              </div>
            }

            <mat-divider></mat-divider>

            <div class="section">
              <h3><mat-icon>description</mat-icon> Descripción</h3>
              <p class="description">{{ jobOffer.description }}</p>
            </div>

            @if (jobOffer.requirements) {
              <mat-divider></mat-divider>
              <div class="section">
                <h3><mat-icon>checklist</mat-icon> Requisitos</h3>
                <p class="requirements">{{ jobOffer.requirements }}</p>
              </div>
            }

            @if (jobOffer.benefits) {
              <mat-divider></mat-divider>
              <div class="section">
                <h3><mat-icon>card_giftcard</mat-icon> Beneficios</h3>
                <p class="benefits">{{ jobOffer.benefits }}</p>
              </div>
            }

            <mat-divider></mat-divider>

            <div class="employer-section">
              <h3><mat-icon>business</mat-icon> Información del Empleador</h3>
              <p><strong>Nombre:</strong> {{ jobOffer.employerName }}</p>
              @if (jobOffer.employerEmail) {
                <p><strong>Contacto:</strong> {{ jobOffer.employerEmail }}</p>
              }
              <button mat-stroked-button color="primary" [routerLink]="['/user', jobOffer.employerId]">
                <mat-icon>person</mat-icon>
                Ver Perfil del Empleador
              </button>
            </div>

            <div class="meta-info">
              <small>
                Publicado: {{ jobOffer.createdAt | date:'longDate' }}
                @if (jobOffer.expiresAt) {
                  | Expira: {{ jobOffer.expiresAt | date:'longDate' }}
                }
              </small>
            </div>
          </mat-card-content>

          <mat-card-actions align="end">
            <button mat-button routerLink="/job-offers">
              <mat-icon>arrow_back</mat-icon>
              Volver
            </button>
            @if (isAuthenticated && currentUser?.role === 'TRABAJADOR') {
              <button mat-raised-button color="primary" (click)="openApplyDialog()">
                <mat-icon>send</mat-icon>
                Aplicar a esta oferta
              </button>
            }
            @if (!isAuthenticated) {
              <button mat-raised-button color="accent" routerLink="/login">
                <mat-icon>login</mat-icon>
                Iniciar sesión para aplicar
              </button>
            }
          </mat-card-actions>
        </mat-card>
      } @else {
        <mat-card>
          <mat-card-content>
            <p>Cargando oferta laboral...</p>
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
    .job-card {
      padding: 20px;
    }
    .job-avatar {
      background-color: #3f51b5;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      width: 48px;
      height: 48px;
    }
    .job-avatar mat-icon {
      color: white;
    }
    mat-card-subtitle {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      align-items: center;
      margin-top: 8px;
    }
    .company {
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
    .salary-section {
      background: #e8f5e9;
      padding: 16px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .salary-section h3 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 8px;
      color: #2e7d32;
    }
    .salary {
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
    .description, .requirements, .benefits {
      white-space: pre-line;
      line-height: 1.6;
      color: #555;
    }
    .employer-section {
      background: #f5f5f5;
      padding: 16px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .employer-section h3 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 12px;
    }
    .employer-section p {
      margin: 8px 0;
    }
    .employer-section button {
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
export class JobOfferDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private jobOfferService = inject(JobOfferService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  jobOffer?: JobOffer;
  isAuthenticated = this.authService.isAuthenticated();
  currentUser = this.authService.getCurrentUser();

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.jobOfferService.getJobOfferById(+id).subscribe({
        next: (offer) => this.jobOffer = offer,
        error: () => {
          this.snackBar.open('Error al cargar la oferta laboral', 'Cerrar', {
            duration: 5000
          });
        }
      });
    }
  }

  openApplyDialog(): void {
    const dialogRef = this.dialog.open(ApplyJobDialogComponent, {
      width: '600px',
      data: this.jobOffer,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // La aplicación fue enviada exitosamente
      }
    });
  }
}
