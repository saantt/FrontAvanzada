import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { JwtInterceptor } from './servicios/auth.interceptor';
import { AuthService } from './servicios/auth.service';


@NgModule({

  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule,
    AppComponent,
    FormsModule,
    ReactiveFormsModule
    // otros módulos que uses
  ],
  providers: [
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
})
export class AppModule {}
