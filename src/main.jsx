import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// 🔥 REGISTRO PWA
import { registerSW } from 'virtual:pwa-register'

registerSW({
  onNeedRefresh() {
    if (confirm("Hay una nueva versión. Actualizar?")) {
      location.reload()
    }
  },
  onOfflineReady() {
    console.log("App lista para uso offline")
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
