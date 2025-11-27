import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { JobOfferService } from '../../services/job-offer.service';
import { WorkerServiceService } from '../../services/worker-service.service';

@Component({
  selector: 'app-moderator',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatCardModule, MatButtonModule],
  template: `
    <div class="container">
      <h1>Panel de Moderación</h1>

      <mat-tab-group>
        <mat-tab label="Ofertas Pendientes">
          <div class="tab-content">
            @for (job of pendingJobs; track job.id) {
              <mat-card class="mb-2">
                <mat-card-header>
                  <mat-card-title>{{ job.title }}</mat-card-title>
                  <mat-card-subtitle>{{ job.employerName }}</mat-card-subtitle>
                </mat-card-header>
                <mat-card-content>
                  <p>{{ job.description }}</p>
                </mat-card-content>
                <mat-card-actions>
                  <button mat-raised-button color="primary" (click)="approveJob(job.id!)">Aprobar</button>
                  <button mat-raised-button color="warn" (click)="rejectJob(job.id!)">Rechazar</button>
                </mat-card-actions>
              </mat-card>
            } @empty {
              <p>No hay ofertas pendientes.</p>
            }
          </div>
        </mat-tab>

        <mat-tab label="Servicios Pendientes">
          <div class="tab-content">
            @for (service of pendingServices; track service.id) {
              <mat-card class="mb-2">
                <mat-card-header>
                  <mat-card-title>{{ service.title }}</mat-card-title>
                  <mat-card-subtitle>{{ service.workerName }}</mat-card-subtitle>
                </mat-card-header>
                <mat-card-content>
                  <p>{{ service.description }}</p>
                </mat-card-content>
                <mat-card-actions>
                  <button mat-raised-button color="primary" (click)="approveService(service.id!)">Aprobar</button>
                  <button mat-raised-button color="warn" (click)="rejectService(service.id!)">Rechazar</button>
                </mat-card-actions>
              </mat-card>
            } @empty {
              <p>No hay servicios pendientes.</p>
            }
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    .tab-content { padding: 20px; }
  `]
})
export class ModeratorComponent implements OnInit {
  private jobOfferService = inject(JobOfferService);
  private workerServiceService = inject(WorkerServiceService);

  pendingJobs: any[] = [];
  pendingServices: any[] = [];

  ngOnInit(): void {
    this.loadPendingJobs();
    this.loadPendingServices();
  }

  loadPendingJobs(): void {
    this.jobOfferService.getPendingJobOffers().subscribe(jobs => this.pendingJobs = jobs);
  }

  loadPendingServices(): void {
    this.workerServiceService.getPendingWorkerServices().subscribe(services => this.pendingServices = services);
  }

  approveJob(id: number): void {
    this.jobOfferService.moderateJobOffer(id, 'APROBADO' as any).subscribe(() => this.loadPendingJobs());
  }

  rejectJob(id: number): void {
    this.jobOfferService.moderateJobOffer(id, 'RECHAZADO' as any).subscribe(() => this.loadPendingJobs());
  }

  approveService(id: number): void {
    this.workerServiceService.moderateWorkerService(id, 'APROBADO' as any).subscribe(() => this.loadPendingServices());
  }

  rejectService(id: number): void {
    this.workerServiceService.moderateWorkerService(id, 'RECHAZADO' as any).subscribe(() => this.loadPendingServices());
  }
}
