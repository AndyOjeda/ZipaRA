import { Component, ElementRef, ViewChild } from '@angular/core';
import { BottomNavComponent } from "../../components/bottom-nav/bottom-nav.component";
import { Router } from '@angular/router';
import { getHotelByTrigger } from '../../services/api.service';
import { Html5Qrcode } from 'html5-qrcode';

@Component({
  selector: 'app-scan',
  imports: [BottomNavComponent],
  templateUrl: './scan.component.html',
  styleUrl: './scan.component.css'
})
export class ScanComponent {

   @ViewChild('video', { static: true }) video!: ElementRef<HTMLDivElement>;
  scanning = false;
  html5QrCode: Html5Qrcode | null = null;

  constructor(private router: Router) {}

  async startScan() {
    if (this.scanning) return; // ya está escaneando
    this.scanning = true;

    this.html5QrCode = new Html5Qrcode("reader");

    try {
      await this.html5QrCode.start(
        { facingMode: "environment" }, // cámara trasera
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        async (decodedText) => {
          console.log("📌 Trigger detectado:", decodedText);

          // 👉 buscar en backend
          try {
            const res = await getHotelByTrigger(decodedText);
            console.log("🏨 Respuesta backend:", res.data);
          } catch (err) {
            console.error("❌ Error al consultar backend:", err);
          }

          // opcional: parar después de primer escaneo
          this.stopScan();
        },
        (errorMessage) => {
          // se ignoran errores de lectura
        }
      );
    } catch (err) {
      console.error("⚠️ No se pudo iniciar cámara:", err);
      this.scanning = false;
    }
  }

  stopScan() {
    if (this.html5QrCode) {
      this.html5QrCode.stop().then(() => {
        console.log("⏹️ Escaneo detenido");
        this.scanning = false;
      });
    }
  }
}