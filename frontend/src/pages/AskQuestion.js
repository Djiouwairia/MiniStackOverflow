"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import api from "../api/axios"

const AskQuestion = () => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState([]) // DOIT ÊTRE UN TABLEAU
  const [selectedTags, setSelectedTags] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    console.log("AskQuestion: Chargement des tags...")
    fetchTags()
  }, [])

  const fetchTags = async () => {
    try {
      setLoading(true)
      const response = await api.get("/tags/")
      console.log("Tags API response:", response.data)
      
      // 🔥 CORRECTION : L'API peut retourner {results: [...]} ou directement [...]
      const apiData = response.data
      const tagsData = apiData.results || apiData
      
      // S'assurer que c'est un tableau
      if (Array.isArray(tagsData)) {
        setTags(tagsData)
        console.log("Tags chargés:", tagsData.length)
      } else {
        console.error("Tags n'est pas un tableau:", tagsData)
        setTags([])
      }
    } catch (error) {
      console.error("Erreur chargement tags:", error.response || error)
      setTags([]) // Tableau vide en cas d'erreur
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!user) {
      navigate("/login")
      return
    }

    if (selectedTags.length === 0) {
      setError("Veuillez sélectionner au moins un tag")
      return
    }

    try {
      const response = await api.post("/questions/", {
        title,
        content,
        tag_ids: selectedTags,
      })
      console.log("Question créée:", response.data)
      navigate(`/question/${response.data.id}`)
    } catch (err) {
      console.error("Erreur création question:", err.response?.data || err)
      setError(err.response?.data?.detail || "Erreur lors de la création de la question")
    }
  }

  const toggleTag = (tagId) => {
    setSelectedTags((prev) => 
      prev.includes(tagId) 
        ? prev.filter((id) => id !== tagId) 
        : [...prev, tagId]
    )
  }

  // Protection contre tags non-tableau
  const safeTags = Array.isArray(tags) ? tags : []

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="bg-white p-8 rounded-lg shadow-md border border-border">
        <h1 className="text-3xl font-bold text-text-primary mb-6">Poser une question</h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-text-primary font-medium mb-2">
              Titre
            </label>
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
            <label className="block text-text-primary font-medium mb-2">
              Description (Markdown supporté)
            </label>
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
            <label className="block text-text-primary font-medium mb-2">
              Tags {loading && "(chargement...)"}
            </label>
            
            <div className="text-sm text-text-secondary mb-3">
              Tags sélectionnés: {selectedTags.length}
            </div>
            
            {loading ? (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <p className="mt-2">Chargement des tags...</p>
              </div>
            ) : safeTags.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                <p className="text-yellow-800">
                  Aucun tag disponible. Créez d'abord des tags dans l'admin Django.
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {safeTags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                      selectedTags.includes(tag.id)
                        ? "bg-primary text-white"
                        : "bg-blue-50 text-primary border border-blue-200 hover:bg-blue-100"
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            )}
            
            {/* Debug info */}
            <div className="mt-2 text-xs text-gray-500">
              Tags disponibles: {safeTags.length} | 
              Structure: {JSON.stringify(safeTags.slice(0, 1))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded hover:bg-blue-700 font-medium text-lg disabled:opacity-50"
          >
            {loading ? "Publication en cours..." : "Publier la question"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AskQuestion



