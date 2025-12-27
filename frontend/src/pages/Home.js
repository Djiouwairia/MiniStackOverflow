"use client"

import { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import api from "../api/axios"

const Home = () => {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState("recent")
  const { user } = useContext(AuthContext)

  useEffect(() => {
    fetchQuestions()
  }, [activeFilter])

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      let params = {}
      
      // Construire les paramètres
      switch(activeFilter) {
        case "popular":
          params.sort = "votes"
          break
        case "unanswered":
          params.unanswered = true
          break
        default:
          params.ordering = "-created_at"
      }
      
      console.log("📡 Requête API avec params:", params)
      const response = await api.get("/questions/", { params })
      
      // 🔥 CORRECTION CRITIQUE ICI :
      // L'API retourne {count, next, previous, results: [...]}
      const apiData = response.data
      console.log("📦 Structure réponse API:", apiData)
      console.log("🎯 Résultats (questions):", apiData.results)
      
      // Prenez les résultats, pas toute la réponse
      const questionsData = apiData.results || apiData
      setQuestions(Array.isArray(questionsData) ? questionsData : [])
      
      // DEBUG : Vérifiez la première question
      if (questionsData.length > 0) {
        console.log("✅ PREMIÈRE QUESTION:", questionsData[0])
        console.log("✅ vote_count:", questionsData[0].vote_count)
        console.log("✅ answer_count:", questionsData[0].answer_count)
        console.log("✅ has_accepted_answer:", questionsData[0].has_accepted_answer)
      }
      
    } catch (error) {
      console.error("❌ Erreur:", error.response || error)
      setQuestions([])
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (questionId, value) => {
    if (!user) {
      alert("Connectez-vous pour voter")
      return
    }
    
    try {
      console.log(`🗳️ Vote: question ${questionId}, valeur: ${value}`)
      await api.post(`/questions/${questionId}/vote/`, { value })
      // Recharger les questions après le vote
      fetchQuestions()
    } catch (error) {
      console.error("❌ Erreur de vote:", error.response?.data || error)
      alert(error.response?.data?.detail || "Erreur lors du vote")
    }
  }

  // RENDU SIMPLIFIÉ POUR TEST
  if (loading) {
    return <div className="text-center py-12">Chargement...</div>
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Toutes les questions</h1>
        <Link 
          to={user ? "/ask" : "/login"} 
          className="bg-blue-600 text-white px-5 py-2.5 rounded hover:bg-blue-700 font-medium"
        >
          Poser une question
        </Link>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setActiveFilter("recent")}
          className={`px-4 py-2 rounded ${activeFilter === "recent" ? "bg-blue-600 text-white" : "bg-white text-gray-800 border"}`}
        >
          Récentes
        </button>
        <button
          onClick={() => setActiveFilter("popular")}
          className={`px-4 py-2 rounded ${activeFilter === "popular" ? "bg-blue-600 text-white" : "bg-white text-gray-800 border"}`}
        >
          Populaires
        </button>
        <button
          onClick={() => setActiveFilter("unanswered")}
          className={`px-4 py-2 rounded ${activeFilter === "unanswered" ? "bg-blue-600 text-white" : "bg-white text-gray-800 border"}`}
        >
          Sans réponse
        </button>
      </div>

      {/* DEBUG VISUEL */}
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <strong>DEBUG:</strong> {questions.length} questions chargées | 
        Filtre: {activeFilter} | 
        User: {user ? user.username : "Non connecté"}
      </div>

      {/* Liste des questions - VERSION SIMPLIFIÉE POUR TEST */}
      <div className="space-y-6">
        {questions.map((question) => {
          console.log(`🎨 Rendu question ${question.id}:`, {
            vote_count: question.vote_count,
            answer_count: question.answer_count,
            has_accepted: question.has_accepted_answer
          })
          
          return (
            <div key={question.id} className="bg-white border rounded-lg p-6 shadow-sm">
              <div className="flex gap-6">
                {/* COLONNE GAUCHE: Stats et votes */}
                <div className="flex flex-col items-center min-w-[120px]">
                  {/* Vote count */}
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-gray-800">{question.vote_count}</div>
                    <div className="text-sm text-gray-600">votes</div>
                  </div>
                  
                  {/* Boutons de vote - TOUJOURS VISIBLES */}
                  <div className="flex flex-col items-center gap-2 mb-6">
                    <button
                      onClick={() => handleVote(question.id, 1)}
                      disabled={!user}
                      className={`text-3xl p-2 rounded-full ${user ? "text-gray-500 hover:text-green-600 hover:bg-green-50" : "text-gray-300 cursor-not-allowed"}`}
                      title={user ? "Voter positivement" : "Connectez-vous pour voter"}
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => handleVote(question.id, -1)}
                      disabled={!user}
                      className={`text-3xl p-2 rounded-full ${user ? "text-gray-500 hover:text-red-600 hover:bg-red-50" : "text-gray-300 cursor-not-allowed"}`}
                      title={user ? "Voter négativement" : "Connectez-vous pour voter"}
                    >
                      ▼
                    </button>
                  </div>
                  
                  {/* Réponses */}
                  <div className="text-center mb-4">
                    <div className={`text-2xl font-bold ${question.has_accepted_answer ? "text-green-600" : "text-gray-800"}`}>
                      {question.answer_count}
                    </div>
                    <div className="text-sm text-gray-600">réponses</div>
                  </div>
                  
                  {/* Vues */}
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-800">{question.views}</div>
                    <div className="text-sm text-gray-600">vues</div>
                  </div>
                </div>

                {/* COLONNE DROITE: Contenu */}
                <div className="flex-1">
                  <Link 
                    to={`/question/${question.id}`}
                    className="text-xl font-bold text-blue-600 hover:text-blue-800 block mb-3"
                  >
                    {question.title}
                  </Link>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {question.tags?.map((tag) => (
                      <span 
                        key={tag.id}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                  
                  {/* Métadonnées */}
                  <div className="flex justify-between items-center text-sm text-gray-600 mt-4 pt-4 border-t">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{question.author?.username}</span>
                        <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">
                          {question.author?.reputation || 0} réputation
                        </span>
                      </div>
                    </div>
                    <div className="text-gray-500">
                      posé le {new Date(question.created_at).toLocaleDateString("fr-FR", {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* DEBUG pour cette question */}
              <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                Question ID: {question.id} | 
                Vote count: {question.vote_count} | 
                Answer count: {question.answer_count} | 
                Has accepted: {question.has_accepted_answer ? 'Oui' : 'Non'}
              </div>
            </div>
          )
        })}
      </div>

      {/* Résumé */}
      <div className="mt-8 text-center text-gray-600">
        {questions.length} question{questions.length > 1 ? 's' : ''} affichée{questions.length > 1 ? 's' : ''}
      </div>
    </div>
  )
}

export default Home


