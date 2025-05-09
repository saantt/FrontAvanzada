import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import * as mapboxgl from 'mapbox-gl';
import { environment } from './enviroment'; // Asegúrate de tener este archivo

@Component({
  selector: 'app-formulario',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.css'
})
export class FormularioComponent implements OnInit {
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  map!: mapboxgl.Map;
  crearReporteForm!: FormGroup;
  categorias: string[];
  ciudades: string[];
  lat: number = 4.604858;
  lng: number = -74.060364;
  zoom: number = 12;

  constructor(private formBuilder: FormBuilder) {
    this.categorias = [
      'Mascota Perdida',
      'Robo',
      'Alumbrado público',
      'Huecos en la vía'
    ];

    this.ciudades = [
      'Bogotá',
      'Cali',
      'Cartagena',
      'Armenia',
      'Ibagué'
    ];
    // Asigna el accessToken directamente a la propiedad del objeto mapboxgl
    /* (mapboxgl as any).accessToken = environment.mapboxToken; */
  }

  ngOnInit() {
    this.crearFormulario();
  }

  ngAfterViewInit() {
    this.initMap();
  }

  private crearFormulario() {
    this.crearReporteForm = this.formBuilder.group({
      titulo: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      categoria: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
      ubicacion: [{ value: '', disabled: true }, [Validators.required]],
      imagen: ['', [Validators.required]],
      latitude: [this.lat],
      longitude: [this.lng]
    });
  }

  initMap() {
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

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const files = event.target.files;
      const file = files[0];
      this.crearReporteForm.get('imagen')?.setValue(file);
    }
  }

  crearReporte() {
    console.log(this.crearReporteForm.value);
    // Aquí iría la lógica para enviar el reporte al backend
  }
}