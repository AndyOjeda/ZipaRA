import { Component, ElementRef, ViewChild } from '@angular/core';
import { BottomNavComponent } from "../../components/bottom-nav/bottom-nav.component";
import { Router } from '@angular/router';
import { getHotelByTrigger } from '../../services/api.service';

@Component({
  selector: 'app-scan',
  imports: [BottomNavComponent],
  templateUrl: './scan.component.html',
  styleUrl: './scan.component.css'
})
export class ScanComponent {

   @ViewChild('video', { static: true }) video!: ElementRef<HTMLVideoElement>;

  constructor(private router: Router) {}

  ngOnInit() {
    // Pedir acceso a la cámara
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        this.video.nativeElement.srcObject = stream;
      })
      .catch(err => console.error("⚠️ No se pudo acceder a la cámara:", err));
  }

  startScan() {
    console.log('📷 Escaneo iniciado...');

    // ⚡ Aún fijo, luego lo reemplazas con la detección real
    const triggerDetectado = "vuforia/Cartilla.xml";

    getHotelByTrigger(triggerDetectado)
      .then(res => {
        const hotel = res.data;
        console.log("🏨 Hotel detectado:", hotel);
        if (hotel && hotel.id) {
          this.router.navigate(['/modelo3d', hotel.id]);
        } else {
          console.warn("❌ No se encontró un hotel para este trigger");
        }
      })
      .catch(err => console.error("⚠️ Error al buscar hotel:", err));
  }
}