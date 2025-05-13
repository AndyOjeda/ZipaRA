import { Component } from '@angular/core';
import { BottomNavComponent } from "../../components/bottom-nav/bottom-nav.component";

@Component({
  selector: 'app-scan',
  imports: [BottomNavComponent],
  templateUrl: './scan.component.html',
  styleUrl: './scan.component.css'
})
export class ScanComponent {

  startScan() {
    console.log('Escaneo iniciado...');

    // Aquí eventualmente puedes llamar a tu servicio de cámara o escaneo.
    // Por ejemplo: this.cameraService.openCamera()
  }
}
