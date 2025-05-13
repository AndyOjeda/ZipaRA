import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BottomNavComponent } from "../../components/bottom-nav/bottom-nav.component";
import mapboxgl from 'mapbox-gl';
import { Location } from '@angular/common';


@Component({
  selector: 'app-detail',
  imports: [CommonModule, BottomNavComponent],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent implements AfterViewInit {

 detail: any;
  activeImageIndex = 0;

  constructor(private route: ActivatedRoute, private location: Location) {
    const id = this.route.snapshot.paramMap.get('id');
    this.detail = this.getMockDetail(id);
  }

  getMockDetail(id: string | null) {
    return {
      id,
      name: 'Sao Pulo Hotel',
      location: 'Zipaquirá, Colombia',
      lat: 5.0221,
      lng: -74.0048,
      price: 900,
      rating: 4.9,
      reviews: 1092,
      images: ['assets/img/hotel.jpg', 'assets/img/hotel.jpg'],
      amenities: [
        { name: 'Café', icon: 'pi pi-shopping-bag' },
        { name: 'Restaurant', icon: 'pi pi-shopping-bag' },
        { name: 'Garden', icon: 'pi pi-shopping-bag' },
        { name: 'Golf Course', icon: 'pi pi-shopping-bag' },
        { name: 'Free WiFi', icon: 'pi pi-wifi' }
      ],
      description:
        'Escape to Sao Pulo Hotel, a tranquil oasis inspired by the lush landscapes and culture of Zipaquirá, Colombia. Experience serenity in this colonial gem.',
      gallery: ['assets/img/hotel.jpg', 'assets/img/hotel.jpg']
    };
  }

  ngAfterViewInit(): void {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYW5kcmVzb2plZGEyMCIsImEiOiJjbWFpZGloOWIwbmF4MnFvY3RwMWFqdnBsIn0.Ap1NaGLQzmyX9UXAG_rm3A';

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [this.detail.lng, this.detail.lat],
      zoom: 14
    });

    new mapboxgl.Marker()
      .setLngLat([this.detail.lng, this.detail.lat])
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
}
