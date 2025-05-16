import { Component, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ComentarioService } from '../../servicios/comentario.service';
import { AuthService } from '../../servicios/auth.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.component.html',
  styleUrl: './comentarios.component.css',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule]
})
export class ComentariosComponent {
  @Input() reportId!: string;

  commentForm: ReturnType<FormBuilder['group']>;

  constructor(
    private fb: FormBuilder,
    private comentarioService: ComentarioService,
    private authService: AuthService
  ) {
    this.commentForm = this.fb.group({
      text: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  onSubmit() {
    if (this.commentForm.invalid) return;

    const clienteId = this.authService.getUserIdFromToken();
    if (!clienteId) {
      console.error("Usuario no autenticado");
      return;
    }

    const comentario = {
      mensaje: this.commentForm.value.text!,
      clienteId: clienteId
    };

    this.comentarioService.crearComentario(this.reportId, comentario).subscribe({
      next: () => {
        this.commentForm.reset();
        console.log("Comentario enviado correctamente");
      },
      error: (err) => {
        console.error("Error al enviar comentario:", err);
      }
    });
  }
}
