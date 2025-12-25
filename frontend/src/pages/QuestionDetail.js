"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, Link } from "react-router-dom"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { AuthContext } from "../context/AuthContext"
import api from "../api/axios"

const QuestionDetail = () => {
  const { id } = useParams()
  const { user } = useContext(AuthContext)
  const [question, setQuestion] = useState(null)
  const [answer, setAnswer] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuestion()
  }, [id])

  const fetchQuestion = async () => {
    try {
      const response = await api.get(`/questions/${id}/`)
      setQuestion(response.data)
    } catch (error) {
      console.error("Error fetching question:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (type, itemType, itemId) => {
    if (!user) return

    const value = type === "up" ? 1 : -1
    try {
      await api.post(`/${itemType}s/${itemId}/vote/`, { value })
      fetchQuestion()
    } catch (error) {
      console.error("Error voting:", error)
    }
  }

  const handleSubmitAnswer = async (e) => {
    e.preventDefault()
    if (!user) return

    try {
      await api.post(`/questions/${id}/answers/`, { content: answer })
      setAnswer("")
      fetchQuestion()
    } catch (error) {
      console.error("Error submitting answer:", error)
    }
  }

  const handleAcceptAnswer = async (answerId) => {
    try {
      await api.post(`/answers/${answerId}/accept/`)
      fetchQuestion()
    } catch (error) {
      console.error("Error accepting answer:", error)
    }
  }

  if (loading) return <div className="text-center py-8">Chargement...</div>
  if (!question) return <div className="text-center py-8">Question introuvable</div>

  return (
    <div className="max-w-4xl mx-auto">
      {/* Question */}
      <div className="bg-white border border-border rounded p-6 mb-4">
        <h1 className="text-3xl font-bold text-text-primary mb-4">{question.title}</h1>

        <div className="flex items-center space-x-4 text-sm text-text-secondary mb-6">
          <span>
            Par{" "}
            <Link to={`/user/${question.author.id}`} className="text-primary">
              {question.author.username}
            </Link>
          </span>
          <span>{new Date(question.created_at).toLocaleDateString("fr-FR")}</span>
          <span>{question.views} vues</span>
        </div>

        <div className="flex space-x-4">
          <div className="flex flex-col items-center space-y-2">
            <button
              onClick={() => handleVote("up", "question", question.id)}
              className="text-text-secondary hover:text-secondary text-2xl"
              disabled={!user}
            >
              ▲
            </button>
            <span className="text-2xl font-bold">{question.vote_count}</span>
            <button
              onClick={() => handleVote("down", "question", question.id)}
              className="text-text-secondary hover:text-secondary text-2xl"
              disabled={!user}
            >
              ▼
            </button>
          </div>

          <div className="flex-1">
            <div className="prose max-w-none mb-4">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{question.content}</ReactMarkdown>
            </div>

            <div className="flex flex-wrap gap-2">
              {question.tags.map((tag) => (
                <span key={tag.id} className="bg-blue-50 text-primary px-2 py-1 rounded text-sm">
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Answers */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          {question.answer_count} Réponse{question.answer_count > 1 ? "s" : ""}
        </h2>

        {question.answers.map((ans) => (
          <div
            key={ans.id}
            className={`bg-white border-2 rounded p-6 mb-4 ${ans.is_accepted ? "border-success" : "border-border"}`}
          >
            {ans.is_accepted && (
              <div className="bg-success text-white px-3 py-1 rounded inline-block mb-3 text-sm font-medium">
                ✓ Meilleure réponse
              </div>
            )}

            <div className="flex space-x-4">
              <div className="flex flex-col items-center space-y-2">
                <button
                  onClick={() => handleVote("up", "answer", ans.id)}
                  className="text-text-secondary hover:text-secondary text-2xl"
                  disabled={!user}
                >
                  ▲
                </button>
                <span className="text-2xl font-bold">{ans.vote_count}</span>
                <button
                  onClick={() => handleVote("down", "answer", ans.id)}
                  className="text-text-secondary hover:text-secondary text-2xl"
                  disabled={!user}
                >
                  ▼
                </button>

                {user && question.author.id === user.id && !ans.is_accepted && (
                  <button
                    onClick={() => handleAcceptAnswer(ans.id)}
                    className="text-success hover:text-green-700 text-2xl mt-2"
                    title="Accepter cette réponse"
                  >
                    ✓
                  </button>
                )}
              </div>

              <div className="flex-1">
                <div className="prose max-w-none mb-4">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{ans.content}</ReactMarkdown>
                </div>

                <div className="text-sm text-text-secondary">
                  Répondu par{" "}
                  <Link to={`/user/${ans.author.id}`} className="text-primary">
                    {ans.author.username}
                  </Link>{" "}
                  le {new Date(ans.created_at).toLocaleDateString("fr-FR")}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Answer Form */}
      {user ? (
        <div className="bg-white border border-border rounded p-6">
          <h3 className="text-xl font-bold text-text-primary mb-4">Votre réponse</h3>
          <form onSubmit={handleSubmitAnswer}>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Écrivez votre réponse en Markdown..."
              rows="8"
              className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm mb-4"
              required
            />
            <button type="submit" className="bg-primary text-white px-6 py-2 rounded hover:bg-blue-700 font-medium">
              Publier la réponse
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded p-6 text-center">
          <p className="text-text-secondary">
            <Link to="/login" className="text-primary hover:text-blue-700">
              Connectez-vous
            </Link>{" "}
            pour répondre à cette question
          </p>
        </div>
      )}
    </div>
  )
}

export default QuestionDetail
