import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { LanguageProvider } from './i18n/LanguageProvider'
import { PwaProvider } from './pwa/usePwa'
import './index.css'

const container = document.getElementById('root')

if (!container) {
  throw new Error('Root element #root was not found in index.html')
}

createRoot(container).render(
  <StrictMode>
    <LanguageProvider>
      <PwaProvider>
        <App />
      </PwaProvider>
    </LanguageProvider>
  </StrictMode>,
)
