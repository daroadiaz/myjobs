import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { JobApplicationService } from '../../services/job-application.service';
import { JobOffer } from '../../models/job-offer.model';

@Component({
  selector: 'app-apply-job-dialog',
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
      <mat-icon>send</mat-icon>
      Aplicar a: {{ data.title }}
    </h2>

    <mat-dialog-content>
      <form [formGroup]="applicationForm">
        <p class="info-text">
          Empresa: <strong>{{ data.employerName }}</strong>
        </p>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Carta de presentación</mat-label>
          <textarea matInput formControlName="coverLetter" rows="8"
            placeholder="Escriba una carta de presentación explicando por qué es el candidato ideal para este puesto..."></textarea>
          <mat-hint>Mínimo 50 caracteres</mat-hint>
          <mat-error *ngIf="applicationForm.get('coverLetter')?.hasError('required')">
            La carta de presentación es requerida
          </mat-error>
          <mat-error *ngIf="applicationForm.get('coverLetter')?.hasError('minlength')">
            Debe tener al menos 50 caracteres
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>URL del CV / Currículum</mat-label>
          <input matInput formControlName="resumeUrl"
            placeholder="https://ejemplo.com/mi-curriculum.pdf">
          <mat-icon matSuffix>link</mat-icon>
          <mat-hint>Enlace a su CV en Google Drive, Dropbox, LinkedIn, etc.</mat-hint>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary"
        (click)="onSubmit()"
        [disabled]="applicationForm.invalid || isSubmitting">
        <mat-icon>send</mat-icon>
        {{ isSubmitting ? 'Enviando...' : 'Enviar Aplicación' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    .info-text {
      margin-bottom: 20px;
      color: #666;
    }
    h2 {
      display: flex;
      align-items: center;
      gap: 8px;
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
export class ApplyJobDialogComponent {
  private fb = inject(FormBuilder);
  private jobApplicationService = inject(JobApplicationService);
  private snackBar = inject(MatSnackBar);

  isSubmitting = false;

  applicationForm: FormGroup = this.fb.group({
    coverLetter: ['', [Validators.required, Validators.minLength(50)]],
    resumeUrl: ['']
  });

  constructor(
    public dialogRef: MatDialogRef<ApplyJobDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: JobOffer
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSubmit(): void {
    if (this.applicationForm.valid) {
      this.isSubmitting = true;

      const application = {
        jobOfferId: this.data.id!,
        coverLetter: this.applicationForm.value.coverLetter,
        resumeUrl: this.applicationForm.value.resumeUrl || null
      };

      this.jobApplicationService.createJobApplication(application).subscribe({
        next: () => {
          this.snackBar.open('Aplicación enviada exitosamente', 'Cerrar', {
            duration: 5000
          });
          this.dialogRef.close(true);
        },
        error: (error: any) => {
          this.isSubmitting = false;
          const message = error.error?.message || 'Error al enviar la aplicación';
          this.snackBar.open(message, 'Cerrar', {
            duration: 5000
          });
        }
      });
    }
  }
}
