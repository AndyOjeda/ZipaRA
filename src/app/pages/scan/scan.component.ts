import { Component, ElementRef, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BottomNavComponent } from "../../components/bottom-nav/bottom-nav.component";
import { Router } from '@angular/router';
import { getHotelByTrigger } from '../../services/api.service';
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
  hotel: any = null;
  cargando = false;
  currentCamera: 'user' | 'environment' = 'environment';

  @ViewChild('mindarContainer', { static: true }) mindarContainer!: ElementRef;

  mindarThree: any;

  // 📌 Diccionario de triggers → modelos
  triggerMap: Record<string, any> = {
    "HotelZipaquira": {
      nombre: "Hotel Zipaquirá",
      descripcion: "Hospedaje acogedor en el centro histórico.",
      modelo3d: "/assets/modelo3d/caciqueReal.glb",
      id: "hotel-1"
    },
    "ReligionZipaquira": {
      nombre: "Catedral de Sal",
      descripcion: "Lugar de peregrinación y maravilla arquitectónica.",
      modelo3d: "/assets/modelo3d/religion.glb",
      id: "religion-1"
    },
    "GastronomiaZipaquira": {
      nombre: "Gastronomía local",
      descripcion: "Sabores tradicionales de la región.",
      modelo3d: "/assets/modelo3d/gastronomia.glb",
      id: "gastronomia-1"
    },
    "EstatuaZipaquira": {
      nombre: "Estatua histórica",
      descripcion: "Monumento representativo de la ciudad.",
      modelo3d: "/assets/modelo3d/estatua.glb",
      id: "estatua-1"
    },
    "PiedrasZipaquira": {
      nombre: "Formaciones rocosas",
      descripcion: "Piedras ancestrales de gran valor cultural.",
      modelo3d: "/assets/modelo3d/piedras.glb",
      id: "piedras-1"
    },
    "PlazaPrincipal": {
      nombre: "Plaza principal",
      descripcion: "Centro de encuentro y cultura.",
      modelo3d: "/assets/modelo3d/plaza.glb",
      id: "plaza-1"
    },
    "20241118_155423773_ios1": {
      nombre: "Trigger especial",
      descripcion: "Contenido único escaneado.",
      modelo3d: "/assets/modelo3d/caciqueReal.glb",
      id: "especial-1"
    }
  };

  startScan() {
    this.scanning = true;

    this.mindarThree = new (window as any).MINDAR.IMAGE.MindARThree({
      container: this.mindarContainer.nativeElement,
      imageTargetSrc: '/assets/triggers.mind',
      uiLoading: "no",
      uiScanning: "no",
      uiError: "no",
      videoSettings: { facingMode: this.currentCamera }
    });

    const { renderer, scene, camera } = this.mindarThree;

    // 🔗 Recorremos todos los triggers registrados en el .mind
    Object.keys(this.triggerMap).forEach((triggerName, index) => {
      const anchor = this.mindarThree.addAnchor(index);

      anchor.onTargetFound = () => {
        console.log(`✅ Trigger detectado: ${triggerName}`);
        this.loadHotelData(triggerName);
      };

      anchor.onTargetLost = () => {
        console.log(`❌ Trigger perdido: ${triggerName}`);
        this.hotel = null;
      };
    });

    const start = async () => {
      await this.mindarThree.start();
      renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
      });
    };
    start();
  }

  async loadHotelData(triggerName: string) {
    this.cargando = true;
    try {
      const data = this.triggerMap[triggerName];
      this.hotel = data;
    } catch (err) {
      console.error("❌ Error cargando el modelo:", err);
    } finally {
      this.cargando = false;
    }
  }

  verUbicacion() {
    if (this.hotel?.id) {
      window.location.href = `/map/${this.hotel.id}`;
    }
  }

  swapCamera() {
    this.currentCamera = this.currentCamera === 'environment' ? 'user' : 'environment';
    console.log("🔄 Cambiando a cámara:", this.currentCamera);

    if (this.mindarThree) {
      this.mindarThree.stop();
      this.startScan();
    }
  }
}