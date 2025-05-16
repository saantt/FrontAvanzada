import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { UserService } from '../../servicios/user.service'; // Replace with your actual user service
import { Router } from '@angular/router';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-configuracion',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit{
  userData: any = { nombre: '', ciudad: '', telefono: '' }; 
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  passwordMismatch = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  private obtenerClienteIdDesdeToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
 
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || payload.id || null;
    } catch (e) {
      return null;
    }
  }

  loadUserData(): void {
  this.userService.getCurrentUser().subscribe({ 
    next: (data) => {
      console.log('Usuario cargado:', data);
      this.userData.nombre = data.respuesta.nombre;
      this.userData.ciudad = data.respuesta.ciudad;
      this.userData.telefono = data.respuesta.telefono;
    },
    error: (error) => {
      console.error('Error fetching user data:', error);
    },
  });
  }


   updateProfile(): void {
    const userId = this.obtenerClienteIdDesdeToken();
    this.userService.updateUser({ ...this.userData, id: userId }).subscribe({
      next: (response) => {
        alert('Perfil actualizado correctamente.');
      },
      error: (error) => {
        console.error('Error updating profile', error);
      },
    });
  }

  openDeleteAccountConfirmation(): void {
  if (confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción es irreversible.')) {
    const userId = this.obtenerClienteIdDesdeToken();
    if (userId) {
      this.userService.eliminarUsuario(userId).subscribe({
        next: () => {
          alert('Cuenta eliminada correctamente.');
          this.authService.logout();
          this.router.navigate(['/login']);
        },
        error: (error: any) => {
          console.error('Error eliminando la cuenta:', error);
        }
      });
    } else {
      alert('No se pudo obtener el ID del usuario. Intenta iniciar sesión nuevamente.');
    }
  }
}
}