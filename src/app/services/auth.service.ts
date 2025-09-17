import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:3000" });

// Si usas JWT, cada vez que tengas un token lo puedes añadir aquí:
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email: string, password: string) => {
  const res = await API.post("/auth/login", { email, password });
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
  }
  return res.data;
};

export const register = async (usuario: { nombre: string; email: string; password: string }) => {
  const res = await API.post("/auth/register", usuario);
  return res.data;
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const getProfile = async () => {
  const res = await API.get("/auth/me");
  return res.data;
};

