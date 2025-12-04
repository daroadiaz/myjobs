import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDividerModule
  ],
  template: `
    <div class="container">
      <mat-card class="profile-card">
        <mat-card-header>
          <div mat-card-avatar class="avatar">
            @if (currentUser?.profileImage) {
              <img [src]="currentUser.profileImage" alt="Avatar">
            } @else {
              <mat-icon>person</mat-icon>
            }
          </div>
          <mat-card-title>Editar Perfil</mat-card-title>
          <mat-card-subtitle>Actualice su información personal</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          @if (currentUser) {
            <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
              <h3 class="section-title">Información Personal</h3>

              <div class="form-row two-columns">
                <mat-form-field appearance="outline">
                  <mat-label>Nombre</mat-label>
                  <input matInput formControlName="firstName">
                  <mat-icon matPrefix>person</mat-icon>
                  <mat-error *ngIf="profileForm.get('firstName')?.hasError('required')">
                    El nombre es requerido
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Apellido</mat-label>
                  <input matInput formControlName="lastName">
                  <mat-icon matPrefix>person_outline</mat-icon>
                  <mat-error *ngIf="profileForm.get('lastName')?.hasError('required')">
                    El apellido es requerido
                  </mat-error>
                </mat-form-field>
              </div>

              <div class="form-row two-columns">
                <mat-form-field appearance="outline">
                  <mat-label>Correo electrónico</mat-label>
                  <input matInput formControlName="email" type="email" readonly>
                  <mat-icon matPrefix>email</mat-icon>
                  <mat-hint>El email no puede ser modificado</mat-hint>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Teléfono</mat-label>
                  <input matInput formControlName="phone" type="tel">
                  <mat-icon matPrefix>phone</mat-icon>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Ubicación</mat-label>
                  <input matInput formControlName="location"
                    placeholder="Ej: Ciudad de México, México">
                  <mat-icon matPrefix>location_on</mat-icon>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>URL de imagen de perfil</mat-label>
                  <input matInput formControlName="profileImage"
                    placeholder="https://ejemplo.com/mi-foto.jpg">
                  <mat-icon matPrefix>image</mat-icon>
                  <mat-hint>Enlace a su foto de perfil</mat-hint>
                </mat-form-field>
              </div>

              <mat-divider></mat-divider>

              <h3 class="section-title">Acerca de mí</h3>

              <div class="form-row">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Biografía</mat-label>
                  <textarea matInput formControlName="bio" rows="5"
                    placeholder="Cuéntenos sobre usted, su experiencia, habilidades e intereses..."></textarea>
                  <mat-hint>{{ profileForm.get('bio')?.value?.length || 0 }} / 1000 caracteres</mat-hint>
                </mat-form-field>
              </div>

              <div class="info-section">
                <p><mat-icon>badge</mat-icon> <strong>Rol:</strong> {{ getRoleLabel(currentUser.role) }}</p>
                <p><mat-icon>calendar_today</mat-icon> <strong>Miembro desde:</strong> {{ currentUser.createdAt | date:'longDate' }}</p>
              </div>

              <div class="form-actions">
                <button mat-button type="button" routerLink="/profile">
                  <mat-icon>close</mat-icon>
                  Cancelar
                </button>
                <button mat-raised-button color="primary" type="submit"
                  [disabled]="profileForm.invalid || isSubmitting">
                  <mat-icon>save</mat-icon>
                  {{ isSubmitting ? 'Guardando...' : 'Guardar Cambios' }}
                </button>
              </div>
            </form>
          } @else {
            <p>Cargando información del perfil...</p>
          }
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
    .profile-card {
      padding: 20px;
    }
    .avatar {
      width: 56px;
      height: 56px;
      background: #3f51b5;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      overflow: hidden;
    }
    .avatar mat-icon {
      color: white;
      font-size: 32px;
      width: 32px;
      height: 32px;
    }
    .avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .section-title {
      margin: 24px 0 16px;
      color: #333;
      font-size: 16px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
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
    .info-section {
      background: #f5f5f5;
      padding: 16px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .info-section p {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 8px 0;
    }
    .info-section mat-icon {
      color: #666;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid #eee;
    }
    mat-divider {
      margin: 24px 0;
    }
    @media (max-width: 600px) {
      .two-columns {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class EditProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  currentUser: User | null = null;
  isSubmitting = false;

  profileForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: [{ value: '', disabled: true }],
    phone: [''],
    location: [''],
    profileImage: [''],
    bio: ['', [Validators.maxLength(1000)]]
  });

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone || '',
          location: user.location || '',
          profileImage: user.profileImage || '',
          bio: user.bio || ''
        });
      },
      error: () => {
        this.snackBar.open('Error al cargar el perfil', 'Cerrar', {
          duration: 5000
        });
      }
    });
  }

  getRoleLabel(role: string): string {
    const labels: Record<string, string> = {
      'TRABAJADOR': 'Trabajador / Profesional',
      'EMPLEADOR': 'Empleador / Empresa',
      'MODERADOR': 'Moderador'
    };
    return labels[role] || role;
  }

  onSubmit(): void {
    if (this.profileForm.valid && this.currentUser) {
      this.isSubmitting = true;

      const updateData = {
        firstName: this.profileForm.value.firstName,
        lastName: this.profileForm.value.lastName,
        phone: this.profileForm.value.phone,
        location: this.profileForm.value.location,
        profileImage: this.profileForm.value.profileImage,
        bio: this.profileForm.value.bio
      };

      this.userService.updateProfile(this.currentUser.id, updateData).subscribe({
        next: (updatedUser) => {
          // Actualizar el usuario en localStorage
          const authData = localStorage.getItem('auth');
          if (authData) {
            const auth = JSON.parse(authData);
            auth.user = { ...auth.user, ...updatedUser };
            localStorage.setItem('auth', JSON.stringify(auth));
          }

          this.snackBar.open('Perfil actualizado exitosamente', 'Cerrar', {
            duration: 5000
          });
          this.router.navigate(['/profile']);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.snackBar.open(
            error.error?.message || 'Error al actualizar el perfil',
            'Cerrar',
            { duration: 5000 }
          );
        }
      });
    }
  }
}
