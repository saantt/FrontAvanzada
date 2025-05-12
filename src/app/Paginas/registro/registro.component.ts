import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../servicios/auth.service';

@Component({
  imports: [ReactiveFormsModule, CommonModule],
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  ciudades: string[];
  registroForm!: FormGroup;

  constructor(private authService: AuthService, private formBuilder: FormBuilder) {
    this.ciudades = ['Armenia', 'Bogota', 'Cali', 'Cartagena', 'Cúcuta', 'Ibagué'];
    this.crearFormulario();
  }

  private crearFormulario() {
    this.registroForm = this.formBuilder.group({     
      nombre: ['', [Validators.required]],
      telefono: ['', [
        Validators.required, 
        Validators.pattern(/^[0-9]{10}$/)
      ]],
      ciudad: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],     
      password: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(7)]],
      confirmaPassword: ['', [Validators.required]] // ← Añade este control
    }, {
      validators: this.passwordsMatchValidator
    } as AbstractControlOptions);
  }

  public passwordsMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmaPassword = formGroup.get('confirmaPassword')?.value;
    
    if (password && confirmaPassword && password !== confirmaPassword) {
      formGroup.get('confirmaPassword')?.setErrors({ passwordsMismatch: true });
      return { passwordsMismatch: true };
    } else {
      formGroup.get('confirmaPassword')?.setErrors(null);
      return null;
    }
  }
  registrar() {
    if (this.registroForm.valid) {
      const formData = this.registroForm.value;
      const userData = {
        nombre: formData.nombre,
        telefono: formData.telefono,
        ciudad: formData.ciudad,
        direccion: formData.direccion,
        email: formData.email,
        password: formData.password
      };
      this.authService.register(userData).subscribe({
        next: (response) => {
          console.log('Registro exitoso:', response);
        },
        error: (error) => {
          console.error('Error en el registro:', error);
        }
      });
    }
  }
}