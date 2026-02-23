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

// --- SVGs GENERALES ---
const MoonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>;
const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg>;
const SvgInbox = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></svg>;
const SvgWrench = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>;
const SvgTrash = () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>;
const SvgExternal = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></svg>;
const SvgSubTickets = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>;
const SvgSubFeatures = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3V2" /><path d="M5 10v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V10" /><path d="M18 21V9" /><path d="M6 21V9" /><path d="M2 10h20" /><path d="M12 21v-4" /><path d="M12 13V7" /><path d="M9 4h6a2 2 0 0 1 2 2v1H7V6a2 2 0 0 1 2-2Z" /></svg>;
const SvgAddTicket = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>;
const SvgX = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>;
const SvgChevronDown = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>;
const SvgSort = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="4" x2="14" y2="4" /><line x1="10" y1="4" x2="3" y2="4" /><line x1="21" y1="12" x2="12" y2="12" /><line x1="8" y1="12" x2="3" y2="12" /><line x1="21" y1="20" x2="16" y2="20" /><line x1="12" y1="20" x2="3" y2="20" /><line x1="14" y1="2" x2="14" y2="6" /><line x1="8" y1="10" x2="8" y2="14" /><line x1="16" y1="18" x2="16" y2="22" /></svg>;
const SvgMonitor = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>;
const SvgTag = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>;
const SvgSearch = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>;
const SvgRecent = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
const SvgAlert = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>;
const SvgPin = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="17" x2="12" y2="22" /><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.68V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3v4.68a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" /></svg>;
const SvgHourglass = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 22h14" /><path d="M5 2h14" /><path d="M17 22v-4.172a2 2 0 0 0-.832-1.664L12 12l-4.168 4.164A2 2 0 0 0 7 17.828V22" /><path d="M7 2v4.172a2 2 0 0 0 .832 1.664L12 12l4.168-4.164A2 2 0 0 0 17 6.172V2" /></svg>;

