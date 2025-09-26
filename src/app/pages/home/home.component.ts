import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BottomNavComponent } from "../../components/bottom-nav/bottom-nav.component";
import { getHoteles, getRestaurantes, getEventos, getActividades } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import localeEsCO from '@angular/common/locales/es-CO';

@Component({
  selector: 'app-home',
  standalone: true, // Angular 15+ standalone components
  imports: [BottomNavComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

 usuario: any = null;
  hoteles: any[] = [];
  restaurantes: any[] = [];
  eventos: any[] = [];
  actividades: any[] = [];
  selectedCategory: string = 'hoteles';

  categorias = [
    { id: 'hoteles', icon: 'pi pi-home', label: 'Hoteles' },
    { id: 'restaurantes', icon: 'pi pi-shop', label: 'Restaurantes' },
    { id: 'eventos', icon: 'pi pi-calendar', label: 'Eventos' },
    { id: 'actividades', icon: 'pi pi-shopping-bag', label: 'Actividades' }
  ];

  constructor(private router: Router) {}

  async ngOnInit() {
    try {
      // Recuperar usuario del localStorage
      const usuarioStorage = localStorage.getItem('usuario');
      if (usuarioStorage) {
        this.usuario = JSON.parse(usuarioStorage);
      }

      if (!this.usuario) {
        console.error("No hay usuario logueado");
        this.router.navigate(['/login']);
        return;
      }

      // Consultar preferencias
      const res = await fetch(`http://localhost:4000/api/preferencias/usuario/${this.usuario.id}`);
      const preferencias = await res.json();

      if (!preferencias || preferencias.length === 0) {
        this.router.navigate(['/preferencias']);
        return;
      }

      // Seleccionar la preferida
      this.selectedCategory = preferencias[0].interes_principal.toLowerCase();

      // Reordenar categorías para que la preferida quede primero
      this.categorias.sort((a, b) =>
        a.id === this.selectedCategory ? -1 : (b.id === this.selectedCategory ? 1 : 0)
      );

      // Cargar datos
      const hotelesRes = await getHoteles();
      this.hoteles = hotelesRes.data;

      const restaurantesRes = await getRestaurantes();
      this.restaurantes = restaurantesRes.data;

      const eventosRes = await getEventos();
      this.eventos = eventosRes.data;

      const actividadesRes = await getActividades();
      this.actividades = actividadesRes.data;

    } catch (err) {
      console.error('Error cargando datos:', err);
    }
  }

  goToDetail(id: number) {
    this.router.navigate([`/detail/${this.selectedCategory}/${id}`], {
      state: { category: this.selectedCategory }
    });
  }

}