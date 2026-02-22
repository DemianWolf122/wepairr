import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css' // <-- ESTA LÍNEA ES VITAL PARA QUE NO SE VEA EN BLANCO

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)