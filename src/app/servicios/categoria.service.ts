import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Categoria } from '../interfaces/categoria.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private baseUrl = 'http://localhost:8080/api/categorias';

  private getAuthHeaders(): { headers: HttpHeaders } {
  const token = localStorage.getItem('token');
  return {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
  };
  }

  constructor(private http: HttpClient) {}

  listarCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.baseUrl, this.getAuthHeaders());
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
