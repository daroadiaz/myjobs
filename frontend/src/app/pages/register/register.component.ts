import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { Role } from '../../models/user.model';

@Component({
  selector: 'app-register',
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
    MatSnackBarModule
  ],
  template: `
    <div class="container">
      <mat-card class="register-card">
        <mat-card-header>
          <mat-card-title>Registro</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <mat-form-field class="full-width">
              <mat-label>Nombre</mat-label>
              <input matInput formControlName="firstName" required>
            </mat-form-field>

            <mat-form-field class="full-width">
              <mat-label>Apellido</mat-label>
              <input matInput formControlName="lastName" required>
            </mat-form-field>

            <mat-form-field class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" required>
            </mat-form-field>

            <mat-form-field class="full-width">
              <mat-label>Teléfono</mat-label>
              <input matInput formControlName="phone">
            </mat-form-field>

            <mat-form-field class="full-width">
              <mat-label>Contraseña</mat-label>
              <input matInput type="password" formControlName="password" required>
            </mat-form-field>

            <mat-form-field class="full-width">
              <mat-label>Tipo de Usuario</mat-label>
              <mat-select formControlName="role" required>
                <mat-option value="TRABAJADOR">Trabajador - Busco trabajo y ofrezco servicios</mat-option>
                <mat-option value="EMPLEADOR">Empleador - Publico ofertas laborales</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field class="full-width">
              <mat-label>Ubicación</mat-label>
              <input matInput formControlName="location">
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" class="full-width mt-2">
              Registrarse
            </button>
          </form>

          <div class="text-center mt-2">
            <a routerLink="/login">¿Ya tienes cuenta? Inicia sesión</a>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 64px);
      padding: 20px;
    }
    .register-card {
      max-width: 500px;
      width: 100%;
    }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  registerForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['', Validators.required],
    location: ['']
  });

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.snackBar.open('Registro exitoso', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.snackBar.open('Error: ' + (error.error?.message || 'Error en el registro'), 'Cerrar', { duration: 5000 });
        }
      });
    }
  }
}
