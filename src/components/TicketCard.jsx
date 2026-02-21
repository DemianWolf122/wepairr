import React, { useState } from 'react';
import { generarReciboPDF } from '../utils/generarPDF'; // Importamos el generador

function TicketCard({ ticket, onStatusChange, onBudgetChange, vista }) {
    const [isDragging, setIsDragging] = useState(false);
    const [editandoPrecio, setEditandoPrecio] = useState(false);
    const [montoLocal, setMontoLocal] = useState(ticket.presupuesto || 0);

    const getStatusColor = (estado) => {
        switch (estado) {
            case 'Ingresado': return '#ff4d4d';
            case 'En Proceso': return '#ffca28';
            case 'Finalizado': return '#66bb6a';
            case 'Entregado': return '#42a5f5';
            default: return '#ccc';
        }
    };

    const handleDragStart = (e) => {
        setIsDragging(true);
        e.dataTransfer.setData('ticketId', ticket.id);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragEnd = () => setIsDragging(false);

    const guardarPrecio = () => {
        onBudgetChange(ticket.id, Number(montoLocal));
        setEditandoPrecio(false);
    };

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            className={isDragging ? 'ticket-dragging' : ''}
            style={{
                border: '1px solid #333',
                borderRadius: '12px',
                padding: '20px',
                margin: '15px 0',
                backgroundColor: '#1a1a1a',
                color: 'white',
                cursor: 'grab',
                transition: 'all 0.2s ease',
                position: 'relative',
                boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
            }}
        >
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', paddingRight: '120px' }}>{ticket.equipo}</h3>

            <p style={{ margin: '0 0 15px 0', color: '#aaa', fontSize: '0.9rem', lineHeight: '1.4' }}>
                {ticket.falla}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #333', paddingTop: '15px' }}>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {editandoPrecio ? (
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <span style={{ fontSize: '1.1rem', alignSelf: 'center' }}>$</span>
                            <input
                                type="number"
                                value={montoLocal}
                                onChange={(e) => setMontoLocal(e.target.value)}
                                style={{ width: '80px', padding: '5px', borderRadius: '4px', border: '1px solid #66bb6a', backgroundColor: '#000', color: '#fff', outline: 'none' }}
                                autoFocus
                            />
                            <button onClick={guardarPrecio} style={{ backgroundColor: '#66bb6a', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '0 10px', fontWeight: 'bold' }}>✓</button>
                        </div>
                    ) : (
                        <div
                            onClick={() => vista === 'activos' && setEditandoPrecio(true)}
                            style={{ cursor: vista === 'activos' ? 'pointer' : 'default', display: 'flex', alignItems: 'center', gap: '8px' }}
                            title={vista === 'activos' ? "Haz clic para editar precio" : ""}
                        >
                            <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: ticket.presupuesto > 0 ? '#fff' : '#888' }}>
                                ${ticket.presupuesto.toLocaleString('es-AR')}
                            </span>
                            {vista === 'activos' && <span style={{ fontSize: '0.8rem', color: '#666' }}>✏️</span>}
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    {/* NUEVO BOTÓN: PDF (Solo en el taller) */}
                    {vista === 'activos' && (
                        <button
                            onClick={() => generarReciboPDF(ticket)}
                            style={{
                                backgroundColor: '#333',
                                border: '1px solid #555',
                                borderRadius: '6px',
                                padding: '8px 12px',
                                color: 'white',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                                fontSize: '0.85rem'
                            }}
                            title="Descargar Comprobante PDF"
                        >
                            📄 PDF
                        </button>
                    )}

                    <button
                        onClick={() => vista === 'activos' && onStatusChange(ticket.id)}
                        style={{
                            backgroundColor: getStatusColor(ticket.estado),
                            border: 'none',
                            borderRadius: '6px',
                            padding: '8px 16px',
                            color: 'black',
                            fontWeight: 'bold',
                            cursor: vista === 'activos' ? 'pointer' : 'default',
                            opacity: vista === 'activos' ? 1 : 0.7
                        }}
                    >
                        {ticket.estado}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TicketCard;