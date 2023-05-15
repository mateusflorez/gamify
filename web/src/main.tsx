import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/main.css'
import './utils/i18n'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <App />
    </Suspense>
  </React.StrictMode>,
)
