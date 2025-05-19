import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule  } from '@angular/forms';
import { environment } from './enviromment';
import { CategoriaService } from '../../servicios/categoria.service';
import { ReportService } from '../../servicios/report.service';
import { ActivatedRoute } from '@angular/router';
//import * as mapboxgl from 'mapbox-gl';

declare var mapboxgl: any;

@Component({
  selector: 'app-editar-reporte',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule ],
  templateUrl: './editar-reporte.component.html',
  styleUrls: ['./editar-reporte.component.css']
})
export class EditarReporteComponent implements OnInit {
  @Input() reporte!: any;
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  map!: mapboxgl.Map;
  editarReporteForm!: FormGroup;
  categorias: any[] = [];
  reports: any[] = [];
  dataReports: any = { titulo: '', categoria: '', descripcion: '', ubicacion: null, imagen: ''}; 

  lat: number = 4.604858;
  lng: number = -74.060364;
  marker!: mapboxgl.Marker;

  @ViewChild('mapa', { static: false }) divMapa!: ElementRef;
  mapa!: mapboxgl.Map;

  ubicacion = {
    latitud: 4.595914915574825,
    longitud: -74.07441877523767
  };

  constructor(
    private formBuilder: FormBuilder,
    private categoriaService: CategoriaService,
    private reportService: ReportService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
  this.cargarCategorias();

  const reportId = this.route.snapshot.paramMap.get('id');
  if (reportId) {
    this.reportService.getReports().subscribe({
      next: (data) => {
        const reportEncontrado = data.find(report => report.id == reportId);
        if (reportEncontrado) {
          this.dataReports = {
            titulo: reportEncontrado.titulo,
            categoria: reportEncontrado.categoria,
            descripcion: reportEncontrado.descripcion,
            ubicacion: reportEncontrado.ubicacion,
            imagen: reportEncontrado.imagen
          };

          // Actualiza coordenadas si vienen en la respuesta
          if (reportEncontrado.ubicacion) {
            this.lat = reportEncontrado.ubicacion.latitud;
            this.lng = reportEncontrado.ubicacion.longitud;
          }

          this.initFormWithReport(this.dataReports);
          this.initMap();
        } else {
          console.error('Reporte no encontrado');
          this.initFormWithReport({});
          this.initMap();
        }
      },
      error: (err) => {
        console.error('Error al cargar el reporte:', err);
        this.initFormWithReport({});
        this.initMap();
      }
    });
  } else {
    this.initFormWithReport({});
    this.initMap();
  }
}

initFormWithReport(report: any): void {
  this.editarReporteForm = this.formBuilder.group({
    titulo: [report.titulo || '', Validators.required],
    descripcion: [report.descripcion || '', Validators.required],
    categoria: [report.categoria || '', Validators.required],
    ubicacion: [`Lat: ${this.lat.toFixed(6)}, Lng: ${this.lng.toFixed(6)}`],
    imagen: [null],
    latitude: [this.lat],
    longitude: [this.lng]
  });
}

  cargarCategorias(): void {
    this.categoriaService.listarCategorias().subscribe({
      next: (data) => (this.categorias = data),
      error: (error) => console.error('Error al cargar categorías', error)
    });
  }

  initMap(): void {
  (mapboxgl as any).accessToken = environment.mapboxToken;

  this.mapa = new mapboxgl.Map({
    container: this.divMapa.nativeElement,
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [this.lng, this.lat],
    zoom: 15
  });

  this.marker = new mapboxgl.Marker({ draggable: true })
    .setLngLat([this.lng, this.lat])
    .addTo(this.mapa);

    console.log('Marker:', this.marker);

  this.mapa.on('click', (e) => {
      this.lat = e.lngLat.lat;
      this.lng = e.lngLat.lng;
      this.marker.setLngLat([this.lng, this.lat]);
      this.actualizarUbicacion();
    });

if (this.marker) {
  this.marker.on('dragend', () => {
    const lngLat = this.marker!.getLngLat();
    this.lng = lngLat.lng;
    this.lat = lngLat.lat;
    this.actualizarUbicacion();
  });
} else {
  console.error('❌ Marker no se creó correctamente.');
}
    this.actualizarUbicacion();
  }

  actualizarUbicacion() {
    this.editarReporteForm.patchValue({
      ubicacion: `Lat: ${this.lat.toFixed(6)}, Lng: ${this.lng.toFixed(6)}`,
      latitude: this.lat,
      longitude: this.lng
    });
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.editarReporteForm.get('imagen')?.setValue(file);
    }
  }

  editarReporte(): void {
  const reportId = this.route.snapshot.paramMap.get('id');
  if (!reportId) return;

  const updatedReport = {
    titulo: this.dataReports.titulo,
    descripcion: this.dataReports.descripcion,
    categoriaId: this.dataReports.categoria,
    ubicacion: {
      latitud: this.lat,
      longitud: this.lng
    }
  };

  this.reportService.updateReport(reportId, updatedReport).subscribe({
    next: (res) => {
      console.log('Reporte actualizado correctamente:', res);
      alert('Reporte actualizado correctamente');
    },
    error: (err) => {
      console.error('Error al actualizar el reporte:', err);
      alert('Error al actualizar el reporte');
    }
  });
}

}
