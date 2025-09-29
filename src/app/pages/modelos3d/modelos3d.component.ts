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

   hotel: any = null;
  cargando = true;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    // ⚡ Ajusta el puerto al mismo que expone tu backend
    fetch(`http://localhost:4000/api/hoteles/${id}`)
      .then(res => res.json())
      .then(data => {
        this.hotel = data;
        this.cargando = false;
      })
      .catch(err => {
        console.error("❌ Error cargando el modelo 3D:", err);
        this.cargando = false;
      });
  }

  verUbicacion() {
    if (this.hotel?.id) {
      this.router.navigate(['/map', this.hotel.id]);
    }
  }
}