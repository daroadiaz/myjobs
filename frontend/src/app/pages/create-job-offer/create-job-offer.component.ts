import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { JobOfferService } from '../../services/job-offer.service';

@Component({
  selector: 'app-create-job-offer',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <div class="container">
      <mat-card class="form-card">
        <mat-card-header>
          <mat-icon mat-card-avatar>work</mat-icon>
          <mat-card-title>Publicar Nueva Oferta Laboral</mat-card-title>
          <mat-card-subtitle>Complete los datos de la oferta de trabajo</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="jobOfferForm" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Título del puesto</mat-label>
                <input matInput formControlName="title" placeholder="Ej: Desarrollador Full Stack Senior">
                <mat-error *ngIf="jobOfferForm.get('title')?.hasError('required')">El título es requerido</mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Descripción del puesto</mat-label>
                <textarea matInput formControlName="description" rows="5"
                  placeholder="Describa las responsabilidades y funciones del puesto..."></textarea>
                <mat-error *ngIf="jobOfferForm.get('description')?.hasError('required')">La descripción es requerida</mat-error>
              </mat-form-field>
            </div>

            <div class="form-row two-columns">
              <mat-form-field appearance="outline">
                <mat-label>Categoría</mat-label>
                <mat-select formControlName="category">
                  <mat-option value="Tecnología">Tecnología</mat-option>
                  <mat-option value="Diseño">Diseño</mat-option>
                  <mat-option value="Marketing">Marketing</mat-option>
                  <mat-option value="Ventas">Ventas</mat-option>
                  <mat-option value="Administración">Administración</mat-option>
                  <mat-option value="Recursos Humanos">Recursos Humanos</mat-option>
                  <mat-option value="Finanzas">Finanzas</mat-option>
                  <mat-option value="Salud">Salud</mat-option>
                  <mat-option value="Educación">Educación</mat-option>
                  <mat-option value="Construcción">Construcción</mat-option>
                  <mat-option value="Logística">Logística</mat-option>
                  <mat-option value="Otro">Otro</mat-option>
                </mat-select>
                <mat-error *ngIf="jobOfferForm.get('category')?.hasError('required')">La categoría es requerida</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Ubicación</mat-label>
                <input matInput formControlName="location" placeholder="Ej: Ciudad de México, Remoto">
              </mat-form-field>
            </div>

            <div class="form-row two-columns">
              <mat-form-field appearance="outline">
                <mat-label>Tipo de trabajo</mat-label>
                <mat-select formControlName="jobType">
                  <mat-option value="Tiempo Completo">Tiempo Completo</mat-option>
                  <mat-option value="Medio Tiempo">Medio Tiempo</mat-option>
                  <mat-option value="Freelance">Freelance</mat-option>
                  <mat-option value="Temporal">Temporal</mat-option>
                  <mat-option value="Prácticas">Prácticas</mat-option>
                  <mat-option value="Remoto">Remoto</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Fecha de expiración</mat-label>
                <input matInput [matDatepicker]="picker" formControlName="expiresAt">
                <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
              </mat-form-field>
            </div>

            <h3 class="section-title">Información Salarial</h3>
            <div class="form-row three-columns">
              <mat-form-field appearance="outline">
                <mat-label>Salario mínimo</mat-label>
                <input matInput type="number" formControlName="salaryMin" placeholder="0">
                <span matTextPrefix>$&nbsp;</span>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Salario máximo</mat-label>
                <input matInput type="number" formControlName="salaryMax" placeholder="0">
                <span matTextPrefix>$&nbsp;</span>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Período</mat-label>
                <mat-select formControlName="salaryPeriod">
                  <mat-option value="Hora">Por Hora</mat-option>
                  <mat-option value="Día">Por Día</mat-option>
                  <mat-option value="Semana">Por Semana</mat-option>
                  <mat-option value="Mes">Por Mes</mat-option>
                  <mat-option value="Año">Por Año</mat-option>
                  <mat-option value="Proyecto">Por Proyecto</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Requisitos</mat-label>
                <textarea matInput formControlName="requirements" rows="4"
                  placeholder="Liste los requisitos del puesto (experiencia, habilidades, educación...)"></textarea>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Beneficios</mat-label>
                <textarea matInput formControlName="benefits" rows="4"
                  placeholder="Describa los beneficios ofrecidos (seguro médico, vacaciones, bonos...)"></textarea>
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-button type="button" routerLink="/dashboard">Cancelar</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="jobOfferForm.invalid || isSubmitting">
                <mat-icon>publish</mat-icon>
                {{ isSubmitting ? 'Publicando...' : 'Publicar Oferta' }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    .form-card {
      padding: 20px;
    }
    mat-card-header {
      margin-bottom: 20px;
    }
    .form-row {
      margin-bottom: 16px;
    }
    .full-width {
      width: 100%;
    }
    .two-columns {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .three-columns {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 16px;
    }
    .section-title {
      margin: 24px 0 16px;
      color: #666;
      font-size: 14px;
      font-weight: 500;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid #eee;
    }
    @media (max-width: 600px) {
      .two-columns, .three-columns {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CreateJobOfferComponent {
  private fb = inject(FormBuilder);
  private jobOfferService = inject(JobOfferService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  isSubmitting = false;

  jobOfferForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', [Validators.required]],
    category: ['', [Validators.required]],
    location: [''],
    jobType: ['Tiempo Completo'],
    salaryMin: [null],
    salaryMax: [null],
    salaryPeriod: ['Mes'],
    requirements: [''],
    benefits: [''],
    expiresAt: [null]
  });

  onSubmit(): void {
    if (this.jobOfferForm.valid) {
      this.isSubmitting = true;
      this.jobOfferService.createJobOffer(this.jobOfferForm.value).subscribe({
        next: () => {
          this.snackBar.open('Oferta laboral publicada exitosamente. Pendiente de aprobación.', 'Cerrar', {
            duration: 5000
          });
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.snackBar.open(error.error?.message || 'Error al publicar la oferta', 'Cerrar', {
            duration: 5000
          });
        }
      });
    }
  }
}
