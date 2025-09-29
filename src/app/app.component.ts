import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GoogleMapsModule } from '@angular/google-maps';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { FloatingButtonComponent } from "./components/floating-button/floating-button.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GoogleMapsModule, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TurismoZipaquira';
 currentRoute: string = '';

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
      }
    });
  }

  showFloatingButton(): boolean {
    return !(this.currentRoute.includes('/login') || this.currentRoute.includes('/register') || this.currentRoute.includes('/profile') || this.currentRoute.includes('/scan')  || this.currentRoute.includes('/modelo3d') );
  }
}
