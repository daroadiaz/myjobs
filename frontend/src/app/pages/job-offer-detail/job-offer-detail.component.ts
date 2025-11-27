import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { JobOfferService } from '../../services/job-offer.service';
import { JobOffer } from '../../models/job-offer.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-job-offer-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="container">
      @if (jobOffer) {
        <mat-card>
          <mat-card-header>
            <mat-card-title><h1>{{ jobOffer.title }}</h1></mat-card-title>
            <mat-card-subtitle>{{ jobOffer.category }} | {{ jobOffer.location }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p><strong>Descripción:</strong></p>
            <p>{{ jobOffer.description }}</p>

            @if (jobOffer.salaryMin) {
              <p><strong>Salario:</strong> {{ jobOffer.salaryMin }} - {{ jobOffer.salaryMax }} / {{ jobOffer.salaryPeriod }}</p>
            }

            @if (jobOffer.requirements) {
              <p><strong>Requisitos:</strong></p>
              <p>{{ jobOffer.requirements }}</p>
            }

            @if (jobOffer.benefits) {
              <p><strong>Beneficios:</strong></p>
              <p>{{ jobOffer.benefits }}</p>
            }

            <p><strong>Publicado por:</strong> {{ jobOffer.employerName }}</p>
            <p><strong>Vistas:</strong> {{ jobOffer.views }}</p>
          </mat-card-content>
          <mat-card-actions>
            @if (isAuthenticated && currentUser?.role === 'TRABAJADOR') {
              <button mat-raised-button color="primary">Aplicar</button>
            }
            <button mat-button routerLink="/job-offers">Volver</button>
          </mat-card-actions>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .container { padding: 20px; max-width: 800px; margin: 0 auto; }
  `]
})
export class JobOfferDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private jobOfferService = inject(JobOfferService);
  private authService = inject(AuthService);

  jobOffer?: JobOffer;
  isAuthenticated = this.authService.isAuthenticated();
  currentUser = this.authService.getCurrentUser();

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.jobOfferService.getJobOfferById(+id).subscribe(offer => this.jobOffer = offer);
    }
  }
}
