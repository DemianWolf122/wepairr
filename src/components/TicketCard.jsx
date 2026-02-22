import React from 'react';
import './TicketCard.css';

const SvgPhone = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect></svg>;
const SvgUser = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const SvgCalendar = () => <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;

function TicketCard({ ticket, vista, onStatusChange, onBudgetChange }) {
    const isConsulta = ticket.tipo === 'consulta';

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

    return (
        <div
            className="ticket-card-premium glass-effect"
            draggable={true}
            onDragStart={(e) => {
                e.dataTransfer.setData('ticketId', ticket.id);
            }}
        >
            <div className="tc-header">
                <span className="tc-id">#{ticket.id}</span>
                {vista === 'activos' && (
                    <span className={`tc-status-badge ${getStatusColor(ticket.estado)}`} onClick={() => onStatusChange(ticket.id)}>
                        {ticket.estado}
                    </span>
                )}
                {isConsulta && <span className="tc-type-badge">Consulta Web</span>}
            </div>

            <div className="tc-body">
                <h3 className="tc-device-title">
                    <SvgPhone /> {ticket.dispositivo || 'Dispositivo N/A'}
                </h3>
                <p className="tc-problem">Falla: {ticket.problema}</p>

                <div className="tc-client-info">
                    <SvgUser />
                    <span>{ticket.cliente?.nombre || 'Cliente'}</span>
                    <span className="tc-separator">•</span>
                    <span>{ticket.cliente?.telefono || '-'}</span>
                </div>
            </div>

            <div className="tc-footer">
                <div className="tc-date">
                    <SvgCalendar /> {formatDate(ticket.fechaIngreso || ticket.fecha)}
                </div>

                {vista === 'activos' && (
                    <div className="tc-budget-box animate-fade-in">
                        <span>Presupuesto:</span>
                        <div className="budget-input-wrapper">
                            <span>$</span>
                            <input type="number" value={ticket.presupuesto || ''} onChange={(e) => onBudgetChange(ticket.id, e.target.value)} placeholder="-" className="tc-budget-input" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TicketCard;