import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { JobOfferService } from '../../services/job-offer.service';
import { WorkerServiceService } from '../../services/worker-service.service';
import { JobApplicationService } from '../../services/job-application.service';
import { JobOffer } from '../../models/job-offer.model';
import { WorkerService } from '../../models/worker-service.model';
import { JobApplication } from '../../models/job-application.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatBadgeModule,
    MatDividerModule,
    MatMenuModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  template: `
    <div class="container">
      <div class="dashboard-header">
        <div class="welcome">
          <h1>Bienvenido, {{ currentUser?.firstName }}!</h1>
          <p class="subtitle">{{ getRoleDescription() }}</p>
        </div>
        <div class="quick-stats">
          @if (currentUser?.role === 'EMPLEADOR') {
            <div class="stat-card">
              <mat-icon>work</mat-icon>
              <div class="stat-info">
                <span class="stat-value">{{ myJobOffers.length }}</span>
                <span class="stat-label">Ofertas</span>
              </div>
            </div>
            <div class="stat-card">
              <mat-icon>inbox</mat-icon>
              <div class="stat-info">
                <span class="stat-value">{{ getPendingApplicationsCount() }}</span>
                <span class="stat-label">Pendientes</span>
              </div>
            </div>
          }
          @if (currentUser?.role === 'TRABAJADOR') {
            <div class="stat-card">
              <mat-icon>build</mat-icon>
              <div class="stat-info">
                <span class="stat-value">{{ myServices.length }}</span>
                <span class="stat-label">Servicios</span>
              </div>
            </div>
            <div class="stat-card">
              <mat-icon>send</mat-icon>
              <div class="stat-info">
                <span class="stat-value">{{ myApplications.length }}</span>
                <span class="stat-label">Aplicaciones</span>
              </div>
            </div>
          }
        </div>
      </div>

      @if (currentUser?.role === 'EMPLEADOR') {
        <mat-tab-group>
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon>work</mat-icon>
              <span class="tab-label">Mis Ofertas Laborales</span>
            </ng-template>
            <div class="tab-content">
              <div class="tab-header">
                <h2>Ofertas Laborales Publicadas</h2>
                <button mat-raised-button color="primary" routerLink="/create-job-offer">
                  <mat-icon>add</mat-icon>
                  Nueva Oferta Laboral
                </button>
              </div>

              @if (myJobOffers.length === 0) {
                <div class="empty-state">
                  <mat-icon>work_off</mat-icon>
                  <h3>No tienes ofertas publicadas</h3>
                  <p>Comienza publicando tu primera oferta laboral para encontrar candidatos</p>
                  <button mat-raised-button color="primary" routerLink="/create-job-offer">
                    <mat-icon>add</mat-icon>
                    Crear Primera Oferta
                  </button>
                </div>
              } @else {
                <div class="cards-list">
                  @for (job of myJobOffers; track job.id) {
                    <mat-card class="item-card">
                      <mat-card-header>
                        <mat-icon mat-card-avatar>work</mat-icon>
                        <mat-card-title>{{ job.title }}</mat-card-title>
                        <mat-card-subtitle>
                          {{ job.category }} | {{ job.location || 'Sin ubicación' }}
                        </mat-card-subtitle>
                      </mat-card-header>
                      <mat-card-content>
                        <div class="card-chips">
                          <mat-chip [class]="'status-' + job.status?.toLowerCase()">
                            {{ getStatusLabel(job.status) }}
                          </mat-chip>
                          @if (job.applicationCount && job.applicationCount > 0) {
                            <mat-chip class="applications-chip">
                              <mat-icon matChipAvatar>people</mat-icon>
                              {{ job.applicationCount }} aplicaciones
                            </mat-chip>
                          }
                        </div>
                        <p class="description">{{ job.description | slice:0:150 }}...</p>
                        @if (job.salaryMin || job.salaryMax) {
                          <p class="salary">
                            <mat-icon>payments</mat-icon>
                            ${{ job.salaryMin || 0 }} - ${{ job.salaryMax || 0 }} / {{ job.salaryPeriod }}
                          </p>
                        }
                        @if (job.moderatorComments && job.status === 'RECHAZADO') {
                          <div class="moderator-feedback">
                            <mat-icon>feedback</mat-icon>
                            <span>{{ job.moderatorComments }}</span>
                          </div>
                        }
                      </mat-card-content>
                      <mat-card-actions align="end">
                        <button mat-button [routerLink]="['/job-offers', job.id]">
                          <mat-icon>visibility</mat-icon> Ver
                        </button>
                        <button mat-button color="primary" [routerLink]="['/edit-job-offer', job.id]">
                          <mat-icon>edit</mat-icon> Editar
                        </button>
                        <button mat-button color="warn" (click)="deleteJobOffer(job)">
                          <mat-icon>delete</mat-icon> Eliminar
                        </button>
                      </mat-card-actions>
                    </mat-card>
                  }
                </div>
              }
            </div>
          </mat-tab>

          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon [matBadge]="getPendingApplicationsCount()" matBadgeColor="warn"
                [matBadgeHidden]="getPendingApplicationsCount() === 0">inbox</mat-icon>
              <span class="tab-label">Aplicaciones Recibidas</span>
            </ng-template>
            <div class="tab-content">
              <div class="tab-header">
                <h2>Aplicaciones de Candidatos</h2>
                <button mat-stroked-button color="primary" routerLink="/manage-applications">
                  <mat-icon>open_in_new</mat-icon>
                  Ver Gestión Completa
                </button>
              </div>

              @if (receivedApplications.length === 0) {
                <div class="empty-state">
                  <mat-icon>inbox</mat-icon>
                  <h3>No has recibido aplicaciones</h3>
                  <p>Cuando los candidatos apliquen a tus ofertas, aparecerán aquí</p>
                </div>
              } @else {
                <div class="applications-list">
                  @for (app of receivedApplications; track app.id) {
                    <mat-card class="application-card" [class]="'border-' + app.status?.toLowerCase()">
                      <div class="app-header">
                        <div class="applicant-info">
                          <mat-icon>person</mat-icon>
                          <div>
                            <strong>{{ app.applicantName }}</strong>
                            <span class="job-title">{{ app.jobOfferTitle }}</span>
                          </div>
                        </div>
                        <mat-chip [class]="'status-' + app.status?.toLowerCase()">
                          {{ getApplicationStatusLabel(app.status) }}
                        </mat-chip>
                      </div>
                      <p class="cover-preview">{{ app.coverLetter | slice:0:200 }}...</p>
                      <div class="app-actions">
                        <small>{{ app.createdAt | date:'medium' }}</small>
                        <button mat-button [routerLink]="['/user', app.applicantId]">
                          Ver Perfil
                        </button>
                      </div>
                    </mat-card>
                  }
                </div>
              }
            </div>
          </mat-tab>
        </mat-tab-group>
      }

      @if (currentUser?.role === 'TRABAJADOR') {
        <mat-tab-group>
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon>build</mat-icon>
              <span class="tab-label">Mis Servicios</span>
            </ng-template>
            <div class="tab-content">
              <div class="tab-header">
                <h2>Servicios Profesionales Publicados</h2>
                <button mat-raised-button color="primary" routerLink="/create-service">
                  <mat-icon>add</mat-icon>
                  Nuevo Servicio
                </button>
              </div>

              @if (myServices.length === 0) {
                <div class="empty-state">
                  <mat-icon>handyman</mat-icon>
                  <h3>No tienes servicios publicados</h3>
                  <p>Publica tus servicios profesionales para que los empleadores te encuentren</p>
                  <button mat-raised-button color="primary" routerLink="/create-service">
                    <mat-icon>add</mat-icon>
                    Crear Primer Servicio
                  </button>
                </div>
              } @else {
                <div class="cards-list">
                  @for (service of myServices; track service.id) {
                    <mat-card class="item-card">
                      <mat-card-header>
                        <mat-icon mat-card-avatar>build</mat-icon>
                        <mat-card-title>{{ service.title }}</mat-card-title>
                        <mat-card-subtitle>
                          {{ service.category }} | {{ service.location || 'Sin ubicación' }}
                        </mat-card-subtitle>
                      </mat-card-header>
                      <mat-card-content>
                        <div class="card-chips">
                          <mat-chip [class]="'status-' + service.status?.toLowerCase()">
                            {{ getStatusLabel(service.status) }}
                          </mat-chip>
                          <mat-chip>
                            <mat-icon matChipAvatar>visibility</mat-icon>
                            {{ service.views || 0 }} vistas
                          </mat-chip>
                        </div>
                        <p class="description">{{ service.description | slice:0:150 }}...</p>
                        @if (service.priceMin || service.priceMax) {
                          <p class="salary">
                            <mat-icon>payments</mat-icon>
                            ${{ service.priceMin || 0 }} - ${{ service.priceMax || 0 }} / {{ service.pricePeriod }}
                          </p>
                        }
                        @if (service.moderatorComments && service.status === 'RECHAZADO') {
                          <div class="moderator-feedback">
                            <mat-icon>feedback</mat-icon>
                            <span>{{ service.moderatorComments }}</span>
                          </div>
                        }
                      </mat-card-content>
                      <mat-card-actions align="end">
                        <button mat-button [routerLink]="['/worker-services', service.id]">
                          <mat-icon>visibility</mat-icon> Ver
                        </button>
                        <button mat-button color="primary" [routerLink]="['/edit-service', service.id]">
                          <mat-icon>edit</mat-icon> Editar
                        </button>
                        <button mat-button color="warn" (click)="deleteService(service)">
                          <mat-icon>delete</mat-icon> Eliminar
                        </button>
                      </mat-card-actions>
                    </mat-card>
                  }
                </div>
              }
            </div>
          </mat-tab>

          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon>send</mat-icon>
              <span class="tab-label">Mis Aplicaciones</span>
            </ng-template>
            <div class="tab-content">
              <div class="tab-header">
                <h2>Aplicaciones Enviadas</h2>
                <button mat-stroked-button color="primary" routerLink="/job-offers">
                  <mat-icon>search</mat-icon>
                  Buscar Ofertas
                </button>
              </div>

              @if (myApplications.length === 0) {
                <div class="empty-state">
                  <mat-icon>send</mat-icon>
                  <h3>No has aplicado a ninguna oferta</h3>
                  <p>Explora las ofertas laborales disponibles y postúlate</p>
                  <button mat-raised-button color="primary" routerLink="/job-offers">
                    <mat-icon>search</mat-icon>
                    Buscar Ofertas
                  </button>
                </div>
              } @else {
                <div class="applications-list">
                  @for (app of myApplications; track app.id) {
                    <mat-card class="application-card" [class]="'border-' + app.status?.toLowerCase()">
                      <div class="app-header">
                        <div class="applicant-info">
                          <mat-icon>work</mat-icon>
                          <div>
                            <strong>{{ app.jobOfferTitle }}</strong>
                            <span class="job-title">Aplicado el {{ app.createdAt | date:'mediumDate' }}</span>
                          </div>
                        </div>
                        <mat-chip [class]="'status-' + app.status?.toLowerCase()">
                          {{ getApplicationStatusLabel(app.status) }}
                        </mat-chip>
                      </div>
                      @if (app.employerComments) {
                        <div class="employer-response">
                          <mat-icon>chat</mat-icon>
                          <span>{{ app.employerComments }}</span>
                        </div>
                      }
                      <div class="app-actions">
                        <button mat-button [routerLink]="['/job-offers', app.jobOfferId]">
                          Ver Oferta
                        </button>
                        @if (app.status === 'PENDIENTE') {
                          <button mat-button color="warn" (click)="cancelApplication(app)">
                            Cancelar
                          </button>
                        }
                      </div>
                    </mat-card>
                  }
                </div>
              }
            </div>
          </mat-tab>
        </mat-tab-group>
      }
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 16px;
    }
    .welcome h1 {
      margin: 0;
    }
    .subtitle {
      color: #666;
      margin: 4px 0 0;
    }
    .quick-stats {
      display: flex;
      gap: 16px;
    }
    .stat-card {
      display: flex;
      align-items: center;
      gap: 12px;
      background: #f5f5f5;
      padding: 12px 20px;
      border-radius: 8px;
    }
    .stat-card mat-icon {
      color: #3f51b5;
      font-size: 28px;
      width: 28px;
      height: 28px;
    }
    .stat-info {
      display: flex;
      flex-direction: column;
    }
    .stat-value {
      font-size: 24px;
      font-weight: 600;
      color: #333;
    }
    .stat-label {
      font-size: 12px;
      color: #666;
    }
    .tab-label {
      margin-left: 8px;
    }
    .tab-content {
      padding: 24px 0;
    }
    .tab-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .tab-header h2 {
      margin: 0;
    }
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      background: #fafafa;
      border-radius: 8px;
    }
    .empty-state mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #ccc;
    }
    .empty-state h3 {
      margin: 16px 0 8px;
      color: #333;
    }
    .empty-state p {
      color: #666;
      margin-bottom: 20px;
    }
    .cards-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .item-card {
      transition: box-shadow 0.2s;
    }
    .item-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .card-chips {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
      flex-wrap: wrap;
    }
    .status-pendiente {
      background-color: #fff3e0 !important;
      color: #e65100 !important;
    }
    .status-aprobado {
      background-color: #e8f5e9 !important;
      color: #2e7d32 !important;
    }
    .status-rechazado {
      background-color: #ffebee !important;
      color: #c62828 !important;
    }
    .status-aceptada {
      background-color: #e8f5e9 !important;
      color: #2e7d32 !important;
    }
    .status-rechazada {
      background-color: #ffebee !important;
      color: #c62828 !important;
    }
    .status-cancelada {
      background-color: #fafafa !important;
      color: #666 !important;
    }
    .applications-chip {
      background-color: #e3f2fd !important;
      color: #1565c0 !important;
    }
    .description {
      color: #666;
      margin: 8px 0;
    }
    .salary {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #2e7d32;
      font-weight: 500;
    }
    .salary mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
    .moderator-feedback {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 12px;
      background: #ffebee;
      border-radius: 8px;
      margin-top: 12px;
    }
    .moderator-feedback mat-icon {
      color: #c62828;
    }
    .applications-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .application-card {
      padding: 16px;
    }
    .application-card.border-pendiente {
      border-left: 4px solid #ff9800;
    }
    .application-card.border-aceptada {
      border-left: 4px solid #4caf50;
    }
    .application-card.border-rechazada {
      border-left: 4px solid #f44336;
    }
    .app-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }
    .applicant-info {
      display: flex;
      gap: 12px;
      align-items: flex-start;
    }
    .applicant-info mat-icon {
      color: #666;
    }
    .job-title {
      display: block;
      font-size: 12px;
      color: #999;
    }
    .cover-preview {
      color: #666;
      font-size: 14px;
      margin: 0 0 12px;
    }
    .employer-response {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 12px;
      background: #e8f5e9;
      border-radius: 8px;
      margin-bottom: 12px;
    }
    .employer-response mat-icon {
      color: #2e7d32;
    }
    .app-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .app-actions small {
      color: #999;
    }
    @media (max-width: 768px) {
      .dashboard-header {
        flex-direction: column;
        align-items: flex-start;
      }
      .tab-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private jobOfferService = inject(JobOfferService);
  private workerServiceService = inject(WorkerServiceService);
  private jobApplicationService = inject(JobApplicationService);
  private snackBar = inject(MatSnackBar);

  currentUser = this.authService.getCurrentUser();
  myJobOffers: JobOffer[] = [];
  myServices: WorkerService[] = [];
  myApplications: JobApplication[] = [];
  receivedApplications: JobApplication[] = [];

  ngOnInit(): void {
    if (this.currentUser?.role === 'EMPLEADOR') {
      this.loadEmployerData();
    } else if (this.currentUser?.role === 'TRABAJADOR') {
      this.loadWorkerData();
    }
  }

  loadEmployerData(): void {
    this.jobOfferService.getMyJobOffers().subscribe({
      next: (offers) => this.myJobOffers = offers,
      error: () => this.showError('Error al cargar ofertas')
    });
    this.jobApplicationService.getApplicationsByEmployer().subscribe({
      next: (apps) => this.receivedApplications = apps,
      error: () => this.showError('Error al cargar aplicaciones')
    });
  }

  loadWorkerData(): void {
    this.workerServiceService.getMyWorkerServices().subscribe({
      next: (services) => this.myServices = services,
      error: () => this.showError('Error al cargar servicios')
    });
    this.jobApplicationService.getMyApplications().subscribe({
      next: (apps) => this.myApplications = apps,
      error: () => this.showError('Error al cargar aplicaciones')
    });
  }

  getRoleDescription(): string {
    if (this.currentUser?.role === 'EMPLEADOR') {
      return 'Panel de Empleador - Gestiona tus ofertas y candidatos';
    } else if (this.currentUser?.role === 'TRABAJADOR') {
      return 'Panel de Profesional - Gestiona tus servicios y aplicaciones';
    }
    return '';
  }

  getPendingApplicationsCount(): number {
    return this.receivedApplications.filter(a => a.status === 'PENDIENTE').length;
  }

  getStatusLabel(status?: string): string {
    const labels: Record<string, string> = {
      'PENDIENTE': 'Pendiente de aprobación',
      'APROBADO': 'Publicado',
      'RECHAZADO': 'Rechazado',
      'CERRADO': 'Cerrado',
      'INACTIVO': 'Inactivo'
    };
    return labels[status || ''] || status || '';
  }

  getApplicationStatusLabel(status?: string): string {
    const labels: Record<string, string> = {
      'PENDIENTE': 'Pendiente',
      'ACEPTADA': 'Aceptada',
      'RECHAZADA': 'Rechazada',
      'CANCELADA': 'Cancelada'
    };
    return labels[status || ''] || status || '';
  }

  deleteJobOffer(job: JobOffer): void {
    if (confirm(`¿Estás seguro de eliminar la oferta "${job.title}"?`)) {
      this.jobOfferService.deleteJobOffer(job.id!).subscribe({
        next: () => {
          this.myJobOffers = this.myJobOffers.filter(j => j.id !== job.id);
          this.snackBar.open('Oferta eliminada', 'Cerrar', { duration: 3000 });
        },
        error: () => this.showError('Error al eliminar la oferta')
      });
    }
  }

  deleteService(service: WorkerService): void {
    if (confirm(`¿Estás seguro de eliminar el servicio "${service.title}"?`)) {
      this.workerServiceService.deleteWorkerService(service.id!).subscribe({
        next: () => {
          this.myServices = this.myServices.filter(s => s.id !== service.id);
          this.snackBar.open('Servicio eliminado', 'Cerrar', { duration: 3000 });
        },
        error: () => this.showError('Error al eliminar el servicio')
      });
    }
  }

  cancelApplication(app: JobApplication): void {
    if (confirm('¿Estás seguro de cancelar esta aplicación?')) {
      this.jobApplicationService.deleteJobApplication(app.id!).subscribe({
        next: () => {
          this.myApplications = this.myApplications.filter(a => a.id !== app.id);
          this.snackBar.open('Aplicación cancelada', 'Cerrar', { duration: 3000 });
        },
        error: () => this.showError('Error al cancelar la aplicación')
      });
    }
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', { duration: 5000 });
  }
}
