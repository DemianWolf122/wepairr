import React from 'react';
import generarPDF from '../utils/generarPDF';
import './TicketCard.css';

// --- SVGs ---
const SvgPhone = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect></svg>;
const SvgUser = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const SvgCalendar = () => <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const SvgWhatsApp = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>;
const SvgPDF = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;

function TicketCard({ ticket, vista, onStatusChange, onBudgetChange }) {
    const isConsulta = ticket.tipo === 'consulta';

    // Asignación de colores según estado
    const getStatusColor = (estado) => {
        switch (estado) {
            case 'Ingresado': return 'status-yellow';
            case 'En Proceso': return 'status-blue';
            case 'Finalizado': return 'status-green';
            case 'Entregado': return 'status-gray';
            default: return 'status-gray';
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    };

    // FUNCIÓN DE WHATSAPP AUTOMÁTICO
    const handleWhatsApp = (e) => {
        e.stopPropagation(); // Evita que se active el Drag&Drop al hacer click
        if (!ticket.cliente?.telefono) {
            alert("Este cliente no tiene un teléfono registrado.");
            return;
        }

        // Limpiamos el número de espacios o guiones
        const phone = ticket.cliente.telefono.replace(/[\s\-\(\)]/g, '');
        const nombre = ticket.cliente.nombre || 'Cliente';
        const estado = ticket.estado || 'Ingresado';

        // Mensaje Premium Automático
        const msg = `Hola ${nombre}, te contactamos del Servicio Técnico para informarte que tu equipo *${ticket.dispositivo}* actualmente se encuentra: *${estado}*.\n\nPor cualquier consulta, estamos a tu disposición.`;

        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    // FUNCIÓN PARA GENERAR PDF
    const handlePDF = (e) => {
        e.stopPropagation();
        generarPDF(ticket);
    };

    return (
        <div
            className={`ticket-card-premium glass-effect border-${getStatusColor(ticket.estado)}`}
            draggable={true}
            onDragStart={(e) => {
                e.dataTransfer.setData('ticketId', ticket.id);
            }}
        >
            <div className="tc-header">
                <div className="tc-id-group">
                    <span className="tc-id">#{ticket.id}</span>
                    {isConsulta && <span className="tc-type-badge">Consulta Web</span>}
                </div>

                {vista === 'activos' && (
                    <span className={`tc-status-badge ${getStatusColor(ticket.estado)}`} onClick={() => onStatusChange(ticket.id)}>
                        {ticket.estado}
                    </span>
                )}
            </div>

            <div className="tc-body">
                <h3 className="tc-device-title">
                    <SvgPhone /> {ticket.dispositivo || 'Dispositivo N/A'}
                </h3>
                <div className="tc-problem-box">
                    <p className="tc-problem">"{ticket.problema}"</p>
                </div>
            </div>

            <div className="tc-client-section">
                <div className="tc-client-info">
                    <SvgUser />
                    <div className="tc-client-details">
                        <span className="tc-client-name">{ticket.cliente?.nombre || 'Cliente'}</span>
                        <span className="tc-client-phone">{ticket.cliente?.telefono || 'Sin teléfono'}</span>
                    </div>
                </div>

                {/* BOTONES DE ACCIÓN RÁPIDA (WA Y PDF) */}
                <div className="tc-quick-actions">
                    <button className="tc-action-btn wa-btn" onClick={handleWhatsApp} title="Enviar WhatsApp Automático">
                        <SvgWhatsApp />
                    </button>
                    <button className="tc-action-btn pdf-btn" onClick={handlePDF} title="Descargar Comprobante PDF">
                        <SvgPDF />
                    </button>
                </div>
            </div>

            <div className="tc-footer">
                <div className="tc-date">
                    <SvgCalendar /> {formatDate(ticket.fechaIngreso || ticket.fecha)}
                </div>

                {vista === 'activos' && (
                    <div className="tc-budget-box animate-fade-in" onClick={e => e.stopPropagation()}>
                        <span className="budget-label">Presupuesto:</span>
                        <div className="budget-input-wrapper">
                            <span>$</span>
                            <input
                                type="number"
                                value={ticket.presupuesto || ''}
                                onChange={(e) => onBudgetChange(ticket.id, e.target.value)}
                                placeholder="0"
                                className="tc-budget-input"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TicketCard;