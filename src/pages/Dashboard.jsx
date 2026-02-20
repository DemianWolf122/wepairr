import React, { useContext, useState } from 'react';
import TicketCard from '../components/TicketCard';
import { TicketContext } from '../context/TicketContext';

function Dashboard() {
    const {
        tickets,
        actualizarEstadoTicket,
        moverAPapelera,
        restaurarTicket,
        eliminarDefinitivamente
    } = useContext(TicketContext);

    // Estado para alternar entre ver los Activos y la Papelera
    const [vistaActual, setVistaActual] = useState('activos'); // 'activos' o 'papelera'

    // Estado para el efecto visual de la papelera cuando se arrastra algo encima
    const [isDragOverTrash, setIsDragOverTrash] = useState(false);

    // Filtramos los tickets según la vista
    const ticketsMostrados = tickets.filter(t => vistaActual === 'activos' ? !t.borrado : t.borrado);

    const ciclarEstado = (id, estadoActual) => {
        const SECUENCIA_ESTADOS = ['Ingresado', 'En Proceso', 'Finalizado', 'Entregado'];
        const indiceActual = SECUENCIA_ESTADOS.indexOf(estadoActual);
        const siguienteIndice = (indiceActual + 1) % SECUENCIA_ESTADOS.length;
        actualizarEstadoTicket(id, SECUENCIA_ESTADOS[siguienteIndice]);
    };

    // Lógica para cuando se suelta un ticket en el tacho
    const handleDropTrash = (e) => {
        e.preventDefault();
        setIsDragOverTrash(false);
        const ticketId = parseInt(e.dataTransfer.getData('ticketId'), 10);
        if (ticketId) {
            moverAPapelera(ticketId); // Lo marca como borrado y desaparece de la vista activa
        }
    };

    const handleDragOverTrash = (e) => {
        e.preventDefault(); // Necesario para permitir el "drop"
        setIsDragOverTrash(true);
    };

    const handleDragLeaveTrash = () => {
        setIsDragOverTrash(false);
    };

    return (
        <main style={{ minHeight: '100vh', backgroundColor: '#000000', color: '#ffffff', padding: '30px', fontFamily: 'system-ui' }}>

            {/* Navegación superior (Tabs) */}
            <header style={{ display: 'flex', gap: '20px', borderBottom: '1px solid #333', paddingBottom: '20px', marginBottom: '30px' }}>
                <button
                    onClick={() => setVistaActual('activos')}
                    style={vistaActual === 'activos' ? tabActiva : tabInactiva}
                >
                    Tickets Activos
                </button>
                <button
                    onClick={() => setVistaActual('papelera')}
                    style={vistaActual === 'papelera' ? tabActiva : tabInactiva}
                >
                    Papelera ({tickets.filter(t => t.borrado).length})
                </button>
            </header>

            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>

                {/* Columna Principal: Lista de Tickets */}
                <section style={{ flex: '1 1 500px' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>
                        {vistaActual === 'activos' ? 'Gestión de Reparaciones' : 'Elementos Eliminados'}
                    </h2>

                    {ticketsMostrados.length === 0 && (
                        <p style={{ color: '#666' }}>No hay elementos en esta vista.</p>
                    )}

                    <div className="lista-tickets">
                        {ticketsMostrados.map(ticket => (
                            <div key={ticket.id} style={{ position: 'relative' }}>
                                <TicketCard
                                    ticket={ticket}
                                    onStatusChange={(id) => vistaActual === 'activos' ? ciclarEstado(id, ticket.estado) : null}
                                />

                                {/* Botones adicionales si estamos en la papelera */}
                                {vistaActual === 'papelera' && (
                                    <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '10px' }}>
                                        <button onClick={() => restaurarTicket(ticket.id)} style={btnStyle('#4CAF50')}>Restaurar</button>
                                        <button onClick={() => eliminarDefinitivamente(ticket.id)} style={btnStyle('#F44336')}>Borrar Permanente</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Columna Secundaria: Zona de Papelera (Solo visible en Activos) */}
                {vistaActual === 'activos' && (
                    <section style={{ flex: '0 0 300px' }}>
                        <div
                            onDrop={handleDropTrash}
                            onDragOver={handleDragOverTrash}
                            onDragLeave={handleDragLeaveTrash}
                            className={isDragOverTrash ? 'trash-zone-active' : ''}
                            style={{
                                border: '2px dashed #444',
                                borderRadius: '16px',
                                height: '200px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: isDragOverTrash ? '#ff4d4d' : '#666',
                                transition: 'all 0.3s ease',
                                backgroundColor: '#111'
                            }}
                        >
                            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🗑️</div>
                            <p style={{ margin: 0, fontWeight: 'bold' }}>Arrastra aquí para eliminar</p>
                        </div>
                    </section>
                )}

            </div>
        </main>
    );
}

const tabActiva = {
    backgroundColor: '#ffffff',
    color: '#000000',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer'
};

const tabInactiva = {
    backgroundColor: 'transparent',
    color: '#888',
    padding: '10px 20px',
    border: '1px solid #333',
    borderRadius: '8px',
    cursor: 'pointer'
};

const btnStyle = (color) => ({
    backgroundColor: color,
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: 'bold'
});

export default Dashboard;