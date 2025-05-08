import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-comentarios',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './comentarios.component.html',
  styleUrl: './comentarios.component.css'
})
export class ComentariosComponent {
  @Input() reportId!: string;
  @Output() commentSubmitted = new EventEmitter<any>();

  commentForm: any;

  constructor(private fb: FormBuilder) {
    this.commentForm = this.fb.group({
      text: ['', [Validators.required, Validators.maxLength(500)]],
      image: [null as File | null]
    });
  }

  previewImage: string | ArrayBuffer | null = null;

 

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.commentForm.patchValue({ image: file });

      // Generar vista previa
      const reader = new FileReader();
      reader.onload = () => this.previewImage = reader.result;
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.commentForm.patchValue({ image: null });
    this.previewImage = null;
  }

  onSubmit() {
    if (this.commentForm.valid) {
      const commentData = {
        reportId: this.reportId,
        text: this.commentForm.value.text!,
        image: this.commentForm.value.image
      };

      // Emitir el comentario al componente padre
      this.commentSubmitted.emit(commentData);
      
      // Resetear el formulario
      this.commentForm.reset();
      this.previewImage = null;
      
      console.log('Comentario simulado:', commentData);
    }
  }
}
