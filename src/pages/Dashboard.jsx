import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import TicketCard from '../components/TicketCard';
import Settings from '../components/Settings';
import CommunityWiki from './CommunityWiki';
import MetricsView from './MetricsView';
import InventoryView from './InventoryView';
import ToolsView from './ToolsView';
import FeaturesManager from '../components/FeaturesManager'; // <-- NUEVA IMPORTACIÓN
import { TicketContext } from '../context/TicketContext';
import './Dashboard.css';

// ... (TUS COMPONENTES SVG EXISTENTES: MoonIcon, SunIcon, SvgInbox, SvgWrench, SvgTrash, SvgExternal) ...
const MoonIcon = () => <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>;
const SunIcon = () => <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>;
const SvgInbox = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path></svg>;
const SvgWrench = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>;
const SvgTrash = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const SvgExternal = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>;

// SVG para la sub-navegación
const SvgSubTickets = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
const SvgSubFeatures = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>;

function Dashboard({ config, setConfig, theme, toggleTheme }) {
    const [seccionPrincipal, setSeccionPrincipal] = useState('gestion');
    // Nuevo estado para la sub-sección de gestión
    const [subSeccionGestion, setSubSeccionGestion] = useState('tickets');

    const { tickets, actualizarEstadoTicket, actualizarPresupuesto, moverAPapelera, convertirATicket } = useContext(TicketContext);
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
                    <button onClick={() => setSeccionPrincipal('gestion')} className={`nav-link-btn ${seccionPrincipal === 'gestion' ? 'nav-link-active' : ''}`}>Gestión</button>
                    <button onClick={() => setSeccionPrincipal('metricas')} className={`nav-link-btn ${seccionPrincipal === 'metricas' ? 'nav-link-active' : ''}`}>Métricas</button>
                    <button onClick={() => setSeccionPrincipal('inventario')} className={`nav-link-btn ${seccionPrincipal === 'inventario' ? 'nav-link-active' : ''}`}>Inventario</button>
                    <button onClick={() => setSeccionPrincipal('herramientas')} className={`nav-link-btn ${seccionPrincipal === 'herramientas' ? 'nav-link-active' : ''}`}>Herramientas</button>
                    <button onClick={() => setSeccionPrincipal('comunidad')} className={`nav-link-btn ${seccionPrincipal === 'comunidad' ? 'nav-link-active' : ''}`}>Comunidad</button>
                    <button onClick={() => setSeccionPrincipal('configuracion')} className={`nav-link-btn ${seccionPrincipal === 'configuracion' ? 'nav-link-active' : ''}`}>Ajustes</button>
                </div>
                <div className="nav-actions">
                    <button onClick={toggleTheme} className="theme-toggle-btn" title="Cambiar Tema">
                        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                    </button>
                    <Link to={`/taller/${config.nombreNegocio?.toLowerCase().replace(/\s+/g, '-') || 'tu-local'}`} target="_blank" className="btn-view-site">
                        Mi Vidriera <SvgExternal />
                    </Link>
                </div>
            </nav>

            <main className={`dashboard-content ${seccionPrincipal === 'configuracion' ? 'modo-editor-activo' : ''}`}>

                {/* LÓGICA DE LA SECCIÓN GESTIÓN CON SUB-PESTAÑAS */}
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

                        {/* VISTA DE TICKETS (Lo que ya tenías) */}
                        {subSeccionGestion === 'tickets' && (
                            <>
                                <header className="dashboard-tabs">
                                    <button onClick={() => setVistaActual('inbox')} className={`tab-btn ${vistaActual === 'inbox' ? 'tab-active' : 'tab-inactive'}`}><SvgInbox /> Inbox ({consultasNuevas.length})</button>
                                    <button onClick={() => setVistaActual('activos')} className={`tab-btn ${vistaActual === 'activos' ? 'tab-active' : 'tab-inactive'}`}><SvgWrench /> Taller Activo ({reparacionesActivas.length})</button>
                                    <button onClick={() => setVistaActual('papelera')} className={`tab-btn ${vistaActual === 'papelera' ? 'tab-active' : 'tab-inactive'}`}><SvgTrash /> Papelera ({ticketsPapelera.length})</button>
                                </header>

                                <div className="ticket-list">
                                    {ticketsMostrados.length === 0 && <p className="ticket-list-empty">{vistaActual === 'inbox' ? 'No hay consultas nuevas.' : 'No hay equipos en reparación.'}</p>}
                                    {ticketsMostrados.map(ticket => (
                                        <div key={ticket.id} className="ticket-item-wrapper">
                                            <TicketCard ticket={ticket} vista={vistaActual} onStatusChange={(id) => vistaActual === 'activos' ? ciclarEstado(id, ticket.estado) : null} onBudgetChange={actualizarPresupuesto} />
                                            {vistaActual === 'inbox' && (
                                                <div className="ticket-actions-absolute ticket-actions-inbox">
                                                    <button onClick={() => convertirATicket(ticket.id)} className="action-btn btn-green">Aceptar</button>
                                                    <button onClick={() => moverAPapelera(ticket.id)} className="action-btn btn-dark">Ignorar</button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {vistaActual !== 'papelera' && (
                                    <div onDrop={handleDropTrash} onDragOver={(e) => { e.preventDefault(); setIsDragOverTrash(true); }} onDragLeave={() => setIsDragOverTrash(false)} className={`dropzone ${isDragOverTrash ? 'dropzone-active' : 'dropzone-idle'}`}>
                                        <SvgTrash />
                                        <span>Arrastrá un ticket acá para descartarlo</span>
                                    </div>
                                )}
                            </>
                        )}

                        {/* VISTA DEL NUEVO GESTOR DE FUNCIONALIDADES */}
                        {subSeccionGestion === 'features' && (
                            <FeaturesManager config={config} onUpdate={setConfig} />
                        )}
                    </>
                )}

                {seccionPrincipal === 'metricas' && <MetricsView tickets={tickets} />}
                {seccionPrincipal === 'inventario' && <InventoryView />}
                {seccionPrincipal === 'herramientas' && <ToolsView />}
                {seccionPrincipal === 'comunidad' && <CommunityWiki />}
                {seccionPrincipal === 'configuracion' && <Settings config={config} onUpdate={setConfig} />}
            </main>
        </div>
    );
}
export default Dashboard;