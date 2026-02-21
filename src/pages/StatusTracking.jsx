import React, { useState, useContext } from 'react';
import { TicketContext } from '../context/TicketContext';

function StatusTracking() {
    const { tickets } = useContext(TicketContext);
    const [busqueda, setBusqueda] = useState('');
    const [resultado, setResultado] = useState(null);
    const [buscado, setBuscado] = useState(false);

    const handleBuscar = (e) => {
        e.preventDefault();
        // Busca por ID exacto (el cliente lo vería en su PDF)
        const ticketEncontrado = tickets.find(t => t.id.toString() === busqueda && t.tipo === 'ticket');
        setResultado(ticketEncontrado || null);
        setBuscado(true);
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#000', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10vh 20px', fontFamily: 'system-ui' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Seguimiento de Reparación</h1>
            <p style={{ color: '#888', marginBottom: '40px' }}>Ingresá tu N° de Ticket para conocer el estado actual.</p>

            <form onSubmit={handleBuscar} style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '400px', marginBottom: '40px' }}>
                <input
                    type="text"
                    placeholder="Ej. 1708560000000"
                    value={busqueda}
                    onChange={e => setBusqueda(e.target.value)}
                    style={{ flex: 1, padding: '15px', borderRadius: '8px', border: '1px solid #333', background: '#111', color: '#fff', outline: 'none' }}
                />
                <button type="submit" style={{ padding: '0 25px', backgroundColor: '#fff', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Buscar</button>
            </form>

            {buscado && resultado && (
                <div style={{ backgroundColor: '#111', padding: '30px', borderRadius: '12px', border: '1px solid #333', width: '100%', maxWidth: '500px', animation: 'fadeIn 0.3s' }}>
                    <h2 style={{ margin: '0 0 10px 0', color: '#66bb6a' }}>{resultado.equipo}</h2>
                    <p style={{ color: '#aaa', margin: '0 0 20px 0' }}>Falla reportada: {resultado.falla}</p>
                    <div style={{ padding: '15px', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid #222' }}>
                        <span style={{ display: 'block', color: '#888', fontSize: '0.9rem', marginBottom: '5px' }}>Estado Actual:</span>
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{resultado.estado}</span>
                    </div>
                </div>
            )}

            {buscado && !resultado && (
                <p style={{ color: '#ff4d4d' }}>No se encontró ninguna reparación activa con ese código.</p>
            )}
        </div>
    );
}

export default StatusTracking;