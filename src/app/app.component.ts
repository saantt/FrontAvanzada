import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { AuthService } from './servicios/auth.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Proyecto-Programacion-Avanzada';
  footer = 'Universidad del Quindío - 2025-1'; 
  users: any = null ;

  isLoggedIn: boolean = false;
  displayReports: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    // Escucha el cambio de ruta
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Cierra el submenú de reportes cuando cambia la ruta
        this.displayReports = false;
      }
    });
  }

  ngOnInit(): void {
    // estado de autenticación
    const isLogged = this.authService.isLoggedIn;
    this.authService.authStatus.next(isLogged);
    this.authService.authStatus.subscribe(status => {

      if (status) {
        const userId = this.obtenerClienteIdDesdeToken();
        if (userId) {
          this.authService.getCurrentUserId(userId).subscribe({
            next: (data) => {
              this.users = data
            },
            error: (error) => {
              console.error('Error fetching my reports:', error);
            }
          });
        }
      }else{
        this.users = null;
      }
      this.isLoggedIn = status;
    });
  }

  // obtener id del usuario
  obtenerClienteIdDesdeToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
 
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || payload.id || null; // depende de cómo generaste el JWT
    } catch (e) {
      return null;
    }
  }

  toggleReportes() {
    this.displayReports = !this.displayReports;
  }

}
