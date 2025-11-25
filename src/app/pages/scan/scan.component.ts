
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

  showModal = false;
  currentModel: any = null;

  currentIndex = 0;

  models = [
    {
      nombre: "Plaza Zipaquirá",
      descripcion: "Hospedaje acogedor en el centro histórico.",
      modelo3d: "assets/modelo3d/plaza.glb"
    },
    {
      nombre: "Piedras de Sevilla",
      descripcion: "Lugar icónico de Colombia.",
      modelo3d: "assets/modelo3d/piedras.glb"
    },
    {
      nombre: "Muro de Escalar",
      descripcion: "Monumento representativo.",
      modelo3d: "assets/modelo3d/torreEscalar.glb"
    },
    {
      nombre: "Comida Típica",
      descripcion: "Piedras ancestrales.",
      modelo3d: "assets/modelo3d/carnePapa.glb"
    },
    {
      nombre: "Hotel Cacique Real",
      descripcion: "Centro cultural.",
      modelo3d: "assets/modelo3d/plaza.glb"
    },
        {
      nombre: "Catedral de Sal",
      descripcion: "Centro cultural.",
      modelo3d: "assets/modelo3d/religion.glb"
    },
    {
      nombre: "Estatua",
      descripcion: "Centro cultural.",
      modelo3d: "assets/modelo3d/estatua.glb"
    }
  ];

  async startCamera() {
    try {
      this.scanning = true;
      this.showModal = false;

      if (this.stream) this.stopCamera();

      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: this.currentCamera }
      });

      const video = this.cameraView.nativeElement as HTMLVideoElement;
      video.srcObject = this.stream;
      video.play();

      this.scheduleNextModel();

    } catch (err) {
      console.error("Error cámara:", err);
    }
  }

  scheduleNextModel() {
    setTimeout(() => {
      this.currentModel = this.models[this.currentIndex];
      this.showModal = true;

      this.currentIndex = (this.currentIndex + 1) % this.models.length;

    }, 5000);
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
    }
  }

  closeModal() {
    this.showModal = false;
    this.scanning = false;
    this.stopCamera();
  }

  swapCamera() {
    this.currentCamera = this.currentCamera === 'environment' ? 'user' : 'environment';
    this.startCamera();
  }
}