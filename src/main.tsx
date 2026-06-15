/**
 * Entry point utama aplikasi React.
 * Digunakan saat: Menginisialisasi aplikasi dan merender komponen root ke DOM.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
