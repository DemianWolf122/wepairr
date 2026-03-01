import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import * as Sentry from "@sentry/react"; // INYECTADO: Importación para el Profiler
import Dashboard from './pages/Dashboard';
import ClientReception from './pages/ClientReception';
import Home from './pages/Home';
import StatusTracking from './pages/StatusTracking';
import Directory from './pages/Directory';
import Login from './pages/Login'; // <-- AQUÍ ESTÁ TU NUEVA PANTALLA IMPORTADA
import { TicketProvider } from './context/TicketContext';
import './index.css';

// *** AQUÍ ESTABA LA FUNCIÓN DUMMY DE LOGIN. FUE ELIMINADA PARA EVITAR EL CHOQUE ***

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

// INYECTADO: Exportamos envuelto en Sentry Profiler para medir el rendimiento de toda la App
export default Sentry.withProfiler(App);