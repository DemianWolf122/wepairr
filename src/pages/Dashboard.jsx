import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import TicketCard from '../components/TicketCard';
import Settings from '../components/Settings';
import CommunityWiki from './CommunityWiki';
import MetricsView from './MetricsView';
import InventoryView from './InventoryView';
import { TicketContext } from '../context/TicketContext';
import './Dashboard.css';

const ContrastIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 2a10 10 0 0 0 0 20z" fill="currentColor"></path>
    </svg>
);

function Dashboard({ config, setConfig, theme, toggleTheme }) {
    const [seccionPrincipal, setSeccionPrincipal] = useState('gestion');
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

    return (
        <div className="dashboard-wrapper">
            <nav className="tech-navbar">
                <div className="tech-brand">
                    <Link to="/" style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>Wepairr <span style={{ color: 'var(--text-secondary)', fontWeight: 'normal' }}>Workspace</span></Link>
                </div>
                <div className="nav-menu">
                    <button type="button" className={`nav-link-btn ${seccionPrincipal === 'gestion' ? 'nav-link-active' : ''}`} onClick={() => setSeccionPrincipal('gestion')}>Gestión</button>
                    <button type="button" className={`nav-link-btn ${seccionPrincipal === 'metricas' ? 'nav-link-active' : ''}`} onClick={() => setSeccionPrincipal('metricas')}>Métricas</button>
                    <button type="button" className={`nav-link-btn ${seccionPrincipal === 'inventario' ? 'nav-link-active' : ''}`} onClick={() => setSeccionPrincipal('inventario')}>Inventario</button>
                    <button type="button" className={`nav-link-btn ${seccionPrincipal === 'comunidad' ? 'nav-link-active' : ''}`} onClick={() => setSeccionPrincipal('comunidad')}>Comunidad</button>
                    <button type="button" className={`nav-link-btn ${seccionPrincipal === 'configuracion' ? 'nav-link-active' : ''}`} onClick={() => setSeccionPrincipal('configuracion')}>Ajustes</button>
                </div>
                <div className="nav-actions">
                    <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); toggleTheme(); }}
                        className="theme-toggle-btn"
                        title="Cambiar Tema"
                    >
                        <ContrastIcon />
                    </button>
                    <Link to="/taller/tu-local" target="_blank" className="btn-view-site">Mi Vidriera ↗</Link>
                </div>
            </nav>

            <main className="dashboard-content">
                {seccionPrincipal === 'gestion' && (
                    <>
                        <header className="dashboard-tabs">
                            <button type="button" onClick={() => setVistaActual('inbox')} className={`tab-btn ${vistaActual === 'inbox' ? 'tab-active' : 'tab-inactive'}`}>📥 Inbox ({consultasNuevas.length})</button>
                            <button type="button" onClick={() => setVistaActual('activos')} className={`tab-btn ${vistaActual === 'activos' ? 'tab-active' : 'tab-inactive'}`}>🔧 Taller Activo ({reparacionesActivas.length})</button>
                            <button type="button" onClick={() => setVistaActual('papelera')} className={`tab-btn ${vistaActual === 'papelera' ? 'tab-active' : 'tab-inactive'}`}>🗑️ Papelera ({ticketsPapelera.length})</button>
                        </header>

                        <div className="ticket-list">
                            {ticketsMostrados.length === 0 && <p className="ticket-list-empty">{vistaActual === 'inbox' ? 'No hay consultas nuevas.' : 'No hay equipos en reparación.'}</p>}

                            {ticketsMostrados.map(ticket => (
                                <div key={ticket.id} className="ticket-item-wrapper">
                                    <TicketCard ticket={ticket} vista={vistaActual} onStatusChange={(id) => vistaActual === 'activos' ? ciclarEstado(id, ticket.estado) : null} onBudgetChange={actualizarPresupuesto} />

                                    {vistaActual === 'inbox' && (
                                        <div className="ticket-actions-absolute ticket-actions-inbox">
                                            <button type="button" onClick={() => convertirATicket(ticket.id)} className="action-btn btn-green">Aceptar</button>
                                            <button type="button" onClick={() => moverAPapelera(ticket.id)} className="action-btn btn-dark">Ignorar</button>
                                        </div>
                                    )}

                                    {vistaActual === 'papelera' && (
                                        <div className="ticket-actions-absolute ticket-actions-trash">
                                            <button type="button" onClick={() => restaurarTicket(ticket.id)} className="action-btn btn-green">Restaurar</button>
                                            <button type="button" onClick={() => eliminarDefinitivamente(ticket.id)} className="action-btn btn-red">Eliminar</button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {vistaActual !== 'papelera' && (
                            <div onDrop={handleDropTrash} onDragOver={(e) => { e.preventDefault(); setIsDragOverTrash(true); }} onDragLeave={() => setIsDragOverTrash(false)} className={`dropzone ${isDragOverTrash ? 'dropzone-active' : 'dropzone-idle'}`}>
                                <span className="dropzone-icon">🗑️</span>
                                <span>Arrastrá un ticket acá para descartarlo</span>
                            </div>
                        )}
                    </>
                )}

                {seccionPrincipal === 'metricas' && <MetricsView tickets={tickets} />}
                {seccionPrincipal === 'inventario' && <InventoryView />}
                {seccionPrincipal === 'comunidad' && <CommunityWiki />}
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