import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Categoria } from '../interfaces/categoria.interface';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private baseUrl = 'https://proyectofinalprogramacionavanzada-3.onrender.com/api/categorias';

  private getAuthHeaders(): { headers: HttpHeaders } {
  const token = localStorage.getItem('token');
  return {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
  };
  }

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

  listarCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.baseUrl, this.getAuthHeaders()).pipe(
      map((response: any) => {
        console.log(response);
        
        //  Manejar diferentes estructuras de respuesta
        if (Array.isArray(response)) {
          return response;
        } else if (response) {
          return response;
        } else {
          return []; //  Devolver un array vacío por defecto
        }
      }),
      catchError(this.handleError)
    );
  }

  crearCategoria(categoria: Categoria): Observable<any> {
    return this.http.post(this.baseUrl, categoria, this.getAuthHeaders());
  }

  actualizarCategoria(id: string, categoria: Categoria): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, categoria, this.getAuthHeaders());
  }

  eliminarCategoria(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, this.getAuthHeaders());
  }
}
