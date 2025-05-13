import { Component } from '@angular/core';
import { BottomNavComponent } from "../../components/bottom-nav/bottom-nav.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [BottomNavComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private router: Router) {}

  goToDetail(name: string, image: string, price: string) {
    this.router.navigate(['/detail'], {
      queryParams: {
        name,
        image,
        price
      }
    });
  }
}
