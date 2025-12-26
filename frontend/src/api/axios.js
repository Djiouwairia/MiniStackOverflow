import axios from "axios"

// URL dynamique qui fonctionne partout
const getBaseURL = () => {
  // Vérifie si on est dans un navigateur
  if (typeof window !== "undefined") {
    const host = window.location.hostname
    
    // Production sur Vercel
    if (host.includes("vercel.app") || host.includes("mini-stack-frontend")) {
      return "https://mini-stackoverflow-backend.onrender.com/api"
    }
    
    // Développement local
    if (host === "localhost" || host === "127.0.0.1") {
      return "http://localhost:8000/api"
    }
  }
  
  // Fallback par défaut (pour Vercel build)
  return "https://mini-stackoverflow-backend.onrender.com/api"
}

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
})

// Debug
console.log("?? API Config - Base URL:", api.defaults.baseURL)
console.log("?? Hostname:", typeof window !== "undefined" ? window.location.hostname : "server-side")

// Interceptors
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default api
