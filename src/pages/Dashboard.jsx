import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import TicketCard from '../components/TicketCard';
import Settings from '../components/Settings';
import { TicketContext } from '../context/TicketContext';
import './Dashboard.css';

function Dashboard({ config, setConfig }) {
    // ESTADO PARA NAVEGACIÓN SUPERIOR (Gestión vs Configuración)
    const [seccionPrincipal, setSeccionPrincipal] = useState('gestion');

    const { tickets, actualizarEstadoTicket, actualizarPresupuesto, moverAPapelera, restaurarTicket, eliminarDefinitivamente, convertirATicket } = useContext(TicketContext);

    // ESTADO PARA PESTAÑAS INTERNAS DE GESTIÓN
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

    return (
        <div className="dashboard-wrapper">
            {/* --- NAVBAR DEL TÉCNICO --- */}
            <nav className="tech-navbar">
                <div className="tech-brand">
                    {/* Convertimos el logo en un Link que lleva a Home */}
                    <Link to="/" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        Wepairr <span style={{ color: '#666', fontWeight: 'normal' }}>Workspace</span>
                    </Link>
                </div>
                <div className="nav-menu">
                    <button
                        className={`nav-link-btn ${seccionPrincipal === 'gestion' ? 'nav-link-active' : ''}`}
                        onClick={() => setSeccionPrincipal('gestion')}
                    >
                        Tablero de Gestión
                    </button>
                    <button
                        className={`nav-link-btn ${seccionPrincipal === 'configuracion' ? 'nav-link-active' : ''}`}
                        onClick={() => setSeccionPrincipal('configuracion')}
                    >
                        Configurar Vidriera
                    </button>
                </div>
                <div className="nav-actions">
                    <Link to="/taller/electro-fix" target="_blank" className="btn-view-site">
                        Ver mi Web ↗
                    </Link>
                </div>
            </nav>

            {/* --- ÁREA DE TRABAJO --- */}
            <main className="dashboard-content">

                {/* VISTA 1: GESTIÓN DE TICKETS */}
                {seccionPrincipal === 'gestion' && (
                    <>
                        <header className="dashboard-tabs">
                            <button onClick={() => setVistaActual('inbox')} className={`tab-btn ${vistaActual === 'inbox' ? 'tab-active' : 'tab-inactive'}`}>📥 Inbox ({consultasNuevas.length})</button>
                            <button onClick={() => setVistaActual('activos')} className={`tab-btn ${vistaActual === 'activos' ? 'tab-active' : 'tab-inactive'}`}>🔧 Taller Activo ({reparacionesActivas.length})</button>
                            <button onClick={() => setVistaActual('papelera')} className={`tab-btn ${vistaActual === 'papelera' ? 'tab-active' : 'tab-inactive'}`}>🗑️ Papelera ({ticketsPapelera.length})</button>
                        </header>

                        <div className="ticket-list">
                            {ticketsMostrados.length === 0 && <p className="ticket-list-empty">{vistaActual === 'inbox' ? 'No hay consultas nuevas en el buzón.' : 'No hay equipos en reparación actualmente.'}</p>}

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
                                            <button onClick={() => eliminarDefinitivamente(ticket.id)} className="action-btn btn-red">Eliminar Permanente</button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Dropzone siempre visible al fondo de la pantalla de gestión */}
                        {vistaActual !== 'papelera' && (
                            <div onDrop={handleDropTrash} onDragOver={(e) => { e.preventDefault(); setIsDragOverTrash(true); }} onDragLeave={() => setIsDragOverTrash(false)} className={`dropzone ${isDragOverTrash ? 'dropzone-active' : 'dropzone-idle'}`}>
                                <span className="dropzone-icon">🗑️</span>
                                <span>Arrastrá un ticket acá para descartarlo</span>
                            </div>
                        )}
                    </>
                )}

                {/* VISTA 2: CONFIGURACIÓN DE LA VIDRIERA */}
                {seccionPrincipal === 'configuracion' && (
                    <div className="settings-full-container">
                        <Settings config={config} onUpdate={setConfig} />
                    </div>
                )}

            </main>
        </div>
    );
}

export default Dashboard;