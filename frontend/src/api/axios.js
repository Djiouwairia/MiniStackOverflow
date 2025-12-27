import axios from "axios"

// 🚀 VERSION PRODUCTION UNIQUEMENT
const API_URL = "https://mini-stackoverflow-backend.onrender.com/api"

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
})

console.log("✅ API configurée pour:", API_URL)

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
