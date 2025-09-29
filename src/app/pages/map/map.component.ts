import { Component, OnInit } from '@angular/core';
import { BottomNavComponent } from "../../components/bottom-nav/bottom-nav.component";
import * as mapboxgl from 'mapbox-gl';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { getHoteles, getActividades, getEventos, getRestaurantes, searchAll } from '../../services/api.service';

@Component({
  selector: 'app-map',
  imports: [BottomNavComponent, CommonModule, FormsModule, HttpClientModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit {

    constructor(private router: Router) {}

  map!: mapboxgl.Map;
  searchQuery: string = '';
  places: any[] = [];
  markers: mapboxgl.Marker[] = [];

  async ngOnInit(): Promise<void> {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-74.00, 5.02],
      zoom: 13.5,
      accessToken: 'pk.eyJ1IjoiYW5kcmVzb2plZGEyMCIsImEiOiJjbWFpZGloOWIwbmF4MnFvY3RwMWFqdnBsIn0.Ap1NaGLQzmyX9UXAG_rm3A'
    });

    // 🔥 Al cargar, traemos los últimos registros
    await this.loadLastPlaces();
  }

  /** Obtiene el último registro de cada colección */
  async loadLastPlaces() {
    try {
      const [hotelesRes, restaurantesRes, actividadesRes, eventosRes] = await Promise.all([
        getHoteles(),
        getRestaurantes(),
        getActividades(),
        getEventos()
      ]);

      const lastHotel = hotelesRes.data.at(-1);
      const lastRestaurante = restaurantesRes.data.at(-1);
      const lastActividad = actividadesRes.data.at(-1);
      const lastEvento = eventosRes.data.at(-1);

      this.places = [
        this.mapPlace(lastRestaurante, 'restaurantes'),
        this.mapPlace(lastHotel, 'hoteles'),
        this.mapPlace(lastActividad, 'actividades'),
        this.mapPlace(lastEvento, 'eventos')
      ].filter(Boolean);

      this.addMarkers(this.places);
    } catch (err) {
      console.error("Error cargando últimos registros", err);
    }
  }

  /** Buscar en backend */
  async searchPlace() {
    const query = this.searchQuery.trim();

    if (!query) {
      await this.loadLastPlaces();
      return;
    }

    try {
      const results: any = await searchAll(query);
      const data = results.data || results; // ✅ maneja ambos casos

      this.places = [
        ...data.hoteles.map((h: any) => this.mapPlace(h, 'hoteles')),
        ...data.restaurantes.map((r: any) => this.mapPlace(r, 'restaurantes')),
        ...data.eventos.map((e: any) => this.mapPlace(e, 'eventos')),
        ...data.actividades.map((a: any) => this.mapPlace(a, 'actividades'))
      ];

      this.addMarkers(this.places);
    } catch (err) {
      console.error("❌ Error en búsqueda", err);
      this.places = [];
    }
  }

  /** Normaliza un registro de la API */
  private mapPlace(p: any, tipo?: string) {
    const baseUrl = 'http://localhost:4000';
    return {
      id: p.id,
      tipo: tipo || p.tipo || 'general',
      name: p.nombre || p.titulo,
      address: p.direccion || p.ubicacion || p.address || "Sin dirección", // ✅ más robusto
      price: p.precio
        ? `$${p.precio}`
        : (p.precio_min && p.precio_max
            ? `$${p.precio_min} - $${p.precio_max}`
            : "Consultar"),
      coordinates: [p.longitud || -74.00, p.latitud || 5.02],
      image: p.imagen
        ? (p.imagen.startsWith('/uploads') ? `${baseUrl}${p.imagen}` : p.imagen)
        : "https://source.unsplash.com/300x200/?travel"
    };
  }

  addMarkers(places: any[]) {
    this.markers.forEach(marker => marker.remove());
    this.markers = [];

    for (const place of places) {
      const marker = new mapboxgl.Marker()
        .setLngLat(place.coordinates)
        .addTo(this.map);
      this.markers.push(marker);
    }
  }

  goToDetail(place: any) {
    this.router.navigate([`/detail/${place.tipo}/${place.id}`], {
      state: { place }
    });
  }

  /** Buscar en tiempo real mientras escribe */
  async onSearchChange() {
    const query = this.searchQuery.trim().toLowerCase();

    if (!query) {
      await this.loadLastPlaces();
      return;
    }

    await this.searchPlace();
  }
}