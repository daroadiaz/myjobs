import { Component, inject, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';

declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>Iniciar Sesión</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <!-- Google Sign-In Button -->
          <div class="google-signin-container">
            <div id="google-signin-button"></div>
            @if (isGoogleLoading) {
              <mat-spinner diameter="24"></mat-spinner>
            }
          </div>

          <mat-divider></mat-divider>
          <div class="divider-text">o continúa con email</div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" required>
              @if (loginForm.get('email')?.hasError('required')) {
                <mat-error>El email es obligatorio</mat-error>
              }
              @if (loginForm.get('email')?.hasError('email')) {
                <mat-error>Email inválido</mat-error>
              }
            </mat-form-field>

            <mat-form-field class="full-width">
              <mat-label>Contraseña</mat-label>
              <input matInput type="password" formControlName="password" required>
              @if (loginForm.get('password')?.hasError('required')) {
                <mat-error>La contraseña es obligatoria</mat-error>
              }
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" class="full-width mt-2">
              Iniciar Sesión
            </button>
          </form>

          <div class="text-center mt-2">
            <a routerLink="/register">¿No tienes cuenta? Regístrate</a>
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
    .login-card {
      max-width: 400px;
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
  `]
})
export class LoginComponent implements OnInit, AfterViewInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private ngZone = inject(NgZone);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  isGoogleLoading = false;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initializeGoogleSignIn();
  }

  private initializeGoogleSignIn(): void {
    if (typeof google !== 'undefined' && google.accounts) {
      google.accounts.id.initialize({
        client_id: this.authService.getGoogleClientId(),
        callback: (response: any) => this.handleGoogleSignIn(response),
        auto_select: false,
        cancel_on_tap_outside: true
      });

      google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left'
        }
      );
    } else {
      // Retry after script loads
      setTimeout(() => this.initializeGoogleSignIn(), 500);
    }
  }

  private handleGoogleSignIn(response: any): void {
    this.ngZone.run(() => {
      this.isGoogleLoading = true;
      this.authService.authenticateWithGoogle({ idToken: response.credential }).subscribe({
        next: () => {
          this.isGoogleLoading = false;
          this.snackBar.open('Inicio de sesión con Google exitoso', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isGoogleLoading = false;
          const message = error.error?.message || 'Error al autenticar con Google';
          if (message.includes('rol')) {
            // Usuario nuevo necesita seleccionar rol - redirigir a registro
            this.snackBar.open('Usuario nuevo. Por favor completa tu registro.', 'Cerrar', { duration: 5000 });
            this.router.navigate(['/register'], { queryParams: { googleToken: response.credential } });
          } else {
            this.snackBar.open('Error: ' + message, 'Cerrar', { duration: 5000 });
          }
        }
      });
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.snackBar.open('Inicio de sesión exitoso', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.snackBar.open('Error: ' + (error.error?.message || 'Credenciales inválidas'), 'Cerrar', { duration: 5000 });
        }
      });
    }
  }
}
