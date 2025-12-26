import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:8000/api", // URL ABSOLUE pour éviter les problèmes
})

// CORRECTION CRITIQUE : Ajouter le token à TOUTES les requêtes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    console.log("Token found for request:", !!token) // Debug
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log("Authorization header set") // Debug
    } else {
      console.warn("No token found") // Debug
    }
    return config
  },
  (error) => {
    console.error("Request interceptor error:", error)
    return Promise.reject(error)
  }
)

// Refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      const refreshToken = localStorage.getItem("refresh")
      if (refreshToken) {
        try {
          const response = await axios.post(
            "http://localhost:8000/api/auth/token/refresh/", 
            { refresh: refreshToken }
          )
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
