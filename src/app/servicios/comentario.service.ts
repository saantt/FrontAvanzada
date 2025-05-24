import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {
  private baseUrl = 'https://proyectofinalprogramacionavanzada-3.onrender.com/api/comentarios'; // Ajusta si tienes prefijo

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código de estado: ${error.status}, Mensaje: ${error.error || error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

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

  getComment(idReporte: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${idReporte}`,this.getAuthHeaders()).pipe(
      map((response: any) => {
        //  Manejar diferentes estructuras de respuesta
        if (Array.isArray(response)) {
          return response;
        } else if (response && response.data) {
          return response.data;
        } else {
          return []; //  Devolver un array vacío por defecto
        }
      }),
      catchError(this.handleError)
    );
  }
  
}
