import React, { useContext, useState } from 'react';
import TicketCard from '../components/TicketCard';
import ChatBox from '../components/ChatBox';
import Settings from '../components/Settings';
import { TicketContext } from '../context/TicketContext';

function Dashboard({ config, setConfig }) {
    const {
        tickets,
        actualizarEstadoTicket,
        moverAPapelera,
        restaurarTicket,
        eliminarDefinitivamente
    } = useContext(TicketContext);

    const [vistaActual, setVistaActual] = useState('activos');
    const [isDragOverTrash, setIsDragOverTrash] = useState(false);

    const ticketsMostrados = tickets.filter(t => vistaActual === 'activos' ? !t.borrado : t.borrado);

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

            {/* COLUMNA IZQUIERDA: Gestión de Tickets y Papelera (60%) */}
            <section style={{ flex: '1 1 500px', padding: '30px', minWidth: '320px', display: 'flex', flexDirection: 'column' }}>

                {/* Navegación de Pestañas */}
                <header style={{ display: 'flex', gap: '15px', borderBottom: '1px solid #333', paddingBottom: '15px', marginBottom: '25px' }}>
                    <button onClick={() => setVistaActual('activos')} style={vistaActual === 'activos' ? tabActiva : tabInactiva}>
                        Tickets Activos
                    </button>
                    <button onClick={() => setVistaActual('papelera')} style={vistaActual === 'papelera' ? tabActiva : tabInactiva}>
                        Papelera ({tickets.filter(t => t.borrado).length})
                    </button>
                </header>

                {/* Lista de Tickets */}
                <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px' }}>
                    {ticketsMostrados.length === 0 && <p style={{ color: '#666' }}>No hay elementos aquí.</p>}
                    {ticketsMostrados.map(ticket => (
                        <div key={ticket.id} style={{ position: 'relative' }}>
                            <TicketCard
                                ticket={ticket}
                                onStatusChange={(id) => vistaActual === 'activos' ? ciclarEstado(id, ticket.estado) : null}
                            />
                            {vistaActual === 'papelera' && (
                                <div style={{ position: 'absolute', top: '25px', right: '15px', display: 'flex', gap: '10px' }}>
                                    <button onClick={() => restaurarTicket(ticket.id)} style={btnStyle('#66bb6a', '#000')}>Restaurar</button>
                                    <button onClick={() => eliminarDefinitivamente(ticket.id)} style={btnStyle('#ff4d4d', '#fff')}>Eliminar</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Zona de Papelera (Dropzone) - Solo en Activos */}
                {vistaActual === 'activos' && (
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
                        <span style={{ fontSize: '2rem', display: 'block', marginBottom: '5px' }}>🗑️</span>
                        Arrastrá un ticket aquí para enviarlo a la papelera
                    </div>
                )}
            </section>

            {/* COLUMNA DERECHA: Configuración y Chat (40%) */}
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

// Estilos extraídos
const tabActiva = { backgroundColor: '#fff', color: '#000', padding: '10px 20px', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' };
const tabInactiva = { backgroundColor: 'transparent', color: '#888', padding: '10px 20px', border: '1px solid #333', borderRadius: '6px', cursor: 'pointer' };
const btnStyle = (bg, color) => ({ backgroundColor: bg, color: color, border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' });

export default Dashboard;