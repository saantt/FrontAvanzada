import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { UserService } from '../../servicios/user.service'; // Replace with your actual user service
import { Router } from '@angular/router';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-configuracion',
  imports: [ReactiveFormsModule, CommonModule,FormsModule],
  templateUrl: './configuracion.component.html',
  styleUrl: './configuracion.component.css'
})
export class ConfiguracionComponent implements OnInit{
  userData: any = { nombre: '', ciudad: '', telefono: '', direccion: '', email: '' }; // Initialize with empty values
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  passwordMismatch = false;

  constructor(
    private authService: AuthService,
    private userService: UserService, // Inject User Service
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.userService.getCurrentUser().subscribe({  // Use User Service to get user data
      next: (data) => {
        this.userData = data;
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
        // Handle error (e.g., show a message to the user)
      },
    });
  }

  updateProfile(): void {
    this.userService.updateUser(this.userData).subscribe({  // Use User Service to update
      next: (response) => {
        console.log('Profile updated successfully', response);
        // Optionally, show a success message to the user
      },
      error: (error) => {
        console.error('Error updating profile', error);
        // Handle error
      },
    });
  }

  changePassword(): void {
    if (this.newPassword !== this.confirmPassword) {
      this.passwordMismatch = true;
      return;
    }
    this.passwordMismatch = false;

    const passwordData = {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
    };

    this.authService.changePassword(passwordData.currentPassword, passwordData.newPassword).subscribe({
      next: (response) => {
        console.log('Password changed successfully', response);
        // Optionally, show a success message and clear the form
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      },
      error: (error) => {
        console.error('Error changing password', error);
        // Handle error (e.g., show error message returned from the server)
      },
    });
  }

  openDeleteAccountConfirmation(): void {
    this.router.navigate(['/delete-account']); // Navigate to the delete account page
  }
}
