import { Component, OnInit } from '@angular/core';
import { BottomNavComponent } from "../../components/bottom-nav/bottom-nav.component";
import { Router } from '@angular/router';
import { getPreferenciaByUser } from '../../services/api.service';
import { getHoteles } from '../../services/api.service';
import { getRestaurantes } from '../../services/api.service';
import { getEventos } from '../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [BottomNavComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  usuario: any = null;
  hoteles: any[] = [];
  restaurantes: any[] = [];
  eventos: any[] = [];

  constructor(private router: Router) {}

  async ngOnInit() {
    this.usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

    if (!this.usuario?.id) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      const prefs = await getPreferenciaByUser(this.usuario.id);

      if (!prefs.data || prefs.data.length === 0) {
        this.router.navigate(['/preferencias']);
        return;
      }

      // Cargar datos dinámicos
      const resHoteles = await getHoteles();
      this.hoteles = resHoteles.data;

      const resRestaurantes = await getRestaurantes();
      this.restaurantes = resRestaurantes.data;

      const resEventos = await getEventos();
      this.eventos = resEventos.data;

    } catch (err) {
      console.error('Error cargando datos:', err);
    }
  }

  goToDetail(nombre: string, imagen: string, precio: string) {
    this.router.navigate(['/detalle'], { 
      queryParams: { nombre, imagen, precio }
    });
  }
}