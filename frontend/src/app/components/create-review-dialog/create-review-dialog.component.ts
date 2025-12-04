import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ReviewService } from '../../services/review.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-create-review-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>rate_review</mat-icon>
      Calificar a {{ data.firstName }} {{ data.lastName }}
    </h2>

    <mat-dialog-content>
      <form [formGroup]="reviewForm">
        <div class="rating-section">
          <label>Calificación</label>
          <div class="stars-input">
            @for (star of [1,2,3,4,5]; track star) {
              <button type="button" mat-icon-button
                (click)="setRating(star)"
                [class.selected]="star <= selectedRating">
                <mat-icon>
                  {{ star <= selectedRating ? 'star' : 'star_border' }}
                </mat-icon>
              </button>
            }
          </div>
          <span class="rating-label">{{ getRatingLabel() }}</span>
          @if (reviewForm.get('rating')?.hasError('required') && reviewForm.get('rating')?.touched) {
            <mat-error>Debe seleccionar una calificación</mat-error>
          }
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Comentario (opcional)</mat-label>
          <textarea matInput formControlName="comment" rows="4"
            placeholder="Comparta su experiencia trabajando con esta persona..."></textarea>
          <mat-hint>{{ reviewForm.get('comment')?.value?.length || 0 }} / 500 caracteres</mat-hint>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary"
        (click)="onSubmit()"
        [disabled]="reviewForm.invalid || isSubmitting">
        <mat-icon>send</mat-icon>
        {{ isSubmitting ? 'Enviando...' : 'Enviar Reseña' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    h2 {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .full-width {
      width: 100%;
    }
    .rating-section {
      margin-bottom: 24px;
    }
    .rating-section label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #333;
    }
    .stars-input {
      display: flex;
      gap: 4px;
    }
    .stars-input button {
      color: #ccc;
    }
    .stars-input button.selected {
      color: #ffc107;
    }
    .stars-input button mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
    }
    .rating-label {
      display: block;
      margin-top: 8px;
      font-size: 14px;
      color: #666;
    }
    mat-error {
      font-size: 12px;
      color: #f44336;
    }
    mat-dialog-content {
      min-width: 400px;
    }
    @media (max-width: 600px) {
      mat-dialog-content {
        min-width: unset;
      }
    }
  `]
})
export class CreateReviewDialogComponent {
  private fb = inject(FormBuilder);
  private reviewService = inject(ReviewService);
  private snackBar = inject(MatSnackBar);

  selectedRating = 0;
  isSubmitting = false;

  reviewForm: FormGroup = this.fb.group({
    rating: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
    comment: ['', [Validators.maxLength(500)]]
  });

  constructor(
    public dialogRef: MatDialogRef<CreateReviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) {}

  setRating(rating: number): void {
    this.selectedRating = rating;
    this.reviewForm.patchValue({ rating });
  }

  getRatingLabel(): string {
    const labels: Record<number, string> = {
      1: 'Malo',
      2: 'Regular',
      3: 'Bueno',
      4: 'Muy bueno',
      5: 'Excelente'
    };
    return labels[this.selectedRating] || 'Seleccione una calificación';
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  onSubmit(): void {
    if (this.reviewForm.valid) {
      this.isSubmitting = true;

      const review = {
        userId: this.data.id,
        rating: this.reviewForm.value.rating,
        comment: this.reviewForm.value.comment || null
      };

      this.reviewService.createReview(review).subscribe({
        next: (createdReview) => {
          this.snackBar.open('Reseña enviada exitosamente', 'Cerrar', {
            duration: 5000
          });
          this.dialogRef.close(createdReview);
        },
        error: (error) => {
          this.isSubmitting = false;
          const message = error.error?.message || 'Error al enviar la reseña';
          this.snackBar.open(message, 'Cerrar', {
            duration: 5000
          });
        }
      });
    }
  }
}
