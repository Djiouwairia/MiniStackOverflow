"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import api from "../api/axios"

const UserProfile = () => {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUser()
  }, [id])

  const fetchUser = async () => {
    try {
      const response = await api.get(`/auth/users/${id}/`)
      setUser(response.data)
    } catch (error) {
      console.error("Error fetching user:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center py-8">Chargement...</div>
  if (!user) return <div className="text-center py-8">Utilisateur introuvable</div>

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-md border border-border">
        <h1 className="text-3xl font-bold text-text-primary mb-6">{user.username}</h1>

        <div className="space-y-4">
          {user.bio && (
            <div>
              <label className="text-text-secondary">Bio</label>
              <p className="text-lg">{user.bio}</p>
            </div>
          )}

          <div>
            <label className="text-text-secondary">RÃ©putation</label>
            <p className="text-2xl font-bold text-primary">{user.reputation}</p>
          </div>

          <div>
            <label className="text-text-secondary">Membre depuis</label>
            <p className="text-lg">{new Date(user.created_at).toLocaleDateString("fr-FR")}</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-surface p-4 rounded text-center">
              <p className="text-3xl font-bold text-primary">{user.questions_count}</p>
              <p className="text-text-secondary">Questions</p>
            </div>
            <div className="bg-surface p-4 rounded text-center">
              <p className="text-3xl font-bold text-secondary">{user.answers_count}</p>
              <p className="text-text-secondary">RÃ©ponses</p>
            </div>
            <div className="bg-surface p-4 rounded text-center">
              <p className="text-3xl font-bold text-success">{user.total_votes}</p>
              <p className="text-text-secondary">Votes reÃ§us</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile



