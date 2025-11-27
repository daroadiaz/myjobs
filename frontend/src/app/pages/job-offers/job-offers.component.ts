import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { JobOfferService } from '../../services/job-offer.service';
import { JobOffer } from '../../models/job-offer.model';

@Component({
  selector: 'app-job-offers',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, FormsModule],
  template: `
    <div class="container">
      <h1>Ofertas Laborales</h1>

      <mat-form-field class="full-width">
        <mat-label>Buscar ofertas</mat-label>
        <input matInput [(ngModel)]="searchQuery" (input)="onSearch()" placeholder="Buscar por título, categoría...">
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>

      <div class="job-offers-grid">
        @for (job of jobOffers; track job.id) {
          <mat-card>
            <mat-card-header>
              <mat-card-title>{{ job.title }}</mat-card-title>
              <mat-card-subtitle>{{ job.category }} | {{ job.location }}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p>{{ job.description.substring(0, 200) }}...</p>
              @if (job.salaryMin && job.salaryMax) {
                <p><strong>Salario:</strong> {{ job.salaryMin }} - {{ job.salaryMax }} / {{ job.salaryPeriod }}</p>
              }
              <p><small>Publicado por: {{ job.employerName }}</small></p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-raised-button color="primary" [routerLink]="['/job-offers', job.id]">Ver Detalles</button>
            </mat-card-actions>
          </mat-card>
        } @empty {
          <p class="no-results">No se encontraron ofertas laborales.</p>
        }
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    .job-offers-grid {
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
export class JobOffersComponent implements OnInit {
  private jobOfferService = inject(JobOfferService);

  jobOffers: JobOffer[] = [];
  searchQuery: string = '';

  ngOnInit(): void {
    this.loadJobOffers();
  }

  loadJobOffers(): void {
    this.jobOfferService.getAllJobOffers().subscribe({
      next: (offers) => this.jobOffers = offers,
      error: (err) => console.error('Error loading job offers:', err)
    });
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.jobOfferService.searchJobOffers(this.searchQuery).subscribe({
        next: (offers) => this.jobOffers = offers
      });
    } else {
      this.loadJobOffers();
    }
  }
}
