import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { TicketContext } from '../context/TicketContext';

function StatusTracking() {
    const { tickets } = useContext(TicketContext);
    const [busqueda, setBusqueda] = useState('');
    const [resultado, setResultado] = useState(null);
    const [buscado, setBuscado] = useState(false);

    const handleBuscar = (e) => {
        e.preventDefault();
        const ticketEncontrado = tickets.find(t => t.id.toString() === busqueda && t.tipo === 'ticket');
        setResultado(ticketEncontrado || null);
        setBuscado(true);
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10vh 20px', fontFamily: 'system-ui', transition: 'background-color 0.3s, color 0.3s' }}>
            <Link to="/" style={{ position: 'absolute', top: '30px', left: '30px', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 'bold' }}>← Volver</Link>

            <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Seguimiento de Reparación</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>Ingresá tu N° de Ticket para conocer el estado actual.</p>

            <form onSubmit={handleBuscar} style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '400px', marginBottom: '40px' }}>
                <input
                    type="text"
                    placeholder="Ej. 1708560000000"
                    value={busqueda}
                    onChange={e => setBusqueda(e.target.value)}
                    style={{ flex: 1, padding: '15px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)', outline: 'none', fontSize: '1rem' }}
                />
                <button type="submit" style={{ padding: '0 25px', backgroundColor: 'var(--text-primary)', color: 'var(--bg-main)', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Buscar</button>
            </form>

            {buscado && resultado && (
                <div style={{ backgroundColor: 'var(--bg-panel)', padding: '30px', borderRadius: '12px', border: '1px solid var(--border-color)', width: '100%', maxWidth: '500px', animation: 'fadeIn 0.3s', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ margin: '0 0 10px 0', color: 'var(--accent-color)' }}>{resultado.equipo}</h2>
                    <p style={{ color: 'var(--text-secondary)', margin: '0 0 20px 0', lineHeight: '1.5' }}>Falla reportada: {resultado.falla}</p>
                    <div style={{ padding: '15px', backgroundColor: 'var(--bg-input)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <span style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '5px' }}>Estado Actual:</span>
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{resultado.estado}</span>
                    </div>
                </div>
            )}

            {buscado && !resultado && (
                <p style={{ color: 'var(--danger)', fontWeight: '500', padding: '15px', backgroundColor: 'var(--bg-input)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    No se encontró ninguna reparación activa con ese código.
                </p>
            )}
        </div>
    );
}

export default StatusTracking;