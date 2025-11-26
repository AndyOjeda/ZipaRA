import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BottomNavComponent } from "../../components/bottom-nav/bottom-nav.component";
import mapboxgl from 'mapbox-gl';
import { Location } from '@angular/common';
import { getHoteles } from '../../services/api.service';
import { getRestaurantes } from '../../services/api.service';
import { getEventos } from '../../services/api.service';
import { getActividades } from '../../services/api.service';
import { Router } from '@angular/router';

import { getFavoritos } from '../../services/api.service';
import { addFavorito } from '../../services/api.service';
import { removeFavorito } from '../../services/api.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-detail',
  imports: [CommonModule, BottomNavComponent, FormsModule],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
  ,schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DetailComponent implements OnInit ,AfterViewInit {

 
  detail: any;
  category!: string;
  activeImageIndex = 0;
  isFavorito = false;
  favoritoId: number | null = null;
  instagram: string | null = null;
  facebook: string | null = null;

  showRestaurantReserve = false;
  showRestaurantMenu = false;
  showHotelReserve = false;
  showInsideView = false;
  insideViewer: any = null;
  insidePanorama: any = null;

  showPlato = false;
  showHabitacion = false;

  platoActivo: any = {};
  habitacionActiva: any = {};
  today = new Date();

  alert = {
  show: false,
  type: 'success', // success | error | info
  title: '',
  message: ''
};


  restaurantReserve: any = {
  date: '',
  time: '',
  people: 2,
  };

  // reservas hotel (modelo)
  hotelReserve: any = {
    checkin: '',
    checkout: '',
    members: 2,
    beds: 1,
  };

platosRecomendados: any = {
  1: {
    nombre: 'Cerveza 𝑺𝒕𝒐𝒖𝒕',
    img: 'assets/modelo3d/pie.glb',
    usdz: 'assets/modelo3d/pie.usdz',
    desc: 'Es el nombre de un estilo de cerveza, tipo ale, muy oscura, originario de las islas británicas, 𝑺𝒕𝒐𝒖𝒕, es el nombre utilizado para la cerveza más fuerte fabricada con secas maltas tostadas y con notas de café achocolatadas.'
  },
  2: {
    nombre: 'Costilla Braseada en Reducción Oscura con Papas Rústicas y Brotes Frescos',
    img: 'assets/modelo3d/salario.glb',
    usdz: 'assets/modelo3d/salario.usdz',
    desc: 'Costilla de cerdo braseada lentamente hasta obtener una textura tierna y jugosa, bañada en una reducción oscura con notas dulces y ahumadas. Se sirve sobre papas rústicas doradas y chorizo caramelizado, que aportan profundidad y contraste. Finalizado con brotes frescos y un toque floral que realza la presentación y añade frescura al paladar.'
  },
  3: {
    nombre: 'Costillas Glaseadas en Salsa Agridulce con Ensalada Cremosa de Papas',
    img: 'assets/modelo3d/labriego.glb',
    usdz: 'assets/modelo3d/labriego.usdz',
    desc: 'Deliciosas costillas de cerdo cocinadas a fuego lento hasta quedar suaves y jugosas, bañadas en una salsa agridulce brillante con notas caramelizadas. Se coronan con tomates cherry amarillos que aportan frescura y un toque cítrico. Acompañan unas papas rústicas mezcladas con una crema suave de hierbas y tiras de cebolla, creando un balance perfecto entre lo dulce, lo salado y lo cremoso.'
  },
  4: {
    nombre: 'Raviolis Quesudos',
    img: 'assets/modelo3d/grana.glb',
    usdz: 'assets/modelo3d/grana.usdz',
    desc: 'Raviolis hechos a mano, rellenos de queso de cabra: suaves, cremosos, inolvidables. Una salsa de tomates rostizados con un toque de siracha que equilibra dulzura, acidez y ese picante que despierta sentidos. La trucha, curada y ahumada desde nuestras montañas, une dos mundos en un solo plato.'
  },
  5: {
    nombre: 'Postre Matrimonio',
    img: 'assets/modelo3d/matrimonio.glb',
    usdz: 'assets/modelo3d/matrimonio.usdz',
    desc: 'La combinación perfecta de arequipe, cuajada y salsa de mora en un solo postre. Un amor eterno entre dulzura y tradición. '
  },
  6: {
    nombre: 'Mojarra Frita Tradicional con Arroz con Coco y Patacón Dorado',
    img: 'assets/modelo3d/mar.glb',
    usdz: 'assets/modelo3d/mar.usdz',
    desc: 'Mojarra entera frita a la perfección, con piel crujiente y carne jugosa, acompañada de un aromático arroz con coco que aporta dulzura y suavidad. Incluye patacón dorado y crujiente, una fresca ensalada de verduras y un toque de limón para realzar los sabores. Un clásico de la cocina caribeña y colombiana preparado en su esencia más auténtica.'
  }
};


habitacionesDestacadas: any = {
  4: {
    nombre: 'Suite Deluxe',
    img: 'assets/modelo3d/habCaminoSal.glb',
    precio: 180000,
    desc: 'Habitación amplia, elegante y con vista a la ciudad.'
  },
  5: {
    nombre: 'Habitación Doble',
    img: 'assets/modelo3d/habBacata.glb',
    precio: 140000,
    desc: 'Perfecta para parejas o dos viajeros.'
  },
  6: {
    nombre: 'Habitación Ejecutiva',
    img: 'assets/modelo3d/habCacique1.glb',
    precio: 220000,
    desc: 'Pensada para viajeros corporativos con todas las comodidades.'
  },
  7: {
    nombre: 'Habitación Familiar',
    img: 'assets/modelo3d/habBoutique.glb',
    precio: 160000,
    desc: 'Espacio ideal para familias de hasta 5 personas.'
  },
  8: {
    nombre: 'Habitación Estándar',
    img: 'assets/modelo3d/habSalinero.glb',
    precio: 110000,
    desc: 'Cómoda, sencilla y económica.'
  },
  9: {
    nombre: 'Suite Romántica',
    img: 'assets/modelo3d/habLuxury.glb',
    precio: 200000,
    desc: 'Decoración especial para parejas.'
  },
  10: {
    nombre: 'Habitación Premium',
    img: 'assets/modelo3d/habSalinero.glb',
    precio: 250000,
    desc: 'La experiencia más exclusiva del hotel.'
  },
  11: {
    nombre: 'Loft Moderno',
    img: 'assets/modelo3d/habPuerta.glb',
    precio: 190000,
    desc: 'Estilo moderno con cocina equipada.'
  }
};


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.category = this.route.snapshot.paramMap.get('category') || 'hoteles';

    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
    const usuario_id = usuario?.id;

    if (!id) return;

    try {
      let res: any;

      switch (this.category) {
        case 'hoteles':
          res = await getHoteles();
          break;
        case 'restaurantes':
          res = await getRestaurantes();
          break;
        case 'eventos':
          res = await getEventos();
          break;
        case 'actividades':
          res = await getActividades();
          break;
        default:
          res = { data: [] };
      }

      this.detail = res.data.find((item: any) => item.id == id);

      if (this.detail) {
        // Normalizar propiedades comunes
        this.detail.name = this.detail.nombre || this.detail.titulo || "Sin nombre";
        this.detail.location = this.detail.direccion || "Zipaquirá";
        this.detail.rating = this.detail.resenas || 4.5;
        this.detail.amenities = this.detail.comodidades
          ? (typeof this.detail.comodidades === 'string'
              ? JSON.parse(this.detail.comodidades)
              : this.detail.comodidades)
          : {};
        this.detail.description = this.detail.descripcion || "Sin descripción disponible.";
        this.detail.images = [`https://backendzipara.onrender.com${this.detail.imagen}`];

        this.detail.googleMapsUrl =
          `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(this.detail.location)}`;

        // Precios según categoría
        if (this.category === 'hoteles') {
          this.detail.price = this.detail.precio || 0;
        } else if (this.category === 'restaurantes') {
          this.detail.precio_min = this.detail.precio_min || 0;
          this.detail.precio_max = this.detail.precio_max || 0;
        } else {
          this.detail.price = this.detail.precio || 0;
        }

        // Coordenadas por defecto
        this.detail.lat = Number(this.detail.lat) || 5.0221;
        this.detail.lng = Number(this.detail.lng) || -74.0048;
      }
    } catch (err) {
      console.error('Error cargando detalle:', err);
    }

    // Validar favoritos
    if (usuario_id && this.detail) {
      const { data: favoritos } = await getFavoritos(usuario_id);

      const fav = favoritos.find((f: any) =>
        (this.category === 'hoteles' && f.hotel_id == this.detail?.id) ||
        (this.category === 'restaurantes' && f.restaurante_id == this.detail?.id) ||
        (this.category === 'eventos' && f.evento_id == this.detail?.id) ||
        (this.category === 'actividades' && f.actividad_id == this.detail?.id)
      );

      if (fav) {
        this.isFavorito = true;
        this.favoritoId = fav.id;   // 👈 PK de la tabla favoritos
      }
    }

    // Intentar geocodificar si no hay coordenadas válidas
    if (this.detail?.location && (!this.detail.lat || !this.detail.lng)) {
      const coords = await this.geocodeAddress(this.detail.location);
      if (coords) {
        this.detail.lat = coords.lat;
        this.detail.lng = coords.lng;
      }
    }

    if (this.detail?.lat && this.detail?.lng) {
      this.initMap(this.detail.lat, this.detail.lng);
    }
  }

  private async geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=TU_TOKEN_MAPBOX&limit=1`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const [lng, lat] = data.features[0].center;
      return { lat, lng };
    }

    return null;
  }

  ngAfterViewInit(): void {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYW5kcmVzb2plZGEyMCIsImEiOiJjbWFpZGloOWIwbmF4MnFvY3RwMWFqdnBsIn0.Ap1NaGLQzmyX9UXAG_rm3A';

    // Observa cambios en detail hasta que exista
    const interval = setInterval(() => {
      const mapDiv = document.getElementById('map');
      if (this.detail && mapDiv) {
        const lng = Number(this.detail.lng) || -74.0048;
        const lat = Number(this.detail.lat) || 5.0221;

        this.initMap(lat, lng);
        clearInterval(interval); // detener el checkeo
      }
    }, 300);
  }


  private initMap(lat: number, lng: number) {
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: 14
    });

    new mapboxgl.Marker({ color: "#ff0000" })
      .setLngLat([lng, lat])
      .addTo(map);
  }

  nextImage() {
    this.activeImageIndex = (this.activeImageIndex + 1) % this.detail.images.length;
  }

  prevImage() {
    this.activeImageIndex =
      (this.activeImageIndex - 1 + this.detail.images.length) % this.detail.images.length;
  }

  goBack() {
    this.location.back();
  }

  async toggleFavorito() {
    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
    const usuario_id = usuario?.id;

    if (!usuario_id) {
      alert("Debes iniciar sesión");
      return;
    }

    if (this.isFavorito && this.favoritoId) {
      // ❌ Quitar de favoritos
      await removeFavorito(this.favoritoId);
      this.isFavorito = false;
      this.favoritoId = null;
    } else {
      // ✅ Agregar a favoritos
      const payload: any = { usuario_id };
      if (this.category === "hoteles") payload.hotel_id = this.detail.id;
      if (this.category === "restaurantes") payload.restaurante_id = this.detail.id;
      if (this.category === "eventos") payload.evento_id = this.detail.id;
      if (this.category === "actividades") payload.actividad_id = this.detail.id;

      const res = await addFavorito(payload);
      this.isFavorito = true;
      this.favoritoId = res.data.id; // 👈 guarda el id que devuelve el backend
    }
  }

  loadSampleMenuForDetail(detail: any) {
  // si ya tiene menuSections, usarlo
  if (detail.menuSections && detail.menuSections.length) return;

  // generar diferentes menús según id para que "cada restaurante sea diferente"
  const baseMenus: any = {
    1: [
      {
        name: 'Entradas',
        description: 'A compartir antes del plato fuerte',
        items: [
          { name: 'Ceviche de la casa', description: 'Ceviche fresco con toque cítrico', price: 12 },
          { name: 'Empanadas fritas', description: 'Empanadas rellenas con carne y papa', price: 4 }
        ]
      },
      {
        name: 'Principales',
        description: 'Nuestros platos principales',
        items: [
          { name: 'Pescado a la sal', description: 'Pescado horneado en costra de sal', price: 22 },
          { name: 'Bandeja paisa', description: 'Clásico plato colombiano', price: 18 }
        ]
      },
      {
        name: 'Postres',
        description: 'Dulces tradicionales',
        items: [
          { name: 'Tres leches', description: 'Pastel esponjoso con crema', price: 6 },
          { name: 'Cuajada con melao', description: 'Postre tradicional', price: 5 }
        ]
      }
    ],
    2: [
      {
        name: 'Entradas',
        description: 'Pequeñas porciones para empezar',
        items: [
          { name: 'Bruschetta', description: 'Pan tostado con tomate y albahaca', price: 9 },
          { name: 'Tabla de quesos', description: 'Selección de quesos locales', price: 14 }
        ]
      },
      {
        name: 'Principales',
        description: 'Sabores con tradición',
        items: [
          { name: 'Sopa de ajo', description: 'Sopa reconfortante', price: 10 },
          { name: 'Lomo al trapo', description: 'Corte jugoso a la parrilla', price: 26 }
        ]
      },
      {
        name: 'Bebidas y postres',
        description: 'Complementos',
        items: [
          { name: 'Limonada de coco', description: 'Refrescante', price: 4 },
          { name: 'Flan', description: 'Clásico', price: 5 }
        ]
      }
    ],
    3: [
      {
        name: 'Entradas',
        description: 'Sabores para compartir',
        items: [
          { name: 'Arepa con queso', description: 'Arepa recién hecha', price: 3 },
          { name: 'Tamales', description: 'Tamales tradicionales', price: 7 }
        ]
      },
      {
        name: 'Principales',
        description: 'Especialidades de la casa',
        items: [
          { name: 'Gallina criolla', description: 'Preparación tradicional', price: 16 },
          { name: 'Pasta con salsa de la casa', description: 'Pasta casera', price: 12 }
        ]
      },
      {
        name: 'Postres',
        description: 'Sabor local',
        items: [
          { name: 'Almojábanas', description: 'Bolitas de queso horneadas', price: 3 },
          { name: 'Brevas con arequipe', description: 'Dulce tradicional', price: 6 }
        ]
      }
    ]
  };

  // fallback: si no hay id, usar menú genérico
  const menu = baseMenus[detail?.id] || baseMenus[1];

  detail.menuSections = menu;
  // cover y actualizacion del menu (puedes sustituir con detail.imagen si quieres)
  detail.menuCover = detail.imagen || '/mnt/data/0d3001ce-e988-441f-a7d0-84687e8a3599.png';
  detail.menuUpdated = this.today.toLocaleDateString();
}

// ---------- métodos para abrir/cerrar modales ----------
openRestaurantReserve() {
  this.restaurantReserve = { date: '', time: '', people: 2 };
  this.showRestaurantReserve = true;
}

closeRestaurantReserve() {
  this.showRestaurantReserve = false;
}

openRestaurantMenu() {
  // carga sample si no existe
  this.loadSampleMenuForDetail(this.detail);
  this.showRestaurantMenu = true;
}

closeRestaurantMenu() {
  this.showRestaurantMenu = false;
}

openHotelReserve() {
  this.hotelReserve = { checkin: '', checkout: '', members: 2, beds: 1 };
  this.showHotelReserve = true;
}

closeHotelReserve() {
  this.showHotelReserve = false;
}

// ---------- handlers de submit (simulación) ----------
submitRestaurantReserve(e: Event) {
  e.preventDefault();

  // Validación mínima
  if (!this.restaurantReserve.date || !this.restaurantReserve.time || !this.restaurantReserve.people) {
    this.showAlert(
      'error',
      'Datos incompletos',
      'Por favor completa la fecha, hora y número de personas.'
    );
    return;
  }

  const msg = `Reserva confirmada para ${this.restaurantReserve.people} persona(s) el ${this.restaurantReserve.date} a las ${this.restaurantReserve.time}.`;

  // Cerrar modal
  this.showRestaurantReserve = false;

  // Reset
  this.restaurantReserve = {
    date: '',
    time: '',
    people: 1
  };

  // Mostrar alerta bonita
  this.showAlert(
    'success',
    'Reserva en ' + this.detail.name,
    msg
  );
}


submitHotelReserve(e: Event) {
  e.preventDefault();

  // Validaciones
  if (!this.hotelReserve.checkin || !this.hotelReserve.checkout || !this.hotelReserve.members) {
    this.showAlert(
      'error',
      'Datos incompletos',
      'Por favor completa llegada, salida y número de miembros.'
    );
    return;
  }

  const inDate = new Date(this.hotelReserve.checkin);
  const outDate = new Date(this.hotelReserve.checkout);

  if (outDate <= inDate) {
    this.showAlert(
      'error',
      'Fechas incorrectas',
      'La fecha de salida debe ser posterior a la de llegada.'
    );
    return;
  }

  const msg = `${this.hotelReserve.members} persona(s), ${this.hotelReserve.beds} cama(s) del ${this.hotelReserve.checkin} al ${this.hotelReserve.checkout}.`;

  // Cerrar modal
  this.showHotelReserve = false;

  // Reset
  this.hotelReserve = {
    checkin: '',
    checkout: '',
    members: 1,
    beds: 1
  };

  // Mostrar alerta
  this.showAlert(
    'success',
    'Reserva en ' + this.detail.name,
    msg
  );
}


// ---------- util: toast simple ----------
showToastMsg = '';
showToastTimeout: any = null;
showToast(message: string) {
  this.showToastMsg = message;
  // usa alert temporal o un toast visual
  // aquí creamos un toast visual en DOM:
  const toast = document.createElement('div');
  toast.innerText = message;
  toast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 rounded-full shadow-lg z-60';
  document.body.appendChild(toast);
  if (this.showToastTimeout) clearTimeout(this.showToastTimeout);
  this.showToastTimeout = setTimeout(() => {
    toast.remove();
  }, 4500);
}

// ---------- util para scroll del menu (modal) ----------
scrollMenu(amount: number) {
  const container = Array.from(document.querySelectorAll('.max-w-4xl'))[0] as HTMLElement;
  // mejor target al modal contenido
  const modalContent = document.querySelector('.max-w-4xl .overflow-auto') as HTMLElement;
  if (modalContent) {
    modalContent.scrollBy({ top: 0, left: amount, behavior: 'smooth' });
  } else {
    // fallback: scroll ventana modal
    window.scrollBy({ top: 0, left: amount, behavior: 'smooth' } as any);
  }
}

  showAlert(type: 'success' | 'error' | 'info', title: string, message: string) {
    this.alert = {
      show: true,
      type,
      title,
      message
    };

    // Ocultar auto a los 2.5s
    setTimeout(() => {
      this.alert.show = false;
    }, 5000);
  }

  closeAlert() {
    this.alert.show = false;
  }

  // ----- Abrir plato recomendado -----
openPlatoRecomendado() {
  const id = this.detail?.id;
  this.platoActivo = this.platosRecomendados[id] || {
    nombre: 'Plato de la casa',
    img: this.detail?.images?.[0] || '',
    desc: 'Recomendado por el chef.'
  };
  this.showPlato = true;
}

closePlato() {
  this.showPlato = false;
}


// ----- Abrir habitación destacada -----
openHabitacion() {
  const id = this.detail?.id;
  this.habitacionActiva = this.habitacionesDestacadas[id] || {
    nombre: 'Habitación estándar',
    img: this.detail?.images?.[0] || '',
    precio: this.detail?.price || 0,
    desc: 'Habitación cómoda y equipada.'
  };
  this.showHabitacion = true;
}

closeHabitacion() {
  this.showHabitacion = false;
}

openOnirix(url: string) {
  window.open(url, "_blank");
}



}