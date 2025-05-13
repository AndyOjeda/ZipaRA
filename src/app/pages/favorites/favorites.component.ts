import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BottomNavComponent } from "../../components/bottom-nav/bottom-nav.component";

@Component({
  selector: 'app-favorites',
  imports: [CommonModule, BottomNavComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent {

 favorites: { nombre: string; tipo: string; link: string }[] = [];

  constructor(private router: Router) {}

  goExplore() {
    this.router.navigate(['/map']); // o donde quieras redirigir
  }

  goTo(link: string) {
    this.router.navigate([link]);
  }
}
