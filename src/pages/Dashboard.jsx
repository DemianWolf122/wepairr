import React, { useContext, useState } from 'react';
import TicketCard from '../components/TicketCard';
import ChatBox from '../components/ChatBox';
import Settings from '../components/Settings';
import { TicketContext } from '../context/TicketContext';

function Dashboard({ config, setConfig }) {
    const {
        tickets,
        actualizarEstadoTicket,
        actualizarPresupuesto,
        moverAPapelera,
        restaurarTicket,
        eliminarDefinitivamente,
        convertirATicket // Esta es la función nueva que agregamos al contexto
    } = useContext(TicketContext);

    // Ahora tenemos 3 vistas: 'inbox', 'activos' y 'papelera'
    const [vistaActual, setVistaActual] = useState('inbox');
    const [isDragOverTrash, setIsDragOverTrash] = useState(false);

    // FILTRADO INTELIGENTE DE DATOS
    const consultasNuevas = tickets.filter(t => t.tipo === 'consulta' && !t.borrado);
    const reparacionesActivas = tickets.filter(t => t.tipo === 'ticket' && !t.borrado);
    const ticketsPapelera = tickets.filter(t => t.borrado);

    // Definimos qué lista mostrar según la pestaña
    const obtenerTicketsAMostrar = () => {
        if (vistaActual === 'inbox') return consultasNuevas;
        if (vistaActual === 'activos') return reparacionesActivas;
        return ticketsPapelera;
    };

    const ticketsMostrados = obtenerTicketsAMostrar();

    const ciclarEstado = (id, estadoActual) => {
        const SECUENCIA_ESTADOS = ['Ingresado', 'En Proceso', 'Finalizado', 'Entregado'];
        const indiceActual = SECUENCIA_ESTADOS.indexOf(estadoActual);
        const siguienteIndice = (indiceActual + 1) % SECUENCIA_ESTADOS.length;
        actualizarEstadoTicket(id, SECUENCIA_ESTADOS[siguienteIndice]);
    };

    const handleDropTrash = (e) => {
        e.preventDefault();
        setIsDragOverTrash(false);
        const ticketId = parseInt(e.dataTransfer.getData('ticketId'), 10);
        if (ticketId) moverAPapelera(ticketId);
    };

    const handleDragOverTrash = (e) => {
        e.preventDefault();
        setIsDragOverTrash(true);
    };

    const handleDragLeaveTrash = () => setIsDragOverTrash(false);

    return (
        <main style={{ display: 'flex', flexWrap: 'wrap', minHeight: '100vh', backgroundColor: '#000000', color: '#ffffff', fontFamily: 'system-ui' }}>

            {/* COLUMNA IZQUIERDA: Gestión (60%) */}
            <section style={{ flex: '1 1 500px', padding: '30px', minWidth: '320px', display: 'flex', flexDirection: 'column' }}>

                {/* Navegación de Pestañas con contadores */}
                <header style={{ display: 'flex', gap: '15px', borderBottom: '1px solid #333', paddingBottom: '15px', marginBottom: '25px' }}>
                    <button onClick={() => setVistaActual('inbox')} style={vistaActual === 'inbox' ? tabActiva : tabInactiva}>
                        📥 Inbox ({consultasNuevas.length})
                    </button>
                    <button onClick={() => setVistaActual('activos')} style={vistaActual === 'activos' ? tabActiva : tabInactiva}>
                        🔧 Taller ({reparacionesActivas.length})
                    </button>
                    <button onClick={() => setVistaActual('papelera')} style={vistaActual === 'papelera' ? tabActiva : tabInactiva}>
                        Papelera ({ticketsPapelera.length})
                    </button>
                </header>

                {/* Lista Dinámica de Tickets/Consultas */}
                <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px' }}>
                    {ticketsMostrados.length === 0 && (
                        <p style={{ color: '#666', textAlign: 'center', marginTop: '20px' }}>
                            {vistaActual === 'inbox' ? 'No hay consultas nuevas.' : 'No hay trabajos en curso.'}
                        </p>
                    )}

                    {ticketsMostrados.map(ticket => (
                        <div key={ticket.id} style={{ position: 'relative', marginBottom: '15px' }}>
                            <TicketCard
                                ticket={ticket}
                                vista={vistaActual}
                                onStatusChange={(id) => vistaActual === 'activos' ? ciclarEstado(id, ticket.estado) : null}
                                onBudgetChange={actualizarPresupuesto} // <-- Pasamos la función
                            />
                            {/* Acciones especiales para el INBOX */}
                            {vistaActual === 'inbox' && (
                                <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '8px' }}>
                                    <button onClick={() => convertirATicket(ticket.id)} style={btnStyle('#66bb6a', '#000')}>Aceptar</button>
                                    <button onClick={() => moverAPapelera(ticket.id)} style={btnStyle('#333', '#fff')}>Ignorar</button>
                                </div>
                            )}

                            {/* Acciones especiales para la PAPELERA */}
                            {vistaActual === 'papelera' && (
                                <div style={{ position: 'absolute', top: '25px', right: '15px', display: 'flex', gap: '10px' }}>
                                    <button onClick={() => restaurarTicket(ticket.id)} style={btnStyle('#66bb6a', '#000')}>Restaurar</button>
                                    <button onClick={() => eliminarDefinitivamente(ticket.id)} style={btnStyle('#ff4d4d', '#fff')}>Eliminar</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Zona de Papelera (Dropzone) */}
                {vistaActual !== 'papelera' && (
                    <div
                        onDrop={handleDropTrash}
                        onDragOver={handleDragOverTrash}
                        onDragLeave={handleDragLeaveTrash}
                        style={{
                            border: `2px dashed ${isDragOverTrash ? '#ff4d4d' : '#333'}`,
                            backgroundColor: isDragOverTrash ? '#1a0505' : '#0a0a0a',
                            borderRadius: '12px', padding: '20px', textAlign: 'center', transition: 'all 0.2s', color: isDragOverTrash ? '#ff4d4d' : '#666'
                        }}
                    >
                        <span style={{ fontSize: '1.5rem', display: 'block' }}>🗑️ Arrastrá acá para descartar</span>
                    </div>
                )}
            </section>

            {/* COLUMNA DERECHA: Configuración (40%) */}
            <section style={{ flex: '1 1 400px', padding: '30px', borderLeft: window.innerWidth > 800 ? '1px solid #222' : 'none', backgroundColor: '#050505' }}>
                <Settings config={config} onUpdate={setConfig} />
                <div style={{ marginTop: '30px', height: '450px' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '15px', color: '#aaa' }}>Asistente IA (Taller)</h3>
                    <ChatBox onProcesarMensaje={() => { }} />
                </div>
            </section>

        </main>
    );
}

// Estilos extraídos (Mantenemos tu estética minimalista)
const tabActiva = { backgroundColor: '#fff', color: '#000', padding: '10px 20px', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' };
const tabInactiva = { backgroundColor: 'transparent', color: '#888', padding: '10px 20px', border: '1px solid #333', borderRadius: '6px', cursor: 'pointer' };
const btnStyle = (bg, color) => ({ backgroundColor: bg, color: color, border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' });

export default Dashboard;