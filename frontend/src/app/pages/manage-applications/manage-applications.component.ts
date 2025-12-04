import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { JobApplicationService } from '../../services/job-application.service';
import { JobApplication, ApplicationStatus } from '../../models/job-application.model';

@Component({
  selector: 'app-manage-applications',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatDialogModule,
    MatDividerModule,
    MatBadgeModule
  ],
  template: `
    <div class="container">
      <div class="header">
        <h1>
          <mat-icon>inbox</mat-icon>
          Gestión de Aplicaciones Recibidas
        </h1>
        <p class="subtitle">Revise y gestione las aplicaciones de candidatos</p>
      </div>

      <div class="filters">
        <mat-form-field appearance="outline">
          <mat-label>Filtrar por estado</mat-label>
          <mat-select [(value)]="selectedStatus" (selectionChange)="filterApplications()">
            <mat-option value="ALL">Todas</mat-option>
            <mat-option value="PENDIENTE">Pendientes</mat-option>
            <mat-option value="ACEPTADA">Aceptadas</mat-option>
            <mat-option value="RECHAZADA">Rechazadas</mat-option>
          </mat-select>
        </mat-form-field>

        <div class="stats">
          <span class="stat">
            <mat-icon>hourglass_empty</mat-icon>
            {{ getPendingCount() }} Pendientes
          </span>
          <span class="stat accepted">
            <mat-icon>check_circle</mat-icon>
            {{ getAcceptedCount() }} Aceptadas
          </span>
          <span class="stat rejected">
            <mat-icon>cancel</mat-icon>
            {{ getRejectedCount() }} Rechazadas
          </span>
        </div>
      </div>

      @if (filteredApplications.length === 0) {
        <mat-card class="empty-card">
          <mat-card-content>
            <mat-icon>inbox</mat-icon>
            <h3>No hay aplicaciones</h3>
            <p>Aún no has recibido aplicaciones para tus ofertas laborales.</p>
          </mat-card-content>
        </mat-card>
      }

      <mat-accordion>
        @for (app of filteredApplications; track app.id) {
          <mat-expansion-panel [class.pending]="app.status === 'PENDIENTE'"
                               [class.accepted]="app.status === 'ACEPTADA'"
                               [class.rejected]="app.status === 'RECHAZADA'">
            <mat-expansion-panel-header>
              <mat-panel-title>
                <span class="applicant-name">{{ app.applicantName }}</span>
              </mat-panel-title>
              <mat-panel-description>
                <span class="job-title">{{ app.jobOfferTitle }}</span>
                <mat-chip [class]="'status-' + app.status?.toLowerCase()">
                  {{ getStatusLabel(app.status) }}
                </mat-chip>
              </mat-panel-description>
            </mat-expansion-panel-header>

            <div class="application-content">
              <div class="info-grid">
                <div class="info-item">
                  <mat-icon>person</mat-icon>
                  <div>
                    <strong>Candidato</strong>
                    <p>{{ app.applicantName }}</p>
                  </div>
                </div>
                <div class="info-item">
                  <mat-icon>email</mat-icon>
                  <div>
                    <strong>Email</strong>
                    <p>{{ app.applicantEmail }}</p>
                  </div>
                </div>
                <div class="info-item">
                  <mat-icon>work</mat-icon>
                  <div>
                    <strong>Oferta</strong>
                    <p>{{ app.jobOfferTitle }}</p>
                  </div>
                </div>
                <div class="info-item">
                  <mat-icon>calendar_today</mat-icon>
                  <div>
                    <strong>Fecha de aplicación</strong>
                    <p>{{ app.createdAt | date:'medium' }}</p>
                  </div>
                </div>
              </div>

              <mat-divider></mat-divider>

              <div class="cover-letter-section">
                <h4><mat-icon>description</mat-icon> Carta de Presentación</h4>
                <p class="cover-letter">{{ app.coverLetter }}</p>
              </div>

              @if (app.resumeUrl) {
                <div class="resume-section">
                  <h4><mat-icon>attach_file</mat-icon> Currículum</h4>
                  <a [href]="app.resumeUrl" target="_blank" mat-stroked-button color="primary">
                    <mat-icon>open_in_new</mat-icon>
                    Ver CV
                  </a>
                </div>
              }

              @if (app.status === 'PENDIENTE') {
                <mat-divider></mat-divider>

                <div class="action-section">
                  <h4><mat-icon>rate_review</mat-icon> Responder a esta aplicación</h4>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Comentarios para el candidato (opcional)</mat-label>
                    <textarea matInput [(ngModel)]="app.employerComments" rows="3"
                      placeholder="Escriba un mensaje para el candidato..."></textarea>
                  </mat-form-field>

                  <div class="action-buttons">
                    <button mat-raised-button color="primary"
                      (click)="updateStatus(app, 'ACEPTADA')">
                      <mat-icon>check_circle</mat-icon>
                      Aceptar Candidato
                    </button>
                    <button mat-raised-button color="warn"
                      (click)="updateStatus(app, 'RECHAZADA')">
                      <mat-icon>cancel</mat-icon>
                      Rechazar
                    </button>
                  </div>
                </div>
              }

              @if (app.status !== 'PENDIENTE' && app.employerComments) {
                <mat-divider></mat-divider>
                <div class="comments-section">
                  <h4><mat-icon>comment</mat-icon> Tu respuesta</h4>
                  <p>{{ app.employerComments }}</p>
                </div>
              }

              <div class="panel-actions">
                <button mat-button [routerLink]="['/user', app.applicantId]">
                  <mat-icon>person</mat-icon>
                  Ver Perfil Completo
                </button>
              </div>
            </div>
          </mat-expansion-panel>
        }
      </mat-accordion>

      <div class="back-button">
        <button mat-stroked-button routerLink="/dashboard">
          <mat-icon>arrow_back</mat-icon>
          Volver al Dashboard
        </button>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 1000px;
      margin: 0 auto;
    }
    .header {
      margin-bottom: 24px;
    }
    .header h1 {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0;
    }
    .subtitle {
      color: #666;
      margin: 8px 0 0;
    }
    .filters {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 16px;
    }
    .stats {
      display: flex;
      gap: 20px;
    }
    .stat {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 14px;
      color: #666;
    }
    .stat.accepted {
      color: #2e7d32;
    }
    .stat.rejected {
      color: #c62828;
    }
    .empty-card {
      text-align: center;
      padding: 40px;
    }
    .empty-card mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #ccc;
    }
    .empty-card h3 {
      margin: 16px 0 8px;
    }
    .empty-card p {
      color: #666;
    }
    mat-expansion-panel {
      margin-bottom: 12px;
    }
    mat-expansion-panel.pending {
      border-left: 4px solid #ff9800;
    }
    mat-expansion-panel.accepted {
      border-left: 4px solid #4caf50;
    }
    mat-expansion-panel.rejected {
      border-left: 4px solid #f44336;
    }
    .applicant-name {
      font-weight: 500;
    }
    .job-title {
      color: #666;
      margin-right: 12px;
    }
    .status-pendiente {
      background-color: #fff3e0 !important;
      color: #e65100 !important;
    }
    .status-aceptada {
      background-color: #e8f5e9 !important;
      color: #2e7d32 !important;
    }
    .status-rechazada {
      background-color: #ffebee !important;
      color: #c62828 !important;
    }
    .application-content {
      padding: 16px 0;
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 20px;
    }
    .info-item {
      display: flex;
      gap: 12px;
      align-items: flex-start;
    }
    .info-item mat-icon {
      color: #666;
    }
    .info-item strong {
      display: block;
      font-size: 12px;
      color: #999;
    }
    .info-item p {
      margin: 4px 0 0;
    }
    .cover-letter-section, .resume-section, .action-section, .comments-section {
      padding: 16px 0;
    }
    .cover-letter-section h4, .resume-section h4, .action-section h4, .comments-section h4 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 12px;
      color: #333;
    }
    .cover-letter {
      white-space: pre-line;
      background: #f5f5f5;
      padding: 16px;
      border-radius: 8px;
      line-height: 1.6;
    }
    .full-width {
      width: 100%;
    }
    .action-buttons {
      display: flex;
      gap: 12px;
      margin-top: 16px;
    }
    .panel-actions {
      padding-top: 16px;
      border-top: 1px solid #eee;
      margin-top: 16px;
    }
    .back-button {
      margin-top: 24px;
      text-align: center;
    }
    mat-divider {
      margin: 16px 0;
    }
  `]
})
export class ManageApplicationsComponent implements OnInit {
  private jobApplicationService = inject(JobApplicationService);
  private snackBar = inject(MatSnackBar);

