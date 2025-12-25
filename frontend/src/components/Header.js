"use client"

import { useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

const Header = () => {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <header className="bg-background border-b-2 border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">Mini Stack</span>
            <span className="text-2xl font-bold text-secondary">Overflow</span>
          </Link>

          <nav className="flex items-center space-x-4">
            <Link to="/" className="text-text-primary hover:text-primary px-3 py-2 rounded">
              Questions
            </Link>

            {user ? (
              <>
                <Link to="/ask" className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700">
                  Poser une question
                </Link>
                <Link to="/profile" className="text-text-primary hover:text-primary px-3 py-2">
                  {user.username}
                </Link>
                <button onClick={handleLogout} className="text-text-secondary hover:text-text-primary px-3 py-2">
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-primary hover:text-blue-700 px-3 py-2">
                  Connexion
                </Link>
                <Link to="/register" className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700">
                  Inscription
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
