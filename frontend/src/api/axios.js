# 1. Crée un NOUVEAU fichier
@'
import axios from "axios"

// 🚨🚨🚨 VERSION ULTIME - PRODUCTION SEULEMENT 🚨🚨🚨
const PRODUCTION_API = "https://mini-stackoverflow-backend.onrender.com/api"

const api = axios.create({
  baseURL: PRODUCTION_API,
  headers: { "Content-Type": "application/json" },
})

console.log("🔥🔥🔥 PRODUCTION API FORCÉE 🔥🔥🔥")
console.log("🔥 URL:", PRODUCTION_API)
console.log("🔥 Timestamp:", Date.now())

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
'@ | Out-File -FilePath src/api/axios-ultime.js -Encoding UTF8'