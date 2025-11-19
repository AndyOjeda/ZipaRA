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
  hotel: any = null;
  cargando = false;
  currentCamera: 'environment' | 'user' = 'environment';

  @ViewChild('mindarContainer', { static: true }) mindarContainer!: ElementRef;

  mindarThree: any;
  anchor: any;

  triggerMap: Record<string, any> = {
    "HotelZipaquira": {
      nombre: "Hotel Zipaquirá",
      descripcion: "Hospedaje acogedor en el centro histórico.",
      modelo3d: "/assets/modelo3d/hotelZipaquira.glb",
      id: "hotel-1"
    },
    "ReligionZipaquira": {
      nombre: "Catedral de Sal",
      descripcion: "Lugar de peregrinación y maravilla arquitectónica.",
      modelo3d: "/assets/modelo3d/religion.glb",
      id: "religion-1"
    },
    "EstatuaZipaquira": {
      nombre: "Estatua histórica",
      descripcion: "Monumento representativo.",
      modelo3d: "/assets/modelo3d/estatua.glb",
      id: "estatua-1"
    },
    "PiedrasZipaquira": {
      nombre: "Formaciones rocosas",
      descripcion: "Piedras ancestrales.",
      modelo3d: "/assets/modelo3d/piedras.glb",
      id: "piedras-1"
    },
    "PlazaPrincipal": {
      nombre: "Plaza principal",
      descripcion: "Centro de encuentro y cultura.",
      modelo3d: "/assets/modelo3d/plaza.glb",
      id: "plaza-1"
    }
  };

  // ----------------------------------------------
  // 🚀 INICIAR ESCANEO
  // ----------------------------------------------
  async startScan() {
    if (!(window as any).MINDAR?.IMAGE) {
      console.error("⚠️ MindAR no cargó todavía");
      return;
    }

    this.scanning = true;

    // Destruir instancias previas
    if (this.mindarThree) {
      try { await this.mindarThree.stop(); } catch {}
    }

    // Inicializar motor
    this.mindarThree = new (window as any).MINDAR.IMAGE.MindARThree({
      container: this.mindarContainer.nativeElement,
      imageTargetSrc: "/assets/triggers.mind",
      uiLoading: "no",
      uiScanning: "no",
      uiError: "no",
      videoSettings: {
        facingMode: this.currentCamera
      }
    });

    const { renderer, scene, camera } = this.mindarThree;

    // Anchor universal
    this.anchor = this.mindarThree.addAnchor(0);

    // Detectar cuando encuentra un trigger
    this.anchor.onTargetFound = () => {
      console.log("🎯 Target detectado");
      const triggerName = this.getTriggerNameFromIndex(0);
      this.loadHotelData(triggerName);
    };

    this.anchor.onTargetLost = () => {
      console.log("❌ Target perdido");
    };

    await this.mindarThree.start();

    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }

  // ------------------------------------------------------------------
  // 🧠 Mapear índice del .mind → nombre del trigger
  // ------------------------------------------------------------------
  getTriggerNameFromIndex(index: number) {
    const keys = Object.keys(this.triggerMap);
    return keys[index];
  }

  // ------------------------------------------------------------------
  // 📌 Cargar datos del trigger detectado
  // ------------------------------------------------------------------
  async loadHotelData(triggerName: string) {
    this.cargando = true;

    try {
      this.hotel = this.triggerMap[triggerName];
    } catch (err) {
      console.error("❌ Error cargando:", err);
    } finally {
      this.cargando = false;
    }
  }

  // ------------------------------------------------------------------
  // 📍 Mandar a mapa
  // ------------------------------------------------------------------
  verUbicacion() {
    if (this.hotel?.id) {
      window.location.href = `/map/${this.hotel.id}`;
    }
  }

  // ------------------------------------------------------------------
  // 🔄 Cambiar Cámara
  // ------------------------------------------------------------------
  async swapCamera() {
    this.currentCamera = this.currentCamera === 'environment' ? 'user' : 'environment';

    if (this.mindarThree) {
      await this.mindarThree.stop();
    }

    this.startScan();
  }
}