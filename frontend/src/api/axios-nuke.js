import axios from "axios"

// 🚨🚨🚨 NUKE VERSION - PRODUCTION ONLY 🚨🚨🚨
const API_URL = "https://mini-stackoverflow-backend.onrender.com/api"

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
})

console.log("💥💥💥 NUKE API LOADED - PRODUCTION 💥💥💥")
console.log("URL:", API_URL)
console.log("Build:", new Date().toISOString())

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
