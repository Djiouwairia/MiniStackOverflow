import React from "react"
import api from "../api/axios"

const DebugEnv = () => {
  return (
    <div style={{padding:"10px", background:"#eee", margin:"10px 0"}}>
      🌍 API utilisée : {api.defaults.baseURL}
    </div>
  )
}

export default DebugEnv
