import { Component } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-borrar-cuenta',
  imports: [ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './borrar-cuenta.component.html',
  styleUrl: './borrar-cuenta.component.css'
})
export class BorrarCuentaComponent {
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  confirmDeleteAccount() {
    if (this.password) {
      this.authService.deleteAccount(this.password).subscribe({
        next: (response) => {
          // Handle successful deletion (e.g., logout, redirect)
          console.log('Cuenta eliminada:', response);
          this.authService.logout(); // Assuming you have a logout method
          this.router.navigate(['/']); // Redirect to home or login
        },
        error: (error) => {
          // Handle error (e.g., incorrect password)
          console.error('Error al eliminar la cuenta:', error);
          this.errorMessage = 'Contraseña incorrecta. Por favor, inténtalo de nuevo.';
        },
      });
    } else {
      this.errorMessage = 'La contraseña es requerida.';
    }
  }

  cancelDelete() {
    // Navigate back or to a safe place
    this.router.navigate(['/profile']); // Or wherever you want to go
  }
}
