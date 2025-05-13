import { Component } from '@angular/core';
import { Router, NavigationEnd  } from '@angular/router';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-bottom-nav',
  imports: [RouterModule],
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.css'
})
export class BottomNavComponent {
 activeLink: string = 'home';

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;
        if (url.includes('/map')) this.activeLink = 'map';
        else if (url.includes('/scan')) this.activeLink = 'camera';
        else if (url.includes('/favorites')) this.activeLink = 'favorites';
        else if (url.includes('/profile')) this.activeLink = 'profile';
        else this.activeLink = 'home';
      }
    });
  }

  setActive(link: string) {
    this.activeLink = link;
  }
}
