import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NotificationService } from '../../servicios/notification.service';
import { AuthService } from '../../servicios/auth.service';
import { Notification } from '../../interfaces/notification.interface';

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  imports: [CommonModule], // Esto soluciona el error NG8103
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css'],
  providers: [DatePipe]
})
export class NotificacionesComponent implements OnInit {

  public notificaciones: Notification[] = [];
  public isLoading: boolean = true;

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.cargarNotificaciones();
  }

  cargarNotificaciones(): void {
    const usuarioId = this.authService.getUserIdFromToken();
    if (usuarioId) {
      this.isLoading = true;
      this.notificationService.getNotificacionesPorUsuario(usuarioId).subscribe({
        next: (notificaciones) => {
          this.notificaciones = notificaciones.map(notif => ({
            ...notif,
            fechaCreacion: this.formatFecha(notif.timestamp)
          }));
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al cargar notificaciones', error);
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
    }
  }

  formatFecha(fecha: string): string {
    return this.datePipe.transform(fecha, 'medium') || '';
  }
}
