import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:4000/api" });

// Helper para enviar con multipart/form-data
const multipartConfig = {
  headers: { "Content-Type": "multipart/form-data" },
};

// ------------------ Hoteles ------------------
export const getHoteles = () => API.get("/hoteles");
export const createHotel = (data: FormData) =>
  API.post("/hoteles", data, multipartConfig);
export const updateHotel = (id: number, data: FormData) =>
  API.put(`/hoteles/${id}`, data, multipartConfig);
export const deleteHotel = (id: number) => API.delete(`/hoteles/${id}`);

// ---------------- Restaurantes ----------------
export const getRestaurantes = () => API.get("/restaurantes");
export const createRestaurante = (data: FormData) =>
  API.post("/restaurantes", data, multipartConfig);
export const updateRestaurante = (id: number, data: FormData) =>
  API.put(`/restaurantes/${id}`, data, multipartConfig);
export const deleteRestaurante = (id: number) =>
  API.delete(`/restaurantes/${id}`);

// ------------------ Eventos ------------------
export const getEventos = () => API.get("/eventos");
export const createEvento = (data: FormData) =>
  API.post("/eventos", data, multipartConfig);
export const updateEvento = (id: number, data: FormData) =>
  API.put(`/eventos/${id}`, data, multipartConfig);
export const deleteEvento = (id: number) => API.delete(`/eventos/${id}`);

// ---------------- Actividades ----------------
export const getActividades = () => API.get("/actividades");
export const createActividad = (data: FormData) =>
  API.post("/actividades", data, multipartConfig);
export const updateActividad = (id: number, data: FormData) =>
  API.put(`/actividades/${id}`, data, multipartConfig);
export const deleteActividad = (id: number) =>
  API.delete(`/actividades/${id}`);

// ------------------ Reseñas ------------------
export const getResenas = () => API.get("/resenas");
export const createResena = (data: any) => API.post("/resenas", data);
export const updateResena = (id: number, data: any) =>
  API.put(`/resenas/${id}`, data);
export const deleteResena = (id: number) => API.delete(`/resenas/${id}`);

// ----------------- Favoritos -----------------
export const getFavoritos = (usuario_id: number) =>
  API.get(`/favoritos/${usuario_id}`);
export const addFavorito = (data: any) => API.post("/favoritos", data);
export const removeFavorito = (id: number) =>
  API.delete(`/favoritos/${id}`);

// ------------------ Usuarios -----------------
export const getUsuarios = () => API.get("/usuarios");
export const createUsuario = (data: any) => API.post("/usuarios", data);
export const updateUsuario = (id: number, data: any) =>
  API.put(`/usuarios/${id}`, data);
export const deleteUsuario = (id: number) => API.delete(`/usuarios/${id}`);

// ---------------- Preferencias ----------------
export const getPreferencias = () => API.get("/preferencias");
export const getPreferenciaByUser = (userId: number) =>
  API.get(`/preferencias/usuario/${userId}`);
export const createPreferencia = (data: any) =>
  API.post("/preferencias", data);
export const updatePreferencia = (id: number, data: any) =>
  API.put(`/preferencias/${id}`, data);
export const deletePreferencia = (id: number) =>
  API.delete(`/preferencias/${id}`);

// ---------------- Categorías ----------------
export const getCategorias = () => API.get("/categorias");
export const createCategorias = (data: any) =>
  API.post("/categorias", data);
