import { Component, inject, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { Role } from '../../models/user.model';

declare const google: any;

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
    MatSnackBarModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  template: `
    <div class="container">
      <mat-card class="register-card">
        <mat-card-header>
          <mat-card-title>{{ googleToken ? 'Completar Registro con Google' : 'Registro' }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          @if (!googleToken) {
            <!-- Google Sign-Up Button -->
            <div class="google-signin-container">
              <div id="google-signup-button"></div>
              @if (isGoogleLoading) {
                <mat-spinner diameter="24"></mat-spinner>
              }
            </div>

            <mat-divider></mat-divider>
            <div class="divider-text">o regístrate con email</div>
          } @else {
            <div class="google-info-banner">
              <mat-icon>check_circle</mat-icon>
              <span>Cuenta de Google verificada. Selecciona tu tipo de usuario para continuar.</span>
            </div>
          }

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            @if (!googleToken) {
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
            }

            <mat-form-field class="full-width">
              <mat-label>Tipo de Usuario</mat-label>
              <mat-select formControlName="role" required>
                <mat-option value="TRABAJADOR">Trabajador - Busco trabajo y ofrezco servicios</mat-option>
                <mat-option value="EMPLEADOR">Empleador - Publico ofertas laborales</mat-option>
              </mat-select>
            </mat-form-field>

            @if (!googleToken) {
              <mat-form-field class="full-width">
                <mat-label>Ubicación</mat-label>
                <input matInput formControlName="location">
              </mat-form-field>
            }

            <button mat-raised-button color="primary" type="submit" class="full-width mt-2" [disabled]="isGoogleLoading">
              @if (isGoogleLoading) {
                <mat-spinner diameter="20"></mat-spinner>
              } @else {
                {{ googleToken ? 'Completar Registro' : 'Registrarse' }}
              }
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
    .google-signin-container {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 16px 0;
      min-height: 44px;
    }
    .divider-text {
      text-align: center;
      margin: 16px 0;
      color: #666;
      font-size: 14px;
    }
    mat-divider {
      margin: 16px 0 !important;
    }
    .google-info-banner {
      display: flex;
      align-items: center;
      gap: 8px;
      background-color: #e8f5e9;
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 16px;
      color: #2e7d32;
    }
    .google-info-banner mat-icon {
      color: #4caf50;
    }
  `]
})
export class RegisterComponent implements OnInit, AfterViewInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  private ngZone = inject(NgZone);

  googleToken: string | null = null;
  isGoogleLoading = false;

  registerForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['', Validators.required],
    location: ['']
  });

  ngOnInit(): void {
    // Check if coming from Google Sign-In with token
    this.route.queryParams.subscribe(params => {
      if (params['googleToken']) {
        this.googleToken = params['googleToken'];
        // Disable fields not needed for Google registration
        this.registerForm.get('firstName')?.clearValidators();
        this.registerForm.get('lastName')?.clearValidators();
        this.registerForm.get('email')?.clearValidators();
        this.registerForm.get('password')?.clearValidators();
        this.registerForm.updateValueAndValidity();
      }
    });
  }

  ngAfterViewInit(): void {
    if (!this.googleToken) {
      this.initializeGoogleSignUp();
    }
  }

  private initializeGoogleSignUp(): void {
    if (typeof google !== 'undefined' && google.accounts) {
      google.accounts.id.initialize({
        client_id: this.authService.getGoogleClientId(),
        callback: (response: any) => this.handleGoogleSignUp(response),
        auto_select: false,
        cancel_on_tap_outside: true
      });

      google.accounts.id.renderButton(
        document.getElementById('google-signup-button'),
        {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'signup_with',
          shape: 'rectangular',
          logo_alignment: 'left'
        }
      );
    } else {
      setTimeout(() => this.initializeGoogleSignUp(), 500);
    }
  }

  private handleGoogleSignUp(response: any): void {
    this.ngZone.run(() => {
      // Store the token and ask for role selection
      this.googleToken = response.credential;
      this.snackBar.open('Cuenta verificada. Selecciona tu tipo de usuario.', 'Cerrar', { duration: 3000 });

      // Clear validators for non-Google fields
      this.registerForm.get('firstName')?.clearValidators();
      this.registerForm.get('lastName')?.clearValidators();
      this.registerForm.get('email')?.clearValidators();
      this.registerForm.get('password')?.clearValidators();
      this.registerForm.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    if (this.googleToken) {
      // Google registration - only need role
      const role = this.registerForm.get('role')?.value;
      if (!role) {
        this.snackBar.open('Por favor selecciona un tipo de usuario', 'Cerrar', { duration: 3000 });
        return;
      }

      this.isGoogleLoading = true;
      this.authService.authenticateWithGoogle({ idToken: this.googleToken, role }).subscribe({
        next: () => {
          this.isGoogleLoading = false;
          this.snackBar.open('Registro con Google exitoso', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isGoogleLoading = false;
          this.snackBar.open('Error: ' + (error.error?.message || 'Error en el registro'), 'Cerrar', { duration: 5000 });
        }
      });
    } else {
      // Regular registration
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
}
