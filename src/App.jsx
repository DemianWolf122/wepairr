import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ClientReception from './pages/ClientReception';
import Home from './pages/Home';
import Directory from './pages/Directory';
import { TicketProvider } from './context/TicketContext';
import './index.css';

// Componente simple de Login para que no de error la ruta
function Login() {
  return (
    <div style={{ padding: '50px', backgroundColor: 'var(--bg-main)', height: '100vh', color: 'var(--text-primary)', textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '2.5rem', margin: '0 0 10px 0' }}>Acceso Técnicos</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Ingresa tus credenciales para acceder a tu espacio.</p>
      <Link to="/dashboard" style={{ display: 'inline-block', padding: '15px 30px', backgroundColor: 'var(--accent-color)', color: '#fff', textDecoration: 'none', borderRadius: '12px', fontWeight: 'bold' }}>
        Entrar a mi Taller
      </Link>
    </div>
  );
}

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
  // 1. Carga segura del Tema
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('wepairr_theme') || 'dark'; }
    catch (e) { return 'dark'; }
  });

  const toggleTheme = () => {
    setTheme(prev => {
      const nextTheme = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('wepairr_theme', nextTheme);
      return nextTheme;
    });
  };

  // 2. SISTEMA ANTI-CRASH: Carga segura de la configuración
  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('wepairr_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Fusionamos lo guardado con lo inicial por si faltan variables nuevas (como mapas o garantías)
        return { ...CONFIG_INICIAL, ...parsed };
      }
    } catch (error) {
      console.error("Datos corruptos detectados, restaurando valores de fábrica.");
    }
    return CONFIG_INICIAL;
  });

  // Guardado en tiempo real
  useEffect(() => {
    localStorage.setItem('wepairr_config', JSON.stringify(config));
  }, [config]);

  // Aplicación del CSS del Tema
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  return (
    <TicketProvider>
      <div className={`app-root ${theme}`}>
        <Router>
          <Routes>
            <Route path="/" element={<Home theme={theme} toggleTheme={toggleTheme} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/talleres" element={<Directory />} />
            <Route path="/directorio" element={<Directory />} />
            <Route path="/dashboard/*" element={<Dashboard config={config} setConfig={setConfig} theme={theme} toggleTheme={toggleTheme} />} />
            <Route path="/taller/:slug" element={<ClientReception config={config} />} />
          </Routes>
        </Router>
      </div>
    </TicketProvider>
  );
}

export default App;