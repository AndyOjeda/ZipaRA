import { Component, OnInit } from '@angular/core';
import { BottomNavComponent } from "../../components/bottom-nav/bottom-nav.component";
import * as mapboxgl from 'mapbox-gl';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

predefinedPlaces = [
  {
    name: 'Catedral de Sal',
    address: 'Zipaquirá, Cundinamarca',
    coordinates: [-74.0104, 5.0189],
    image: 'assets/img/catedral.jpg'
  },
  {
    name: 'Hotel Cacique Real',
    address: 'Carrera 10 #4-36, Zipaquirá',
    coordinates: [-74.0067, 5.0235],
    image: 'https://source.unsplash.com/300x200/?hotel'
  },
  {
    name: 'Restaurante Funzipa',
    address: 'Calle 5 #9-31, Zipaquirá',
    coordinates: [-74.0078, 5.0185],
    image: 'https://source.unsplash.com/300x200/?restaurant'
  }
];


  ngOnInit(): void {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-74.00, 5.02],
      zoom: 13.5,
      accessToken: 'pk.eyJ1IjoiYW5kcmVzb2plZGEyMCIsImEiOiJjbWFpZGloOWIwbmF4MnFvY3RwMWFqdnBsIn0.Ap1NaGLQzmyX9UXAG_rm3A' // ✅ PASADO AQUÍ
    });
  }

  flyTo(coords: [number, number]) {
    this.map.flyTo({ center: coords, zoom: 15 });
  }

  searchPlace() {
  const query = this.searchQuery.trim().toLowerCase();

  if (!query) {
    this.places = [];
    this.clearMarkers();
    return;
  }

  const filtered = this.predefinedPlaces.filter(place =>
    place.name.toLowerCase().includes(query) ||
    place.address.toLowerCase().includes(query)
  );

  if (filtered.length > 0) {
    this.places = filtered;
    this.addMarkers(filtered);
  } else {
    const accessToken = 'pk.eyJ1IjoiYW5kcmVzb2plZGEyMCIsImEiOiJjbWFpZGloOWIwbmF4MnFvY3RwMWFqdnBsIn0.Ap1NaGLQzmyX9UXAG_rm3A';
    const bbox = '-74.06,5.00,-73.97,5.08';

    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?bbox=${bbox}&access_token=${accessToken}`)
      .then(res => res.json())
      .then(data => {
        this.places = data.features.map((f: any) => ({
          name: f.text,
          address: f.place_name,
          coordinates: f.center,
          image: `https://source.unsplash.com/300x200/?${f.text}`
        }));
        this.addMarkers(this.places);
      })
      .catch(err => {
        console.error('Error en la búsqueda:', err);
      });
  }
}


  clearMarkers() {
  this.markers.forEach(marker => marker.remove());
  this.markers = [];
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
    this.router.navigate(['/detail'], { state: { place } });
  }

  toggleFavorite(place: any): void {
  place.isFavorite = !place.isFavorite;
  // Aquí puedes guardar en localStorage o enviar a backend si deseas
}

}
