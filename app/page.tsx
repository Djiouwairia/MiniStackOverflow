"use client"
import React, { useEffect, useState } from 'react'
import { useToast } from "@/hooks/use-toast"
// Tentez l'import relatif si l'alias @ ne fonctionne pas
import api from "../frontend/src/api/axios" 

export default function StackOverflowFinal() {
  const [questions, setQuestions] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newQuestion, setNewQuestion] = useState({ title: '', content: '' })
  
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [loginData, setLoginData] = useState({ username: '', password: '' })
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) setIsLoggedIn(true)
    fetchQuestions()
  }, [])

  // 1. CHARGER LES QUESTIONS (Utilise Axios)
  const fetchQuestions = async () => {
    try {
      const res = await api.get("/questions/")
      const results = res.data.results ? res.data.results : res.data
      setQuestions(Array.isArray(results) ? results : [])
    } catch (err) {
      console.error("Erreur fetch:", err)
      setQuestions([])
    } finally {
      setLoading(false)
    }
  }

  // 2. CONNEXION (Cible l'URL /api/auth/login/ de votre Django)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await api.post("/auth/login/", loginData)
      if (res.status === 200) {
        localStorage.setItem('token', res.data.access)
        localStorage.setItem('refresh', res.data.refresh)
        setIsLoggedIn(true)
        setIsLoginModalOpen(false)
        setLoginData({ username: '', password: '' })
        toast({ title: "Succès", description: "Connecté à PostgreSQL !" })
        fetchQuestions()
      }
    } catch (err: any) {
      toast({ 
        variant: "destructive", 
        title: "Échec", 
        description: err.response?.data?.detail || "Identifiants incorrects." 
      })
    }
  }

  const handlePublish = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    // On prépare l'objet avec tag_ids (obligatoire selon votre erreur console)
    const dataToSend = {
      ...newQuestion,
      tag_ids: [] // On envoie une liste vide pour commencer
    };

    console.log("Données envoyées à Django :", dataToSend);
    
    const response = await api.post("/questions/", dataToSend);
    
    toast({ title: "Publié !", description: "La question est enregistrée." });
    setIsModalOpen(false);
    setNewQuestion({ title: '', content: '' });
    fetchQuestions();
  } catch (err: any) {
    console.error("Erreur détaillée du serveur :", err.response?.data);
    
    // Extraction propre du message d'erreur pour le toast
    const serverError = err.response?.data;
    let errorMessage = "Erreur de publication.";

    if (serverError && typeof serverError === 'object') {
      // Récupère le premier message d'erreur trouvé dans l'objet (ex: erreur sur tag_ids)
      errorMessage = Object.entries(serverError)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");
    }

    toast({ 
      variant: "destructive", 
      title: "Erreur serveur", 
      description: errorMessage
    });
  }
};

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refresh')
    setIsLoggedIn(false)
    toast({ title: "Déconnecté" })
  }

  const filteredQuestions = Array.isArray(questions) 
    ? questions.filter((q: any) => q.title.toLowerCase().includes(searchTerm.toLowerCase()))
    : []

  return (
    <div className="min-h-screen bg-[#f8f9f9]">
      <header className="bg-white border-t-4 border-orange-400 border-b shadow-sm p-3 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <span className="text-xl font-bold flex-shrink-0">
            Mini <span className="text-orange-500">StackOverflow</span>
          </span>
          <div className="flex-1 max-w-2xl relative">
            <input 
              type="text"
              placeholder="Rechercher..."
              className="w-full border rounded p-2 pl-8 outline-none focus:ring-1 focus:ring-blue-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute left-2 top-2.5">🔍</span>
          </div>

          {isLoggedIn ? (
            <button onClick={handleLogout} className="text-sm font-medium text-gray-600 hover:text-red-500 transition">
              Déconnexion
            </button>
          ) : (
            <button 
              onClick={() => setIsLoginModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-600"
            >
              Connexion
            </button>
          )}
        </div>
      </header>

      <div className="max-w-6xl mx-auto flex py-6 px-4 gap-6">
        <main className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-normal">Toutes les Questions</h1>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Poser une Question
            </button>
          </div>

          <div className="space-y-4">
            {loading ? (
               <div className="text-center py-10 text-gray-500 italic">Connexion PostgreSQL...</div>
            ) : filteredQuestions.map((q: any) => (
                <div key={q.id} className="bg-white border-b p-4 hover:bg-gray-50">
                  <h3 className="text-blue-600 text-lg font-medium">{q.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{q.content}</p>
                </div>
            ))}
          </div>
        </main>
      </div>

      {/* MODAL CONNEXION */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-lg p-8 max-w-sm w-full">
            <h2 className="text-2xl font-bold mb-6 text-center">Connexion</h2>
            <form onSubmit={handleLogin}>
              <input 
                placeholder="Nom d'utilisateur"
                className="w-full border rounded p-3 mb-4" 
                value={loginData.username}
                onChange={(e) => setLoginData({...loginData, username: e.target.value})}
              />
              <input 
                type="password"
                placeholder="Mot de passe"
                className="w-full border rounded p-3 mb-6" 
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
              />
              <button type="submit" className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold">
                Se connecter
              </button>
              <button type="button" onClick={() => setIsLoginModalOpen(false)} className="w-full mt-2 text-gray-500 text-sm">Annuler</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PUBLICATION */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Nouvelle question</h2>
            <form onSubmit={handlePublish}>
              <input required className="w-full border rounded p-2 mb-4" placeholder="Titre" value={newQuestion.title} onChange={(e) => setNewQuestion({...newQuestion, title: e.target.value})} />
              <textarea required rows={5} className="w-full border rounded p-2 mb-4" placeholder="Détails" value={newQuestion.content} onChange={(e) => setNewQuestion({...newQuestion, content: e.target.value})} />
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)}>Annuler</button>
                <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded">Publier</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}