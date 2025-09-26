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

//Actividad
import { createActividad } from '../../services/api.service';

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

  availableComodidades: string[] = [
  "wifi",
  "parking",
  "piscina",
  "gimnasio",
  "spa",
  "restaurante",
  "bar",
  "servicioHab"
];

  selectedItemId: number | null = null;
  selectedFile: File | null = null;
  addData: any = { 
    nombre: '', 
    direccion: '', 
    categoria_id: null, 
    descripcion: '',
    precio: null,
    comodidades: '',
    imagen: '' 
  };

  editData: any = { 
    nombre: '', 
    direccion: '', 
    categoria_id: null, 
    descripcion: '',
    precio: null,
    comodidades: '',
    imagen: '' 
  };

  loadingMessage: string | null = null;
  successMessage: string | null = null;
  errorMessage: string | null = null;


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
    this.selectedItemId = null;

    // 🔹 Si selecciona hoteles, cargamos categorías dinámicamente
    if (this.selectedEntity === 'hoteles' || this.selectedEntity === 'restaurantes' || this.selectedEntity === 'eventos' || this.selectedEntity === 'actividades') {
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

  prepareAdd() { 
    this.resetModes(); 
    this.addMode = true;  
    this.addData = {
      nombre: '',
      direccion: '',
      categoria_id: null,
      descripcion: '',
      precio: null,
      comodidades: {}, // 👈 JSON para hoteles
      imagen: ''
    };
  }

  prepareEdit() { 
    this.resetModes(); 
    this.editMode = true; 
    this.fetchEntities(); 
  }

  prepareDelete() { 
  this.resetModes(); 
  this.deleteMode = true; 
  this.fetchEntities(); 
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

  async saveAdd() {
    this.loadingMessage = `Guardando ${this.selectedEntity}...`;
    this.successMessage = null;
    this.errorMessage = null;

    try {
      let response;

      switch (this.selectedEntity) {
        case "categorias":
          response = (await createCategorias(this.addData)).data;
          break;

        case "hoteles": {
          const formData = this.toFormData(this.addData);
          if (this.selectedFile) formData.append("imagen", this.selectedFile);
          response = await createHotel(formData);
          break;
        }

        case "restaurantes": {
          const formData = this.toFormData(this.addData);
          if (this.selectedFile) formData.append("imagen", this.selectedFile);
          response = await createRestaurante(formData);
          break;
        }

        case "eventos": {
          const formData = this.toFormData(this.addData);
          if (this.selectedFile) formData.append("imagen", this.selectedFile);
          response = await createEvento(formData);
          break;
        }

        case "actividades": {
          const formData = this.toFormData(this.addData);
          if (this.selectedFile) formData.append("imagen", this.selectedFile);
          response = await createActividad(formData);
          break;
        }

        default:
          throw new Error("Entidad no soportada");
      }

      this.successMessage = `${this.selectedEntity} creado con éxito 🎉`;
      this.addMode = false;
      this.selectedFile = null;
      this.fetchEntities(); // 👈 refrescar tabla
    } catch (err: any) {
      this.errorMessage = `Error al guardar ${this.selectedEntity}`;
      console.error(err);
    } finally {
      this.loadingMessage = null;
    }
  }


  async saveEdit() {
    try {
      if (!this.selectedItemId) return;

      switch (this.selectedEntity) {
        case 'hoteles': {
          const formData = this.toFormData(this.editData);
          if (this.selectedFile) {
            formData.append('imagen', this.selectedFile);
          }
          await updateHotel(this.selectedItemId, formData);
          break;
        }

        case 'restaurantes':
          await updateRestaurante(this.selectedItemId, this.editData);
          break;

        case 'eventos':
          await updateEvento(this.selectedItemId, this.editData);
          break;

        case 'usuarios':
          await updateUsuario(this.selectedItemId, this.editData);
          break;
      }

      this.successMessage = `${this.selectedEntity} actualizado ✅`;
      this.fetchEntities();
      this.editMode = false;
      this.selectedFile = null;
    } catch (err) {
      this.errorMessage = `Error editando ${this.selectedEntity}`;
      console.error(err);
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

      this.successMessage = `${this.selectedEntity} eliminado 🗑️`;
      this.fetchEntities();
      this.deleteMode = false;
    } catch (err) {
      this.errorMessage = `Error eliminando ${this.selectedEntity}`;
      console.error(err);
    }
  }


  toFormData(data: any) {
    const formData = new FormData();
    for (const key in data) {
      if (data[key] !== null && data[key] !== undefined) {
        
        // 👇 Si es un objeto (comodidades), lo pasamos a JSON string
        if (key === 'comodidades' && typeof data[key] === 'object') {
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      }
    }
    return formData;
  }


  toggleComodidad(c: string) {
  this.addData.comodidades[c] = !this.addData.comodidades[c];
}

}