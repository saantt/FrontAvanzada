import { Component, OnInit } from '@angular/core';
import { MapaService } from '../../../servicios/mapa.service';

@Component({
  selector: 'app-mapa-reportes',
  templateUrl: './mapa-reportes.component.html',
  styleUrls: ['./mapa-reportes.component.css']
})
export class MapaReportesComponent implements OnInit {
  coordenadasSeleccionadas: { lng: number; lat: number } | null = null;

  constructor(private mapaService: MapaService) {}

  ngOnInit(): void {
    this.mapaService.crearMapa('mapa');

    this.mapaService.agregarMarcador().subscribe(coords => {
      this.coordenadasSeleccionadas = coords;
      console.log('Coordenadas seleccionadas:', coords);
    });
  }
}
