import React, { useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TicketContext } from '../context/TicketContext';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import PriceEstimator from '../components/PriceEstimator';

const TECNICOS_DB = {
    'electro-fix': {
        nombre: 'Electro Fix',
        titulo: 'Revivimos tus equipos.',
        descripcion: 'Ingresa los datos de tu dispositivo para recibir asistencia inmediata.',
        colorTema: '#ffffff',
        avatar: '⚡'
    }
};

function ClientReception({ config }) {
    const { techId } = useParams();
    const { agregarTicket } = useContext(TicketContext);

    const datosTecnico = TECNICOS_DB[techId] || {
        nombre: 'Taller Wepairr',
        titulo: 'Asistencia Técnica',
        descripcion: 'Completa los datos para iniciar tu consulta.',
        colorTema: '#ffffff',
        avatar: '🔧'
    };

    const [faseActiva, setFaseActiva] = useState(1);
    const [datosDispositivo, setDatosDispositivo] = useState({ modelo: '', falla: '' });

    const [mensaje, setMensaje] = useState('');
    const [historial, setHistorial] = useState([]);

    // NUEVO: Control del flujo interno del chat
    const [pasoChat, setPasoChat] = useState(1);
    const [detalleFalla, setDetalleFalla] = useState('');

    const iniciarConsulta = (e) => {
        e.preventDefault();
        if (!datosDispositivo.modelo.trim() || !datosDispositivo.falla.trim()) return;

        setHistorial([
            { actor: 'ia', texto: `Hola. Soy el asistente de ${datosTecnico.nombre}. Veo que tienes un problema con tu ${datosDispositivo.modelo} (${datosDispositivo.falla}). ¿Podrías brindarme más detalles de cómo ocurrió para que el técnico lo evalúe?` }
        ]);

        setFaseActiva(2);
    };

    const manejarMensajeChat = (e) => {
        e.preventDefault();
        if (!mensaje.trim()) return;

        const textoCliente = mensaje;
        setHistorial(prev => [...prev, { actor: 'cliente', texto: textoCliente }]);
        setMensaje('');

        setTimeout(() => {
            if (pasoChat === 1) {
                // El cliente acaba de dar los detalles. Le pedimos contacto.
                setDetalleFalla(textoCliente); // Guardamos este detalle para el ticket final
                setHistorial(prev => [...prev, {
                    actor: 'ia',
                    texto: 'Comprendo la situación. Para generar la orden oficial y que el laboratorio pueda contactarte con el presupuesto exacto, ¿me podrías indicar un número de teléfono o WhatsApp?'
                }]);
                setPasoChat(2);

            } else if (pasoChat === 2) {
                // El cliente (supuestamente) nos dio el teléfono. CERRAR VENTA.
                setHistorial(prev => [...prev, {
                    actor: 'ia',
                    texto: '¡Excelente! He registrado tu número y el caso ha sido enviado a la bandeja de entrada del taller. El técnico revisará los detalles y se pondrá en contacto a la brevedad.'
                }]);

                // RECIÉN AHORA generamos el ticket en la base de datos global
                const nuevoTicket = {
                    id: Date.now(),
                    equipo: datosDispositivo.modelo,
                    falla: `${datosDispositivo.falla} - Detalle: ${detalleFalla} - Teléfono: ${textoCliente}`,
                    presupuesto: 0,
                    estado: 'Ingresado',
                    tecnicoId: techId,
                    tipo: 'consulta', // Ingresa al Inbox, no al Taller activo
                    borrado: false
                };

                agregarTicket(nuevoTicket);
                setPasoChat(3); // Chat finalizado

            } else {
                // Si el cliente sigue escribiendo después de cerrar la orden
                setHistorial(prev => [...prev, {
                    actor: 'ia',
                    texto: 'Tu consulta ya se encuentra en revisión. Te contactaremos pronto al número indicado para continuar.'
                }]);
            }
        }, 1200);
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#000000',
            color: '#ffffff',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '5vh 20px',
            boxSizing: 'border-box'
        }}>

            <div style={{ position: 'absolute', top: '30px', left: '30px' }}>
                <Link to="/dashboard" style={{ color: '#666', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>
                    ← Volver al Dashboard
                </Link>
            </div>

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

            {faseActiva === 1 && (
                <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '60px', animation: 'fadeIn 0.5s ease' }}>

                    <section>
                        <h2 style={sectionTitleStyle}>Nuestra Calidad</h2>
                        <BeforeAfterSlider
                            imageBefore="https://images.unsplash.com/photo-1597740985671-2a8a3b80502e?q=80&w=600&auto=format&fit=crop"
                            imageAfter="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop"
                        />
                    </section>

                    {config?.mostrarPresupuestador !== false && (
                        <section>
                            <PriceEstimator config={config} />
                        </section>
                    )}

                    <section style={{ maxWidth: '500px', margin: '0 auto', width: '100%' }}>
                        <h2 style={sectionTitleStyle}>Inicia tu Consulta</h2>
                        <form onSubmit={iniciarConsulta} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                            <div>
                                <input
                                    type="text"
                                    value={datosDispositivo.modelo}
                                    onChange={(e) => setDatosDispositivo({ ...datosDispositivo, modelo: e.target.value })}
                                    placeholder="Modelo del Dispositivo (Ej. iPhone 13 Pro)"
                                    required
                                    style={minimalistInputStyle}
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    value={datosDispositivo.falla}
                                    onChange={(e) => setDatosDispositivo({ ...datosDispositivo, falla: e.target.value })}
                                    placeholder="Falla Principal (Ej. Pantalla astillada)"
                                    required
                                    style={minimalistInputStyle}
                                />
                            </div>
                            <button type="submit" style={minimalistButtonStyle}>
                                Iniciar Chat de Recepción
                            </button>
                        </form>
                    </section>
                </div>
            )}

            {faseActiva === 2 && (
                <main style={{ width: '100%', maxWidth: '500px', animation: 'fadeIn 0.5s ease' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', height: '550px' }}>
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
                                disabled={pasoChat === 3} // Deshabilitamos si ya terminó
                            />
                            <button type="submit" style={{ ...minimalistButtonStyle, padding: '0 30px', width: 'auto', marginTop: 0 }} disabled={pasoChat === 3}>
                                Enviar
                            </button>
                        </form>
                    </div>
                </main>
            )}
        </div>
    );
}

const sectionTitleStyle = { fontSize: '1.1rem', color: '#888', textTransform: 'uppercase', letterSpacing: '2px', textAlign: 'center', marginBottom: '30px', fontWeight: '500' };
const minimalistInputStyle = { width: '100%', padding: '16px 0', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #333333', color: '#ffffff', fontSize: '1.1rem', outline: 'none', transition: 'border-color 0.3s ease', boxSizing: 'border-box' };
const minimalistButtonStyle = { width: '100%', padding: '18px', backgroundColor: '#ffffff', color: '#000000', fontWeight: '600', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1.05rem', marginTop: '10px', transition: 'opacity 0.2s ease' };

export default ClientReception;