function Dashboard({ config, setConfig, theme, toggleTheme }) {
    const [seccionPrincipal, setSeccionPrincipal] = useState('gestion');
    const [subSeccionGestion, setSubSeccionGestion] = useState('tickets');

    const [busqueda, setBusqueda] = useState('');
    const [criterioOrden, setCriterioOrden] = useState('recientes');
    const [filtroTipo, setFiltroTipo] = useState('todos');
    const [filtroEstado, setFiltroEstado] = useState('todos');

    // ESTADO PARA EL BOTÓN FLOTANTE (REEMPLAZA EL DRAG AND DROP)
    const [isDeleteMode, setIsDeleteMode] = useState(false);

    const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
    const [isTipoMenuOpen, setIsTipoMenuOpen] = useState(false);
    const [isEstadoMenuOpen, setIsEstadoMenuOpen] = useState(false);

    const sortRef = useRef(null);
    const tipoRef = useRef(null);
    const estadoRef = useRef(null);

    const { tickets, actualizarEstadoTicket, actualizarPresupuesto, moverAPapelera, restaurarTicket, eliminarDefinitivamente, convertirATicket, editarTicket } = useContext(TicketContext);

    const [vistaActual, setVistaActual] = useState('activos');

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sortRef.current && !sortRef.current.contains(event.target)) setIsSortMenuOpen(false);
            if (tipoRef.current && !tipoRef.current.contains(event.target)) setIsTipoMenuOpen(false);
            if (estadoRef.current && !estadoRef.current.contains(event.target)) setIsEstadoMenuOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const sortOptions = [
        { id: 'recientes', label: 'Recientes Primero', icon: <SvgRecent /> },
        { id: 'prioridad', label: 'Urgentes Primero', icon: <SvgAlert /> },
        { id: 'estado', label: 'Ingresados Primero', icon: <SvgPin /> },
        { id: 'antiguos', label: 'Más Antiguos', icon: <SvgHourglass /> }
    ];

    const tipoOptions = [
        { id: 'todos', label: 'Todos los Equipos' },
        { id: 'celular', label: 'Celulares / Tablets' },
        { id: 'pc', label: 'PCs / Notebooks' },
        { id: 'gpu', label: 'Placas de Video' },
        { id: 'consola', label: 'Consolas' }
    ];

    const estadoOptions = [
        { id: 'todos', label: 'Cualquier Estado' },
        { id: 'Ingresado', label: 'Solo Ingresados' },
        { id: 'En Proceso', label: 'Solo En Proceso' },
        { id: 'Finalizado', label: 'Solo Finalizados' },
        { id: 'Entregado', label: 'Solo Entregados' }
    ];

    const getDeviceType = (name = "") => {
        const n = name.toLowerCase();
        if (n.includes('rtx') || n.includes('gtx') || n.includes('placa') || n.includes('grafica') || n.includes('rx ') || n.includes('gpu')) return 'gpu';
        if (n.includes('pc') || n.includes('escritorio') || n.includes('mother') || n.includes('gabinete') || n.includes('notebook') || n.includes('laptop') || n.includes('mac')) return 'pc';
        if (n.includes('ps4') || n.includes('ps5') || n.includes('xbox') || n.includes('nintendo') || n.includes('consola')) return 'consola';
        return 'celular';
    };

    const priorityWeight = { 'Urgente': 3, 'Alta': 2, 'Normal': 1, 'Baja': 0 };
    const statusWeight = { 'Ingresado': 3, 'En Proceso': 2, 'Finalizado': 1, 'Entregado': 0 };

    const ticketsMostrados = useMemo(() => {
        let base = [];
        if (vistaActual === 'inbox') base = tickets.filter(t => t.tipo === 'consulta' && !t.borrado);
        else if (vistaActual === 'activos') base = tickets.filter(t => t.tipo === 'ticket' && !t.borrado);
        else if (vistaActual === 'papelera') base = tickets.filter(t => t.borrado);

        let filtered = base.filter(t => {
            if (filtroEstado !== 'todos' && t.estado !== filtroEstado) return false;
            if (filtroTipo !== 'todos' && getDeviceType(t.dispositivo) !== filtroTipo) return false;

            if (busqueda.trim() !== '') {
                const term = busqueda.toLowerCase();
                const matchCliente = t.cliente?.nombre?.toLowerCase().includes(term);
                const matchEquipo = t.dispositivo?.toLowerCase().includes(term);
                const matchProblema = t.problema?.toLowerCase().includes(term);
                const matchId = t.id.toString().includes(term);

                if (!matchCliente && !matchEquipo && !matchProblema && !matchId) return false;
            }
            return true;
        });

        return filtered.sort((a, b) => {
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
    }, [tickets, vistaActual, criterioOrden, filtroTipo, filtroEstado, busqueda]);

    const ciclarEstado = (id, estadoActual) => {
        if (isDeleteMode) return;
        const SECUENCIA_ESTADOS = ['Ingresado', 'En Proceso', 'Finalizado', 'Entregado'];
        const indiceActual = SECUENCIA_ESTADOS.indexOf(estadoActual);
        const siguienteIndice = (indiceActual + 1) % SECUENCIA_ESTADOS.length;
        actualizarEstadoTicket(id, SECUENCIA_ESTADOS[siguienteIndice]);
    };

    const handleTicketCreated = () => setVistaActual('activos');

    const handleDeleteAction = (id) => {
        if (vistaActual === 'papelera') {
            eliminarDefinitivamente(id);
        } else {
            moverAPapelera(id);
        }
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

                {/* BOTÓN FLOTANTE (Solo visible en tickets y que no sea "nuevo") */}
                {seccionPrincipal === 'gestion' && subSeccionGestion === 'tickets' && vistaActual !== 'nuevo' && (
                    <button
                        className={`floating-delete-btn ${isDeleteMode ? 'active' : ''}`}
                        onClick={() => setIsDeleteMode(!isDeleteMode)}
                        title={isDeleteMode ? "Cancelar eliminación" : "Activar modo eliminar"}
                    >
                        {isDeleteMode ? <SvgX /> : <SvgTrash />}
                    </button>
                )}

                {seccionPrincipal === 'gestion' && (
                    <>
                        <div className="gestion-header-row">
                            <div className="gestion-sub-nav">
                                <button className={`sub-nav-btn ${subSeccionGestion === 'tickets' ? 'active' : ''}`} onClick={() => setSubSeccionGestion('tickets')}>
                                    <SvgSubTickets /> Tickets y Consultas
                                </button>
                                <button className={`sub-nav-btn ${subSeccionGestion === 'features' ? 'active' : ''}`} onClick={() => setSubSeccionGestion('features')}>
                                    <SvgSubFeatures /> Funcionalidades de Vidriera
                                </button>
                            </div>

                            {subSeccionGestion === 'tickets' && (
                                <div className="search-box-tickets">
                                    <SvgSearch />
                                    <input
                                        type="text"
                                        placeholder="Buscar cliente, equipo o #ID..."
                                        value={busqueda}
                                        onChange={e => setBusqueda(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>

                        {subSeccionGestion === 'tickets' && (
                            <>
                                <header className="dashboard-tabs">
                                    <div className="tabs-left">
                                        <button onClick={() => setVistaActual('inbox')} className={`tab-btn ${vistaActual === 'inbox' ? 'tab-active' : 'tab-inactive'}`}><SvgInbox /> Inbox</button>
                                        <button onClick={() => setVistaActual('activos')} className={`tab-btn ${vistaActual === 'activos' ? 'tab-active' : 'tab-inactive'}`}><SvgWrench /> Activos</button>
                                        <button onClick={() => setVistaActual('papelera')} className={`tab-btn ${vistaActual === 'papelera' ? 'tab-active' : 'tab-inactive'}`}><SvgTrash /> Papelera</button>
                                    </div>

                                    <div className="filters-group">
                                        <div className="custom-sort-wrapper" ref={tipoRef}>
                                            <div className={`custom-sort-header ${isTipoMenuOpen ? 'active' : ''}`} onClick={() => setIsTipoMenuOpen(!isTipoMenuOpen)}>
                                                <SvgMonitor />
                                                <span>{tipoOptions.find(o => o.id === filtroTipo)?.label}</span>
                                                <SvgChevronDown className={`sort-chevron ${isTipoMenuOpen ? 'open' : ''}`} />
                                            </div>
                                            {isTipoMenuOpen && (
                                                <div className="custom-sort-menu animate-fade-in">
                                                    {tipoOptions.map(opt => (
                                                        <div key={opt.id} className={`custom-sort-item ${filtroTipo === opt.id ? 'active' : ''}`} onClick={() => { setFiltroTipo(opt.id); setIsTipoMenuOpen(false); }}>
                                                            {opt.label}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="custom-sort-wrapper" ref={estadoRef}>
                                            <div className={`custom-sort-header ${isEstadoMenuOpen ? 'active' : ''}`} onClick={() => setIsEstadoMenuOpen(!isEstadoMenuOpen)}>
                                                <SvgTag />
                                                <span>{estadoOptions.find(o => o.id === filtroEstado)?.label}</span>
                                                <SvgChevronDown className={`sort-chevron ${isEstadoMenuOpen ? 'open' : ''}`} />
                                            </div>
                                            {isEstadoMenuOpen && (
                                                <div className="custom-sort-menu animate-fade-in">
                                                    {estadoOptions.map(opt => (
                                                        <div key={opt.id} className={`custom-sort-item ${filtroEstado === opt.id ? 'active' : ''}`} onClick={() => { setFiltroEstado(opt.id); setIsEstadoMenuOpen(false); }}>
                                                            {opt.label}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="custom-sort-wrapper" ref={sortRef}>
                                            <div className={`custom-sort-header ${isSortMenuOpen ? 'active' : ''}`} onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}>
                                                <SvgSort />
                                                <span>{sortOptions.find(o => o.id === criterioOrden)?.label}</span>
                                                <SvgChevronDown className={`sort-chevron ${isSortMenuOpen ? 'open' : ''}`} />
                                            </div>
                                            {isSortMenuOpen && (
                                                <div className="custom-sort-menu animate-fade-in">
                                                    {sortOptions.map(opt => (
                                                        <div key={opt.id} className={`custom-sort-item ${criterioOrden === opt.id ? 'active' : ''}`} onClick={() => { setCriterioOrden(opt.id); setIsSortMenuOpen(false); }}>
                                                            <span className="sort-item-icon">{opt.icon}</span>
                                                            {opt.label}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <button onClick={() => setVistaActual('nuevo')} className={`tab-btn tab-btn-action ${vistaActual === 'nuevo' ? 'tab-active' : 'tab-inactive'}`}>
                                            <SvgAddTicket /> Ingreso Manual
                                        </button>
                                    </div>
                                </header>

                                {vistaActual === 'nuevo' ? (
                                    <NewTicketForm onTicketCreated={handleTicketCreated} />
                                ) : (
                                    <div className="ticket-list">
                                        {ticketsMostrados.length === 0 && <p className="ticket-list-empty">No se encontraron tickets con estos filtros.</p>}
                                        {ticketsMostrados.map(ticket => (
                                            <div key={ticket.id} className="ticket-item-wrapper">
                                                <TicketCard
                                                    ticket={ticket}
                                                    vista={vistaActual}
                                                    onStatusChange={(id) => vistaActual === 'activos' ? ciclarEstado(id, ticket.estado) : null}
                                                    onBudgetChange={actualizarPresupuesto}
                                                    onEditTicket={editarTicket}
                                                    isDeleteMode={isDeleteMode}
                                                    onDelete={() => handleDeleteAction(ticket.id)}
                                                />
                                                {!isDeleteMode && vistaActual === 'inbox' && (
                                                    <div className="ticket-actions-absolute ticket-actions-inbox">
                                                        <button onClick={() => convertirATicket(ticket.id)} className="action-btn btn-green">Aceptar</button>
                                                        <button onClick={() => moverAPapelera(ticket.id)} className="action-btn btn-dark">Ignorar</button>
                                                    </div>
                                                )}
                                                {!isDeleteMode && vistaActual === 'papelera' && (
                                                    <div className="ticket-actions-absolute ticket-actions-trash">
                                                        <button onClick={() => restaurarTicket(ticket.id)} className="action-btn btn-green">Restaurar</button>
                                                        <button onClick={() => eliminarDefinitivamente(ticket.id)} className="action-btn btn-red">Eliminar</button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
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