"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import api from "../api/axios"

const AdminAnswer = () => {
  const [questions, setQuestions] = useState([])
  const [filteredQuestions, setFilteredQuestions] = useState([])
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [answer, setAnswer] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("unanswered")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  // Vérifier si l'utilisateur est admin
  const isAdmin = user && (user.username === "admin" || user.is_staff)

  useEffect(() => {
    if (!isAdmin) {
      navigate("/")
      return
    }
    fetchQuestions()
  }, [isAdmin, navigate])

  useEffect(() => {
    filterQuestions()
  }, [questions, searchTerm, filter])

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      const response = await api.get("/questions/")
      const apiData = response.data
      const questionsData = apiData.results || apiData
      setQuestions(Array.isArray(questionsData) ? questionsData : [])
    } catch (error) {
      console.error("Erreur chargement questions:", error)
      setError("Erreur lors du chargement des questions")
    } finally {
      setLoading(false)
    }
  }

  const filterQuestions = () => {
    let filtered = [...questions]

    // Filtrer par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(q =>
        q?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q?.content?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtrer par type
    if (filter === "unanswered") {
      filtered = filtered.filter(q => (q?.answer_count || 0) === 0)
    } else if (filter === "recent") {
      filtered = filtered.sort((a, b) => 
        new Date(b?.created_at || 0) - new Date(a?.created_at || 0)
      )
    }

    setFilteredQuestions(filtered)
  }

  const handleSelectQuestion = (question) => {
    console.log("Question sélectionnée:", question)
    setSelectedQuestion(question)
    setAnswer("")
    setError("")
    setSuccess("")
  }

  const handleSubmitAnswer = async (e) => {
  e.preventDefault()
  
  if (!selectedQuestion) {
    setError("Veuillez sélectionner une question")
    return
  }
  
  if (!answer.trim()) {
    setError("Veuillez écrire une réponse")
    return
  }
  
  setSubmitting(true)
  setError("")
  
  try {
    console.log("📤 Tentative de publication de réponse...")
    console.log("Question ID:", selectedQuestion.id)
    console.log("Contenu réponse (50 premiers caractères):", answer.substring(0, 50))
    
    // Vérifier le token
    const token = localStorage.getItem("token")
    console.log("Token présent:", !!token)
    if (token) {
      console.log("Token (début):", token.substring(0, 20) + "...")
    }
    
    // Vérifier l'URL complète
    const apiUrl = `${api.defaults.baseURL}/questions/${selectedQuestion.id}/answers/`
    console.log("URL complète:", apiUrl)
    
    // Ajouter des logs des headers
    console.log("Headers de la requête:", {
      Authorization: `Bearer ${token ? 'PRESENT' : 'MISSING'}`,
      'Content-Type': 'application/json'
    })
    
    const response = await api.post(`/questions/${selectedQuestion.id}/answers/`, {
      content: answer
    })
    
    console.log("✅ Réponse publiée avec succès!")
    console.log("Réponse API:", response.data)
    
    setSuccess(`Réponse publiée avec succès à la question : "${selectedQuestion.title}"`)
    setAnswer("")
    setSelectedQuestion(null)
    
    fetchQuestions()
    
    setTimeout(() => setSuccess(""), 5000)
  } catch (error) {
    console.error("❌ ERREUR publication réponse")
    console.error("Type d'erreur:", error.name)
    console.error("Message:", error.message)
    console.error("Stack:", error.stack)
    
    if (error.response) {
      console.error("❌ Réponse d'erreur:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      })
      
      if (error.response.status === 401) {
        setError("ERREUR 401: Non autorisé. Votre token JWT est peut-être expiré. Déconnectez-vous et reconnectez-vous.")
      } else if (error.response.status === 403) {
        setError("ERREUR 403: Accès interdit. Vous n'avez pas la permission de répondre.")
      } else if (error.response.status === 404) {
        setError(`ERREUR 404: Endpoint non trouvé. Vérifiez que l'URL existe: /questions/${selectedQuestion.id}/answers/`)
      } else if (error.response.status === 400) {
        setError(`ERREUR 400: Mauvaise requête. Détails: ${JSON.stringify(error.response.data)}`)
      } else {
        setError(`Erreur ${error.response.status}: ${error.response.data?.detail || "Erreur serveur"}`)
      }
    } else if (error.request) {
      console.error("❌ Aucune réponse reçue:", error.request)
      setError("Aucune réponse du serveur. Vérifiez que votre backend Django fonctionne sur localhost:8000")
    } else {
      console.error("❌ Erreur de configuration:", error.message)
      setError(`Erreur: ${error.message}`)
    }
  } finally {
    setSubmitting(false)
  }
}
  // Si pas admin, rediriger
  if (!isAdmin) {
    return null
  }

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-text-secondary">Chargement des questions...</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* En-tête admin */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-800">📝 Interface Admin - Répondre aux questions</h1>
            <p className="text-blue-600 mt-1">
              Connecté en tant qu'administrateur : <span className="font-bold">{user?.username}</span>
            </p>
          </div>
          <div className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            Mode Admin
          </div>
        </div>
      </div>

      {/* Messages d'alerte */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          ❌ {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          ✅ {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Colonne gauche : Liste des questions */}
        <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-text-primary">
              Questions ({filteredQuestions.length})
            </h2>
            
            <div className="text-sm text-text-secondary">
              Total : {questions.length} questions
            </div>
          </div>

          {/* Filtres et recherche */}
          <div className="space-y-4 mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Rechercher une question..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter("unanswered")}
                className={`px-3 py-1.5 rounded text-sm ${
                  filter === "unanswered" 
                    ? "bg-primary text-white" 
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                Sans réponse ({questions.filter(q => (q?.answer_count || 0) === 0).length})
              </button>
              <button
                onClick={() => setFilter("recent")}
                className={`px-3 py-1.5 rounded text-sm ${
                  filter === "recent" 
                    ? "bg-primary text-white" 
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                Récentes
              </button>
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1.5 rounded text-sm ${
                  filter === "all" 
                    ? "bg-primary text-white" 
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                Toutes
              </button>
            </div>
          </div>

          {/* Liste des questions */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {filteredQuestions.length === 0 ? (
              <div className="text-center py-8 text-text-secondary">
                Aucune question trouvée
              </div>
            ) : (
              filteredQuestions.map((question) => (
                <div
                  key={question.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedQuestion?.id === question.id
                      ? "border-primary bg-blue-50"
                      : "border-border hover:border-primary"
                  }`}
                  onClick={() => handleSelectQuestion(question)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-text-primary mb-1 line-clamp-2">
                        {question.title || 'Sans titre'}
                      </h3>
                      
                      <div className="flex items-center gap-4 text-sm text-text-secondary">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{question.author?.username || 'Anonyme'}</span>
                          <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                            {question.author?.reputation || 0}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <span className="font-bold">{question.answer_count || 0}</span>
                            <span>réponses</span>
                          </span>
                          
                          <span className="flex items-center gap-1">
                            <span className="font-bold">{question.vote_count || 0}</span>
                            <span>votes</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center ml-4">
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        (question.answer_count || 0) === 0
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}>
                        {(question.answer_count || 0) === 0 ? "Sans réponse" : "Répondu"}
                      </div>
                      <div className="text-xs text-text-secondary mt-1">
                        {question.created_at 
                          ? new Date(question.created_at).toLocaleDateString("fr-FR")
                          : 'Date inconnue'
                        }
                      </div>
                    </div>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {question.tags?.slice(0, 3).map((tag) => (
                      <span
                        key={tag.id}
                        className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded"
                      >
                        {tag.name}
                      </span>
                    ))}
                    {question.tags && question.tags.length > 3 && (
                      <span className="text-xs text-text-secondary">
                        +{question.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Colonne droite : Formulaire de réponse */}
        <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-bold text-text-primary mb-6">
            {selectedQuestion 
              ? `Répondre à : "${selectedQuestion.title || 'Sans titre'}"` 
              : "Sélectionnez une question"
            }
          </h2>

          {selectedQuestion ? (
            <>
              {/* Aperçu de la question - VERSION SÉCURISÉE */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                <h3 className="font-bold text-text-primary mb-2">Question sélectionnée :</h3>
                
                {/* Protection contre content undefined */}
                <p className="text-text-primary mb-3">
                  {selectedQuestion.content 
                    ? `${selectedQuestion.content.substring(0, 200)}${selectedQuestion.content.length > 200 ? '...' : ''}`
                    : 'Aucun contenu disponible'
                  }
                </p>
                
                <div className="flex items-center justify-between text-sm text-text-secondary">
                  <div>
                    Par <span className="font-medium">
                      {selectedQuestion.author?.username || 'Utilisateur inconnu'}
                    </span>
                    {selectedQuestion.author && (
                      <span className="ml-2 text-xs bg-gray-200 px-2 py-0.5 rounded">
                        {selectedQuestion.author.reputation || 0} réputation
                      </span>
                    )}
                  </div>
                  <div>
                    {selectedQuestion.answer_count || 0} réponse{(selectedQuestion.answer_count || 0) !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              {/* Formulaire de réponse */}
              <form onSubmit={handleSubmitAnswer}>
                <div className="mb-6">
                  <label className="block text-text-primary font-medium mb-2">
                    Votre réponse (Markdown supporté) :
                  </label>
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder={`Écrivez votre réponse à "${selectedQuestion.title}"...`}
                    rows="10"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                    disabled={submitting}
                  />
                  
                  <div className="text-sm text-text-secondary mt-2">
                    💡 En tant qu'admin, soyez précis et professionnel dans vos réponses.
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setSelectedQuestion(null)}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-gray-700"
                    disabled={submitting}
                  >
                    ← Changer de question
                  </button>
                  
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setAnswer("")}
                      className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-gray-700"
                      disabled={submitting || !answer.trim()}
                    >
                      Effacer
                    </button>
                    
                    <button
                      type="submit"
                      disabled={submitting || !answer.trim()}
                      className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                          Publication...
                        </>
                      ) : (
                        "Publier la réponse"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center py-12 text-text-secondary">
              <div className="text-4xl mb-4">👆</div>
              <p className="text-lg mb-2">Sélectionnez une question à gauche</p>
              <p className="text-sm">Choisissez une question dans la liste pour y répondre</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminAnswer



