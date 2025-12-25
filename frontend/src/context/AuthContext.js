"use client"

import { createContext, useState, useEffect } from "react"
import axios from "axios"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const response = await axios.get("http://localhost:8000/api/auth/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUser(response.data)
      } catch (error) {
        localStorage.removeItem("token")
        localStorage.removeItem("refresh")
      }
    }
    setLoading(false)
  }

  const login = async (username, password) => {
    const response = await axios.post("http://localhost:8000/api/auth/login/", {
      username,
      password,
    })
    localStorage.setItem("token", response.data.access)
    localStorage.setItem("refresh", response.data.refresh)
    await checkAuth()
  }

  const register = async (username, email, password, password2) => {
    await axios.post("http://localhost:8000/api/auth/register/", {
      username,
      email,
      password,
      password2,
    })
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("refresh")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}
