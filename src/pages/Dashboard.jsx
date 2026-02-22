import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import TicketCard from '../components/TicketCard';
import Settings from '../components/Settings';
import CommunityWiki from './CommunityWiki';
import MetricsView from './MetricsView';
import InventoryView from './InventoryView';
import ToolsView from './ToolsView';
import FeaturesManager from '../components/FeaturesManager';
import NewTicketForm from '../components/NewTicketForm';
import AIChatAssistant from '../components/AIChatAssistant';
import { TicketContext } from '../context/TicketContext';
import './Dashboard.css';

const MoonIcon = () => <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>;
const SunIcon = () => <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>;
const SvgSubTickets = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>;
const SvgSubFeatures = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline></svg>;

function Dashboard({ config, setConfig, theme, toggleTheme }) {
    const [seccionPrincipal, setSeccionPrincipal] = useState('gestion');
    const [subSeccionGestion, setSubSeccionGestion] = useState('tickets');
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
                    <button onClick={() => setSeccionPrincipal('gestion')} className={`nav-link-btn ${seccionPrincipal === 'gestion' ? 'nav-link-active' : ''}`}>Gestión</button>
                    <button onClick={() => setSeccionPrincipal('metricas')} className={`nav-link-btn ${seccionPrincipal === 'metricas' ? 'nav-link-active' : ''}`}>Métricas</button>
                    <button onClick={() => setSeccionPrincipal('inventario')} className={`nav-link-btn ${seccionPrincipal === 'inventario' ? 'nav-link-active' : ''}`}>Inventario</button>
                    <button onClick={() => setSeccionPrincipal('herramientas')} className={`nav-link-btn ${seccionPrincipal === 'herramientas' ? 'nav-link-active' : ''}`}>Herramientas</button>
                    <button onClick={() => setSeccionPrincipal('comunidad')} className={`nav-link-btn ${seccionPrincipal === 'comunidad' ? 'nav-link-active' : ''}`}>Comunidad</button>
                    <button onClick={() => setSeccionPrincipal('configuracion')} className={`nav-link-btn ${seccionPrincipal === 'configuracion' ? 'nav-link-active' : ''}`}>Ajustes</button>
                </div>
                <div className="nav-actions">
                    <button onClick={toggleTheme} className="theme-toggle-btn">
                        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                    </button>
                    <Link to={`/taller/${config.nombreNegocio?.toLowerCase().replace(/\s+/g, '-')}`} target="_blank" className="btn-view-site">Mi Vidriera ↗</Link>
                </div>
            </nav>

            <main className={`dashboard-content ${seccionPrincipal === 'configuracion' ? 'modo-editor-activo' : ''}`}>
                {seccionPrincipal === 'gestion' && (
                    <>
                        <div className="gestion-sub-nav">
                            <button className={`sub-nav-btn ${subSeccionGestion === 'tickets' ? 'active' : ''}`} onClick={() => setSubSeccionGestion('tickets')}>
                                <SvgSubTickets /> Tickets y Consultas
                            </button>
                            <button className={`sub-nav-btn ${subSeccionGestion === 'features' ? 'active' : ''}`} onClick={() => setSubSeccionGestion('features')}>
                                <SvgSubFeatures /> Funcionalidades de Vidriera
                            </button>
                        </div>

                        {subSeccionGestion === 'tickets' ? (
                            <>
                                <header className="dashboard-tabs">
                                    <button onClick={() => setVistaActual('inbox')} className={`tab-btn ${vistaActual === 'inbox' ? 'tab-active' : ''}`}>📥 Inbox ({consultasNuevas.length})</button>
                                    <button onClick={() => setVistaActual('activos')} className={`tab-btn ${vistaActual === 'activos' ? 'tab-active' : ''}`}>🔧 Activos ({reparacionesActivas.length})</button>
                                    <button onClick={() => setVistaActual('papelera')} className={`tab-btn ${vistaActual === 'papelera' ? 'tab-active' : ''}`}>🗑️ Papelera</button>
                                    <button onClick={() => setVistaActual('nuevo')} className={`tab-btn tab-btn-action ${vistaActual === 'nuevo' ? 'tab-active' : ''}`}>+ Ingreso Manual</button>
                                </header>

                                {vistaActual === 'nuevo' ? <NewTicketForm onTicketCreated={() => setVistaActual('activos')} /> : (
                                    <div className="ticket-list">
                                        {ticketsMostrados.map(ticket => (
                                            <div key={ticket.id} className="ticket-item-wrapper">
                                                <TicketCard ticket={ticket} vista={vistaActual} onStatusChange={(id) => actualizarEstadoTicket(id, 'Finalizado')} onBudgetChange={actualizarPresupuesto} />
                                                {vistaActual === 'inbox' && (
                                                    <div className="ticket-actions-absolute">
                                                        <button onClick={() => convertirATicket(ticket.id)} className="action-btn btn-green">Aceptar</button>
                                                        <button onClick={() => moverAPapelera(ticket.id)} className="action-btn btn-dark">Ignorar</button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {vistaActual !== 'papelera' && vistaActual !== 'nuevo' && (
                                    <div onDrop={handleDropTrash} onDragOver={(e) => { e.preventDefault(); setIsDragOverTrash(true); }} onDragLeave={() => setIsDragOverTrash(false)} className={`dropzone ${isDragOverTrash ? 'dropzone-active' : ''}`}>
                                        Arrastrá aquí para descartar
                                    </div>
                                )}
                            </>
                        ) : <FeaturesManager config={config} onUpdate={setConfig} />}
                    </>
                )}
                {seccionPrincipal === 'metricas' && <MetricsView tickets={tickets} />}
                {seccionPrincipal === 'inventario' && <InventoryView />}
                {seccionPrincipal === 'herramientas' && <ToolsView />}
                {seccionPrincipal === 'comunidad' && <CommunityWiki />}
                {seccionPrincipal === 'configuracion' && <Settings config={config} onUpdate={setConfig} />}
            </main>
            <AIChatAssistant />
        </div>
    );
}
export default Dashboard;