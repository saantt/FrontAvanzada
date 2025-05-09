import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../interfaces/usuario.interface';
import { environment } from '../Paginas/formulario/enviroment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrl; // Replace with your actual backend API URL

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/profile`); // Or the appropriate endpoint
  }

  updateUser(userData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/profile`, userData); // Or the appropriate endpoint
  }
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/usuarios`); // Ajusta la ruta de tu API
  }

  eliminarUsuario(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/usuarios/${id}`); // Ajusta la ruta de tu API
  }
   // Obtener todos los usuarios
   getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Actualizar estado de un usuario
  updateUserStatus(userId: string, active: boolean): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${userId}/status`, { active });
  }

  // Eliminar un usuario (opcional)
  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}`);
  }

}