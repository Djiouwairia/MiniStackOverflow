"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import ReactMarkdown from "react-markdown"
import { AuthContext } from "../context/AuthContext"
import api from "../api/axios"

const QuestionDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const [question, setQuestion] = useState(null)
  const [newAnswer, setNewAnswer] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    fetchQuestion()
  }, [id])

  const fetchQuestion = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/questions/${id}/`)
      console.log("Question dÃ©tail:", response.data)
      setQuestion(response.data)
    } catch (error) {
      console.error("Erreur chargement question:", error.response || error)
      setError("Question introuvable")
    } finally {
      setLoading(false)
    }
  }

  // Voter sur une question
  const handleQuestionVote = async (value) => {
    if (!user) {
      alert("Connectez-vous pour voter")
      navigate("/login")
      return
    }
    
    try {
      await api.post(`/questions/${id}/vote/`, { value })
      fetchQuestion() // Recharger
    } catch (error) {
      console.error("Erreur vote:", error.response?.data || error)
      alert(error.response?.data?.detail || "Erreur lors du vote")
    }
  }

  // Voter sur une rÃ©ponse
  const handleAnswerVote = async (answerId, value) => {
    if (!user) {
      alert("Connectez-vous pour voter")
      navigate("/login")
      return
    }
    
    try {
      await api.post(`/answers/${answerId}/vote/`, { value })
      fetchQuestion() // Recharger
    } catch (error) {
      console.error("Erreur vote rÃ©ponse:", error.response?.data || error)
      alert(error.response?.data?.detail || "Erreur lors du vote")
    }
  }

  // Accepter une rÃ©ponse (seul l'auteur de la question peut)
  const handleAcceptAnswer = async (answerId) => {
    if (!user) return
    
    try {
      await api.post(`/answers/${answerId}/accept/`)
      setSuccess("RÃ©ponse acceptÃ©e comme meilleure rÃ©ponse !")
      fetchQuestion() // Recharger
      
      // Cacher le message aprÃ¨s 3 secondes
      setTimeout(() => setSuccess(""), 3000)
    } catch (error) {
      console.error("Erreur acceptation rÃ©ponse:", error.response?.data || error)
      setError(error.response?.data?.detail || "Erreur lors de l'acceptation")
    }
  }

  // Soumettre une nouvelle rÃ©ponse
  const handleSubmitAnswer = async (e) => {
    e.preventDefault()
    
    if (!user) {
      alert("Connectez-vous pour rÃ©pondre")
      navigate("/login")
      return
    }
    
    if (!newAnswer.trim()) {
      setError("Veuillez Ã©crire une rÃ©ponse")
      return
    }
    
    setSubmitting(true)
    setError("")
    
    try {
      await api.post(`/questions/${id}/answers/`, {
        content: newAnswer
      })
      
      setNewAnswer("") // Vider le champ
      setSuccess("Votre rÃ©ponse a Ã©tÃ© publiÃ©e avec succÃ¨s !")
      fetchQuestion() // Recharger la question
      
      // Cacher le message aprÃ¨s 3 secondes
      setTimeout(() => setSuccess(""), 3000)
    } catch (error) {
      console.error("Erreur publication rÃ©ponse:", error.response?.data || error)
      setError(error.response?.data?.detail || "Erreur lors de la publication")
    } finally {
      setSubmitting(false)
    }
  }

  // Supprimer une rÃ©ponse (seul l'auteur ou admin peut)
  const handleDeleteAnswer = async (answerId) => {
    if (!user) return
    
    if (!window.confirm("ÃŠtes-vous sÃ»r de vouloir supprimer cette rÃ©ponse ?")) {
      return
    }
    
    try {
      await api.delete(`/answers/${answerId}/`)
      setSuccess("RÃ©ponse supprimÃ©e avec succÃ¨s !")
      fetchQuestion() // Recharger
      
      setTimeout(() => setSuccess(""), 3000)
    } catch (error) {
      console.error("Erreur suppression rÃ©ponse:", error.response?.data || error)
      setError(error.response?.data?.detail || "Erreur lors de la suppression")
    }
  }

  // Ã‰diter une rÃ©ponse (seul l'auteur peut)
  const handleEditAnswer = (answerId, currentContent) => {
    const newContent = prompt("Modifiez votre rÃ©ponse :", currentContent)
    if (newContent !== null && newContent !== currentContent) {
      updateAnswer(answerId, newContent)
    }
  }

  const updateAnswer = async (answerId, content) => {
    try {
      await api.put(`/answers/${answerId}/`, { content })
      setSuccess("RÃ©ponse modifiÃ©e avec succÃ¨s !")
      fetchQuestion()
      
      setTimeout(() => setSuccess(""), 3000)
    } catch (error) {
      console.error("Erreur modification rÃ©ponse:", error.response?.data || error)
      setError(error.response?.data?.detail || "Erreur lors de la modification")
    }
  }

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-text-secondary">Chargement de la question...</p>
      </div>
    )
  }

  if (!question) {
    return (
      <div className="max-w-4xl mx-auto px-4 text-center py-16">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Question introuvable</h2>
        <Link to="/" className="text-primary hover:text-blue-700">
          Retour Ã  la liste des questions
        </Link>
      </div>
    )
  }

  // VÃ©rifier si l'utilisateur est l'auteur de la question
  const isQuestionAuthor = user && user.id === question.author.id
  // VÃ©rifier si l'utilisateur est admin
  const isAdmin = user && user.username === "admin"

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Messages d'alerte */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          {success}
        </div>
      )}

      {/* Question principale */}
      <div className="bg-white border border-border rounded-lg p-6 mb-8 shadow-sm">
        <div className="flex gap-6">
          {/* Colonne gauche : Votes */}
          <div className="flex flex-col items-center min-w-[80px]">
            <button
              onClick={() => handleQuestionVote(1)}
              disabled={!user}
              className={`text-3xl p-2 ${user ? "text-gray-500 hover:text-green-600" : "text-gray-300 cursor-not-allowed"}`}
              title={user ? "Voter positivement" : "Connectez-vous pour voter"}
            >
              â–²
            </button>
            
            <div className="text-3xl font-bold my-2">{question.vote_count || 0}</div>
            
            <button
              onClick={() => handleQuestionVote(-1)}
              disabled={!user}
              className={`text-3xl p-2 ${user ? "text-gray-500 hover:text-red-600" : "text-gray-300 cursor-not-allowed"}`}
              title={user ? "Voter nÃ©gativement" : "Connectez-vous pour voter"}
            >
              â–¼
            </button>
            
            <div className="mt-4 text-center">
              <div className="text-lg font-bold">{question.views || 0}</div>
              <div className="text-sm text-text-secondary">vues</div>
            </div>
          </div>

          {/* Colonne droite : Contenu */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-text-primary mb-4">{question.title}</h1>
            
            <div className="flex items-center gap-4 text-sm text-text-secondary mb-6">
              <div>
                PosÃ© par{" "}
                <Link to={`/user/${question.author.id}`} className="text-primary font-medium">
                  {question.author.username}
                </Link>
              </div>
              <div>â€¢</div>
              <div>
                {new Date(question.created_at).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </div>
              {question.updated_at !== question.created_at && (
                <>
                  <div>â€¢</div>
                  <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                    modifiÃ©
                  </div>
                </>
              )}
            </div>

            {/* Contenu de la question */}
            <div className="prose max-w-none mb-6 text-text-primary">
              <ReactMarkdown>
  {content}
</ReactMarkdown>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {question.tags.map((tag) => (
                <Link
                  key={tag.id}
                  to={`/?tag=${tag.name}`}
                  className="bg-blue-50 text-primary px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-100"
                >
                  {tag.name}
                </Link>
              ))}
            </div>

            {/* Actions de la question (Ã©diter/supprimer - pour l'auteur) */}
            {isQuestionAuthor && (
              <div className="flex gap-3 pt-4 border-t border-border">
                <button
                  onClick={() => navigate(`/question/${id}/edit`)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  âœï¸ Modifier la question
                </button>
                <button
                  onClick={() => {
                    if (window.confirm("Supprimer cette question ?")) {
                      // ImplÃ©mentez la suppression
                    }
                  }}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  ðŸ—‘ï¸ Supprimer
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section des rÃ©ponses */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text-primary">
            {question.answer_count || 0} RÃ©ponse{question.answer_count !== 1 ? "s" : ""}
          </h2>
          
          {/* Filtres de rÃ©ponses */}
          <div className="flex gap-2">
            <button className="text-sm px-3 py-1 border rounded hover:bg-gray-50">
              Les plus rÃ©centes
            </button>
            <button className="text-sm px-3 py-1 border rounded hover:bg-gray-50">
              Les plus votÃ©es
            </button>
          </div>
        </div>

        {/* Liste des rÃ©ponses */}
        {question.answers && question.answers.length > 0 ? (
          <div className="space-y-6">
            {question.answers.map((answer) => {
              const isAnswerAuthor = user && user.id === answer.author.id
              const canAccept = isQuestionAuthor && !answer.is_accepted
              const canEditOrDelete = isAnswerAuthor || isAdmin

              return (
                <div
                  key={answer.id}
                  className={`bg-white border-2 rounded-lg p-6 ${
                    answer.is_accepted
                      ? "border-green-500 bg-green-50"
                      : "border-border"
                  }`}
                >
                  <div className="flex gap-6">
                    {/* Colonne gauche : Votes rÃ©ponse */}
                    <div className="flex flex-col items-center min-w-[80px]">
                      <button
                        onClick={() => handleAnswerVote(answer.id, 1)}
                        disabled={!user}
                        className={`text-2xl p-1 ${
                          user ? "text-gray-500 hover:text-green-600" : "text-gray-300 cursor-not-allowed"
                        }`}
                      >
                        â–²
                      </button>
                      
                      <div className={`text-2xl font-bold my-2 ${
                        answer.vote_count > 0 ? "text-green-600" : 
                        answer.vote_count < 0 ? "text-red-600" : "text-gray-800"
                      }`}>
                        {answer.vote_count || 0}
                      </div>
                      
                      <button
                        onClick={() => handleAnswerVote(answer.id, -1)}
                        disabled={!user}
                        className={`text-2xl p-1 ${
                          user ? "text-gray-500 hover:text-red-600" : "text-gray-300 cursor-not-allowed"
                        }`}
                      >
                        â–¼
                      </button>
                      
                      {/* Bouton accepter la rÃ©ponse (pour l'auteur de la question) */}
                      {canAccept && (
                        <button
                          onClick={() => handleAcceptAnswer(answer.id)}
                          className="mt-4 text-green-600 hover:text-green-800 text-lg"
                          title="Accepter comme meilleure rÃ©ponse"
                        >
                          âœ“
                        </button>
                      )}
                      
                      {/* Badge meilleure rÃ©ponse */}
                      {answer.is_accepted && (
                        <div className="mt-4">
                          <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
                            âœ“ MEILLEURE RÃ‰PONSE
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Colonne droite : Contenu de la rÃ©ponse */}
                    <div className="flex-1">
                      {/* Contenu */}
                      <div className="prose max-w-none mb-4">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {answer.content}
                        </ReactMarkdown>
                      </div>

                      {/* MÃ©tadonnÃ©es et actions */}
                      <div className="flex justify-between items-center pt-4 border-t border-border">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/user/${answer.author.id}`}
                              className="text-primary font-medium"
                            >
                              {answer.author.username}
                            </Link>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {answer.author.reputation || 0} rÃ©putation
                            </span>
                          </div>
                          <span className="text-text-secondary text-sm">
                            â€¢ RÃ©pondu le{" "}
                            {new Date(answer.created_at).toLocaleDateString("fr-FR")}
                          </span>
                        </div>

                        {/* Actions sur la rÃ©ponse (Ã©diter/supprimer) */}
                        {canEditOrDelete && (
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleEditAnswer(answer.id, answer.content)}
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              âœï¸ Modifier
                            </button>
                            <button
                              onClick={() => handleDeleteAnswer(answer.id)}
                              className="text-sm text-red-600 hover:text-red-800"
                            >
                              ðŸ—‘ï¸ Supprimer
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-gray-50 border border-border rounded-lg p-8 text-center">
            <div className="text-4xl mb-4">ðŸ¤”</div>
            <h3 className="text-xl font-medium text-text-primary mb-2">
              Aucune rÃ©ponse pour l'instant
            </h3>
            <p className="text-text-secondary">
              Soyez le premier Ã  rÃ©pondre Ã  cette question !
            </p>
          </div>
        )}
      </div>

      {/* Formulaire pour rÃ©pondre */}
      <div className="bg-white border border-border rounded-lg p-6">
        <h3 className="text-xl font-bold text-text-primary mb-4">
          {user ? "Votre rÃ©ponse" : "Connectez-vous pour rÃ©pondre"}
        </h3>
        
        {user ? (
          <form onSubmit={handleSubmitAnswer}>
            <div className="mb-4">
              <textarea
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="Ã‰crivez votre rÃ©ponse ici... Vous pouvez utiliser Markdown pour formater votre texte."
                rows="8"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={submitting}
              />
              <div className="text-sm text-text-secondary mt-2">
                ðŸ’¡ Conseil: Soyez clair et prÃ©cis. Utilisez des exemples de code si nÃ©cessaire.
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-text-secondary">
                ConnectÃ© en tant que <span className="font-medium">{user.username}</span>
              </div>
              
              <button
                type="submit"
                disabled={submitting || !newAnswer.trim()}
                className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    Publication...
                  </>
                ) : (
                  "Publier la rÃ©ponse"
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6">
            <p className="text-text-secondary mb-4">
              Vous devez Ãªtre connectÃ© pour rÃ©pondre Ã  cette question.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/login"
                className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-blue-700"
              >
                Se connecter
              </Link>
              <Link
                to="/register"
                className="bg-gray-200 text-gray-800 px-6 py-2.5 rounded-lg hover:bg-gray-300"
              >
                S'inscrire
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Aide Markdown */}
      {user && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
          <h4 className="font-bold text-blue-800 mb-2">Aide Markdown :</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <code className="bg-white px-2 py-1 rounded border">**gras**</code>
            <code className="bg-white px-2 py-1 rounded border">*italique*</code>
            <code className="bg-white px-2 py-1 rounded border">```code```</code>
            <code className="bg-white px-2 py-1 rounded border">[lien](url)</code>
          </div>
        </div>
      )}
    </div>
  )
}

export default QuestionDetail



