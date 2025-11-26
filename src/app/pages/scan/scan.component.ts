
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
      descripcion: "La Plaza Principal de Zipaquirá es un punto lleno de historia y encanto colonial. Rodeada de cafés, arquitectura patrimonial y un ambiente vibrante, es el lugar perfecto para iniciar tu recorrido por la ciudad y disfrutar de su esencia cultural.",
      modelo3d: "assets/modelo3d/plaza.glb",
      usdz: "assets/modelo3d/plaza.usdz"
    },
    {
      nombre: "Muro de Escalar",
      descripcion: "Muro de Escalar es un espacio diseñado para la aventura y la adrenalina. Ofrece rutas para todos los niveles, desde principiantes hasta escaladores experimentados, en un ambiente seguro y divertido. Perfecto para disfrutar una experiencia deportiva diferente en la ciudad.",
      modelo3d: "assets/modelo3d/torreEscalar.glb"
    },
    {
      nombre: "Comida Típica",
      descripcion: "Comida Típica (Carne y Papas) combina sabores tradicionales de la región con preparaciones caseras. Carnes jugosas acompañadas de papas criollas o sabaneras resaltan la esencia gastronómica andina. Un plato sencillo pero lleno de sabor local, ideal para disfrutar la auténtica cocina zipaquireña.",
      modelo3d: "assets/modelo3d/CarnePapa.glb"
    },
    {
      nombre: "Hotel Cacique Real",
      descripcion: "Hotel Cacique Real ofrece una estadía cómoda y acogedora en el corazón de Zipaquirá. Con habitaciones modernas, atención amable y una ubicación cercana a los principales atractivos turísticos, es una opción ideal para descansar y disfrutar de la ciudad.",
      modelo3d: "assets/modelo3d/hotelZipaquira.glb"
    },
        {
      nombre: "Catedral de Sal",
      descripcion: "Catedral de Sal es uno de los templos subterráneos más impresionantes del mundo. Construida dentro de una mina de sal, ofrece un recorrido único lleno de arte, iluminación y espiritualidad a 180 metros bajo tierra. Un destino imperdible en Zipaquirá.",
      modelo3d: "assets/modelo3d/religion.glb"
    },
    {
      nombre: "Estatua Zipaquirá",
      descripcion: "Estatua de Zipaquirá es un monumento emblemático que rinde homenaje a la identidad y la historia del municipio. Ubicada en un punto destacado de la ciudad, es un lugar ideal para tomar fotos y apreciar el legado cultural zipaquireño.",
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