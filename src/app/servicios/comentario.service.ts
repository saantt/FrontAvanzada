import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {
  private baseUrl = 'http://localhost:8080/api/comentarios'; // Ajusta si tienes prefijo

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): { headers: HttpHeaders } {
  const token = localStorage.getItem('token');
  return {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
  };
}


  crearComentario(idReporte: string, comentario: any) {
    return this.http.post(`${this.baseUrl}/${idReporte}`, comentario, this.getAuthHeaders());
  }
}
