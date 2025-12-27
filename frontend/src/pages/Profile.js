"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { Link, Navigate } from "react-router-dom"  // AJOUTEZ Navigate ici
import api from "../api/axios"

const Profile = () => {
  const { user, loading } = useContext(AuthContext)
  const [userAnswers, setUserAnswers] = useState([])
  const [answersLoading, setAnswersLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("questions") // "questions" ou "answers"

  useEffect(() => {
    if (user) {
      fetchUserAnswers()
    }
  }, [user])

  const fetchUserAnswers = async () => {
    if (!user) return
    
    try {
      setAnswersLoading(true)
      // RÃ©cupÃ©rer toutes les rÃ©ponses de l'utilisateur
      const response = await api.get(`/questions/?author=${user.id}&include_answers=true`)
      // Ou implÃ©mentez un endpoint spÃ©cifique dans votre backend
      console.log("RÃ©ponses utilisateur:", response.data)
      
      // Si votre backend n'a pas cet endpoint, on peut filtrer cÃ´tÃ© frontend
      // Pour l'instant, on va juste afficher un message
      setUserAnswers([])
    } catch (error) {
      console.error("Erreur chargement rÃ©ponses:", error)
    } finally {
      setAnswersLoading(false)
    }
  }

  if (loading) return <div className="text-center py-8">Chargement...</div>
  if (!user) return <Navigate to="/login" />

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* En-tÃªte du profil */}
      <div className="bg-white p-8 rounded-lg shadow-md border border-border mb-6">
        <h1 className="text-3xl font-bold text-text-primary mb-6">Mon profil</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="space-y-4">
            <div>
              <label className="text-text-secondary block mb-1">Nom d'utilisateur</label>
              <p className="text-xl font-medium">{user.username}</p>
            </div>
            
            <div>
              <label className="text-text-secondary block mb-1">Email</label>
              <p className="text-xl">{user.email}</p>
            </div>
            
            <div>
              <label className="text-text-secondary block mb-1">Membre depuis</label>
              <p className="text-lg">
                {new Date(user.created_at).toLocaleDateString("fr-FR", {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-surface p-4 rounded text-center">
                <p className="text-3xl font-bold text-primary">{user.reputation}</p>
                <p className="text-text-secondary">RÃ©putation</p>
              </div>
              <div className="bg-surface p-4 rounded text-center">
                <p className="text-3xl font-bold text-primary">{user.questions_count || 0}</p>
                <p className="text-text-secondary">Questions</p>
              </div>
              <div className="bg-surface p-4 rounded text-center">
                <p className="text-3xl font-bold text-secondary">{user.answers_count || 0}</p>
                <p className="text-text-secondary">RÃ©ponses</p>
              </div>
            </div>
            
            {user.bio && (
              <div className="mt-6">
                <label className="text-text-secondary block mb-2">Bio</label>
                <p className="text-lg bg-gray-50 p-4 rounded">{user.bio}</p>
              </div>
            )}
          </div>
        </div>

        {/* Onglets pour questions/rÃ©ponses */}
        <div className="border-b border-border mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab("questions")}
              className={`pb-3 px-1 font-medium ${activeTab === "questions" ? "text-primary border-b-2 border-primary" : "text-text-secondary"}`}
            >
              Mes Questions ({user.questions_count || 0})
            </button>
            <button
              onClick={() => setActiveTab("answers")}
              className={`pb-3 px-1 font-medium ${activeTab === "answers" ? "text-primary border-b-2 border-primary" : "text-text-secondary"}`}
            >
              Mes RÃ©ponses ({user.answers_count || 0})
            </button>
          </div>
        </div>

        {/* Contenu des onglets */}
        {activeTab === "questions" ? (
          <div>
            <h3 className="text-xl font-bold text-text-primary mb-4">Mes questions</h3>
            {user.questions_count === 0 ? (
              <div className="text-center py-8 bg-surface rounded">
                <p className="text-text-secondary">Vous n'avez pas encore posÃ© de questions</p>
                <Link to="/ask" className="text-primary hover:text-blue-700 mt-2 inline-block">
                  Poser ma premiÃ¨re question
                </Link>
              </div>
            ) : (
              <p className="text-text-secondary">
                Vos questions apparaissent sur la page d'accueil. Cliquez dessus pour voir les rÃ©ponses.
              </p>
            )}
          </div>
        ) : (
          <div>
            <h3 className="text-xl font-bold text-text-primary mb-4">Mes rÃ©ponses</h3>
            {answersLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-2 text-text-secondary">Chargement des rÃ©ponses...</p>
              </div>
            ) : user.answers_count === 0 ? (
              <div className="text-center py-8 bg-surface rounded">
                <p className="text-text-secondary">Vous n'avez pas encore rÃ©pondu Ã  des questions</p>
                <p className="text-sm text-text-secondary mt-2">
                  Parcourez les questions sur la page d'accueil pour aider d'autres utilisateurs
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-text-secondary">
                  Vous avez donnÃ© {user.answers_count} rÃ©ponse{user.answers_count > 1 ? 's' : ''}.
                </p>
                {/* Ici vous pourriez lister les rÃ©ponses si votre backend le permet */}
                <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                  <p className="text-yellow-800">
                    âš ï¸ Pour afficher la liste dÃ©taillÃ©e de vos rÃ©ponses, 
                    votre backend doit implÃ©menter un endpoint comme <code>/api/users/{user.id}/answers/</code>
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Section actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link 
          to="/ask" 
          className="bg-primary text-white p-4 rounded-lg text-center hover:bg-blue-700 transition-colors"
        >
          <div className="text-2xl mb-2">âœï¸</div>
          <div className="font-bold">Poser une question</div>
        </Link>
        
        <Link 
          to="/" 
          className="bg-secondary text-white p-4 rounded-lg text-center hover:bg-orange-600 transition-colors"
        >
          <div className="text-2xl mb-2">ðŸ”</div>
          <div className="font-bold">Parcourir les questions</div>
        </Link>
        
        <div 
          className="bg-success text-white p-4 rounded-lg text-center cursor-pointer hover:bg-green-600 transition-colors"
          onClick={() => alert("FonctionnalitÃ© Ã  venir: Notifications")}
        >
          <div className="text-2xl mb-2">ðŸ””</div>
          <div className="font-bold">Mes notifications</div>
        </div>
      </div>
    </div>
  )
}

export default Profile



