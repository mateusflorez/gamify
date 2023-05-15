import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react';
import Static from './pages/Static';

function App() {
  const { i18n } = useTranslation();

  const lang = navigator.language.startsWith('pt') ? 'pt' : 'en';

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [i18n, lang]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Static page="dashboard" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
