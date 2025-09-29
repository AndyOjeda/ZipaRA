import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { login } from '../../../services/auth.service';



@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  
  
  email: string = '';
  password: string = '';
  successMessage: string | null = null;
  errorMessage: string | null = null;
  loadingMessage: string | null = null; // NUEVO

  constructor(private router: Router) {}

  async onLogin(): Promise<void> {
    this.successMessage = null;
    this.errorMessage = null;
    this.loadingMessage = 'Cargando...'; // mostrar cargando

    try {
      const res = await login(this.email, this.password);
      console.log('Login exitoso:', res);

      this.loadingMessage = null; // quitar cargando
      this.successMessage = 'Inicio de sesión exitoso';
      
      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 1500);
    } catch (err: any) {
      this.loadingMessage = null; // quitar cargando
      this.errorMessage = err.message || 'Correo o contraseña incorrecta';
    }
  }

  goToRegister(): void {
  this.router.navigate(['/register']);
  }

}