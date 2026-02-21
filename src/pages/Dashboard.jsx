import React, { useContext, useState } from 'react';
import TicketCard from '../components/TicketCard';
import ChatBox from '../components/ChatBox';
import Settings from '../components/Settings';
import { TicketContext } from '../context/TicketContext';
import './Dashboard.css';

function Dashboard({ config, setConfig }) {
    const { tickets, actualizarEstadoTicket, actualizarPresupuesto, moverAPapelera, restaurarTicket, eliminarDefinitivamente, convertirATicket } = useContext(TicketContext);
    const [vistaActual, setVistaActual] = useState('inbox');
    const [isDragOverTrash, setIsDragOverTrash] = useState(false);

    const consultasNuevas = tickets.filter(t => t.tipo === 'consulta' && !t.borrado);
    const reparacionesActivas = tickets.filter(t => t.tipo === 'ticket' && !t.borrado);
    const ticketsPapelera = tickets.filter(t => t.borrado);

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

    return (
        <main className="dashboard-main">
            <section className="dashboard-col-left">
                <header className="dashboard-tabs">
                    <button onClick={() => setVistaActual('inbox')} className={`tab-btn ${vistaActual === 'inbox' ? 'tab-active' : 'tab-inactive'}`}>📥 Inbox ({consultasNuevas.length})</button>
                    <button onClick={() => setVistaActual('activos')} className={`tab-btn ${vistaActual === 'activos' ? 'tab-active' : 'tab-inactive'}`}>🔧 Taller ({reparacionesActivas.length})</button>
                    <button onClick={() => setVistaActual('papelera')} className={`tab-btn ${vistaActual === 'papelera' ? 'tab-active' : 'tab-inactive'}`}>🗑️ Papelera ({ticketsPapelera.length})</button>
                </header>

                <div className="ticket-list">
                    {ticketsMostrados.length === 0 && <p className="ticket-list-empty">{vistaActual === 'inbox' ? 'No hay consultas nuevas.' : 'No hay trabajos en curso.'}</p>}

                    {ticketsMostrados.map(ticket => (
                        <div key={ticket.id} className="ticket-item-wrapper">
                            <TicketCard ticket={ticket} vista={vistaActual} onStatusChange={(id) => vistaActual === 'activos' ? ciclarEstado(id, ticket.estado) : null} onBudgetChange={actualizarPresupuesto} />

                            {vistaActual === 'inbox' && (
                                <div className="ticket-actions-absolute ticket-actions-inbox">
                                    <button onClick={() => convertirATicket(ticket.id)} className="action-btn btn-green">Aceptar</button>
                                    <button onClick={() => moverAPapelera(ticket.id)} className="action-btn btn-dark">Ignorar</button>
                                </div>
                            )}

                            {vistaActual === 'papelera' && (
                                <div className="ticket-actions-absolute ticket-actions-trash">
                                    <button onClick={() => restaurarTicket(ticket.id)} className="action-btn btn-green">Restaurar</button>
                                    <button onClick={() => eliminarDefinitivamente(ticket.id)} className="action-btn btn-red">Eliminar</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {vistaActual !== 'papelera' && (
                    <div onDrop={handleDropTrash} onDragOver={handleDragOverTrash} onDragLeave={() => setIsDragOverTrash(false)} className={`dropzone ${isDragOverTrash ? 'dropzone-active' : 'dropzone-idle'}`}>
                        <span className="dropzone-icon">🗑️</span>
                        <span>Arrastrá acá para descartar</span>
                    </div>
                )}
            </section>

            <section className="dashboard-col-right">
                <Settings config={config} onUpdate={setConfig} />
                <div className="chatbox-container">
                    <h3 className="chatbox-title">Asistente IA (Taller)</h3>
                    <ChatBox onProcesarMensaje={() => { }} />
                </div>
            </section>
        </main>
    );
}
export default Dashboard;