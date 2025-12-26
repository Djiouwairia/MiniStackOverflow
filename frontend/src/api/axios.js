import axios from "axios"

// URL dynamique qui fonctionne partout
const getBaseURL = () => {
  // Vérifie si on est dans un navigateur
  if (typeof window !== "undefined") {
    const host = window.location.hostname
    const port = window.location.port
    
    console.log("🌐 Hostname détecté:", host)
    console.log("🌐 Port détecté:", port)
    
    // Production sur Vercel
    if (host.includes("vercel.app") || 
        host.includes("mini-stack-frontend") || 
        host === "mini-stack-frontend.vercel.app") {
      console.log("🌐 Mode: Production (Vercel)")
      return "https://mini-stackoverflow-backend.onrender.com/api"
    }
    
    // Développement local
    if (host === "localhost" || host === "127.0.0.1") {
      console.log("🌐 Mode: Développement local")
      // En développement, vérifiez si le port est 3000 (React) ou autre
      return "http://localhost:8000/api"
    }
    
    // Autres cas (domaine personnalisé, etc.)
    console.log("🌐 Mode: Autre domaine")
  }
  
  // Fallback par défaut (pour Vercel build)
  console.log("🌐 Mode: Fallback (production)")
  return "https://mini-stackoverflow-backend.onrender.com/api"
}

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
})

// Debug
console.log("🔧 API Config - Base URL:", api.defaults.baseURL)
console.log("🔧 Full URL pour /questions:", api.defaults.baseURL + "/questions/")

// Interceptors
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log("🔑 Token ajouté aux headers")
    } else {
      console.log("🔑 Pas de token trouvé")
    }
    return config
  },
  (error) => {
    console.error("❌ Erreur intercepteur request:", error)
    return Promise.reject(error)
  }
)

// Intercepteur pour les réponses
api.interceptors.response.use(
  (response) => {
    console.log("✅ Réponse API reçue:", response.config.url)
    return response
  },
  (error) => {
    console.error("❌ Erreur API:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      baseURL: api.defaults.baseURL
    })
    return Promise.reject(error)
  }
)

export default api
