"use client"

import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"

const DebugAuth = () => {
  const { user, loading } = useContext(AuthContext)
  
  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: '#f0f0f0',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999
    }}>
      <strong>DEBUG AUTH:</strong><br />
      User: {user ? user.username : 'null'}<br />
      Loading: {loading ? 'true' : 'false'}<br />
      Token: {localStorage.getItem('token') ? 'YES' : 'NO'}<br />
      <button onClick={() => console.log('User:', user)}>Log User</button>
    </div>
  )
}

export default DebugAuth
