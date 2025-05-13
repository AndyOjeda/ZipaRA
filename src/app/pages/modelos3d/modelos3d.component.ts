import { Component } from '@angular/core';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-modelos3d',
  imports: [],
  templateUrl: './modelos3d.component.html',
  styleUrl: './modelos3d.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Modelos3dComponent {

  verUbicacion() {
    window.open('https://www.google.com/maps/place/Estatua+de+Tundama,+Duitama,+Boyacá', '_blank');
  }
}
