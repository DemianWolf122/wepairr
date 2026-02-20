import React, { useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TicketContext } from '../context/TicketContext';

// Simulamos la base de datos de técnicos (Mantenemos la lógica de personalización)
const TECNICOS_DB = {
    'electro-fix': {
        nombre: 'Electro Fix',
        titulo: 'Revivimos tus equipos.',
        descripcion: 'Ingresa los datos de tu dispositivo para recibir asistencia inmediata.',
        colorTema: '#ffffff', // Cambiado a blanco para un look más minimalista
        avatar: '⚡'
    }
};

function ClientReception() {
    const { techId } = useParams();
    const { agregarTicket } = useContext(TicketContext);

    const datosTecnico = TECNICOS_DB[techId] || {
        nombre: 'Taller Wepairr',
        titulo: 'Asistencia Técnica',
        descripcion: 'Completa los datos para iniciar tu consulta.',
        colorTema: '#ffffff',
        avatar: '🔧'
    };

    // Estados para controlar el flujo secuencial
    const [faseActiva, setFaseActiva] = useState(1); // 1: Formulario Inicial, 2: Chat
    const [datosDispositivo, setDatosDispositivo] = useState({ modelo: '', falla: '' });

    // Estados del Chat
    const [mensaje, setMensaje] = useState('');
    const [historial, setHistorial] = useState([]);

    // Manejador del paso 1: Enviar formulario inicial y abrir chat
    const iniciarConsulta = (e) => {
        e.preventDefault();
        if (!datosDispositivo.modelo.trim() || !datosDispositivo.falla.trim()) return;

        // Pre-cargamos el historial del chat con el contexto del dispositivo
        setHistorial([
            { actor: 'ia', texto: `Hola. Soy el asistente de ${datosTecnico.nombre}. Veo que tienes un problema con tu ${datosDispositivo.modelo} (${datosDispositivo.falla}). ¿Podrías brindarme más detalles para que el técnico pueda revisarlo?` }
        ]);

        // Cambiamos a la vista del chat
        setFaseActiva(2);
    };

    // Manejador del paso 2: Enviar mensajes dentro del chat
    const manejarMensajeChat = (e) => {
        e.preventDefault();
        if (!mensaje.trim()) return;

        setHistorial(prev => [...prev, { actor: 'cliente', texto: mensaje }]);

        setTimeout(() => {
            setHistorial(prev => [...prev, {
                actor: 'ia',
                texto: 'He registrado la información exitosamente. El caso ha sido derivado al laboratorio.'
            }]);

            // Generamos el ticket global para el tablero del técnico
            const nuevoTicket = {
                id: Date.now(),
                equipo: datosDispositivo.modelo,
                falla: `${datosDispositivo.falla} - Detalle: ${mensaje}`,
                presupuesto: 0,
                estado: 'Ingresado',
                tecnicoId: techId
            };

            agregarTicket(nuevoTicket);
        }, 1200);

        setMensaje('');
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#000000', // Negro puro para minimalismo extremo
            color: '#ffffff',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '5vh 20px',
            boxSizing: 'border-box'
        }}>

            {/* Navegación temporal para pruebas */}
            <div style={{ position: 'absolute', top: '30px', left: '30px' }}>
                <Link to="/dashboard" style={{ color: '#666', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>
                    ← Volver al Dashboard
                </Link>
            </div>

            {/* HEADER MINIMALISTA */}
            <header style={{ textAlign: 'center', maxWidth: '600px', marginBottom: '50px', marginTop: '40px' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '15px', opacity: 0.9 }}>
                    {datosTecnico.avatar}
                </div>
                <h1 style={{ fontSize: '2.8rem', fontWeight: '700', margin: '0 0 10px 0', letterSpacing: '-0.5px' }}>
                    {datosTecnico.titulo}
                </h1>
                <p style={{ fontSize: '1.1rem', color: '#888888', lineHeight: '1.5', margin: 0 }}>
                    {datosTecnico.descripcion}
                </p>
            </header>

            <main style={{ width: '100%', maxWidth: '500px' }}>

                {/* FASE 1: FORMULARIO INICIAL DE DISPOSITIVO */}
                {faseActiva === 1 && (
                    <form onSubmit={iniciarConsulta} style={{ display: 'flex', flexDirection: 'column', gap: '25px', animation: 'fadeIn 0.5s ease' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', color: '#aaaaaa', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                Modelo del Dispositivo
                            </label>
                            <input
                                type="text"
                                value={datosDispositivo.modelo}
                                onChange={(e) => setDatosDispositivo({ ...datosDispositivo, modelo: e.target.value })}
                                placeholder="Ej. iPhone 13 Pro"
                                required
                                style={minimalistInputStyle}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', color: '#aaaaaa', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                Falla Principal
                            </label>
                            <input
                                type="text"
                                value={datosDispositivo.falla}
                                onChange={(e) => setDatosDispositivo({ ...datosDispositivo, falla: e.target.value })}
                                placeholder="Ej. Pantalla astillada, no enciende..."
                                required
                                style={minimalistInputStyle}
                            />
                        </div>
                        <button type="submit" style={minimalistButtonStyle}>
                            Siguiente
                        </button>
                    </form>
                )}

                {/* FASE 2: CHATBOX */}
                {faseActiva === 2 && (
                    <div style={{ display: 'flex', flexDirection: 'column', height: '550px', animation: 'fadeIn 0.5s ease' }}>

                        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '20px' }}>
                            {historial.map((msg, index) => (
                                <div key={index} style={{
                                    alignSelf: msg.actor === 'cliente' ? 'flex-end' : 'flex-start',
                                    color: msg.actor === 'cliente' ? '#ffffff' : '#cccccc',
                                    backgroundColor: msg.actor === 'cliente' ? '#222222' : 'transparent',
                                    padding: msg.actor === 'cliente' ? '16px 24px' : '0 10px',
                                    borderRadius: '12px',
                                    maxWidth: '85%',
                                    fontSize: '1.05rem',
                                    lineHeight: '1.6',
                                    borderLeft: msg.actor === 'ia' ? '2px solid #333' : 'none'
                                }}>
                                    {msg.texto}
                                </div>
                            ))}
                        </div>

                        <form onSubmit={manejarMensajeChat} style={{ borderTop: '1px solid #222222', paddingTop: '20px', display: 'flex', gap: '15px' }}>
                            <input
                                type="text"
                                value={mensaje}
                                onChange={(e) => setMensaje(e.target.value)}
                                placeholder="Escribe los detalles aquí..."
                                style={minimalistInputStyle}
                            />
                            <button type="submit" style={{ ...minimalistButtonStyle, padding: '0 30px', width: 'auto' }}>
                                Enviar
                            </button>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
}

// Estilos extraídos para mantener el componente limpio
const minimalistInputStyle = {
    width: '100%',
    padding: '16px 0',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '1px solid #333333',
    color: '#ffffff',
    fontSize: '1.1rem',
    outline: 'none',
    transition: 'border-color 0.3s ease',
    boxSizing: 'border-box'
};

const minimalistButtonStyle = {
    width: '100%',
    padding: '18px',
    backgroundColor: '#ffffff',
    color: '#000000',
    fontWeight: '600',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1.05rem',
    marginTop: '10px',
    transition: 'opacity 0.2s ease'
};

export default ClientReception;