import {
  Component,
  ElementRef,
  ViewChild,
  CUSTOM_ELEMENTS_SCHEMA,
  AfterViewInit
} from '@angular/core';

import { BottomNavComponent } from "../../components/bottom-nav/bottom-nav.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Three.js
import * as THREE from 'three';

// Loaders
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  selector: 'app-scan',
  imports: [BottomNavComponent, CommonModule, FormsModule],
  templateUrl: './scan.component.html',
  styleUrl: './scan.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ScanComponent implements AfterViewInit {

  scanning = false;
  currentCamera: 'environment' | 'user' = 'environment';

  @ViewChild('cameraView', { static: true }) cameraView!: ElementRef;
  stream: MediaStream | null = null;

  showModal = false;
  currentModel: any = null;
  currentIndex = 0;

  scene: any;
  camera: any;
  renderer: any;
  controls: any;

  triggerMap: Record<string, any> = {
    "HotelZipaquira": {
      nombre: "Hotel Zipaquirá",
      descripcion: "Hospedaje acogedor en el centro histórico.",
      modelo3d: "/assets/modelo3d/hotelZipaquira.glb"
    },
    "ReligionZipaquira": {
      nombre: "Catedral de Sal",
      descripcion: "Lugar icónico de Colombia.",
      modelo3d: "/assets/modelo3d/religion.glb"
    },
    "EstatuaZipaquira": {
      nombre: "Estatua histórica",
      descripcion: "Monumento representativo.",
      modelo3d: "/assets/modelo3d/estatua.glb"
    },
    "PiedrasZipaquira": {
      nombre: "Formaciones rocosas",
      descripcion: "Piedras ancestrales.",
      modelo3d: "/assets/modelo3d/piedras.glb"
    },
    "PlazaPrincipal": {
      nombre: "Plaza principal",
      descripcion: "Centro cultural.",
      modelo3d: "/assets/modelo3d/plaza.glb"
    }
  };

  ngAfterViewInit() {}

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

  showModel(triggerName: string) {
    this.currentModel = this.triggerMap[triggerName];
    this.showModal = true;

    setTimeout(() => {
      this.loadModel(this.currentModel.modelo3d);
    }, 200);
  }

  loadModel(url: string) {
    const container = document.getElementById('viewer-container');

    if (!container) {
      console.error("No existe el contenedor viewer-container");
      return;
    }

    container.innerHTML = "";

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    this.camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(2, 2, 3);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);

    // 💡 Luz suave
    const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
    this.scene.add(light);

    // Controles
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // 📌 GLTF + DRACO
    const loader = new GLTFLoader();

    const draco = new DRACOLoader();
    draco.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
    loader.setDRACOLoader(draco);

    loader.load(
      url,
      (gltf) => {
        const model = gltf.scene;
        model.position.set(0, 0, 0);
        model.scale.set(1.2, 1.2, 1.2);
        this.scene.add(model);
      },
      undefined,
      (err) => {
        console.error("Error cargando GLB:", err);
      }
    );

    const animate = () => {
      requestAnimationFrame(animate);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };

    animate();
  }

  closeModal() {
    this.showModal = false;
    this.scanning = false;
    this.stopCamera();
  }

  swapCamera() {
    this.currentCamera =
      this.currentCamera === 'environment' ? 'user' : 'environment';

    this.startCamera();
  }
}
