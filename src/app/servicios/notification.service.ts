import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Notification } from '../Paginas/notificaciones/notification.interface'; // Asegúrate de que la ruta sea correcta
import { environment } from '../Paginas/formulario/enviroment'; // Asegúrate de que la ruta sea correcta

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private apiUrl: string = environment.apiUrl; // Usa la URL de la API desde el entorno

  constructor(private http: HttpClient) {}

  // Obtiene las notificaciones del usuario actual desde el backend
  getNotifications(): Observable<Notification[]> {
    // Suponiendo que tienes un endpoint en tu backend para obtener las notificaciones del usuario
    // y que necesitas el ID del usuario actual. Si no, ajusta la llamada a la API.
    const userId = 'user123'; // Esto DEBE obtenerse del servicio de autenticación
    return this.http.get<Notification[]>(`${this.apiUrl}/notifications/${userId}`);
    // Ejemplo de respuesta del backend (ajusta según tu implementación):
    // [
    //  { id: '1', userId: 'user123', type: 'Nuevo Reporte', message: 'Se ha creado un nuevo reporte cerca de ti.', createdAt: '2024-07-24T10:00:00Z', read: false, reportId: 'report1' },
    //  { id: '2', userId: 'user123', type: 'Nuevo Comentario', message: 'Alguien comentó en tu reporte.', createdAt: '2024-07-24T12:30:00Z', read: true, reportId: 'report2' },
    //  { id: '3', userId: 'user123', type: 'Reporte Actualizado', message: 'El estado de un reporte ha cambiado.', createdAt: '2024-07-25T09:00:00Z', read: false, reportId: 'report1' },
    // ]
  }

  // Marca una notificación como leída en el backend
  markAsRead(notificationId: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/notifications/${notificationId}/read`, {});
    // El backend debería devolver un 204 No Content si la actualización se realiza correctamente
  }

  // Método para crear una notificación (ejemplo, desde un WebSocket o similar)
  createNotification(notification: Omit<Notification, 'id' | 'read' | 'createdAt'>): Observable<Notification> {
    return this.http.post<Notification>(`${this.apiUrl}/notifications`, notification);
  }
}