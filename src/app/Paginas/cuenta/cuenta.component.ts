import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';

import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

type User = {
  _id?: string;
  nombre: string;
  email: string;
  telefono: string;
  ciudad: string;
  direccion: string;
  role?: 'user' | 'moderator' | 'admin';
  isActive?: boolean;
};

@Component({
  selector: 'app-cuenta',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './cuenta.component.html',
  styleUrl: './cuenta.component.css'
})
export class CuentaComponent implements OnInit {
  user: User | null = null;
  userInitials = '';
  showLogoutNotification = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    // Registrar íconos de Material
    this.registerIcons();
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  registerIcons(): void {
    const icons = [
      'settings', 'assignment', 'add_circle', 'exit_to_app', 'chevron_right'
    ];
    
    icons.forEach(icon => {
      this.iconRegistry.addSvgIcon(
        icon,
        this.sanitizer.bypassSecurityTrustResourceUrl(
          `assets/icons/${icon}.svg`
        )
      );
    });
  }

  loadUserData(): void {
    this.authService.getCurrentUserInfo().subscribe({
      next: (user) => {
        this.user = user;
        this.userInitials = this.getUserInitials(user.nombre);
      },
      error: (err) => {
        console.error('Error al cargar datos del usuario:', err);
      }
    });
  }

  getUserInitials(fullName: string): string {
    const names = fullName.split(' ');
    let initials = names[0].charAt(0).toUpperCase();
    
    if (names.length > 1) {
      initials += names[names.length - 1].charAt(0).toUpperCase();
    }
    
    return initials;
  }

  logout(): void {
    this.showLogoutNotification = true;
    
    setTimeout(() => {
      this.authService.logout();
      this.router.navigate(['/login']);
    }, 1000);
  }
}
