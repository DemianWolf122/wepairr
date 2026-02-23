import React, { useState } from 'react';
import generarPDF from '../utils/generarPDF';
import './TicketCard.css';

// --- SVGs Premium ---
const SvgPhone = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect></svg>;
const SvgUser = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const SvgCalendar = () => <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const SvgWhatsApp = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>;
const SvgPDF = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
const SvgEdit = () => <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const SvgSave = () => <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>;
const SvgX = () => <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

function TicketCard({ ticket, vista, onStatusChange, onBudgetChange, onEditTicket }) {
    const isConsulta = ticket.tipo === 'consulta';
    const [isEditing, setIsEditing] = useState(false);

    // Estado local para los inputs de edición
    const [editData, setEditData] = useState({
        dispositivo: ticket.dispositivo || '',
        problema: ticket.problema || '',
        cliente: {
            nombre: ticket.cliente?.nombre || '',
            telefono: ticket.cliente?.telefono || ''
        }
    });

    // Función que mapea el estado a un color
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

    const handlePDF = (e) => {
        e.stopPropagation();
        generarPDF(ticket);
    };

    const handleSaveEdit = () => {
        onEditTicket(ticket.id, editData);
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setEditData({
            dispositivo: ticket.dispositivo || '',
            problema: ticket.problema || '',
            cliente: { nombre: ticket.cliente?.nombre || '', telefono: ticket.cliente?.telefono || '' }
        });
        setIsEditing(false);
    };

    const statusColorTheme = getStatusTheme(ticket.estado);

    return (
        <div
            className={`ticket-card-soft glass-effect priority-${ticket.prioridad?.toLowerCase()} ${isEditing ? 'is-editing' : ''}`}
            draggable={!isEditing}
            onDragStart={(e) => {
                if (!isEditing) e.dataTransfer.setData('ticketId', ticket.id);
            }}
        >
            {/* NUEVO: BARRA LATERAL DE COLOR DINÁMICO */}
            <div className={`ticket-status-bar st-bar-${statusColorTheme}`}></div>

            {/* CABECERA */}
            <div className="tc-header-soft">
                <div className="tc-id-soft">#{ticket.id}</div>
                <div className="tc-actions-top">
                    {vista === 'activos' && !isEditing && (
                        <button className="tc-btn-icon btn-edit-soft" onClick={() => setIsEditing(true)} title="Editar información">
                            <SvgEdit />
                        </button>
                    )}
                    {vista === 'activos' && (
                        <span
                            className={`tc-badge-soft st-badge-${statusColorTheme}`}
                            onClick={() => onStatusChange(ticket.id)}
                        >
                            <span className="status-dot"></span>
                            {ticket.estado}
                        </span>
                    )}
                    {isConsulta && <span className="tc-badge-soft badge-web">Consulta Web</span>}
                </div>
            </div>

            {/* CUERPO DEL TICKET (VISTA VS EDICIÓN) */}
            {isEditing ? (
                <div className="tc-body-edit animate-fade-in">
                    <input
                        type="text" className="tc-input-soft" placeholder="Dispositivo"
                        value={editData.dispositivo} onChange={e => setEditData({ ...editData, dispositivo: e.target.value })}
                    />
                    <textarea
                        className="tc-input-soft" rows="2" placeholder="Falla reportada"
                        value={editData.problema} onChange={e => setEditData({ ...editData, problema: e.target.value })}
                    />
                    <div className="tc-edit-row">
                        <input
                            type="text" className="tc-input-soft" placeholder="Nombre"
                            value={editData.cliente.nombre} onChange={e => setEditData({ ...editData, cliente: { ...editData.cliente, nombre: e.target.value } })}
                        />
                        <input
                            type="text" className="tc-input-soft" placeholder="Teléfono"
                            value={editData.cliente.telefono} onChange={e => setEditData({ ...editData, cliente: { ...editData.cliente, telefono: e.target.value } })}
                        />
                    </div>
                    <div className="tc-edit-actions">
                        <button className="tc-btn-soft btn-save" onClick={handleSaveEdit}><SvgSave /> Guardar</button>
                        <button className="tc-btn-soft btn-cancel" onClick={handleCancelEdit}><SvgX /> Cancelar</button>
                    </div>
                </div>
            ) : (
                <div className="tc-body-soft">
                    <h3 className="tc-device-soft"><SvgPhone /> {ticket.dispositivo || 'Dispositivo N/A'}</h3>
                    <p className="tc-problem-soft">"{ticket.problema}"</p>

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
                </div>
            )}

            {/* PIE DE PÁGINA (FECHA Y PRESUPUESTO) */}
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