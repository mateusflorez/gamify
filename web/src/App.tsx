import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react';
import Static from './pages/Static';
import Login from './pages/Login';

function App() {
  const { i18n } = useTranslation();

  const lang = navigator.language.startsWith('pt') ? 'pt' : 'en';

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [i18n, lang]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Static page="dashboard" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
