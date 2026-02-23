import React, { useContext, useState, useMemo, useEffect, useRef } from 'react';
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

const MoonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>;
const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg>;
const SvgInbox = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></svg>;
const SvgWrench = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>;
const SvgTrash = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>;
const SvgExternal = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></svg>;
const SvgSubTickets = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>;
const SvgSubFeatures = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3V2" /><path d="M5 10v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V10" /><path d="M18 21V9" /><path d="M6 21V9" /><path d="M2 10h20" /><path d="M12 21v-4" /><path d="M12 13V7" /><path d="M9 4h6a2 2 0 0 1 2 2v1H7V6a2 2 0 0 1 2-2Z" /></svg>;
const SvgAddTicket = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>;
const SvgSort = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="4" x2="14" y2="4" /><line x1="10" y1="4" x2="3" y2="4" /><line x1="21" y1="12" x2="12" y2="12" /><line x1="8" y1="12" x2="3" y2="12" /><line x1="21" y1="20" x2="16" y2="20" /><line x1="12" y1="20" x2="3" y2="20" /><line x1="14" y1="2" x2="14" y2="6" /><line x1="8" y1="10" x2="8" y2="14" /><line x1="16" y1="18" x2="16" y2="22" /></svg>;
const SvgChevronDown = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>;

// --- ICONOS PARA EL DROPDOWN DE ORDENAMIENTO ---
const SvgRecent = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
const SvgAlert = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>;
const SvgPin = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="17" x2="12" y2="22" /><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.68V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3v4.68a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" /></svg>;
const SvgHourglass = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 22h14" /><path d="M5 2h14" /><path d="M17 22v-4.172a2 2 0 0 0-.832-1.664L12 12l-4.168 4.164A2 2 0 0 0 7 17.828V22" /><path d="M7 2v4.172a2 2 0 0 0 .832 1.664L12 12l4.168-4.164A2 2 0 0 0 17 6.172V2" /></svg>;

