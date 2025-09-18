import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { createHotel } from '../../services/api.service';
import { createRestaurante } from '../../services/api.service';
import { createEvento } from '../../services/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-floating-button',
  imports: [CommonModule, FormsModule],
  templateUrl: './floating-button.component.html',
  styleUrl: './floating-button.component.css'
})
export class FloatingButtonComponent {

 isOpen = false; // controla el menú flotante
  showDialog = false; // controla el modal
  selectedType: string | null = null;
  entityData: any = { nombre: '', descripcion: '' };

  constructor(private router: Router) {}

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  openDialog(type: string) {
    this.selectedType = type;
    this.entityData = { nombre: '', descripcion: '' }; // reset form
    this.showDialog = true;
  }

  closeDialog() {
    this.showDialog = false;
    this.selectedType = null;
  }

  async createEntity() {
    try {
      if (!this.selectedType) return;

      let response;
      switch (this.selectedType) {
        case 'hotel':
          response = await createHotel(this.entityData);
          break;
        case 'restaurante':
          response = await createRestaurante(this.entityData);
          break;
        case 'evento':
          response = await createEvento(this.entityData);
          break;
        case 'actividad':
          // si no tienes aún el endpoint, lo dejas preparado
          console.log('Crear actividad', this.entityData);
          break;
      }

      console.log('Entidad creada:', response?.data || this.entityData);
      this.closeDialog();

    } catch (err) {
      console.error('Error creando entidad:', err);
    }
  }
}