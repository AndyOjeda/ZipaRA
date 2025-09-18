import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { register } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

 nombre: string = '';
  email: string = '';
  password: string = '';
  rol: string = '';

  loading: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private router: Router) {}

  async onRegister() {
    this.successMessage = null;
    this.errorMessage = null;
    this.loading = true;

    try {
      const usuario = {
        nombre: this.nombre,
        email: this.email,
        password: this.password,
        rol: this.rol
      };
      const resultado = await register(usuario);
      console.log('Registro exitoso:', resultado);

      this.loading = false;
      this.successMessage = 'Registro exitoso 🎉';

      setTimeout(() => {
        this.router.navigate(['/']);
      }, 2000);
    } catch (error: any) {
      console.error('Error en registro:', error);
      this.loading = false;
      this.errorMessage = error.message || 'Error en registro';
    }
  }
}