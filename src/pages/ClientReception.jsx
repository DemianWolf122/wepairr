import React, { useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TicketContext } from '../context/TicketContext';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import PriceEstimator from '../components/PriceEstimator';
import './ClientReception.css'; // <-- IMPORTAMOS EL CSS AQUÍ

function ClientReception({ config }) {
    const { techId } = useParams();
    const { agregarTicket } = useContext(TicketContext);

    const tituloSaaS = config?.titulo || 'Asistencia Técnica';
    const descripcionSaaS = config?.descripcion || 'Completa los datos para iniciar tu consulta.';
    const colorPrimario = config?.colorTema || '#ffffff';
    const nombreTaller = config?.nombreNegocio || 'Taller Wepairr';

    const imgAntes = config?.imagenAntes || "https://images.unsplash.com/photo-1597740985671-2a8a3b80502e?q=80&w=600&auto=format&fit=crop";
    const imgDespues = config?.imagenDespues || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop";

    const [faseActiva, setFaseActiva] = useState(1);
    const [datosDispositivo, setDatosDispositivo] = useState({ modelo: '', falla: '' });
    const [mensaje, setMensaje] = useState('');
    const [historial, setHistorial] = useState([]);
    const [pasoChat, setPasoChat] = useState(1);
    const [detalleFalla, setDetalleFalla] = useState('');

    const iniciarConsulta = (e) => {
        e.preventDefault();
        if (!datosDispositivo.modelo.trim() || !datosDispositivo.falla.trim()) return;

        setHistorial([
            { actor: 'ia', texto: `Hola. Soy el asistente de ${nombreTaller}. Veo que tienes un problema con tu ${datosDispositivo.modelo} (${datosDispositivo.falla}). ¿Podrías brindarme más detalles de cómo ocurrió para que el técnico lo evalúe?` }
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
                setDetalleFalla(textoCliente);
                setHistorial(prev => [...prev, {
                    actor: 'ia',
                    texto: 'Comprendo la situación. Para generar la orden oficial y que el laboratorio pueda contactarte con el presupuesto exacto, ¿me podrías indicar un número de teléfono o WhatsApp?'
                }]);
                setPasoChat(2);

            } else if (pasoChat === 2) {
                setHistorial(prev => [...prev, {
                    actor: 'ia',
                    texto: '¡Excelente! He registrado tu número y el caso ha sido enviado a la bandeja de entrada del taller. El técnico revisará los detalles y se pondrá en contacto a la brevedad.'
                }]);

                const nuevoTicket = {
                    id: Date.now(),
                    equipo: datosDispositivo.modelo,
                    falla: `${datosDispositivo.falla} - Detalle: ${detalleFalla} - Teléfono: ${textoCliente}`,
                    presupuesto: 0,
                    estado: 'Ingresado',
                    tecnicoId: techId,
                    tipo: 'consulta',
                    borrado: false
                };

                agregarTicket(nuevoTicket);
                setPasoChat(3);

            } else {
                setHistorial(prev => [...prev, {
                    actor: 'ia',
                    texto: 'Tu consulta ya se encuentra en revisión. Te contactaremos pronto al número indicado para continuar.'
                }]);
            }
        }, 1200);
    };

    return (
        <div className="client-reception-wrapper">
            <div className="back-nav">
                <Link to="/dashboard" className="back-link">← Volver al Dashboard</Link>
            </div>

            <header className="reception-header">
                <div className="header-avatar">🔧</div>
                <h1 className="header-title">{tituloSaaS}</h1>
                <p className="header-desc">{descripcionSaaS}</p>
            </header>

            {faseActiva === 1 && (
                <div className="phase-container">
                    <section>
                        <h2 className="section-title">Nuestra Calidad</h2>
                        <BeforeAfterSlider imageBefore={imgAntes} imageAfter={imgDespues} />
                    </section>

                    {config?.mostrarPresupuestador !== false && (
                        <section>
                            <PriceEstimator config={config} />
                        </section>
                    )}

                    <section className="form-container">
                        <h2 className="section-title">Inicia tu Consulta</h2>
                        <form onSubmit={iniciarConsulta} className="form-flex">
                            <input
                                type="text"
                                className="minimalist-input"
                                value={datosDispositivo.modelo}
                                onChange={(e) => setDatosDispositivo({ ...datosDispositivo, modelo: e.target.value })}
                                placeholder="Modelo del Dispositivo (Ej. iPhone 13 Pro)"
                                required
                            />
                            <input
                                type="text"
                                className="minimalist-input"
                                value={datosDispositivo.falla}
                                onChange={(e) => setDatosDispositivo({ ...datosDispositivo, falla: e.target.value })}
                                placeholder="Falla Principal (Ej. Pantalla astillada)"
                                required
                            />
                            <button
                                type="submit"
                                className="minimalist-button"
                                style={{ backgroundColor: colorPrimario, color: colorPrimario === '#ffffff' ? '#000' : '#fff' }}
                            >
                                Iniciar Chat de Recepción
                            </button>
                        </form>
                    </section>
                </div>
            )}

            {faseActiva === 2 && (
                <main className="chat-main">
                    <div className="chat-layout">
                        <div className="chat-history">
                            {historial.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`chat-message ${msg.actor === 'cliente' ? 'msg-cliente' : 'msg-ia'}`}
                                    style={msg.actor === 'cliente' ? { backgroundColor: colorPrimario !== '#ffffff' ? colorPrimario : '#222222' } : {}}
                                >
                                    {msg.texto}
                                </div>
                            ))}
                        </div>

                        <form onSubmit={manejarMensajeChat} className="chat-form">
                            <input
                                type="text"
                                className="minimalist-input"
                                value={mensaje}
                                onChange={(e) => setMensaje(e.target.value)}
                                placeholder="Escribe los detalles aquí..."
                                disabled={pasoChat === 3}
                            />
                            <button
                                type="submit"
                                className="minimalist-button"
                                style={{ backgroundColor: colorPrimario, color: colorPrimario === '#ffffff' ? '#000' : '#fff' }}
                                disabled={pasoChat === 3}
                            >
                                Enviar
                            </button>
                        </form>
                    </div>
                </main>
            )}
        </div>
    );
}

export default ClientReception;