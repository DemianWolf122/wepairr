import React from 'react';

function MetricsView({ tickets }) {
    const ticketsActivos = tickets.filter(t => t.tipo === 'ticket' && !t.borrado);

    const ingresosPotenciales = ticketsActivos
        .filter(t => t.estado !== 'Entregado')
        .reduce((acc, curr) => acc + (curr.presupuesto || 0), 0);

    const ingresosCerrados = ticketsActivos
        .filter(t => t.estado === 'Entregado')
        .reduce((acc, curr) => acc + (curr.presupuesto || 0), 0);

    return (
        <div style={{ padding: '20px', animation: 'fadeIn 0.3s' }}>
            <h2 style={{ marginBottom: '30px' }}>Resumen Financiero</h2>
            <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1, backgroundColor: '#111', padding: '30px', borderRadius: '12px', border: '1px solid #333' }}>
                    <h3 style={{ color: '#888', margin: '0 0 10px 0', fontSize: '1rem' }}>Ingresos Esperados (En Taller)</h3>
                    <p style={{ fontSize: '2.5rem', margin: 0, fontWeight: 'bold', color: '#ffca28' }}>${ingresosPotenciales.toLocaleString('es-AR')}</p>
                </div>
                <div style={{ flex: 1, backgroundColor: '#111', padding: '30px', borderRadius: '12px', border: '1px solid #333' }}>
                    <h3 style={{ color: '#888', margin: '0 0 10px 0', fontSize: '1rem' }}>Ingresos Cerrados (Entregados)</h3>
                    <p style={{ fontSize: '2.5rem', margin: 0, fontWeight: 'bold', color: '#66bb6a' }}>${ingresosCerrados.toLocaleString('es-AR')}</p>
                </div>
            </div>
        </div>
    );
}

export default MetricsView;