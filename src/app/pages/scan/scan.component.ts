import { Component } from '@angular/core';
import { BottomNavComponent } from "../../components/bottom-nav/bottom-nav.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-scan',
  imports: [BottomNavComponent],
  templateUrl: './scan.component.html',
  styleUrl: './scan.component.css'
})
export class ScanComponent {

  constructor(private router:Router){

  }

  startScan() {
    console.log('Escaneo iniciado...');
    this.router.navigate(['/modelo3d']);
  }

  
}
