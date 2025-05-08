import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-generar-informes',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './generar-informes.component.html',
  styleUrl: './generar-informes.component.css'
})
export class GenerarInformesComponent {
  reportForm: FormGroup;
  categories = [
    'Mascota Perdida',
    'Robo',
    'Alumbrado público',
    'Huecos en la vía',
    'Emergencia médica',
    'Contaminación'
  ];
  statuses = [
    'Todos',
    'Pendiente',
    'Verificado',
    'Rechazado',
    'Resuelto'
  ];
  reportTypes = [
    { id: 'summary', name: 'Resumen General' },
    { id: 'byCategory', name: 'Por Categoría' },
    { id: 'byLocation', name: 'Por Ubicación' },
    { id: 'byStatus', name: 'Por Estado' }
  ];

  constructor(private fb: FormBuilder) {
    this.reportForm = this.fb.group({
      reportType: ['summary', Validators.required],
      categories: [[]],
      status: ['Todos'],
      dateRange: this.fb.group({
        start: [''],
        end: ['']
      }),
      format: ['web', Validators.required]
    });
  }

  generateReport() {
    if (this.reportForm.valid) {
      const formData = this.reportForm.value;
      const filters = {
        type: formData.reportType,
        categories: formData.categories,
        status: formData.status !== 'Todos' ? formData.status : null,
        startDate: formData.dateRange.start,
        endDate: formData.dateRange.end
      };

      // Simular generación de reporte
      if (formData.format === 'pdf') {
        this.generatePDF(filters);
      } else {
        this.generateWebReport(filters);
      }
    }
  }

  private generatePDF(filters: any) {
    console.log('Generando PDF con filtros:', filters);
    // Simulación de descarga
    alert('Descargando PDF generado con los filtros seleccionados');
  }

  private generateWebReport(filters: any) {
    console.log('Generando reporte web con filtros:', filters);
    // Simulación de visualización
    alert('Mostrando reporte en pantalla con los filtros seleccionados');
  }

  toggleCategory(category: string) {
    const categories = this.reportForm.get('categories')?.value;
    const index = categories.indexOf(category);

    if (index >= 0) {
      categories.splice(index, 1);
    } else {
      categories.push(category);
    }

    this.reportForm.get('categories')?.setValue([...categories]);
  }
}
