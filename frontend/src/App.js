import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import Header from "./components/Header"
import Home from "./pages/Home"
import QuestionDetail from "./pages/QuestionDetail"
import AskQuestion from "./pages/AskQuestion"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Profile from "./pages/Profile"
import UserProfile from "./pages/UserProfile"

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-surface">
          <Header />
          <main className="max-w-7xl mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/question/:id" element={<QuestionDetail />} />
              <Route path="/ask" element={<AskQuestion />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/user/:id" element={<UserProfile />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
