import { Component, ElementRef, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BottomNavComponent } from "../../components/bottom-nav/bottom-nav.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-scan',
  imports: [BottomNavComponent, CommonModule, FormsModule],
  templateUrl: './scan.component.html',
  styleUrl: './scan.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ScanComponent {

  scanning = false;
  currentCamera: 'environment' | 'user' = 'environment';

  @ViewChild('cameraView', { static: true }) cameraView!: ElementRef;
  stream: MediaStream | null = null;

  // Modal
  showModal = false;
  currentModel: any = null;

  currentIndex = 0;

  triggerMap: Record<string, any> = {
    "HotelZipaquira": {
      nombre: "Hotel Zipaquirá",
      descripcion: "Hospedaje acogedor en el centro histórico.",
      modelo3d: "assets/modelo3d/hotelZipaquira.glb"
    },
    "ReligionZipaquira": {
      nombre: "Catedral de Sal",
      descripcion: "Lugar icónico de Colombia.",
      modelo3d: "assets/modelo3d/religion.glb"
    },
    "EstatuaZipaquira": {
      nombre: "Estatua histórica",
      descripcion: "Monumento representativo.",
      modelo3d: "assets/modelo3d/estatua.glb"
    },
    "PiedrasZipaquira": {
      nombre: "Formaciones rocosas",
      descripcion: "Piedras ancestrales.",
      modelo3d: "assets/modelo3d/piedras.glb"
    },
    "PlazaPrincipal": {
      nombre: "Plaza principal",
      descripcion: "Centro cultural.",
      modelo3d: "assets/modelo3d/plaza.glb"
    }
  };

  // ▶️ Inicia cámara y modelo
  async startCamera() {
    try {
      this.scanning = true;
      this.showModal = false;

      if (this.stream) this.stopCamera();

      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: this.currentCamera }
      });

      const videoElement = this.cameraView.nativeElement as HTMLVideoElement;
      videoElement.srcObject = this.stream;
      videoElement.play();

      // Espera 5s y muestra solo un modelo
      this.scheduleNextModel();

    } catch (err) {
      console.error("Error cámara:", err);
    }
  }

  scheduleNextModel() {
    const keys = Object.keys(this.triggerMap);
    const next = keys[this.currentIndex];

    setTimeout(() => {
      this.showModel(next);
      this.currentIndex = (this.currentIndex + 1) % keys.length;
    }, 5000);
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
    }
  }

  // Muestra el modelo
  showModel(triggerName: string) {
    this.currentModel = this.triggerMap[triggerName];
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.scanning = false;   // ← vuelve el botón a "Iniciar escaneo"
    this.stopCamera();       // ← apaga la cámara
  }

  // Cambiar cámara
  swapCamera() {
    this.currentCamera = this.currentCamera === 'environment' ? 'user' : 'environment';
    this.startCamera();
  }
}