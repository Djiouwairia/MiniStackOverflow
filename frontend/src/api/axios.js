import axios from "axios"

// URL corrigée - utilise celle de Render
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// CORRECTION CRITIQUE : Ajouter le token à TOUTES les requêtes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    console.log("Token found for request:", !!token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log("Authorization header set")
    } else {
      console.warn("No token found")
    }
    return config
  },
  (error) => {
    console.error("Request interceptor error:", error)
    return Promise.reject(error)
  }
)

// Refresh token - CORRIGEZ l'URL ici aussi !
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      const refreshToken = localStorage.getItem("refresh")
      if (refreshToken) {
        try {
          // CORRECTION : Utilisez la même baseURL
          const response = await api.post("/auth/token/refresh/", {
            refresh: refreshToken
          })
          
          localStorage.setItem("token", response.data.access)
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`
          return api(originalRequest)
        } catch (refreshError) {
          console.error("Refresh token failed:", refreshError)
          localStorage.removeItem("token")
          localStorage.removeItem("refresh")
          window.location.href = "/login"
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api
