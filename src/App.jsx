import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ClientReception from './pages/ClientReception';
import Home from './pages/Home';
import StatusTracking from './pages/StatusTracking';
import Directory from './pages/Directory';
import { TicketProvider } from './context/TicketContext';

import './index.css';

function Login() {
  return (
    <div style={{ padding: '50px', backgroundColor: 'var(--bg-main)', height: '100vh', color: 'var(--text-primary)', textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Acceso Técnicos</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Ingresa tus credenciales para acceder a tu espacio de trabajo.</p>
      <Link to="/dashboard" style={{ display: 'inline-block', padding: '15px 30px', backgroundColor: 'var(--accent-color)', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem' }}>
        Entrar a mi Cuenta
      </Link>
    </div>
  );
}

// ESTADO INICIAL COMPLETO (Restaurado)
const CONFIG_INICIAL = {
  plan: 'premium',
  nombreNegocio: 'Wepairr Tech',
  titulo: 'Reparamos tu mundo.',
  descripcion: 'Especialistas en microelectrónica y reparación de placas base. Tu equipo en las mejores manos.',
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
  mostrarGarantia: true,
  tiempoGarantia: '90 Días',
  mostrarMapa: true,
  mapaUrl: '',
  mostrarFaq: true,
  horariosAtencion: 'Lun a Vie 9:00 - 18:00hs',
  tablaPrecios: {
    'iPhone 13 Pro': { 'Cambio de Pantalla': 250000, 'Cambio de Batería': 85000, 'Pin de Carga': 45000 },
    'Samsung Galaxy S23 Ultra': { 'Módulo Original': 350000, 'Cambio de Batería': 90000 }
  }
};

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('wepairr_theme') || 'dark';
  });

  const toggleTheme = () => {
    setTheme(prev => {
      const nextTheme = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('wepairr_theme', nextTheme);
      return nextTheme;
    });
  };

  // SINCRONIZACIÓN GLOBAL RESTAURADA
  const [config, setConfig] = useState(() => {
    const configGuardada = localStorage.getItem('wepairr_config');
    if (configGuardada) return JSON.parse(configGuardada);
    return CONFIG_INICIAL;
  });

  useEffect(() => {
    localStorage.setItem('wepairr_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  return (
    <TicketProvider>
      <div className={`app-root ${theme}`}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home theme={theme} toggleTheme={toggleTheme} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard/*" element={<Dashboard config={config} setConfig={setConfig} theme={theme} toggleTheme={toggleTheme} />} />
            <Route path="/taller/:techId" element={<ClientReception config={config} />} />
            <Route path="/tracking" element={<StatusTracking />} />
            <Route path="/directorio" element={<Directory theme={theme} toggleTheme={toggleTheme} />} />
          </Routes>
        </BrowserRouter>
      </div>
    </TicketProvider>
  );
}

export default App;