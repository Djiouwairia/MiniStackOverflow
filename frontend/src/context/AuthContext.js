"use client"

import { createContext, useState, useEffect } from "react"
import api from "../api/axios"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log("AuthProvider mounted, checking auth...")
    checkAuth()
  }, [])

  const checkAuth = async () => {
    console.log("checkAuth called")
    const token = localStorage.getItem("token")
    console.log("Token from localStorage:", token ? "YES" : "NO")
    
    if (!token) {
      console.log("No token, skipping auth check")
      setLoading(false)
      return
    }

    try {
      console.log("Making profile request...")
      // CORRECTION : Utilisez le chemin relatif, pas l'URL absolue
      const response = await api.get("/auth/profile/")
      console.log("Profile response:", response.data)
      setUser(response.data)
    } catch (error) {
      console.error("Auth check FAILED:", error.response?.data || error.message)
      console.error("Status:", error.response?.status)
      localStorage.removeItem("token")
      localStorage.removeItem("refresh")
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (username, password) => {
    console.log("Login attempt for:", username)
    try {
      // CORRECTION : Utilisez le chemin relatif
      const response = await api.post("/auth/login/", {
        username,
        password,
      })
      console.log("Login response:", response.data)
      
      localStorage.setItem("token", response.data.access)
      localStorage.setItem("refresh", response.data.refresh)
      
      await checkAuth()
      return response.data
    } catch (error) {
      console.error("Login error:", error.response?.data || error)
      throw error
    }
  }

  const register = async (username, email, password, password2) => {
    try {
      // CORRECTION : Utilisez le chemin relatif
      await api.post("/auth/register/", {
        username,
        email,
        password,
        password2,
      })
    } catch (error) {
      console.error("Register error:", error.response?.data || error)
      throw error
    }
  }

  const logout = () => {
    console.log("Logging out...")
    localStorage.removeItem("token")
    localStorage.removeItem("refresh")
    setUser(null)
    window.location.href = "/"
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      logout, 
      checkAuth 
    }}>
      {children}
    </AuthContext.Provider>
  )
}



