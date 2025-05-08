import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-activacion-cuenta',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './activacion-cuenta.component.html',
  styleUrl: './activacion-cuenta.component.css'
})
export class ActivacionCuentaComponent implements OnInit {
  activationForm: FormGroup;
  email: string = '';
  countdown: number = 900; // 15 minutos en segundos
  countdownDisplay: string = '15:00';
  private countdownInterval: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.activationForm = this.fb.group({
      code: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
        Validators.pattern('^[0-9]*$')
      ]]
    });
  }

  ngOnInit(): void {
    // Obtener email de los parámetros de la URL
    this.email = this.route.snapshot.queryParamMap.get('email') || '';
    
    // Simular envío de código
    this.simulateCodeSending();
    this.startCountdown();
  }

  simulateCodeSending(): void {
    console.log(`Código simulado enviado a: ${this.email}`);
    // En una implementación real, aquí iría la llamada al backend
  }

  startCountdown(): void {
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      const minutes = Math.floor(this.countdown / 60);
      const seconds = this.countdown % 60;
      this.countdownDisplay = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
      
      if (this.countdown <= 0) {
        clearInterval(this.countdownInterval);
        this.countdownDisplay = 'Código expirado';
      }
    }, 1000);
  }

  onSubmit(): void {
    if (this.activationForm.valid) {
      // Simular activación exitosa
      console.log('Código ingresado:', this.activationForm.value.code);
      
      // Redirigir a login con parámetro de éxito
      this.router.navigate(['/login'], { 
        queryParams: { accountActivated: 'true' } 
      });
    }
  }

  resendCode(): void {
    // Resetear el contador
    this.countdown = 900;
    this.countdownDisplay = '15:00';
    this.startCountdown();
    
    // Simular reenvío de código
    this.simulateCodeSending();
    alert('Se ha reenviado un nuevo código a tu correo');
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
 }