  applications: JobApplication[] = [];
  filteredApplications: JobApplication[] = [];
  selectedStatus = 'ALL';

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.jobApplicationService.getApplicationsByEmployer().subscribe({
      next: (apps) => {
        this.applications = apps;
        this.filterApplications();
      },
      error: () => {
        this.snackBar.open('Error al cargar las aplicaciones', 'Cerrar', {
          duration: 5000
        });
      }
    });
  }

  filterApplications(): void {
    if (this.selectedStatus === 'ALL') {
      this.filteredApplications = [...this.applications];
    } else {
      this.filteredApplications = this.applications.filter(
        app => app.status === this.selectedStatus
      );
    }
  }

  getPendingCount(): number {
    return this.applications.filter(a => a.status === 'PENDIENTE').length;
  }

  getAcceptedCount(): number {
    return this.applications.filter(a => a.status === 'ACEPTADA').length;
  }

  getRejectedCount(): number {
    return this.applications.filter(a => a.status === 'RECHAZADA').length;
  }

  getStatusLabel(status?: ApplicationStatus): string {
    const labels: Record<string, string> = {
      'PENDIENTE': 'Pendiente',
      'ACEPTADA': 'Aceptada',
      'RECHAZADA': 'Rechazada',
      'CANCELADA': 'Cancelada'
    };
    return labels[status || ''] || status || '';
  }

  updateStatus(app: JobApplication, status: ApplicationStatus): void {
    this.jobApplicationService.updateApplicationStatus(
      app.id!,
      status,
      app.employerComments
    ).subscribe({
      next: (updated) => {
        const index = this.applications.findIndex(a => a.id === app.id);
        if (index !== -1) {
          this.applications[index] = updated;
          this.filterApplications();
        }
        const message = status === 'ACEPTADA'
          ? 'Candidato aceptado exitosamente'
          : 'Aplicación rechazada';
        this.snackBar.open(message, 'Cerrar', { duration: 5000 });
      },
      error: () => {
        this.snackBar.open('Error al actualizar el estado', 'Cerrar', {
          duration: 5000
        });
      }
    });
  }
}
