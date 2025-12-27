"use client"

import { useState, useContext } from "react"
import { useNavigate, Link } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  })
  const [error, setError] = useState("")
  const { register } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.password2) {
      setError("Les mots de passe ne correspondent pas")
      return
    }

    try {
      await register(formData.username, formData.email, formData.password, formData.password2)
      navigate("/login")
    } catch (err) {
      setError(err.response?.data?.username?.[0] || "Erreur lors de l'inscription")
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="bg-white p-8 rounded-lg shadow-md border border-border">
        <h2 className="text-2xl font-bold text-text-primary mb-6">Inscription</h2>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-text-primary font-medium mb-2">Nom d'utilisateur</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-text-primary font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-text-primary font-medium mb-2">Mot de passe</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-text-primary font-medium mb-2">Confirmer le mot de passe</label>
            <input
              type="password"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <button type="submit" className="w-full bg-primary text-white py-2 rounded hover:bg-blue-700 font-medium">
            S'inscrire
          </button>
        </form>

        <p className="mt-4 text-center text-text-secondary">
          Déjà un compte?{" "}
          <Link to="/login" className="text-primary hover:text-blue-700">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register


