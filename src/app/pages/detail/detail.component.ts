import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BottomNavComponent } from "../../components/bottom-nav/bottom-nav.component";
import mapboxgl from 'mapbox-gl';
import { Location } from '@angular/common';
import { getHoteles } from '../../services/api.service';
import { getRestaurantes } from '../../services/api.service';
import { getEventos } from '../../services/api.service';
import { getActividades } from '../../services/api.service';
import { Router } from '@angular/router';

import { getFavoritos } from '../../services/api.service';
import { addFavorito } from '../../services/api.service';
import { removeFavorito } from '../../services/api.service';


@Component({
  selector: 'app-detail',
  imports: [CommonModule, BottomNavComponent],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent implements OnInit ,AfterViewInit {

 
  detail: any;
  category!: string;
  activeImageIndex = 0;
  isFavorito = false;
  favoritoId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const nav = this.router.getCurrentNavigation();
    this.category = this.route.snapshot.paramMap.get('category') || 'hoteles';


    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
    const usuario_id = usuario?.id;

    if (id) {
      try {
        let res: any;

        switch (this.category) {
          case 'hoteles':
            res = await getHoteles();
            break;
          case 'restaurantes':
            res = await getRestaurantes();
            break;
          case 'eventos':
            res = await getEventos();
            break;
          case 'actividades':
            res = await getActividades();
            break;
          default:
            res = { data: [] };
        }

        this.detail = res.data.find((item: any) => item.id == id);

        if (this.detail) {
          // Normalizar propiedades comunes
          this.detail.name = this.detail.nombre || this.detail.titulo || "Sin nombre";
          this.detail.location = this.detail.direccion || "Zipaquirá";
          this.detail.rating = this.detail.resenas || 4.5;
          this.detail.amenities = this.detail.comodidades
            ? (typeof this.detail.comodidades === 'string'
                ? JSON.parse(this.detail.comodidades)
                : this.detail.comodidades)
            : {};
          this.detail.description = this.detail.descripcion || "Sin descripción disponible.";
          this.detail.images = [`http://localhost:4000${this.detail.imagen}`];

          // Google Maps URL lista
          this.detail.googleMapsUrl =
            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(this.detail.location)}`;

          // ✅ Precios según categoría
          if (this.category === 'hoteles') {
            this.detail.price = this.detail.precio || 0;
          } else if (this.category === 'restaurantes') {
            this.detail.precio_min = this.detail.precio_min || 0;
            this.detail.precio_max = this.detail.precio_max || 0;
          } else if (this.category === 'eventos') {
            this.detail.price = this.detail.precio || 0; // Precio entrada
          } else if (this.category === 'actividades') {
            this.detail.price = this.detail.precio || 0; // Precio actividad
          }

          // ✅ Coordenadas (default si no existen)
          this.detail.lat = Number(this.detail.lat) || 5.0221;
          this.detail.lng = Number(this.detail.lng) || -74.0048;
        }
      } catch (err) {
        console.error('Error cargando detalle:', err);
      }
    }

    // Intentar geocodificar dirección si no hay coordenadas válidas
    if (this.detail?.location && (!this.detail.lat || !this.detail.lng)) {
      const coords = await this.geocodeAddress(this.detail.location);
      if (coords) {
        this.detail.lat = coords.lat;
        this.detail.lng = coords.lng;
      }
    }

    // Inicializar mapa
    if (this.detail?.lat && this.detail?.lng) {
      this.initMap(this.detail.lat, this.detail.lng);
    }

    // ✅ Verificar favoritos
    if (usuario_id && this.detail) {
      const { data: favoritos } = await getFavoritos(usuario_id);

      const fav = favoritos.find((f: any) =>
        (this.category === 'hoteles' && f.hotel_id == this.detail?.id) ||
        (this.category === 'restaurantes' && f.restaurante_id == this.detail?.id) ||
        (this.category === 'eventos' && f.evento_id == this.detail?.id) ||
        (this.category === 'actividades' && f.actividad_id == this.detail?.id)
      );

      if (fav) {
        this.isFavorito = true;
        this.favoritoId = fav.id;
      }
    }
  }

  private async geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=TU_TOKEN_MAPBOX&limit=1`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const [lng, lat] = data.features[0].center;
      return { lat, lng };
    }

    return null;
  }

  ngAfterViewInit(): void {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYW5kcmVzb2plZGEyMCIsImEiOiJjbWFpZGloOWIwbmF4MnFvY3RwMWFqdnBsIn0.Ap1NaGLQzmyX9UXAG_rm3A';

    // Observa cambios en detail hasta que exista
    const interval = setInterval(() => {
      const mapDiv = document.getElementById('map');
      if (this.detail && mapDiv) {
        const lng = Number(this.detail.lng) || -74.0048;
        const lat = Number(this.detail.lat) || 5.0221;

        this.initMap(lat, lng);
        clearInterval(interval); // detener el checkeo
      }
    }, 300);
  }


  private initMap(lat: number, lng: number) {
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: 14
    });

    new mapboxgl.Marker({ color: "#ff0000" })
      .setLngLat([lng, lat])
      .addTo(map);
  }

  nextImage() {
    this.activeImageIndex = (this.activeImageIndex + 1) % this.detail.images.length;
  }

  prevImage() {
    this.activeImageIndex =
      (this.activeImageIndex - 1 + this.detail.images.length) % this.detail.images.length;
  }

  goBack() {
    this.location.back();
  }

  async toggleFavorito() {
    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
    const usuario_id = usuario?.id;

    if (!usuario_id) {
      alert("Debes iniciar sesión");
      return;
    }

    if (this.isFavorito && this.favoritoId) {
      // ❌ Quitar de favoritos
      await removeFavorito(this.favoritoId);
      this.isFavorito = false;
      this.favoritoId = null;
    } else {
      // ✅ Agregar a favoritos
      const payload: any = { usuario_id };
      if (this.category === "hoteles") payload.hotel_id = this.detail.id;
      if (this.category === "restaurantes") payload.restaurante_id = this.detail.id;
      if (this.category === "eventos") payload.evento_id = this.detail.id;
      if (this.category === "actividades") payload.actividad_id = this.detail.id;

      const res = await addFavorito(payload);
      this.isFavorito = true;
      this.favoritoId = res.data.id;
    }
  }
}