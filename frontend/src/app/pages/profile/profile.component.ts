import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  template: `
    <div class="container">
      <h1>Mi Perfil</h1>
      @if (currentUser) {
        <mat-card>
          <mat-card-content>
            <p><strong>Nombre:</strong> {{ currentUser.firstName }} {{ currentUser.lastName }}</p>
            <p><strong>Email:</strong> {{ currentUser.email }}</p>
            <p><strong>Rol:</strong> {{ currentUser.role }}</p>
            @if (currentUser.phone) {
              <p><strong>Teléfono:</strong> {{ currentUser.phone }}</p>
            }
            @if (currentUser.location) {
              <p><strong>Ubicación:</strong> {{ currentUser.location }}</p>
            }
            @if (currentUser.bio) {
              <p><strong>Biografía:</strong> {{ currentUser.bio }}</p>
            }
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary">Editar Perfil</button>
          </mat-card-actions>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .container { padding: 20px; max-width: 600px; margin: 0 auto; }
  `]
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);

  currentUser?: User | null;

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }
}
