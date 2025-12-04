import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { ReviewService } from '../../services/review.service';
import { User } from '../../models/user.model';
import { Review } from '../../models/review.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatTabsModule
  ],
  template: `
    <div class="container">
      @if (currentUser) {
        <mat-card class="profile-card">
          <div class="profile-header">
            <div class="avatar">
              @if (currentUser.profileImage) {
                <img [src]="currentUser.profileImage" alt="Avatar">
              } @else {
                <mat-icon>person</mat-icon>
              }
            </div>
            <div class="profile-info">
              <h1>{{ currentUser.firstName }} {{ currentUser.lastName }}</h1>
              <mat-chip-set>
                <mat-chip [class]="'role-' + currentUser.role.toLowerCase()">
                  <mat-icon matChipAvatar>{{ getRoleIcon() }}</mat-icon>
                  {{ getRoleLabel() }}
                </mat-chip>
                @if (currentUser.location) {
                  <mat-chip>
                    <mat-icon matChipAvatar>location_on</mat-icon>
                    {{ currentUser.location }}
                  </mat-chip>
                }
                @if (currentUser.emailVerified) {
                  <mat-chip class="verified-chip">
                    <mat-icon matChipAvatar>verified</mat-icon>
                    Verificado
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
            <button mat-raised-button color="primary" routerLink="/edit-profile" class="edit-btn">
              <mat-icon>edit</mat-icon>
              Editar Perfil
            </button>
          </div>

          <mat-divider></mat-divider>

          <div class="profile-details">
            <div class="detail-section">
              <h3><mat-icon>contact_mail</mat-icon> Información de Contacto</h3>
              <div class="detail-grid">
                <div class="detail-item">
                  <mat-icon>email</mat-icon>
                  <div>
                    <span class="label">Email</span>
                    <span class="value">{{ currentUser.email }}</span>
                  </div>
                </div>
                @if (currentUser.phone) {
                  <div class="detail-item">
                    <mat-icon>phone</mat-icon>
                    <div>
                      <span class="label">Teléfono</span>
                      <span class="value">{{ currentUser.phone }}</span>
                    </div>
                  </div>
                }
                @if (currentUser.location) {
                  <div class="detail-item">
                    <mat-icon>location_on</mat-icon>
                    <div>
                      <span class="label">Ubicación</span>
                      <span class="value">{{ currentUser.location }}</span>
                    </div>
                  </div>
                }
                <div class="detail-item">
                  <mat-icon>calendar_today</mat-icon>
                  <div>
                    <span class="label">Miembro desde</span>
                    <span class="value">{{ currentUser.createdAt | date:'longDate' }}</span>
                  </div>
                </div>
              </div>
            </div>

            @if (currentUser.bio) {
              <mat-divider></mat-divider>
              <div class="detail-section">
                <h3><mat-icon>info</mat-icon> Acerca de mí</h3>
                <p class="bio">{{ currentUser.bio }}</p>
              </div>
            }
          </div>

          @if (reviews.length > 0) {
            <mat-divider></mat-divider>
            <div class="reviews-section">
              <h3><mat-icon>star</mat-icon> Mis Reseñas ({{ reviews.length }})</h3>
              <div class="reviews-list">
                @for (review of reviews.slice(0, 3); track review.id) {
                  <div class="review-item">
                    <div class="review-header">
                      <span class="reviewer">{{ review.reviewerName }}</span>
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
                  </div>
                }
              </div>
            </div>
          }
        </mat-card>

        <div class="quick-actions">
          <h2>Acciones Rápidas</h2>
          <div class="actions-grid">
            <mat-card class="action-card" routerLink="/dashboard">
              <mat-icon>dashboard</mat-icon>
              <span>Dashboard</span>
            </mat-card>
            @if (currentUser.role === 'EMPLEADOR') {
              <mat-card class="action-card" routerLink="/create-job-offer">
                <mat-icon>add_circle</mat-icon>
                <span>Nueva Oferta</span>
              </mat-card>
              <mat-card class="action-card" routerLink="/manage-applications">
                <mat-icon>inbox</mat-icon>
                <span>Aplicaciones</span>
              </mat-card>
            }
            @if (currentUser.role === 'TRABAJADOR') {
              <mat-card class="action-card" routerLink="/create-service">
                <mat-icon>add_circle</mat-icon>
                <span>Nuevo Servicio</span>
              </mat-card>
              <mat-card class="action-card" routerLink="/job-offers">
                <mat-icon>search</mat-icon>
                <span>Buscar Empleos</span>
              </mat-card>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 900px;
      margin: 0 auto;
    }
    .profile-card {
      padding: 24px;
      margin-bottom: 24px;
    }
    .profile-header {
      display: flex;
      gap: 24px;
      align-items: flex-start;
      flex-wrap: wrap;
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
    .profile-info {
      flex: 1;
    }
    .profile-info h1 {
      margin: 0 0 12px;
    }
    .edit-btn {
      margin-left: auto;
    }
    .rating {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 12px;
    }
    .stars mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: #ccc;
    }
    .stars mat-icon.filled {
      color: #ffc107;
    }
    .rating-text {
      font-size: 14px;
      color: #666;
    }
    .role-trabajador {
      background-color: #e3f2fd !important;
      color: #1565c0 !important;
    }
    .role-empleador {
      background-color: #f3e5f5 !important;
      color: #7b1fa2 !important;
    }
    .role-moderador {
      background-color: #fff3e0 !important;
      color: #e65100 !important;
    }
    .verified-chip {
      background-color: #e8f5e9 !important;
      color: #2e7d32 !important;
    }
    mat-divider {
      margin: 24px 0;
    }
    .detail-section h3 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 16px;
      color: #333;
    }
    .detail-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }
    .detail-item {
      display: flex;
      gap: 12px;
      align-items: flex-start;
    }
    .detail-item mat-icon {
      color: #666;
      margin-top: 2px;
    }
    .detail-item .label {
      display: block;
      font-size: 12px;
      color: #999;
    }
    .detail-item .value {
      display: block;
      color: #333;
    }
    .bio {
      line-height: 1.6;
      color: #555;
      white-space: pre-line;
    }
    .reviews-section h3 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 16px;
    }
    .reviews-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .review-item {
      padding: 12px;
      background: #f9f9f9;
      border-radius: 8px;
    }
    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .reviewer {
      font-weight: 500;
    }
    .review-stars mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #ccc;
    }
    .review-stars mat-icon.filled {
      color: #ffc107;
    }
    .review-comment {
      margin: 0 0 8px;
      color: #555;
    }
    .review-date {
      color: #999;
    }
    .quick-actions h2 {
      margin: 0 0 16px;
    }
    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 16px;
    }
    .action-card {
      padding: 24px;
      text-align: center;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .action-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .action-card mat-icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
      color: #3f51b5;
      margin-bottom: 8px;
    }
    .action-card span {
      display: block;
      font-weight: 500;
    }
    @media (max-width: 600px) {
      .profile-header {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
      .edit-btn {
        margin: 16px auto 0;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private reviewService = inject(ReviewService);

  currentUser?: User | null;
  reviews: Review[] = [];
  averageRating = 0;

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.loadReviews();
    }
  }

  loadReviews(): void {
    if (this.currentUser?.id) {
      this.reviewService.getReviewsByUserId(this.currentUser.id).subscribe({
        next: (reviews) => this.reviews = reviews
      });
      this.reviewService.getUserAverageRating(this.currentUser.id).subscribe({
        next: (rating) => this.averageRating = rating || 0
      });
    }
  }

  getRoleLabel(): string {
    const labels: Record<string, string> = {
      'TRABAJADOR': 'Profesional',
      'EMPLEADOR': 'Empleador',
      'MODERADOR': 'Moderador'
    };
    return labels[this.currentUser?.role || ''] || this.currentUser?.role || '';
  }

  getRoleIcon(): string {
    const icons: Record<string, string> = {
      'TRABAJADOR': 'engineering',
      'EMPLEADOR': 'business',
      'MODERADOR': 'admin_panel_settings'
    };
    return icons[this.currentUser?.role || ''] || 'person';
  }
}
