import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notification } from '../interfaces/notification.interface';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:8080/api/notificaciones'; 

  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  constructor(private http: HttpClient) {}

  getNotificacionesPorUsuario(usuarioId: string): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/usuario/${usuarioId}`, this.getAuthHeaders());
  }
}
