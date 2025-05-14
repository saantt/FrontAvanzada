import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import mapboxgl, { LngLatLike, Marker, Popup } from 'mapbox-gl';

@Injectable({
  providedIn: 'root'
})
export class MapaService {
  mapa!: mapboxgl.Map;
  marcadores: Marker[] = [];
  posicionActual: LngLatLike = [-75.67270, 4.53252]; // Ibagué
  accessToken = 'pk.eyJ1IjoibWlsdG9uZ29tZXoiLCJhIjoiY21hbmF5bmc1MGJ6dTJscHVva240d2gyYSJ9.FGf4B1c6iia2KC3DT5LaLw';

  constructor() {
    (mapboxgl as any).accessToken = this.accessToken;
  }

  public crearMapa(containerId: string = 'mapa'): void {
    this.mapa = new mapboxgl.Map({
      container: containerId,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: this.posicionActual,
      zoom: 15,
      pitch: 45
    });

    this.mapa.addControl(new mapboxgl.NavigationControl());
    this.mapa.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true
      })
    );
  }

  public agregarMarcador(): Observable<{ lng: number; lat: number }> {
    return new Observable(observer => {
      this.mapa.on('click', (e) => {
        this.eliminarMarcadores();

        const marcador = new mapboxgl.Marker()
          .setLngLat(e.lngLat)
          .addTo(this.mapa);

        this.marcadores.push(marcador);
        observer.next({ lng: e.lngLat.lng, lat: e.lngLat.lat });
      });
    });
  }

  public pintarMarcadores(reportes: any[]): void {
    reportes.forEach(reporte => {
      const popup = new mapboxgl.Popup()
        .setHTML(`<h3>${reporte.titulo}</h3><p>${reporte.descripcion}</p>`);

      new mapboxgl.Marker()
        .setLngLat([reporte.ubicacion.longitud, reporte.ubicacion.latitud])
        .setPopup(popup)
        .addTo(this.mapa);
    });
  }

  private eliminarMarcadores(): void {
    this.marcadores.forEach(marker => marker.remove());
    this.marcadores = [];
  }

  public obtenerMapa(): mapboxgl.Map {
    return this.mapa;
  }
}
