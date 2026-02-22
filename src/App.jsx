import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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

  // CARGA DE CONFIGURACIÓN ANTI-CRASH
  const [config, setConfig] = useState(() => {
    try {
      const guardado = localStorage.getItem('wepairr_config');
      if (guardado) {
        const parsedConfig = JSON.parse(guardado);
        // Validamos que sea un objeto y tenga las propiedades mínimas
        if (typeof parsedConfig === 'object' && parsedConfig !== null) {
          return { ...CONFIG_INICIAL, ...parsedConfig };
        }
      }
    } catch (error) {
      console.error("Configuración corrupta detectada, cargando valores por defecto.");
      localStorage.removeItem('wepairr_config'); // Limpiamos la basura
    }
    return CONFIG_INICIAL;
  });

  useEffect(() => {
    try {
      localStorage.setItem('wepairr_config', JSON.stringify(config));
    } catch (e) {
      console.error("Error al guardar la configuración.");
    }
  }, [config]);

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
            <Route path="/dashboard/*" element={<Dashboard config={config} setConfig={setConfig} theme={theme} toggleTheme={toggleTheme} />} />
            <Route path="/taller/:slug" element={<ClientReception config={config} />} />
            <Route path="/tracking" element={<StatusTracking />} />
            <Route path="/directorio" element={<Directory theme={theme} toggleTheme={toggleTheme} />} />
          </Routes>
        </Router>
      </div>
    </TicketProvider>
  );
}

export default App;