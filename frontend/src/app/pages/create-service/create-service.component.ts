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
import { MatChipsModule } from '@angular/material/chips';
import { WorkerServiceService } from '../../services/worker-service.service';

@Component({
  selector: 'app-create-service',
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
    MatChipsModule
  ],
  template: `
    <div class="container">
      <mat-card class="form-card">
        <mat-card-header>
          <mat-icon mat-card-avatar>build</mat-icon>
          <mat-card-title>Publicar Nuevo Servicio Profesional</mat-card-title>
          <mat-card-subtitle>Ofrezca sus servicios a potenciales empleadores</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="serviceForm" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Título del servicio</mat-label>
                <input matInput formControlName="title" placeholder="Ej: Desarrollo de aplicaciones web">
                <mat-error *ngIf="serviceForm.get('title')?.hasError('required')">El título es requerido</mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Descripción del servicio</mat-label>
                <textarea matInput formControlName="description" rows="5"
                  placeholder="Describa detalladamente los servicios que ofrece..."></textarea>
                <mat-error *ngIf="serviceForm.get('description')?.hasError('required')">La descripción es requerida</mat-error>
              </mat-form-field>
            </div>

            <div class="form-row two-columns">
              <mat-form-field appearance="outline">
                <mat-label>Categoría</mat-label>
                <mat-select formControlName="category">
                  <mat-option value="Desarrollo Web">Desarrollo Web</mat-option>
                  <mat-option value="Desarrollo Móvil">Desarrollo Móvil</mat-option>
                  <mat-option value="Diseño Gráfico">Diseño Gráfico</mat-option>
                  <mat-option value="Diseño UX/UI">Diseño UX/UI</mat-option>
                  <mat-option value="Marketing Digital">Marketing Digital</mat-option>
                  <mat-option value="Redacción y Contenido">Redacción y Contenido</mat-option>
                  <mat-option value="Traducción">Traducción</mat-option>
                  <mat-option value="Contabilidad">Contabilidad</mat-option>
                  <mat-option value="Asesoría Legal">Asesoría Legal</mat-option>
                  <mat-option value="Consultoría">Consultoría</mat-option>
                  <mat-option value="Fotografía">Fotografía</mat-option>
                  <mat-option value="Video y Animación">Video y Animación</mat-option>
                  <mat-option value="Música y Audio">Música y Audio</mat-option>
                  <mat-option value="Electricidad">Electricidad</mat-option>
                  <mat-option value="Plomería">Plomería</mat-option>
                  <mat-option value="Carpintería">Carpintería</mat-option>
                  <mat-option value="Otro">Otro</mat-option>
                </mat-select>
                <mat-error *ngIf="serviceForm.get('category')?.hasError('required')">La categoría es requerida</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Ubicación</mat-label>
                <input matInput formControlName="location" placeholder="Ej: Ciudad de México, Remoto">
              </mat-form-field>
            </div>

            <h3 class="section-title">Información de Precios</h3>
            <div class="form-row three-columns">
              <mat-form-field appearance="outline">
                <mat-label>Precio mínimo</mat-label>
                <input matInput type="number" formControlName="priceMin" placeholder="0">
                <span matTextPrefix>$&nbsp;</span>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Precio máximo</mat-label>
                <input matInput type="number" formControlName="priceMax" placeholder="0">
                <span matTextPrefix>$&nbsp;</span>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Período</mat-label>
                <mat-select formControlName="pricePeriod">
                  <mat-option value="Hora">Por Hora</mat-option>
                  <mat-option value="Día">Por Día</mat-option>
                  <mat-option value="Semana">Por Semana</mat-option>
                  <mat-option value="Mes">Por Mes</mat-option>
                  <mat-option value="Proyecto">Por Proyecto</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <h3 class="section-title">Experiencia y Habilidades</h3>
            <div class="form-row two-columns">
              <mat-form-field appearance="outline">
                <mat-label>Años de experiencia</mat-label>
                <mat-select formControlName="experienceYears">
                  <mat-option value="Menos de 1 año">Menos de 1 año</mat-option>
                  <mat-option value="1-2 años">1-2 años</mat-option>
                  <mat-option value="3-5 años">3-5 años</mat-option>
                  <mat-option value="5-10 años">5-10 años</mat-option>
                  <mat-option value="Más de 10 años">Más de 10 años</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Disponibilidad</mat-label>
                <mat-select formControlName="availability">
                  <mat-option value="Inmediata">Inmediata</mat-option>
                  <mat-option value="1 semana">En 1 semana</mat-option>
                  <mat-option value="2 semanas">En 2 semanas</mat-option>
                  <mat-option value="1 mes">En 1 mes</mat-option>
                  <mat-option value="A convenir">A convenir</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Habilidades</mat-label>
                <textarea matInput formControlName="skills" rows="3"
                  placeholder="Liste sus habilidades principales separadas por coma (ej: JavaScript, React, Node.js, MongoDB)"></textarea>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Portfolio / Trabajos anteriores</mat-label>
                <textarea matInput formControlName="portfolio" rows="3"
                  placeholder="Incluya enlaces a su portfolio, GitHub, LinkedIn o proyectos anteriores"></textarea>
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-button type="button" routerLink="/dashboard">Cancelar</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="serviceForm.invalid || isSubmitting">
                <mat-icon>publish</mat-icon>
                {{ isSubmitting ? 'Publicando...' : 'Publicar Servicio' }}
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
export class CreateServiceComponent {
  private fb = inject(FormBuilder);
  private workerServiceService = inject(WorkerServiceService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  isSubmitting = false;

  serviceForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', [Validators.required]],
    category: ['', [Validators.required]],
    location: [''],
    priceMin: [null],
    priceMax: [null],
    pricePeriod: ['Hora'],
    experienceYears: [''],
    availability: ['Inmediata'],
    skills: [''],
    portfolio: ['']
  });

  onSubmit(): void {
    if (this.serviceForm.valid) {
      this.isSubmitting = true;
      this.workerServiceService.createWorkerService(this.serviceForm.value).subscribe({
        next: () => {
          this.snackBar.open('Servicio publicado exitosamente. Pendiente de aprobación.', 'Cerrar', {
            duration: 5000
          });
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.snackBar.open(error.error?.message || 'Error al publicar el servicio', 'Cerrar', {
            duration: 5000
          });
        }
      });
    }
  }
}
