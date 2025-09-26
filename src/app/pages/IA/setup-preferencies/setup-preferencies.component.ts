import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { createPreferencia } from '../../../services/api.service';

@Component({
  selector: 'app-setup-preferencies',
  imports: [CommonModule, FormsModule],
  templateUrl: './setup-preferencies.component.html',
  styleUrl: './setup-preferencies.component.css'
})
export class SetupPreferenciesComponent implements OnInit {

    user: any = null;
  step: number = 0;

  // Opciones predefinidas
  mainOptions: string[] = ['Hoteles', 'Restaurantes', 'Eventos', 'Actividades'];
  activityOptions: string[] = ['Actividades tranquilas', 'Deporte y aventura'];
  budgetOptions: string[] = ['Económico', 'Medio', 'Premium'];
  travelStyleOptions: string[] = ['Familiar', 'Pareja', 'Amigos', 'Solo'];
  scheduleOptions: string[] = ['Día', 'Noche'];

  preferences: any = {};

  constructor(private router: Router) {}

  ngOnInit() {
    try {
      const storedUser = localStorage.getItem('usuario'); // ojo: en login guardas 'usuario'
      this.user = storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      console.error("Error parsing user from localStorage", e);
      this.user = null;
    }
  }

  selectOption(field: string, value: string) {
    this.preferences[field] = value;

    if (this.step === 0) {
      this.step = 1;
    } else if (this.step === 1) {
      this.step = 2;
    } else if (this.step === 2) {
      this.step = 3;
    } else if (this.step === 3) {
      this.step = 4;
    } else if (this.step === 4) {
      this.step = 5; // pantalla final
    }
  }

  async finishSetup() {
    try {
      await createPreferencia({
        interes_principal: this.preferences.mainInterest,
        tipo_actividad: this.preferences.activityType,
        user_id: this.user.id
      });

      console.log("Preferencias guardadas:", this.preferences);
      this.router.navigate(['/home']);
    } catch (err) {
      console.error("Error al guardar preferencias", err);
    }
  }
}