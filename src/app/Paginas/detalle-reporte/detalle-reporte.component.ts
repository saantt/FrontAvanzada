import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComentarioService } from '../../servicios/comentario.service'; // Asegúrate de importar bien tu servicio
import { AuthService } from '../../servicios/auth.service';
import { ComentariosComponent } from "../comentarios/comentarios.component"; // Para obtener el clienteId si tienes auth
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { ActivatedRoute } from '@angular/router';
import { Reporte} from '../../interfaces/reporte.interface';
import { ReportService } from '../../servicios/report.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-detalle-reporte',
  templateUrl: './detalle-reporte.component.html',
  styleUrls: ['./detalle-reporte.component.css'],
  imports: [ComentariosComponent, CommonModule, ReactiveFormsModule, MatDialogModule, MatDividerModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatOptionModule]
})
export class DetalleReporteComponent implements OnInit {
  commentForm: FormGroup;
  reportes: Reporte[] = [];
  selectedReporteId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private comentarioService: ComentarioService,
    private authService: AuthService,
    private reporteService: ReportService
  ) {
    this.commentForm = this.fb.group({
      comentario: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.reporteService.getReports().subscribe({
      next: (data) => this.reportes = data,
      error: (err) => console.error('Error cargando reportes', err)
    });
  }

  enviarComentario() {
    if (this.commentForm.invalid || !this.selectedReporteId) return;

    const comentarioPayload = {
      mensaje: this.commentForm.value.comentario,
      clienteId: this.authService.getUserIdFromToken()
    };

    this.comentarioService.crearComentario(this.selectedReporteId, comentarioPayload).subscribe({
      next: () => {
        alert('Comentario enviado con éxito');
        this.commentForm.reset();
        this.selectedReporteId = null;
      },
      error: (err) => {
        console.error('Error al enviar comentario', err);
        alert('Hubo un error al enviar el comentario');
      }
    });
  }
}