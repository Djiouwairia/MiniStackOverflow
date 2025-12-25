"use client"

import { useState, useContext } from "react"
import { useNavigate, Link } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      await login(username, password)
      navigate("/")
    } catch (err) {
      setError("Identifiants incorrects")
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="bg-white p-8 rounded-lg shadow-md border border-border">
        <h2 className="text-2xl font-bold text-text-primary mb-6">Connexion</h2>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-text-primary font-medium mb-2">Nom d'utilisateur</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-text-primary font-medium mb-2">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <button type="submit" className="w-full bg-primary text-white py-2 rounded hover:bg-blue-700 font-medium">
            Se connecter
          </button>
        </form>

        <p className="mt-4 text-center text-text-secondary">
          Pas encore de compte?{" "}
          <Link to="/register" className="text-primary hover:text-blue-700">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
