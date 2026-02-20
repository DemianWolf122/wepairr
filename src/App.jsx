import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ClientReception from './pages/ClientReception';
import { TicketProvider } from './context/TicketContext'; // <-- 1. Importamos el proveedor

// (Mantenemos el Login temporal)
function Login() {
  return (
    <div style={{ padding: '50px', backgroundColor: '#0f0f0f', height: '100vh', color: 'white', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>Acceso Técnicos</h1>
      <p>Acá irá el formulario para que cada técnico entre a su cuenta.</p>
    </div>
  );
}

function App() {
  const [config, setConfig] = useState({
    nombreNegocio: 'Wepairr Tech',
    titulo: 'Reparaciones Profesionales',
    descripcion: 'Especialistas en microelectrónica. Tu equipo en las mejores manos.',
    colorTema: '#3b82f6',
    redes: { instagram: '', whatsapp: '5491122334455' },
    modoAvanzado: false
  });

  return (
    // 2. Envolvemos absolutamente TODA la app con el TicketProvider
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