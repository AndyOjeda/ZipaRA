import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BottomNavComponent } from "../../components/bottom-nav/bottom-nav.component";
import { getFavoritos } from '../../services/api.service';

@Component({
  selector: 'app-favorites',
  imports: [CommonModule, BottomNavComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent {

 favoritos: any[] = [];

  constructor(private router: Router) {}

  async ngOnInit() {
    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
    const usuario_id = usuario?.id;

    if (usuario_id) {
      const { data } = await getFavoritos(usuario_id);
      this.favoritos = data;
    }
  }

  verDetalle(fav: any) {
  let category = '';
  let itemId = null;

  if (fav.hotel_id) {
    category = 'hoteles';
    itemId = fav.hotel_id;
  } else if (fav.restaurante_id) {
    category = 'restaurantes';
    itemId = fav.restaurante_id;
  } else if (fav.actividad_id) {
    category = 'actividades';
    itemId = fav.actividad_id;
  } else if (fav.evento_id) {
    category = 'eventos';
    itemId = fav.evento_id;
  }

  if (itemId && category) {
    // Ahora navegamos al detalle con el id real del item
    this.router.navigate([`/detail/${category}/${itemId}`]);
    }
  }


}