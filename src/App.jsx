import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ClientReception from './pages/ClientReception';
import { TicketProvider } from './context/TicketContext';

function Login() {
  return (
    <div style={{ padding: '50px', backgroundColor: '#0f0f0f', height: '100vh', color: 'white', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>Acceso Técnicos</h1>
      <p>Acá irá el formulario para que cada técnico entre a su cuenta.</p>
    </div>
  );
}

function App() {
  // Dentro de App.jsx, modifica la inicialización del useState de config:

  const [config, setConfig] = useState(() => {
    const configGuardada = localStorage.getItem('wepairr_config');
    if (configGuardada) {
      return JSON.parse(configGuardada);
    }
    return {
      nombreNegocio: 'Wepairr Tech',
      titulo: 'Reparaciones Profesionales',
      descripcion: 'Especialistas en microelectrónica. Tu equipo en las mejores manos.',
      colorTema: '#ffffff',
      redes: { instagram: '', whatsapp: '5491122334455' },
      modoAvanzado: false,
      // NUEVO: Agregamos la tabla de precios al cerebro de la app
      tablaPrecios: {
        'iPhone 11': { 'Pantalla': 120000, 'Batería': 45000, 'Pin de Carga': 30000 },
        'Samsung S23': { 'Pantalla': 250000, 'Batería': 60000, 'Pin de Carga': 40000 },
        'Motorola G20': { 'Pantalla': 55000, 'Batería': 25000, 'Pin de Carga': 15000 }
      }
    };
  });


  // Guardado automático al modificar cualquier ajuste
  useEffect(() => {
    localStorage.setItem('wepairr_config', JSON.stringify(config));
  }, [config]);

  return (
    <TicketProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard config={config} setConfig={setConfig} />} />
          <Route path="/taller/:techId" element={<ClientReception config={config} />} />
        </Routes>
      </BrowserRouter>
    </TicketProvider>
  );
}

export default App;