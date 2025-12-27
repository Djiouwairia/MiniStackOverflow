"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import api from "../api/axios"

const UserAnswers = () => {
  const { userId } = useParams()
  const [answers, setAnswers] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetchUserAnswers()
    fetchUserInfo()
  }, [userId])

  const fetchUserAnswers = async () => {
    try {
      // Si votre backend a l'endpoint
      const response = await api.get(`/users/${userId}/answers/`)
      setAnswers(response.data.results || response.data)
    } catch (error) {
      console.error("Erreur chargement réponses:", error)
      setAnswers([])
    } finally {
      setLoading(false)
    }
  }

  const fetchUserInfo = async () => {
    try {
      const response = await api.get(`/auth/users/${userId}/`)
      setUser(response.data)
    } catch (error) {
      console.error("Erreur chargement utilisateur:", error)
    }
  }

  if (loading) return <div className="text-center py-12">Chargement...</div>

  return (
    <div className="max-w-4xl mx-auto px-4">
      {user && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-border mb-6">
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Réponses de {user.username}
          </h1>
          <div className="flex items-center gap-4 text-text-secondary">
            <span>Réputation: {user.reputation}</span>
            <span>•</span>
            <span>{user.answers_count} réponse{user.answers_count > 1 ? 's' : ''}</span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {answers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <p className="text-text-secondary text-lg">
              {user ? `${user.username} n'a pas encore répondu à des questions` : "Aucune réponse trouvée"}
            </p>
          </div>
        ) : (
          answers.map((answer) => (
            <div key={answer.id} className="bg-white border rounded-lg p-6">
              <div className="mb-4">
                <Link 
                  to={`/question/${answer.question}`}
                  className="text-lg font-semibold text-primary hover:text-blue-700"
                >
                  Voir la question
                </Link>
              </div>
              
              <div className="prose max-w-none mb-4">
                <p className="text-text-primary">{answer.content.substring(0, 300)}...</p>
              </div>
              
              <div className="flex justify-between items-center text-sm text-text-secondary">
                <div className="flex items-center gap-2">
                  <span>Votes: {answer.vote_count}</span>
                  {answer.is_accepted && (
                    <span className="bg-success text-white px-2 py-1 rounded text-xs">
                      ✓ Meilleure réponse
                    </span>
                  )}
                </div>
                <span>
                  Répondu le {new Date(answer.created_at).toLocaleDateString("fr-FR")}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default UserAnswers
