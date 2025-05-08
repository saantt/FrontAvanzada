import { Component, OnInit } from '@angular/core';
import { Notification } from './notification.interface'; // Asegúrate de que la ruta sea correcta
import { Router } from '@angular/router';
import { NotificationService } from '../../servicios/notification.service'; // Asegúrate de crear este servicio
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notificaciones',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './notificaciones.component.html',
  styleUrl: './notificaciones.component.css'
})
export class NotificacionesComponent implements OnInit{
  notifications: Notification[] = [];
  // Inyecta el servicio y el router
  constructor(private notificationService: NotificationService, private router: Router) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications() {
    this.notificationService.getNotifications().subscribe(
      (notifications) => {
        this.notifications = notifications;
      },
      (error) => {
        console.error('Error al cargar las notificaciones', error);
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    );
  }

  getNotificationTypeIcon(type: string): string {
    switch (type) {
      case 'Nuevo Reporte':
        return '📍'; // Icono de ubicación
      case 'Nuevo Comentario':
        return '💬'; // Icono de comentario
      case 'Reporte Actualizado':
        return 'ℹ️';
      default:
        return '🔔'; // Icono de campana genérico
    }
  }

  markAsReadAndGoToReport(notification: Notification) {
    if (!notification.read) {
      this.notificationService.markAsRead(notification.id).subscribe(
        () => {
          notification.read = true; // Actualiza la interfaz de usuario inmediatamente
          //  this.loadNotifications(); // Esto recargaría TODAS las notificaciones
        },
        (error) => {
          console.error('Error al marcar como leída', error);
        }
      );
    }

    if (notification.reportId) {
      this.router.navigate(['/report', notification.reportId]); //  Navega al reporte
    }
    //  Si no hay reportId, podrías navegar a una página de notificaciones generales
    //  else {
    //   this.router.navigate(['/notifications']);
    //  }
  }
}
