import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ClientReception from './pages/ClientReception';
import StatusTracking from './pages/StatusTracking'; // <-- Nuevo
import { TicketProvider } from './context/TicketContext';

function Login() { /* ... tu componente login actual ... */ }

function App() {
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('wepairr_config');
    return saved ? JSON.parse(saved) : {
      nombreNegocio: 'Wepairr Tech',
      titulo: 'Reparaciones Profesionales',
      descripcion: 'Especialistas en microelectrónica.',
      colorTema: '#ffffff',
      whatsapp: '5491122334455',
      mostrarPresupuestador: true,
      tablaPrecios: {} // Se llena con la lista que te di antes
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
          <Route path="/tracking" element={<StatusTracking />} /> {/* <-- Nueva Ruta Pública */}
        </Routes>
      </BrowserRouter>
    </TicketProvider>
  );
}

export default App;