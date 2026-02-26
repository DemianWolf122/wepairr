import React, { useState } from 'react';
import generarPDF from '../utils/generarPDF';
import { QRCodeCanvas } from 'qrcode.react';
import './TicketCard.css';

// --- SVGs Premium ---
const IconPhone = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect></svg>;
const IconPC = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" y1="6" x2="16" y2="6" /><line x1="8" y1="10" x2="16" y2="10" /></svg>;
const IconConsole = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M6 12h4m-2-2v4m7-2h.01M18 10h.01M3 7l2 10h14l2-10H3z" /></svg>;
const IconGPU = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><rect x="2" y="6" width="20" height="12" rx="2" /><path d="M6 18v2m4-2v2m4-2v2m4-2v2M2 10h20M7 10l2 4m3-4l2 4" /></svg>;

const SvgUser = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const SvgCalendar = () => <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const SvgWhatsApp = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>;
const SvgPDF = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
const SvgEdit = () => <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const SvgSave = () => <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>;
const SvgX = () => <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const SvgTrash = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>;
const SvgDownload = () => <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>;

function TicketCard({ ticket, vista, onStatusChange, onBudgetChange, onEditTicket, isDeleteMode, onDelete }) {
    const isConsulta = ticket.tipo === 'consulta';
    const [isEditing, setIsEditing] = useState(false);

    const [editData, setEditData] = useState({
        dispositivo: ticket.dispositivo || '',
        problema: ticket.problema || '',
        prioridad: ticket.prioridad || 'Normal',
        cliente: {
            nombre: ticket.cliente?.nombre || '',
            telefono: ticket.cliente?.telefono || ''
        }
    });

    const getDeviceIcon = (dispositivo = "") => {
        const name = dispositivo.toLowerCase();
        if (name.includes('rtx') || name.includes('gtx') || name.includes('placa') || name.includes('grafica') || name.includes('gpu') || name.includes('rx ')) return <IconGPU />;
        if (name.includes('pc') || name.includes('notebook') || name.includes('escritorio') || name.includes('laptop') || name.includes('mac')) return <IconPC />;
        if (name.includes('ps4') || name.includes('ps5') || name.includes('xbox') || name.includes('consola')) return <IconConsole />;
        return <IconPhone />;
    };

    const getStatusTheme = (estado) => {
        switch (estado) {
            case 'Ingresado': return 'yellow';
            case 'En Proceso': return 'blue';
            case 'Finalizado': return 'green';
            case 'Entregado': return 'gray';
            default: return 'gray';
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    };

    const handleWhatsApp = (e) => {
        e.stopPropagation();
        if (!ticket.cliente?.telefono) { alert("Este cliente no tiene un teléfono registrado."); return; }
        const phone = ticket.cliente.telefono.replace(/[\s\-\(\)]/g, '');
        const msg = `Hola ${ticket.cliente.nombre || 'Cliente'}, te contactamos para informarte que tu equipo *${ticket.dispositivo}* se encuentra: *${ticket.estado || 'Ingresado'}*.\n\nPor cualquier consulta estamos a tu disposición.`;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    // FIX: Ahora este botón tendrá una clase especial en CSS para ser clickeable
    const handleNotifyFinalizado = (e) => {
        e.preventDefault(); // Prevenir comportamientos por defecto
        e.stopPropagation(); // Detener propagación

        if (!ticket.cliente?.telefono) {
            alert("Este cliente no tiene un teléfono registrado.");
            return;
        }

        const phone = ticket.cliente.telefono.replace(/[\s\-\(\)]/g, '');
        const costo = ticket.presupuesto ? ticket.presupuesto : 'a confirmar';
        const msg = `¡Buenas noticias! Tu ${ticket.dispositivo} ya está listo. Costo: $${costo}. Te esperamos en el taller.`;

        // Usamos window.open asegurando que se ejecute
        const win = window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
        if (!win) alert("Por favor, permite las ventanas emergentes para abrir WhatsApp.");
    };

    const handlePDF = (e) => {
        e.stopPropagation();
        generarPDF(ticket);
    };

    const handleDownloadQR = (e) => {
        e.stopPropagation();
        const canvas = document.getElementById(`qr-canvas-${ticket.id}`);
        if (!canvas) return;

        const pngUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `QR_Tracking_ID${ticket.id}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    const handleSaveEdit = () => {
        onEditTicket(ticket.id, editData);
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setEditData({
            dispositivo: ticket.dispositivo || '',
            problema: ticket.problema || '',
            prioridad: ticket.prioridad || 'Normal',
            cliente: { nombre: ticket.cliente?.nombre || '', telefono: ticket.cliente?.telefono || '' }
        });
        setIsEditing(false);
    };

    const statusColorTheme = getStatusTheme(ticket.estado);
    const prioridad = ticket.prioridad ? ticket.prioridad.toLowerCase() : 'normal';
    const trackingUrl = `${window.location.origin}/tracking/${ticket.id}`;

    return (
        <div className={`ticket-card-soft priority-${prioridad} glass-effect ${isEditing ? 'is-editing' : ''} ${isDeleteMode ? 'delete-mode-active' : ''}`}>
            <div className={`ticket-status-bar st-bar-${statusColorTheme}`}></div>

            {isDeleteMode && (
                <div className="ticket-delete-overlay" onClick={onDelete}>
                    <SvgTrash />
                    <span>Descartar Ticket</span>
                </div>
            )}

            <div className="tc-header-soft">
                <div className="tc-id-soft">#{ticket.id}</div>
                <div className="tc-actions-top">
                    {vista === 'activos' && !isEditing && !isDeleteMode && (
                        <button className="tc-btn-icon btn-edit-soft" onClick={() => setIsEditing(true)} title="Editar información">
                            <SvgEdit />
                        </button>
                    )}
                    {vista === 'activos' && (
                        <span className={`tc-badge-soft st-badge-${statusColorTheme}`} onClick={() => onStatusChange(ticket.id)}>
                            <span className="status-dot"></span>
                            {ticket.estado}
                        </span>
                    )}
                    {isConsulta && <span className="tc-badge-soft badge-web">Consulta Web</span>}
                </div>
            </div>

            {isEditing ? (
                <div className="tc-body-edit animate-fade-in">
                    <div className="tc-edit-field">
                        <label className="tc-edit-label">Equipo / Dispositivo</label>
                        <input type="text" className="tc-input-soft" placeholder="Ej: iPhone 13 Pro" value={editData.dispositivo} onChange={e => setEditData({ ...editData, dispositivo: e.target.value })} />
                    </div>

                    <div className="tc-edit-field">
                        <label className="tc-edit-label">Falla o problema reportado</label>
                        <textarea className="tc-input-soft" rows="2" placeholder="Describa el problema..." value={editData.problema} onChange={e => setEditData({ ...editData, problema: e.target.value })} />
                    </div>

                    <div className="tc-edit-row">
                        <div className="tc-edit-field" style={{ flex: 1 }}>
                            <label className="tc-edit-label">Nombre Cliente</label>
                            <input type="text" className="tc-input-soft" value={editData.cliente.nombre} onChange={e => setEditData({ ...editData, cliente: { ...editData.cliente, nombre: e.target.value } })} />
                        </div>
                        <div className="tc-edit-field" style={{ flex: 1 }}>
                            <label className="tc-edit-label">WhatsApp</label>
                            <input type="text" className="tc-input-soft" value={editData.cliente.telefono} onChange={e => setEditData({ ...editData, cliente: { ...editData.cliente, telefono: e.target.value } })} />
                        </div>
                    </div>

                    <div className="tc-edit-field">
                        <label className="tc-edit-label">Nivel de Urgencia</label>
                        <select className="tc-input-soft select-input" value={editData.prioridad} onChange={e => setEditData({ ...editData, prioridad: e.target.value })}>
                            <option value="Baja">Baja</option>
                            <option value="Normal">Normal</option>
                            <option value="Alta">Alta</option>
                            <option value="Urgente">Urgente</option>
                        </select>
                    </div>

                    <div className="tc-edit-actions">
                        <button className="tc-btn-soft btn-save" onClick={handleSaveEdit}><SvgSave /> Guardar</button>
                        <button className="tc-btn-soft btn-cancel" onClick={handleCancelEdit}><SvgX /> Cancelar</button>
                    </div>
                </div>
            ) : (
                <div className="tc-body-soft">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h3 className="tc-device-soft">{getDeviceIcon(ticket.dispositivo)} {ticket.dispositivo || 'Dispositivo N/A'}</h3>
                            <p className="tc-problem-soft">"{ticket.problema}"</p>
                        </div>

                        {!isConsulta && (
                            <div className="ticket-qr-container" title="Descargar código QR" onClick={handleDownloadQR}>
                                <QRCodeCanvas id={`qr-canvas-${ticket.id}`} value={trackingUrl} size={45} level="L" />
                                <div className="qr-hover-overlay">
                                    <SvgDownload />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="tc-client-row">
                        <div className="tc-client-soft">
                            <div className="client-avatar"><SvgUser /></div>
                            <div className="client-data">
                                <span className="client-name">{ticket.cliente?.nombre || 'Cliente'}</span>
                                <span className="client-phone">{ticket.cliente?.telefono || 'Sin teléfono'}</span>
                            </div>
                        </div>
                        <div className="tc-comms">
                            <button className="tc-btn-icon btn-wa" onClick={handleWhatsApp} title="WhatsApp"><SvgWhatsApp /></button>
                            <button className="tc-btn-icon btn-pdf" onClick={handlePDF} title="PDF"><SvgPDF /></button>
                        </div>
                    </div>

                    {/* BOTÓN REPARADO: Se agrega la clase 'btn-notify-whatsapp' para controlarlo desde CSS */}
                    {ticket.estado === 'Finalizado' && vista === 'activos' && (
                        <button
                            className="tc-btn-soft btn-notify-whatsapp"
                            onClick={handleNotifyFinalizado}
                        >
                            <SvgWhatsApp /> Notificar Reparación
                        </button>
                    )}
                </div>
            )}

            <div className="tc-footer-soft">
                <div className="tc-date-soft"><SvgCalendar /> {formatDate(ticket.fechaIngreso || ticket.fecha)}</div>

                {vista === 'activos' && !isEditing && (
                    <div className="tc-budget-soft" onClick={e => e.stopPropagation()}>
                        <span className="budget-currency">$</span>
                        <input
                            type="number"
                            value={ticket.presupuesto || ''}
                            onChange={(e) => onBudgetChange(ticket.id, e.target.value)}
                            placeholder="0"
                            className="budget-input"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default TicketCard;