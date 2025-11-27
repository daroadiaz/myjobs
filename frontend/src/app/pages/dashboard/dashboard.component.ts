import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { JobOfferService } from '../../services/job-offer.service';
import { WorkerServiceService } from '../../services/worker-service.service';
import { JobApplicationService } from '../../services/job-application.service';
import { Role } from '../../models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTabsModule, MatCardModule, MatButtonModule],
  template: `
    <div class="container">
      <h1>Dashboard</h1>

      @if (currentUser?.role === 'EMPLEADOR') {
        <mat-tab-group>
          <mat-tab label="Mis Ofertas Laborales">
            <div class="tab-content">
              <button mat-raised-button color="primary" routerLink="/create-job-offer" class="mb-2">
                Nueva Oferta Laboral
              </button>
              @for (job of myJobOffers; track job.id) {
                <mat-card class="mb-2">
                  <mat-card-header>
                    <mat-card-title>{{ job.title }}</mat-card-title>
                    <mat-card-subtitle>{{ job.status }} - {{ job.applicationCount }} aplicaciones</mat-card-subtitle>
                  </mat-card-header>
                  <mat-card-actions>
                    <button mat-button [routerLink]="['/job-offers', job.id]">Ver</button>
                  </mat-card-actions>
                </mat-card>
              } @empty {
                <p>No tienes ofertas laborales publicadas.</p>
              }
            </div>
          </mat-tab>
          <mat-tab label="Aplicaciones Recibidas">
            <div class="tab-content">
              @for (app of receivedApplications; track app.id) {
                <mat-card class="mb-2">
                  <mat-card-header>
                    <mat-card-title>{{ app.jobOfferTitle }}</mat-card-title>
                    <mat-card-subtitle>{{ app.applicantName }} - {{ app.status }}</mat-card-subtitle>
                  </mat-card-header>
                  <mat-card-content>
                    <p>{{ app.coverLetter.substring(0, 150) }}...</p>
                  </mat-card-content>
                </mat-card>
              } @empty {
                <p>No has recibido aplicaciones.</p>
              }
            </div>
          </mat-tab>
        </mat-tab-group>
      }

      @if (currentUser?.role === 'TRABAJADOR') {
        <mat-tab-group>
          <mat-tab label="Mis Servicios">
            <div class="tab-content">
              <button mat-raised-button color="primary" routerLink="/create-service" class="mb-2">
                Nuevo Servicio
              </button>
              @for (service of myServices; track service.id) {
                <mat-card class="mb-2">
                  <mat-card-header>
                    <mat-card-title>{{ service.title }}</mat-card-title>
                    <mat-card-subtitle>{{ service.status }}</mat-card-subtitle>
                  </mat-card-header>
                </mat-card>
              } @empty {
                <p>No tienes servicios publicados.</p>
              }
            </div>
          </mat-tab>
          <mat-tab label="Mis Aplicaciones">
            <div class="tab-content">
              @for (app of myApplications; track app.id) {
                <mat-card class="mb-2">
                  <mat-card-header>
                    <mat-card-title>{{ app.jobOfferTitle }}</mat-card-title>
                    <mat-card-subtitle>{{ app.status }}</mat-card-subtitle>
                  </mat-card-header>
                </mat-card>
              } @empty {
                <p>No has aplicado a ninguna oferta.</p>
              }
            </div>
          </mat-tab>
        </mat-tab-group>
      }
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    .tab-content { padding: 20px; }
  `]
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private jobOfferService = inject(JobOfferService);
  private workerServiceService = inject(WorkerServiceService);
  private jobApplicationService = inject(JobApplicationService);

  currentUser = this.authService.getCurrentUser();
  myJobOffers: any[] = [];
  myServices: any[] = [];
  myApplications: any[] = [];
  receivedApplications: any[] = [];

  ngOnInit(): void {
    if (this.currentUser?.role === 'EMPLEADOR') {
      this.loadEmployerData();
    } else if (this.currentUser?.role === 'TRABAJADOR') {
      this.loadWorkerData();
    }
  }

  loadEmployerData(): void {
    this.jobOfferService.getMyJobOffers().subscribe(offers => this.myJobOffers = offers);
    this.jobApplicationService.getApplicationsByEmployer().subscribe(apps => this.receivedApplications = apps);
  }

  loadWorkerData(): void {
    this.workerServiceService.getMyWorkerServices().subscribe(services => this.myServices = services);
    this.jobApplicationService.getMyApplications().subscribe(apps => this.myApplications = apps);
  }
}
