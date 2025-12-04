import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../../services/user.service';
import { ReviewService } from '../../services/review.service';
import { JobOfferService } from '../../services/job-offer.service';
import { WorkerServiceService } from '../../services/worker-service.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { Review } from '../../models/review.model';
import { JobOffer } from '../../models/job-offer.model';
import { WorkerService } from '../../models/worker-service.model';
import { CreateReviewDialogComponent } from '../../components/create-review-dialog/create-review-dialog.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTabsModule,
    MatDividerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="container">
      @if (isLoading) {
        <div class="loading">
          <mat-spinner diameter="50"></mat-spinner>
          <p>Cargando perfil...</p>
        </div>
      } @else if (user) {
        <mat-card class="profile-header">
          <div class="profile-info">
            <div class="avatar">
              @if (user.profileImage) {
                <img [src]="user.profileImage" alt="Avatar">
              } @else {
                <mat-icon>person</mat-icon>
              }
            </div>
            <div class="info">
              <h1>{{ user.firstName }} {{ user.lastName }}</h1>
              <mat-chip-set>
                <mat-chip [class]="'role-' + user.role.toLowerCase()">
                  <mat-icon matChipAvatar>{{ getRoleIcon(user.role) }}</mat-icon>
                  {{ getRoleLabel(user.role) }}
                </mat-chip>
                @if (user.location) {
                  <mat-chip>
                    <mat-icon matChipAvatar>location_on</mat-icon>
                    {{ user.location }}
                  </mat-chip>
                }
              </mat-chip-set>

              @if (averageRating > 0) {
                <div class="rating">
                  <div class="stars">
                    @for (star of [1,2,3,4,5]; track star) {
                      <mat-icon [class.filled]="star <= averageRating">
                        {{ star <= averageRating ? 'star' : 'star_border' }}
                      </mat-icon>
                    }
                  </div>
                  <span class="rating-text">
                    {{ averageRating.toFixed(1) }} ({{ reviews.length }} reseñas)
                  </span>
                </div>
              }
            </div>
          </div>

          @if (user.bio) {
            <div class="bio">
              <h3><mat-icon>info</mat-icon> Acerca de</h3>
              <p>{{ user.bio }}</p>
            </div>
          }

          <div class="contact-info">
            <p><mat-icon>email</mat-icon> {{ user.email }}</p>
            @if (user.phone) {
              <p><mat-icon>phone</mat-icon> {{ user.phone }}</p>
            }
            <p><mat-icon>calendar_today</mat-icon> Miembro desde {{ user.createdAt | date:'longDate' }}</p>
          </div>

          @if (canReview()) {
            <div class="review-action">
              <button mat-raised-button color="primary" (click)="openReviewDialog()">
                <mat-icon>rate_review</mat-icon>
                Escribir Reseña
              </button>
            </div>
          }
        </mat-card>

        <mat-tab-group>
          @if (user.role === 'EMPLEADOR') {
            <mat-tab>
              <ng-template mat-tab-label>
                <mat-icon>work</mat-icon>
                <span class="tab-label">Ofertas Laborales ({{ jobOffers.length }})</span>
              </ng-template>
              <div class="tab-content">
                @if (jobOffers.length === 0) {
                  <div class="empty-state">
                    <mat-icon>work_off</mat-icon>
                    <p>Este empleador no tiene ofertas publicadas</p>
                  </div>
                } @else {
                  <div class="cards-grid">
                    @for (job of jobOffers; track job.id) {
                      <mat-card class="item-card" [routerLink]="['/job-offers', job.id]">
                        <mat-card-header>
                          <mat-card-title>{{ job.title }}</mat-card-title>
                          <mat-card-subtitle>{{ job.category }}</mat-card-subtitle>
                        </mat-card-header>
                        <mat-card-content>
                          <p class="description">{{ job.description | slice:0:120 }}...</p>
                          @if (job.salaryMin || job.salaryMax) {
                            <p class="salary">
                              <mat-icon>payments</mat-icon>
                              ${{ job.salaryMin || 0 }} - ${{ job.salaryMax || 0 }} / {{ job.salaryPeriod }}
                            </p>
                          }
                        </mat-card-content>
                      </mat-card>
                    }
                  </div>
                }
              </div>
            </mat-tab>
          }

          @if (user.role === 'TRABAJADOR') {
            <mat-tab>
              <ng-template mat-tab-label>
                <mat-icon>build</mat-icon>
                <span class="tab-label">Servicios ({{ workerServices.length }})</span>
              </ng-template>
              <div class="tab-content">
                @if (workerServices.length === 0) {
                  <div class="empty-state">
                    <mat-icon>handyman</mat-icon>
                    <p>Este trabajador no tiene servicios publicados</p>
                  </div>
                } @else {
                  <div class="cards-grid">
                    @for (service of workerServices; track service.id) {
                      <mat-card class="item-card" [routerLink]="['/worker-services', service.id]">
                        <mat-card-header>
                          <mat-card-title>{{ service.title }}</mat-card-title>
                          <mat-card-subtitle>{{ service.category }}</mat-card-subtitle>
                        </mat-card-header>
                        <mat-card-content>
                          <p class="description">{{ service.description | slice:0:120 }}...</p>
                          @if (service.priceMin || service.priceMax) {
                            <p class="salary">
                              <mat-icon>payments</mat-icon>
                              ${{ service.priceMin || 0 }} - ${{ service.priceMax || 0 }} / {{ service.pricePeriod }}
                            </p>
                          }
                        </mat-card-content>
                      </mat-card>
                    }
                  </div>
                }
              </div>
            </mat-tab>
          }

          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon>star</mat-icon>
              <span class="tab-label">Reseñas ({{ reviews.length }})</span>
            </ng-template>
            <div class="tab-content">
              @if (reviews.length === 0) {
                <div class="empty-state">
                  <mat-icon>rate_review</mat-icon>
                  <p>Este usuario aún no tiene reseñas</p>
                </div>
              } @else {
                <div class="reviews-list">
                  @for (review of reviews; track review.id) {
                    <mat-card class="review-card">
                      <div class="review-header">
                        <div class="reviewer">
                          <mat-icon>person</mat-icon>
                          <span>{{ review.reviewerName }}</span>
                        </div>
                        <div class="review-stars">
                          @for (star of [1,2,3,4,5]; track star) {
                            <mat-icon [class.filled]="star <= review.rating">
                              {{ star <= review.rating ? 'star' : 'star_border' }}
                            </mat-icon>
                          }
                        </div>
                      </div>
                      @if (review.comment) {
                        <p class="review-comment">{{ review.comment }}</p>
                      }
                      <small class="review-date">{{ review.createdAt | date:'medium' }}</small>
                    </mat-card>
                  }
                </div>
              }
            </div>
          </mat-tab>
        </mat-tab-group>
      } @else {
        <mat-card>
          <mat-card-content>
            <p>Usuario no encontrado</p>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 1000px;
      margin: 0 auto;
    }
    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px;
    }
    .loading p {
      margin-top: 16px;
      color: #666;
    }
    .profile-header {
      padding: 24px;
      margin-bottom: 24px;
    }
    .profile-info {
      display: flex;
      gap: 24px;
      align-items: flex-start;
    }
    .avatar {
      width: 120px;
      height: 120px;
      background: #3f51b5;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      flex-shrink: 0;
    }
    .avatar mat-icon {
      font-size: 60px;
      width: 60px;
      height: 60px;
      color: white;
    }
    .avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .info h1 {
      margin: 0 0 12px;
    }
    .rating {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 12px;
    }
    .stars mat-icon {
      color: #ccc;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
    .stars mat-icon.filled {
      color: #ffc107;
    }
    .rating-text {
      color: #666;
      font-size: 14px;
    }
    .role-trabajador {
      background-color: #e3f2fd !important;
      color: #1565c0 !important;
    }
    .role-empleador {
      background-color: #f3e5f5 !important;
      color: #7b1fa2 !important;
    }
    .bio {
      margin-top: 24px;
      padding: 16px;
      background: #f5f5f5;
      border-radius: 8px;
    }
    .bio h3 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 12px;
      font-size: 14px;
      color: #666;
    }
    .bio p {
      margin: 0;
      line-height: 1.6;
    }
    .contact-info {
      margin-top: 24px;
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
    }
    .contact-info p {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      color: #666;
    }
    .review-action {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid #eee;
    }
    .tab-label {
      margin-left: 8px;
    }
    .tab-content {
      padding: 24px 0;
    }
    .empty-state {
      text-align: center;
      padding: 40px;
      color: #999;
    }
    .empty-state mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
    }
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
    }
    .item-card {
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .item-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .description {
      color: #666;
      font-size: 14px;
    }
    .salary {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #2e7d32;
      font-weight: 500;
      margin-top: 8px;
    }
    .salary mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
    .reviews-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .review-card {
      padding: 16px;
    }
    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .reviewer {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
    }
    .review-stars mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #ccc;
    }
    .review-stars mat-icon.filled {
      color: #ffc107;
    }
    .review-comment {
      color: #555;
      line-height: 1.6;
      margin: 0 0 12px;
    }
    .review-date {
      color: #999;
    }
    @media (max-width: 600px) {
      .profile-info {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
      .contact-info {
        flex-direction: column;
        align-items: center;
      }
    }
  `]
})
export class UserProfileComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private reviewService = inject(ReviewService);
  private jobOfferService = inject(JobOfferService);
  private workerServiceService = inject(WorkerServiceService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  user: User | null = null;
  reviews: Review[] = [];
  jobOffers: JobOffer[] = [];
  workerServices: WorkerService[] = [];
  averageRating = 0;
  isLoading = true;
  currentUser = this.authService.getCurrentUser();

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadUserProfile(+id);
    }
  }

  loadUserProfile(userId: number): void {
    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        this.user = user;
        this.loadUserData(userId);
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Error al cargar el perfil', 'Cerrar', {
          duration: 5000
        });
      }
    });
  }

  loadUserData(userId: number): void {
    // Cargar reseñas
    this.reviewService.getReviewsByUserId(userId).subscribe({
      next: (reviews) => this.reviews = reviews,
      error: () => {}
    });

    // Cargar rating promedio
    this.reviewService.getUserAverageRating(userId).subscribe({
      next: (rating) => this.averageRating = rating || 0,
      error: () => {}
    });

    // Cargar ofertas o servicios según el rol
    if (this.user?.role === 'EMPLEADOR') {
      this.jobOfferService.getJobOffersByEmployerId(userId).subscribe({
        next: (offers) => {
          this.jobOffers = offers.filter(o => o.status === 'APROBADO');
          this.isLoading = false;
        },
        error: () => this.isLoading = false
      });
    } else if (this.user?.role === 'TRABAJADOR') {
      this.workerServiceService.getWorkerServicesByWorkerId(userId).subscribe({
        next: (services) => {
          this.workerServices = services.filter(s => s.status === 'APROBADO');
          this.isLoading = false;
        },
        error: () => this.isLoading = false
      });
    } else {
      this.isLoading = false;
    }
  }

  getRoleLabel(role: string): string {
    const labels: Record<string, string> = {
      'TRABAJADOR': 'Profesional',
      'EMPLEADOR': 'Empleador',
      'MODERADOR': 'Moderador'
    };
    return labels[role] || role;
  }

  getRoleIcon(role: string): string {
    const icons: Record<string, string> = {
      'TRABAJADOR': 'engineering',
      'EMPLEADOR': 'business',
      'MODERADOR': 'admin_panel_settings'
    };
    return icons[role] || 'person';
  }

  canReview(): boolean {
    if (!this.currentUser || !this.user) return false;
    if (this.currentUser.id === this.user.id) return false;
    // Verificar si ya dejó una reseña
    const hasReviewed = this.reviews.some(r => r.reviewerId === this.currentUser?.id);
    return !hasReviewed;
  }

  openReviewDialog(): void {
    const dialogRef = this.dialog.open(CreateReviewDialogComponent, {
      width: '500px',
      data: this.user
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.reviews.unshift(result);
        this.reviewService.getUserAverageRating(this.user!.id).subscribe({
          next: (rating) => this.averageRating = rating || 0
        });
      }
    });
  }
}
