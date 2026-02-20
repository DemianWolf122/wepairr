import React, { useState } from 'react';

function TicketCard({ ticket, onStatusChange }) {
    const [isDragging, setIsDragging] = useState(false);

    const getStatusColor = (estado) => {
        switch (estado) {
            case 'Ingresado': return '#ff4d4d';
            case 'En Proceso': return '#ffca28';
            case 'Finalizado': return '#66bb6a';
            case 'Entregado': return '#42a5f5';
            default: return '#ccc';
        }
    };

    // Cuando empieza el arrastre, guardamos el ID del ticket en la memoria del navegador
    const handleDragStart = (e) => {
        setIsDragging(true);
        e.dataTransfer.setData('ticketId', ticket.id);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragEnd = () => {
        setIsDragging(false);
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
                position: 'relative'
            }}
        >
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem' }}>{ticket.equipo}</h3>
            <p style={{ margin: '0 0 15px 0', color: '#aaa', fontSize: '0.9rem' }}>{ticket.falla}</p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>${ticket.presupuesto}</span>

                <button
                    onClick={() => onStatusChange(ticket.id)}
                    style={{
                        backgroundColor: getStatusColor(ticket.estado),
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 16px',
                        color: 'black',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    {ticket.estado}
                </button>
            </div>
        </div>
    );
}

export default TicketCard;