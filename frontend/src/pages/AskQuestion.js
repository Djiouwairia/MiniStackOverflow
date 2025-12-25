"use client"

import { useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import api from "../api/axios"

const AskQuestion = () => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [error, setError] = useState("")
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    fetchTags()
  }, [])

  const fetchTags = async () => {
    try {
      const response = await api.get("/tags/")
      setTags(response.data)
    } catch (error) {
      console.error("Error fetching tags:", error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!user) {
      navigate("/login")
      return
    }

    try {
      const response = await api.post("/questions/", {
        title,
        content,
        tag_ids: selectedTags,
      })
      navigate(`/question/${response.data.id}`)
    } catch (err) {
      setError("Erreur lors de la création de la question")
    }
  }

  const toggleTag = (tagId) => {
    setSelectedTags((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]))
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-md border border-border">
        <h1 className="text-3xl font-bold text-text-primary mb-6">Poser une question</h1>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-text-primary font-medium mb-2">Titre</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Comment créer un serveur REST avec Django?"
              className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-text-primary font-medium mb-2">Description (Markdown supporté)</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Décrivez votre problème en détail..."
              rows="10"
              className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-text-primary font-medium mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`px-3 py-1 rounded text-sm ${
                    selectedTags.includes(tag.id)
                      ? "bg-primary text-white"
                      : "bg-blue-50 text-primary border border-primary"
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded hover:bg-blue-700 font-medium text-lg"
          >
            Publier la question
          </button>
        </form>
      </div>
    </div>
  )
}

export default AskQuestion
