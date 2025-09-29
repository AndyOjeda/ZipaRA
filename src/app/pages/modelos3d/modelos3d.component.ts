import { Component } from '@angular/core';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BottomNavComponent } from "../../components/bottom-nav/bottom-nav.component";
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modelos3d',
  imports: [CommonModule],
  templateUrl: './modelos3d.component.html',
  styleUrl: './modelos3d.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Modelos3dComponent {

 hotel: any;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    fetch(`http://localhost:3000/hoteles/${id}`)
      .then(res => res.json())
      .then(data => {
        this.hotel = data;
      });
  }

  verUbicacion() {
    this.router.navigate(['/map', this.hotel.id]);
  }
}
