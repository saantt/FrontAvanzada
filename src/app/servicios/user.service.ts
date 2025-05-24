import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../interfaces/usuario.interface';
import { environment } from '../Paginas/formulario/enviroment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://proyectofinalprogramacionavanzada-4.onrender.com/api/usuarios'; // Ajusta según tu backend

  constructor(private http: HttpClient) {}

  private obtenerClienteIdDesdeToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
 
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || payload.id || null; // depende de cómo generaste el JWT
    } catch (e) {
      return null;
    }
  }

  getCurrentUser(): Observable<any> {
  const userId = this.obtenerClienteIdDesdeToken();
  return this.http.get<any>(`${this.apiUrl}/${userId}`);
}

  updateUser(userData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${userData.id}`, userData); // Or the appropriate endpoint
  }
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}`); // Ajusta la ruta de tu API
  }

  eliminarUsuario(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`); // Ajusta la ruta de tu API
  }
}