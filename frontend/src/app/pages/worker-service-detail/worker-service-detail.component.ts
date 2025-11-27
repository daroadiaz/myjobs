import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { WorkerServiceService } from '../../services/worker-service.service';
import { WorkerService } from '../../models/worker-service.model';

@Component({
  selector: 'app-worker-service-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule],
  template: `
    <div class="container">
      @if (service) {
        <mat-card>
          <mat-card-header>
            <mat-card-title><h1>{{ service.title }}</h1></mat-card-title>
            <mat-card-subtitle>{{ service.category }} | {{ service.location }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>{{ service.description }}</p>
            @if (service.priceMin) {
              <p><strong>Precio:</strong> {{ service.priceMin }} - {{ service.priceMax }} / {{ service.pricePeriod }}</p>
            }
            <p><strong>Ofrecido por:</strong> {{ service.workerName }}</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button routerLink="/worker-services">Volver</button>
          </mat-card-actions>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .container { padding: 20px; max-width: 800px; margin: 0 auto; }
  `]
})
export class WorkerServiceDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private workerServiceService = inject(WorkerServiceService);

  service?: WorkerService;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.workerServiceService.getWorkerServiceById(+id).subscribe(s => this.service = s);
    }
  }
}
