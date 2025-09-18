import { Component } from '@angular/core';
import { BottomNavComponent } from "../../components/bottom-nav/bottom-nav.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { getProfile, logout } from '../../services/auth.service';

// Hoteles
import { getHoteles } from '../../services/api.service';
import { createHotel } from '../../services/api.service';
import { updateHotel } from '../../services/api.service';
import { deleteHotel } from '../../services/api.service';

// Usuarios
import { getUsuarios } from '../../services/api.service';
import { createUsuario } from '../../services/api.service';
import { updateUsuario } from '../../services/api.service';
import { deleteUsuario } from '../../services/api.service';

// Restaurantes
import { getRestaurantes } from '../../services/api.service';
import { createRestaurante } from '../../services/api.service';
import { updateRestaurante } from '../../services/api.service';
import { deleteRestaurante } from '../../services/api.service';

// Eventos
import { getEventos } from '../../services/api.service';
import { createEvento } from '../../services/api.service';
import { updateEvento } from '../../services/api.service';
import { deleteEvento } from '../../services/api.service';

//Categorias
import { getCategorias } from '../../services/api.service';
import { createCategorias } from '../../services/api.service';

@Component({
  selector: 'app-profile',
  imports: [BottomNavComponent, CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  usuario: any = null;
  preferencias = { notificaciones: false, newsletter: false };

  // Admin modal state
  showAdminDialog = false;
  selectedEntity: string = '';
  entities: any[] = [];

   categorias: any[] = [];

  editMode = false;
  deleteMode = false;
  addMode = false;

  selectedItemId: number | null = null;
  selectedFile: File | null = null;
  addData: any = { nombre: '', direccion: '', categoria_id: null, imagen: '' };
    editData: any = { nombre: '', direccion: '', categoria_id: null, imagen: '' };

  async ngOnInit() {
    const data = localStorage.getItem('usuario');
    if (data) this.usuario = JSON.parse(data);

    try {
      this.usuario = await getProfile();
      localStorage.setItem('usuario', JSON.stringify(this.usuario));
    } catch (err) {
      console.error('Error obteniendo perfil:', err);
    }
  }

  cerrarSesion() {
    logout();
    window.location.href = '/';
  }

  // Admin dialog
  openAdminDialog() { this.showAdminDialog = true; }
  closeAdminDialog() {
    this.showAdminDialog = false;
    this.entities = [];
    this.resetModes();
  }

  resetModes() {
    this.editMode = false;
    this.deleteMode = false;
    this.addMode = false;
  }

  async onEntitySelected() {
    this.resetModes();
    this.entities = [];

    // 🔹 Si selecciona hoteles, cargamos categorías dinámicamente
    if (this.selectedEntity === 'hoteles') {
      try {
        this.categorias = (await getCategorias()).data;
      } catch (err) {
        console.error("Error cargando categorías:", err);
      }
    }
  }

  onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.selectedFile = file;
  }
}

  async fetchEntities() {
    this.resetModes();
    try {
      switch (this.selectedEntity) {
        case 'hoteles': this.entities = (await getHoteles()).data; break;
        case 'restaurantes': this.entities = (await getRestaurantes()).data; break;
        case 'eventos': this.entities = (await getEventos()).data; break;
        case 'usuarios': this.entities = (await getUsuarios()).data; break;
        case 'categorias': this.entities = (await getCategorias()).data;break;
        default: this.entities = [];
      }
    } catch (err) {
      console.error('Error obteniendo entidades:', err);
    }
  }

  prepareAdd() { this.resetModes(); this.addMode = true; }
  prepareEdit() { this.resetModes(); this.editMode = true; }
  prepareDelete() { this.resetModes(); this.deleteMode = true; }

  async saveAdd() {
    try {
      switch (this.selectedEntity) {
        case 'hoteles': await createHotel(this.addData); break;
        case 'restaurantes': await createRestaurante(this.addData); break;
        case 'eventos': await createEvento(this.addData); break;
        case 'usuarios': await createUsuario(this.addData); break;
        case 'categorias': await createCategorias(this.addData);break;
      }
      this.fetchEntities();
      this.addMode = false;
      this.addData = { nombre: '' };
    } catch (err) {
      console.error('Error agregando entidad:', err);
    }
  }

  async saveEdit() {
    try {
      if (!this.selectedItemId) return;

      switch (this.selectedEntity) {
        case 'hoteles': await updateHotel(this.selectedItemId, this.editData); break;
        case 'restaurantes': await updateRestaurante(this.selectedItemId, this.editData); break;
        case 'eventos': await updateEvento(this.selectedItemId, this.editData); break;
        case 'usuarios': await updateUsuario(this.selectedItemId, this.editData); break;
      }
      this.fetchEntities();
      this.editMode = false;
    } catch (err) {
      console.error('Error editando entidad:', err);
    }
  }

  async deleteEntity() {
    try {
      if (!this.selectedItemId) return;

      switch (this.selectedEntity) {
        case 'hoteles': await deleteHotel(this.selectedItemId); break;
        case 'restaurantes': await deleteRestaurante(this.selectedItemId); break;
        case 'eventos': await deleteEvento(this.selectedItemId); break;
        case 'usuarios': await deleteUsuario(this.selectedItemId); break;
      }
      this.fetchEntities();
      this.deleteMode = false;
    } catch (err) {
      console.error('Error eliminando entidad:', err);
    }
  }
}