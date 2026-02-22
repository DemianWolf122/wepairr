import React from 'react';

function MetricsView({ tickets }) {
    return (
        <div className="animate-fade-in" style={{ padding: '20px' }}>
            <h2 style={{ color: 'var(--text-primary)' }}>Métricas del Taller</h2>
            <div className="glass-effect" style={{ padding: '30px', borderRadius: '16px', marginTop: '20px' }}>
                <h3 style={{ color: 'var(--text-primary)' }}>Total de Tickets: {tickets.length}</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Módulo en desarrollo. Aquí verás gráficos de ingresos y reparaciones.</p>
            </div>
        </div>
    );
}
export default MetricsView;