function Dashboard({ config, setConfig, theme, toggleTheme }) {
    const [seccionPrincipal, setSeccionPrincipal] = useState('gestion');
    const [subSeccionGestion, setSubSeccionGestion] = useState('tickets');

    // Estados del Dropdown Premium
    const [criterioOrden, setCriterioOrden] = useState('recientes');
    const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    const { tickets, actualizarEstadoTicket, actualizarPresupuesto, moverAPapelera, restaurarTicket, eliminarDefinitivamente, convertirATicket, editarTicket } = useContext(TicketContext);

    const [vistaActual, setVistaActual] = useState('inbox');
    const [isDragOverTrash, setIsDragOverTrash] = useState(false);

    // Cerrar dropdown al hacer click afuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsSortMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Opciones del menú desplegable CON SVGs PREMIUM
    const sortOptions = [
        { id: 'recientes', label: 'Recientes Primero', icon: <SvgRecent /> },
        { id: 'prioridad', label: 'Urgentes Primero', icon: <SvgAlert /> },
        { id: 'estado', label: 'Ingresados Primero', icon: <SvgPin /> },
        { id: 'antiguos', label: 'Más Antiguos', icon: <SvgHourglass /> }
    ];

    const priorityWeight = { 'Urgente': 3, 'Alta': 2, 'Normal': 1, 'Baja': 0 };
    const statusWeight = { 'Ingresado': 3, 'En Proceso': 2, 'Finalizado': 1, 'Entregado': 0 };

    const ticketsMostrados = useMemo(() => {
        let base = [];
        if (vistaActual === 'inbox') base = tickets.filter(t => t.tipo === 'consulta' && !t.borrado);
        else if (vistaActual === 'activos') base = tickets.filter(t => t.tipo === 'ticket' && !t.borrado);
        else if (vistaActual === 'papelera') base = tickets.filter(t => t.borrado);

        return [...base].sort((a, b) => {
            if (criterioOrden === 'prioridad') {
                const diff = (priorityWeight[b.prioridad] || 0) - (priorityWeight[a.prioridad] || 0);
                return diff !== 0 ? diff : b.id - a.id;
            }
            if (criterioOrden === 'estado') {
                const diff = (statusWeight[b.estado] || 0) - (statusWeight[a.estado] || 0);
                return diff !== 0 ? diff : b.id - a.id;
            }
            if (criterioOrden === 'antiguos') return a.id - b.id;
            return b.id - a.id;
        });
    }, [tickets, vistaActual, criterioOrden]);

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

    const handleTicketCreated = () => setVistaActual('activos');

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

                        {subSeccionGestion === 'tickets' && (
                            <>
                                <header className="dashboard-tabs">
                                    <button onClick={() => setVistaActual('inbox')} className={`tab-btn ${vistaActual === 'inbox' ? 'tab-active' : 'tab-inactive'}`}><SvgInbox /> Inbox</button>
                                    <button onClick={() => setVistaActual('activos')} className={`tab-btn ${vistaActual === 'activos' ? 'tab-active' : 'tab-inactive'}`}><SvgWrench /> Activos</button>
                                    <button onClick={() => setVistaActual('papelera')} className={`tab-btn ${vistaActual === 'papelera' ? 'tab-active' : 'tab-inactive'}`}><SvgTrash /> Papelera</button>

                                    {/* --- DROPDOWN CUSTOM PREMIUM CON ICONOS SVG --- */}
                                    <div className="custom-sort-wrapper" ref={dropdownRef}>
                                        <div
                                            className={`custom-sort-header ${isSortMenuOpen ? 'active' : ''}`}
                                            onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                                        >
                                            <SvgSort className="sort-icon" />
                                            <span>{sortOptions.find(o => o.id === criterioOrden)?.label}</span>
                                            <SvgChevronDown className={`sort-chevron ${isSortMenuOpen ? 'open' : ''}`} />
                                        </div>

                                        {isSortMenuOpen && (
                                            <div className="custom-sort-menu animate-fade-in">
                                                {sortOptions.map(opt => (
                                                    <div
                                                        key={opt.id}
                                                        className={`custom-sort-item ${criterioOrden === opt.id ? 'active' : ''}`}
                                                        onClick={() => {
                                                            setCriterioOrden(opt.id);
                                                            setIsSortMenuOpen(false);
                                                        }}
                                                    >
                                                        <span className="sort-item-icon">{opt.icon}</span>
                                                        {opt.label}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* BOTÓN INGRESO MANUAL */}
                                    <button onClick={() => setVistaActual('nuevo')} className={`tab-btn tab-btn-action ${vistaActual === 'nuevo' ? 'tab-active' : 'tab-inactive'}`}>
                                        <SvgAddTicket /> Ingreso Manual
                                    </button>
                                </header>

                                {vistaActual === 'nuevo' ? (
                                    <NewTicketForm onTicketCreated={handleTicketCreated} />
                                ) : (
                                    <>
                                        <div className="ticket-list">
                                            {ticketsMostrados.length === 0 && <p className="ticket-list-empty">Sección vacía.</p>}
                                            {ticketsMostrados.map(ticket => (
                                                <div key={ticket.id} className="ticket-item-wrapper">
                                                    <TicketCard
                                                        ticket={ticket}
                                                        vista={vistaActual}
                                                        onStatusChange={(id) => vistaActual === 'activos' ? ciclarEstado(id, ticket.estado) : null}
                                                        onBudgetChange={actualizarPresupuesto}
                                                        onEditTicket={editarTicket}
                                                    />
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
                                        {vistaActual !== 'papelera' && ticketsMostrados.length > 0 && (
                                            <div onDrop={handleDropTrash} onDragOver={(e) => { e.preventDefault(); setIsDragOverTrash(true); }} onDragLeave={() => setIsDragOverTrash(false)} className={`dropzone ${isDragOverTrash ? 'dropzone-active' : 'dropzone-idle'}`}>
                                                <SvgTrash />
                                                <span>Soltar aquí para descartar</span>
                                            </div>
                                        )}
                                    </>
                                )}
                            </>
                        )}

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

            <AIChatAssistant />
        </div>
    );
}

export default Dashboard;