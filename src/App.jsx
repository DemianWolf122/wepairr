import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ClientReception from './pages/ClientReception';
import Home from './pages/Home';
import StatusTracking from './pages/StatusTracking';
import { TicketProvider } from './context/TicketContext';

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

function App() {
  // MOTOR DE TEMAS BLINDADO
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('wepairr_theme') || 'dark';
  });

  useEffect(() => {
    // Aplicamos DOBLE inyección: Atributo HTML y Clase en el Body
    document.documentElement.setAttribute('data-theme', theme);
    document.body.className = theme;
    localStorage.setItem('wepairr_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const [config, setConfig] = useState(() => {
    const configGuardada = localStorage.getItem('wepairr_config');
    if (configGuardada) return JSON.parse(configGuardada);
    return {
      nombreNegocio: 'Wepairr Tech',
      titulo: 'Reparaciones Profesionales',
      descripcion: 'Especialistas en microelectrónica. Tu equipo en las mejores manos.',
      colorTema: '#2563eb',
      redes: { instagram: '', whatsapp: '5491122334455' },
      mostrarPresupuestador: true,
      tablaPrecios: {
        'iPhone 13 Pro': { 'Cambio de Pantalla': 250000, 'Cambio de Batería': 85000, 'Pin de Carga': 45000 },
        'Samsung Galaxy S23 Ultra': { 'Módulo Original': 350000, 'Cambio de Batería': 90000 }
      }
    };
  });

  useEffect(() => {
    localStorage.setItem('wepairr_config', JSON.stringify(config));
  }, [config]);

  return (
    <TicketProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home theme={theme} toggleTheme={toggleTheme} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard config={config} setConfig={setConfig} theme={theme} toggleTheme={toggleTheme} />} />
          <Route path="/taller/:techId" element={<ClientReception config={config} />} />
          <Route path="/tracking" element={<StatusTracking />} />
        </Routes>
      </BrowserRouter>
    </TicketProvider>
  );
}

export default App;