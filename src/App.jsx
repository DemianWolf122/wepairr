import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ClientReception from './pages/ClientReception';
import Home from './pages/Home';
import StatusTracking from './pages/StatusTracking';
import { TicketProvider } from './context/TicketContext';

function Login() {
  return (
    <div style={{ padding: '50px', backgroundColor: '#0f0f0f', height: '100vh', color: 'white', textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Acceso Técnicos</h1>
      <p style={{ color: '#888', marginBottom: '30px' }}>Ingresa tus credenciales para acceder a tu espacio de trabajo.</p>
      <Link to="/dashboard" style={{ display: 'inline-block', padding: '15px 30px', backgroundColor: '#66bb6a', color: '#000', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem' }}>
        Entrar a mi Cuenta
      </Link>
    </div>
  );
}

function App() {
  const [config, setConfig] = useState(() => {
    const configGuardada = localStorage.getItem('wepairr_config');
    if (configGuardada) return JSON.parse(configGuardada);
    return {
      nombreNegocio: 'Wepairr Tech',
      titulo: 'Reparaciones Profesionales',
      descripcion: 'Especialistas en microelectrónica. Tu equipo en las mejores manos.',
      colorTema: '#ffffff',
      redes: { instagram: '', whatsapp: '5491122334455' },
      mostrarPresupuestador: true,
      tablaPrecios: {
        'iPhone 13 Pro': { 'Cambio de Pantalla': 250000, 'Cambio de Batería': 85000, 'Pin de Carga': 45000 },
        'Samsung Galaxy S23 Ultra': { 'Módulo Original': 350000, 'Cambio de Batería': 90000, 'Pin de Carga': 50000 },
        'Motorola Moto G52': { 'Cambio de Pantalla': 85000, 'Cambio de Batería': 35000 }
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
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard config={config} setConfig={setConfig} />} />
          <Route path="/taller/:techId" element={<ClientReception config={config} />} />
          <Route path="/tracking" element={<StatusTracking />} />
        </Routes>
      </BrowserRouter>
    </TicketProvider>
  );
}

export default App;