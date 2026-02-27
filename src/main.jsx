import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import * as Sentry from "@sentry/react" // INYECTADO: Motor de Sentry
import App from './App.jsx'
import './index.css' // <-- ESTA LÍNEA ES VITAL PARA QUE NO SE VEA EN BLANCO

// INYECTADO: Configuración Maestra de Sentry
// Nota: Cuando crees tu cuenta gratuita en sentry.io, te darán un link (DSN). Pégalo aquí.
Sentry.init({
  dsn: "https://ejemplo@o000000.ingest.sentry.io/000000", // <-- REEMPLAZAR CON TU DSN REAL
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  // Monitoreo de Rendimiento (Performance)
  tracesSampleRate: 1.0, // Captura el 100% de las transacciones para medir cuán rápido carga Wepairr

  // Grabación de Sesión (Session Replay - Graba en video si ocurre un error)
  replaysSessionSampleRate: 0.1, // Graba el 10% de las sesiones normales
  replaysOnErrorSampleRate: 1.0, // Graba el 100% de las sesiones que sufren un crasheo
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* INYECTADO: ErrorBoundary atrapa los crasheos antes de que rompan la web */}
    <Sentry.ErrorBoundary
      fallback={
        <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-primary)', fontFamily: 'system-ui, sans-serif', background: 'var(--bg-main)', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <h2 style={{ color: '#ef4444', marginBottom: '10px' }}>⚠️ Ups, algo salió mal en el taller.</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '25px', maxWidth: '400px' }}>
            Nuestros servidores han detectado un error técnico. El reporte ya ha sido enviado automáticamente al equipo de Wepairr para su solución inmediata.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: '15px 30px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)' }}
          >
            Recargar la plataforma
          </button>
        </div>
      }
    >
      <App />
    </Sentry.ErrorBoundary>
  </StrictMode>,
)