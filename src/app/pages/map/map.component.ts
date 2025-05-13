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

  constructor(private http: HttpClient) {}

ngOnInit(): void {
  this.map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [-74.03, 5.02], // Zipaquirá
    zoom: 13,
    accessToken: 'pk.eyJ1IjoiYW5kcmVzb2plZGEyMCIsImEiOiJjbWFpZGloOWIwbmF4MnFvY3RwMWFqdnBsIn0.Ap1NaGLQzmyX9UXAG_rm3A'
  });
}


  searchPlaces() {
    const token = 'pk.eyJ1IjoiYW5kcmVzb2plZGEyMCIsImEiOiJjbWFpZGloOWIwbmF4MnFvY3RwMWFqdnBsIn0.Ap1NaGLQzmyX9UXAG_rm3A';
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${this.searchQuery}.json?proximity=-74.03,5.02&limit=10&access_token=${token}`;

    this.http.get<any>(url).subscribe((res) => {
      this.places = res.features.map((f: any) => ({
        name: f.text,
        address: f.place_name,
        coordinates: f.geometry.coordinates
      }));

      this.places.forEach(place => {
        new mapboxgl.Marker()
          .setLngLat(place.coordinates)
          .addTo(this.map);
      });
    });
  }
}
