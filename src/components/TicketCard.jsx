import React, { useState } from 'react';
import { generarReciboPDF } from '../utils/generarPDF';
import './TicketCard.css';

function TicketCard({ ticket, onStatusChange, onBudgetChange, vista }) {
    const [isDragging, setIsDragging] = useState(false);
    const [editandoPrecio, setEditandoPrecio] = useState(false);
    const [montoLocal, setMontoLocal] = useState(ticket.presupuesto || 0);

    const getStatusColor = (estado) => {
        switch (estado) {
            case 'Ingresado': return 'var(--danger)';
            case 'En Proceso': return 'var(--warning)';
            case 'Finalizado': return 'var(--success)';
            case 'Entregado': return 'var(--accent-color)';
            default: return 'var(--text-secondary)';
        }
    };

    const handleDragStart = (e) => {
        setIsDragging(true);
        e.dataTransfer.setData('ticketId', ticket.id);
        e.dataTransfer.effectAllowed = 'move';
    };

    const guardarPrecio = () => {
        onBudgetChange(ticket.id, Number(montoLocal));
        setEditandoPrecio(false);
    };

    const enviarWhatsApp = () => {
        const telefono = ticket.falla.split('Teléfono: ')[1]?.trim() || "";
        const configGuardada = JSON.parse(localStorage.getItem('wepairr_config')) || {};
        const nombreLocal = configGuardada.nombreNegocio || 'el taller';
        const mensaje = `Hola! Soy de ${nombreLocal}. Te aviso que tu ${ticket.equipo} ya está en estado: ${ticket.estado}. Presupuesto total: $${ticket.presupuesto}.`;

        if (telefono) {
            window.open(`https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`, '_blank');
        } else {
            alert("Este ticket no tiene un número de contacto registrado.");
        }
    };

    return (
        <div draggable onDragStart={handleDragStart} onDragEnd={() => setIsDragging(false)} className={`ticket-card ${isDragging ? 'ticket-dragging' : ''}`}>
            <h3 className="ticket-title">{ticket.equipo}</h3>
            <p className="ticket-desc">{ticket.falla}</p>

            <div className="ticket-footer">
                <div className="budget-wrapper">
                    {editandoPrecio ? (
                        <div className="budget-edit-form">
                            <span className="budget-currency">$</span>
                            <input type="number" value={montoLocal} onChange={(e) => setMontoLocal(e.target.value)} className="budget-input" autoFocus />
                            <button onClick={guardarPrecio} className="btn-save-budget">✓</button>
                        </div>
                    ) : (
                        <div onClick={() => vista === 'activos' && setEditandoPrecio(true)} className="budget-display" style={{ cursor: vista === 'activos' ? 'pointer' : 'default' }}>
                            <span className={`budget-value ${ticket.presupuesto > 0 ? 'budget-value-filled' : 'budget-value-empty'}`}>
                                ${ticket.presupuesto.toLocaleString('es-AR')}
                            </span>
                            {vista === 'activos' && <span className="budget-edit-icon">✏️</span>}
                        </div>
                    )}
                </div>

                <div className="footer-actions">
                    {vista === 'activos' && (
                        <>
                            <button onClick={enviarWhatsApp} className="btn-whatsapp" title="Avisar por WhatsApp">🟢 WA</button>
                            <button onClick={() => generarReciboPDF(ticket)} className="btn-pdf" title="Descargar Comprobante PDF">📄 PDF</button>
                        </>
                    )}
                    <button onClick={() => vista === 'activos' && onStatusChange(ticket.id)} className="btn-status" style={{ backgroundColor: getStatusColor(ticket.estado), color: '#fff', cursor: vista === 'activos' ? 'pointer' : 'default', opacity: vista === 'activos' ? 1 : 0.7 }}>
                        {ticket.estado}
                    </button>
                </div>
            </div>
        </div>
    );
}
export default TicketCard;