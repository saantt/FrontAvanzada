import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withDebugTracing } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // Añade esto
import { AuthMockService } from './servicios/auth.mock.service';
import { AuthService } from './servicios/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: AuthService, useClass: AuthMockService },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withComponentInputBinding(),
      // withDebugTracing() // <-- Descomenta para debug de routing (solo desarrollo)
    ),
    provideAnimations(),
    provideHttpClient(), // Añade esta línea
    // Puedes añadir interceptores si los necesitas:
    // provideHttpClient(withInterceptors([authInterceptor]))
  ]
};