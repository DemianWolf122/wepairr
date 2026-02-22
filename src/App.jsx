import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ClientReception from './pages/ClientReception';
import Home from './pages/Home';
import Directory from './pages/Directory';
import { TicketProvider } from './context/TicketContext';

const CONFIG_INICIAL = {
  plan: 'premium',
  nombreNegocio: 'TechFix Pro',
  titulo: 'Reparamos tu mundo.',
  descripcion: 'Especialistas en microelectrónica y reparación de placas base.',
  colorTema: '#2563eb',
  colorTitulo: '#ffffff',
  colorSubtitulo: '#cbd5e1',
  shopDarkMode: true,
  fontFamily: '"Inter", system-ui, sans-serif',
  borderRadius: '16px',
  whatsapp: '549112345678',
  instagramConnected: false,
  bannerUrl: 'https://images.unsplash.com/photo-1597740985671-2a8a3b80502e?w=800&q=80',
  videoUrl: '',
  mostrarPresupuestador: true,
  mostrarTracking: true,
  mostrarTurnos: false,
  mostrarGarantia: true,
  tiempoGarantia: '90 Días',
  mostrarMapa: true,
  mapaUrl: '',
  mostrarFaq: true,
  horariosAtencion: 'Lun a Vie 9:00 - 18:00hs'
};

function App() {
  // 1. CARGA INICIAL DESDE LA MEMORIA LOCAL
  const [config, setConfig] = useState(() => {
    const guardado = localStorage.getItem('wepairr_config');
    return guardado ? JSON.parse(guardado) : CONFIG_INICIAL;
  });

  const [theme, setTheme] = useState('dark');

  // 2. MAGIA DE SINCRONIZACIÓN: Guarda los cambios al instante
  useEffect(() => {
    localStorage.setItem('wepairr_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <TicketProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home theme={theme} toggleTheme={toggleTheme} />} />
          <Route path="/talleres" element={<Directory />} />
          <Route path="/dashboard/*" element={<Dashboard config={config} setConfig={setConfig} theme={theme} toggleTheme={toggleTheme} />} />
          <Route path="/taller/:slug" element={<ClientReception config={config} />} />
        </Routes>
      </Router>
    </TicketProvider>
  );
}

export default App;