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
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10vh 20px', fontFamily: 'system-ui' }}>
            <Link to="/" style={{ position: 'absolute', top: '30px', left: '30px', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 'bold', background: 'var(--bg-panel-glass)', padding: '10px 20px', borderRadius: '12px', backdropFilter: 'blur(10px)', border: '1px solid var(--border-glass)' }}>← Volver</Link>

            <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', color: 'var(--text-primary)', textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>Seguimiento de Reparación</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>Ingresá tu N° de Ticket para conocer el estado actual.</p>

            <form onSubmit={handleBuscar} style={{ display: 'flex', gap: '15px', width: '100%', maxWidth: '450px', marginBottom: '40px' }}>
                <input
                    type="text"
                    placeholder="Ej. 1708560000000"
                    value={busqueda}
                    onChange={e => setBusqueda(e.target.value)}
                    style={{ flex: 1, padding: '18px', borderRadius: '12px', border: '1px solid var(--border-glass)', background: 'var(--bg-input-glass)', color: 'var(--text-primary)', outline: 'none', fontSize: '1.05rem', backdropFilter: 'blur(10px)', boxShadow: 'var(--shadow-glass)' }}
                />
                <button type="submit" style={{ padding: '0 30px', background: 'linear-gradient(135deg, var(--accent-color), var(--accent-hover))', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.05rem', boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)' }}>Buscar</button>
            </form>

            {buscado && resultado && (
                <div className="glass-effect" style={{ padding: '35px', borderRadius: '20px', width: '100%', maxWidth: '500px', animation: 'fadeIn 0.4s' }}>
                    <h2 style={{ margin: '0 0 10px 0', color: 'var(--accent-color)', fontSize: '1.8rem' }}>{resultado.equipo}</h2>
                    <p style={{ color: 'var(--text-secondary)', margin: '0 0 25px 0', lineHeight: '1.6', fontSize: '1.1rem' }}>Falla reportada: {resultado.falla}</p>
                    <div style={{ padding: '20px', background: 'var(--bg-input-glass)', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                        <span style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Estado Actual:</span>
                        <span style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)' }}>{resultado.estado}</span>
                    </div>
                </div>
            )}

            {buscado && !resultado && (
                <p style={{ color: 'var(--danger)', fontWeight: '600', padding: '20px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.3)', backdropFilter: 'blur(10px)' }}>
                    No se encontró ninguna reparación activa con ese código.
                </p>
            )}
        </div>
    );
}

export default StatusTracking;