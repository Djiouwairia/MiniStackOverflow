"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../api/axios"

const Home = () => {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("")

  useEffect(() => {
    fetchQuestions()
  }, [filter])

  const fetchQuestions = async () => {
    try {
      const response = await api.get(`/questions/?${filter}`)
      setQuestions(response.data.results || response.data)
    } catch (error) {
      console.error("Error fetching questions:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-text-primary">Toutes les questions</h1>
        <Link to="/ask" className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700">
          Poser une question
        </Link>
      </div>

      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setFilter("")}
          className={`px-4 py-2 rounded ${!filter ? "bg-primary text-white" : "bg-white text-text-primary border border-border"}`}
        >
          Récentes
        </button>
        <button
          onClick={() => setFilter("sort=votes")}
          className={`px-4 py-2 rounded ${filter === "sort=votes" ? "bg-primary text-white" : "bg-white text-text-primary border border-border"}`}
        >
          Populaires
        </button>
        <button
          onClick={() => setFilter("unanswered=true")}
          className={`px-4 py-2 rounded ${filter === "unanswered=true" ? "bg-primary text-white" : "bg-white text-text-primary border border-border"}`}
        >
          Sans réponse
        </button>
      </div>

      <div className="space-y-4">
        {questions.map((question) => (
          <div key={question.id} className="bg-white border border-border rounded p-4 hover:border-primary transition">
            <div className="flex space-x-4">
              <div className="flex flex-col items-center space-y-2 text-text-secondary text-sm">
                <div className="text-center">
                  <div className="font-bold text-lg">{question.vote_count}</div>
                  <div>votes</div>
                </div>
                <div className={`text-center ${question.has_accepted_answer ? "text-success" : ""}`}>
                  <div
                    className={`font-bold text-lg ${question.has_accepted_answer ? "bg-success text-white px-2 py-1 rounded" : ""}`}
                  >
                    {question.answer_count}
                  </div>
                  <div>réponses</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">{question.views}</div>
                  <div>vues</div>
                </div>
              </div>

              <div className="flex-1">
                <Link to={`/question/${question.id}`} className="text-primary text-lg font-medium hover:text-blue-700">
                  {question.title}
                </Link>
                <div className="flex items-center space-x-2 mt-2">
                  {question.tags.map((tag) => (
                    <span key={tag.id} className="bg-blue-50 text-primary px-2 py-1 rounded text-sm">
                      {tag.name}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-3 text-sm text-text-secondary">
                  <span>
                    par <span className="text-primary">{question.author.username}</span>
                  </span>
                  <span>{new Date(question.created_at).toLocaleDateString("fr-FR")}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
