import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { JwtInterceptor } from './servicios/auth.interceptor';
import { AuthService } from './servicios/auth.service';
import { NotificationService } from './servicios/notificacion.service';
import { NotificacionesComponent } from './Paginas/notificaciones/notificaciones.component';

@NgModule({

  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule,
    AppComponent,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule
    // otros módulos que uses
  ],
  providers: [
    AuthService,
    NotificationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
})
export class AppModule {}
