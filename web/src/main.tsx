import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/main.css'
import './utils/i18n'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Suspense fallback={<div className='h-screen flex items-center justify-center'><div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>}>
      <App />
    </Suspense>
  </React.StrictMode>,
)
