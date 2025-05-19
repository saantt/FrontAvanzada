import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from './enviroment'; // Asegúrate de tener este archivo
import { Reporte } from '../../interfaces/reporte.interface';
import { CategoriaService } from '../../servicios/categoria.service';
import { ReportService } from '../../servicios/report.service';

declare var mapboxgl: any; // Esto declara la variable para el mapa

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css'],
  
})
export class FormularioComponent implements OnInit, AfterViewInit {
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  map!: mapboxgl.Map;
  crearReporteForm!: FormGroup;
  categorias: any[] = [];
  lat: number = 4.604858;
  lng: number = -74.060364;
  zoom: number = 12;

  constructor(
    private formBuilder: FormBuilder,
    private categoriaService: CategoriaService,
    private reportService: ReportService
  ) {}

  ngOnInit() {
    this.crearFormulario();
    this.cargarCategorias();
  }

  ngAfterViewInit() {
    this.initMap();
  }

  private crearFormulario() {
    this.crearReporteForm = this.formBuilder.group({
      titulo: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      categoria: ['', [Validators.required]],
      ubicacion: [{ value: '', disabled: true }],
      imagen: [''],
      latitude: [this.lat],
      longitude: [this.lng]
    });
  }

  cargarCategorias() {
    this.categoriaService.listarCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (error) => {
        console.error('Error al cargar categorías', error);
      }
    });
  }

  initMap() {
    // Asignar el token a la variable global
    (mapboxgl as any).accessToken = environment.mapboxToken;

    this.map = new mapboxgl.Map({
      container: this.mapContainer.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.lng, this.lat],
      zoom: this.zoom
    });

    const marker = new mapboxgl.Marker({
      draggable: true
    })
      .setLngLat([this.lng, this.lat])
      .addTo(this.map);

    this.map.on('click', (e) => {
      this.lat = e.lngLat.lat;
      this.lng = e.lngLat.lng;
      marker.setLngLat([this.lng, this.lat]);
      this.actualizarUbicacion();
    });

    marker.on('dragend', () => {
      const lngLat = marker.getLngLat();
      this.lng = lngLat.lng;
      this.lat = lngLat.lat;
      this.actualizarUbicacion();
    });

    this.actualizarUbicacion();
  }

  actualizarUbicacion() {
    this.crearReporteForm.patchValue({
      ubicacion: `Lat: ${this.lat.toFixed(6)}, Lng: ${this.lng.toFixed(6)}`,
      latitude: this.lat,
      longitude: this.lng
    });
  }

  obtenerClienteIdDesdeToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
 
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || payload.id || null; // depende de cómo generaste el JWT
    } catch (e) {
      return null;
    }
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.crearReporteForm.get('imagen')?.setValue(file);
    }
  }

  crearReporte() {
    const formValue = this.crearReporteForm.value;
    const clienteId = this.obtenerClienteIdDesdeToken();

    console.log('Cliente ID extraído del token:', clienteId); // DEBUG
    
    if (!clienteId) {
      alert('No se pudo identificar al usuario.');
      return;
    }

    const nuevoReporte = {
      titulo: formValue.titulo,
      descripcion: formValue.descripcion,
      clienteId: clienteId,
      categoriaId: formValue.categoria,
      ubicacion: {
        latitud: formValue.latitude,
        longitud: formValue.longitude
      },
      importante: false,
      fotos: [] // Aquí puedes agregar lógica para cargar imagen y obtener URL si quieres
    };

    this.reportService.crearReporte(nuevoReporte).subscribe({
      next: () => {
        alert('Reporte creado correctamente');
        this.crearReporteForm.reset();
      },
      error: (err) => console.error('Error al enviar el reporte', err)
    });
  }
}
