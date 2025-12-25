"use client"

import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { Navigate } from "react-router-dom"

const Profile = () => {
  const { user, loading } = useContext(AuthContext)

  if (loading) return <div className="text-center py-8">Chargement...</div>
  if (!user) return <Navigate to="/login" />

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-md border border-border">
        <h1 className="text-3xl font-bold text-text-primary mb-6">Mon profil</h1>

        <div className="space-y-4">
          <div>
            <label className="text-text-secondary">Nom d'utilisateur</label>
            <p className="text-xl font-medium">{user.username}</p>
          </div>

          <div>
            <label className="text-text-secondary">Email</label>
            <p className="text-xl">{user.email}</p>
          </div>

          <div>
            <label className="text-text-secondary">Réputation</label>
            <p className="text-xl font-bold text-primary">{user.reputation}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-surface p-4 rounded">
              <p className="text-2xl font-bold text-primary">{user.questions_count}</p>
              <p className="text-text-secondary">Questions posées</p>
            </div>
            <div className="bg-surface p-4 rounded">
              <p className="text-2xl font-bold text-secondary">{user.answers_count}</p>
              <p className="text-text-secondary">Réponses données</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
