import { Injectable } from "@angular/core";
import { delay, Observable, of } from "rxjs";

// auth.mock.service.ts
@Injectable({
    providedIn: 'root'
  })
  export class AuthMockService {
    getCurrentUserInfo(): Observable<any> {
      return of({
        nombre: 'Santiago',
        email: 'Santiago@gmail.com',
        telefono: '3128864250',
        ciudad: 'Armenia',
        direccion: 'Calle 67 #23-01'
      }).pipe(delay(1000));
    }
    
    // Implementa otros métodos necesarios
  }