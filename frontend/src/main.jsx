import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './services/mockSetup' // Intercept API calls with Mock Data!
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
