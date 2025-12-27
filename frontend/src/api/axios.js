import axios from "axios"

// ⚠️ On supprime le fallback vers localhost en production
const API_URL = process.env.REACT_APP_API_URL;
if (!API_URL) {
  throw new Error("❌ REACT_APP_API_URL n'est pas défini dans l'environnement !");
}

console.log("🌍 API_URL utilisé :", API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
})

console.log("✅ API configurée pour:", API_URL)

// Intercepteur pour ajouter le token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Intercepteur pour gérer le refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refresh = localStorage.getItem("refresh")
      if (refresh) {
        try {
          const res = await api.post("/auth/token/refresh/", { refresh })
          localStorage.setItem("token", res.data.access)
          api.defaults.headers.Authorization = `Bearer ${res.data.access}`
          return api(originalRequest)
        } catch (err) {
          console.error("Refresh token failed", err)
          localStorage.removeItem("token")
          localStorage.removeItem("refresh")
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api

