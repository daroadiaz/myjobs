import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { WorkerServiceService } from '../../services/worker-service.service';
import { WorkerService } from '../../models/worker-service.model';

@Component({
  selector: 'app-worker-services',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, FormsModule],
  template: `
    <div class="container">
      <h1>Servicios Profesionales</h1>

      <mat-form-field class="full-width">
        <mat-label>Buscar servicios</mat-label>
        <input matInput [(ngModel)]="searchQuery" (input)="onSearch()" placeholder="Buscar por título, categoría...">
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>

      <div class="services-grid">
        @for (service of services; track service.id) {
          <mat-card>
            <mat-card-header>
              <mat-card-title>{{ service.title }}</mat-card-title>
              <mat-card-subtitle>{{ service.category }} | {{ service.location }}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p>{{ service.description.substring(0, 200) }}...</p>
              @if (service.priceMin && service.priceMax) {
                <p><strong>Precio:</strong> {{ service.priceMin }} - {{ service.priceMax }} / {{ service.pricePeriod }}</p>
              }
              <p><small>Ofrecido por: {{ service.workerName }}</small></p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-raised-button color="primary" [routerLink]="['/worker-services', service.id]">Ver Detalles</button>
            </mat-card-actions>
          </mat-card>
        } @empty {
          <p class="no-results">No se encontraron servicios.</p>
        }
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    .no-results {
      text-align: center;
      padding: 40px;
      color: #666;
    }
  `]
})
export class WorkerServicesComponent implements OnInit {
  private workerServiceService = inject(WorkerServiceService);

  services: WorkerService[] = [];
  searchQuery: string = '';

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.workerServiceService.getAllWorkerServices().subscribe({
      next: (services) => this.services = services,
      error: (err) => console.error('Error loading services:', err)
    });
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.workerServiceService.searchWorkerServices(this.searchQuery).subscribe({
        next: (services) => this.services = services
      });
    } else {
      this.loadServices();
    }
  }
}
