import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:3000" });

// Hoteles
export const getHoteles = () => API.get("/hoteles");
export const createHotel = (data: any) => API.post("/hoteles", data);
export const updateHotel = (id: number, data: any) => API.put(`/hoteles/${id}`, data);
export const deleteHotel = (id: number) => API.delete(`/hoteles/${id}`);

// Restaurantes
export const getRestaurantes = () => API.get("/restaurantes");
export const createRestaurante = (data: any) => API.post("/restaurantes", data);
export const updateRestaurante = (id: number, data: any) => API.put(`/restaurantes/${id}`, data);
export const deleteRestaurante = (id: number) => API.delete(`/restaurantes/${id}`);

// Eventos
export const getEventos = () => API.get("/eventos");
export const createEvento = (data: any) => API.post("/eventos", data);
export const updateEvento = (id: number, data: any) => API.put(`/eventos/${id}`, data);
export const deleteEvento = (id: number) => API.delete(`/eventos/${id}`);

// Reseñas
export const getResenas = () => API.get("/resenas");
export const createResena = (data: any) => API.post("/resenas", data);
export const updateResena = (id: number, data: any) => API.put(`/resenas/${id}`, data);
export const deleteResena = (id: number) => API.delete(`/resenas/${id}`);

// Favoritos
export const getFavoritos = () => API.get("/favoritos");
export const addFavorito = (data: any) => API.post("/favoritos", data);
export const removeFavorito = (id: number) => API.delete(`/favoritos/${id}`);

// Usuarios
export const getUsuarios = () => API.get("/usuarios");
export const createUsuario = (data: any) => API.post("/usuarios", data);
export const updateUsuario = (id: number, data: any) => API.put(`/usuarios/${id}`, data);
export const deleteUsuario = (id: number) => API.delete(`/usuarios/${id}`);
