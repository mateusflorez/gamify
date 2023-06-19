import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react';
import Static from './pages/Static';
import Login from './pages/Login';
import Register from './pages/Register';
import Welcome from './pages/Welcome';

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
        <Route path="/register" element={<Register />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/" element={<Static page="dashboard" />} />
        <Route path="/profile" element={<Static page="profile" />} />
        <Route path="/store" element={<Static page="store" />} />
        <Route path="/inventory" element={<Static page="inventory" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
