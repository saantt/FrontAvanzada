import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';

import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';

@Component({
  selector: 'app-recuperar-contrasenia',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './recuperar-contrasenia.component.html',
  styleUrls: ['./recuperar-contrasenia.component.css']
})
export class RecuperarContraseniaComponent implements OnInit {
  isResetting = false;

  recoverForm: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  resetForm: FormGroup;
  isResetLoad = false;
  resetSuccessMessage = '';
  resetErrorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.recoverForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      code: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(5),
        Validators.pattern('^[0-9]*$')
      ]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.recoverForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const email = this.recoverForm.value.email;

    // Simulación de servicio (reemplaza con tu implementación real)
    this.authService.recoverPassword(email)
      .pipe(
        catchError(error => {
          this.errorMessage = 'Ocurrió un error al enviar el correo. Por favor intenta nuevamente.';
          return of(null);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(response => {
        if (response) {
          this.successMessage = 'Se ha enviado un correo con instrucciones para restablecer tu contraseña.';
          this.resetForm.patchValue(email);
          this.isResetting = true;
          this.resetForm.get('email')?.setValue(this.recoverForm.get('email')?.value);
          this.recoverForm.reset();
        }
      });
  }

  // Envío de código para recuperar contraseña
  onSubmitReset(): void {
    if (this.resetForm.invalid) {
      return;
    }
    this.isResetLoad = true;
    this.successMessage = '';
    this.resetErrorMessage = '';

    if (this.resetForm.valid) {
      const { email, code, newPassword } = this.resetForm.value;
      this.authService.validateCodeAndResetPassword(email, code, newPassword)
      .pipe(
        catchError(error => {
          this.resetErrorMessage = 'Ocurrió un error al enviar el correo. Por favor intenta nuevamente.';
          return of(null);
        }),
        finalize(() => {
          this.isResetLoad = false;
        })
      )
      .subscribe(response =>{
        if (response) {
          this.successMessage = 'Contraseña cambiada exitosamente';
          this.isResetLoad = true;
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        }
      });
    }
  }
}
