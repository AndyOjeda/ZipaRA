import { Component, OnInit } from '@angular/core';
import { BottomNavComponent } from "../../components/bottom-nav/bottom-nav.component";
import * as mapboxgl from 'mapbox-gl';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-map',
  imports: [BottomNavComponent, CommonModule, FormsModule, HttpClientModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit {

  map!: mapboxgl.Map;
  searchQuery: string = '';
  places: any[] = [];
  markers: mapboxgl.Marker[] = [];

  ngOnInit(): void {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-74.00, 5.02], // Zipaquirá
      zoom: 13.5,
      accessToken: 'pk.eyJ1IjoiYW5kcmVzb2plZGEyMCIsImEiOiJjbWFpZGloOWIwbmF4MnFvY3RwMWFqdnBsIn0.Ap1NaGLQzmyX9UXAG_rm3A'
    });
  }


  flyTo(coords: [number, number]) {
    this.map.flyTo({ center: coords, zoom: 15 });
  }

  searchPlace() {
    const query = this.searchQuery.trim();
    if (!query) return;

    const accessToken = 'pk.eyJ1IjoiYW5kcmVzb2plZGEyMCIsImEiOiJjbWFpZGloOWIwbmF4MnFvY3RwMWFqdnBsIn0.Ap1NaGLQzmyX9UXAG_rm3A';
    const bbox = '-74.06,5.00,-74.00,5.05'; // Área de Zipaquirá

    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?bbox=${bbox}&access_token=${accessToken}`)
      .then(res => res.json())
      .then(data => {
        this.places = data.features.map((f: any) => ({
          name: f.text,
          address: f.place_name,
          coordinates: f.center
        }));

        this.addMarkers(this.places);
      })
      .catch(err => {
        console.error('Error en la búsqueda:', err);
      });
  }

  addMarkers(places: any[]) {
    // Elimina los anteriores
    this.markers.forEach(marker => marker.remove());
    this.markers = [];

    // Agrega nuevos
    for (const place of places) {
      const marker = new mapboxgl.Marker()
        .setLngLat(place.coordinates)
        .addTo(this.map);
      this.markers.push(marker);
    }
  }
}
