import axios from "axios";



 const API = axios.create({ baseURL: "https://backend-zipa-ra.vercel.app/api" });
//const API = axios.create({ baseURL: "http://localhost:4000/api" });

// 🔹 Interceptor: agrega el token en cada request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔹 Login
export const login = async (email: string, password: string) => {
  try {
    const res = await API.post("/auth/login", { email, password });

  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("usuario", JSON.stringify(res.data.usuario)); // 🔹 Guardamos usuario
  }


    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Error en login" };
  }
};

// 🔹 Registro
export const register = async (usuario: { nombre: string; email: string; password: string; rol?: string }) => {
  try {
    const res = await API.post("/auth/register", usuario);
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Error en registro" };
  }
};

// 🔹 Logout
export const logout = () => {
  localStorage.removeItem("token");
};

// 🔹 Obtener perfil
export const getProfile = async () => {
  try {
    const res = await API.get("/auth/me");
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Error al obtener perfil" };
  }
};

// 🔹 Verificar si está logueado
export const isLoggedIn = (): boolean => {
  return !!localStorage.getItem("token");
};
