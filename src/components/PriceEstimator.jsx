import React, { useState } from 'react';

// Simulamos la lista de precios que el técnico configuraría en su panel
const TABLA_PRECIOS = {
    'iPhone 11': {
        'Pantalla': 120000,
        'Batería': 45000,
        'Pin de Carga': 30000
    },
    'Samsung S23': {
        'Pantalla': 250000,
        'Batería': 60000,
        'Pin de Carga': 40000
    },
    'Motorola G20': {
        'Pantalla': 55000,
        'Batería': 25000,
        'Pin de Carga': 15000
    }
};

function PriceEstimator() {
    const [equipoSeleccionado, setEquipoSeleccionado] = useState('');
    const [fallaSeleccionada, setFallaSeleccionada] = useState('');

    const equiposDisponibles = Object.keys(TABLA_PRECIOS);

    // Obtenemos las fallas disponibles solo si hay un equipo seleccionado
    const fallasDisponibles = equipoSeleccionado ? Object.keys(TABLA_PRECIOS[equipoSeleccionado]) : [];

    // Calculamos el precio estimado
    const precioEstimado = (equipoSeleccionado && fallaSeleccionada)
        ? TABLA_PRECIOS[equipoSeleccionado][fallaSeleccionada]
        : null;

    return (
        <div style={{
            backgroundColor: '#111',
            padding: '25px',
            borderRadius: '16px',
            border: '1px solid #222',
            maxWidth: '600px',
            margin: '0 auto 40px auto',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '1.3rem', textAlign: 'center' }}>
                Calcula tu Presupuesto
            </h3>

            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                {/* Selector de Equipo */}
                <div style={{ flex: '1 1 200px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#aaa' }}>Modelo del Equipo</label>
                    <select
                        value={equipoSeleccionado}
                        onChange={(e) => {
                            setEquipoSeleccionado(e.target.value);
                            setFallaSeleccionada(''); // Reiniciamos la falla al cambiar de equipo
                        }}
                        style={selectStyle}
                    >
                        <option value="">Selecciona un equipo...</option>
                        {equiposDisponibles.map(equipo => (
                            <option key={equipo} value={equipo}>{equipo}</option>
                        ))}
                    </select>
                </div>

                {/* Selector de Falla */}
                <div style={{ flex: '1 1 200px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#aaa' }}>Problema a reparar</label>
                    <select
                        value={fallaSeleccionada}
                        onChange={(e) => setFallaSeleccionada(e.target.value)}
                        disabled={!equipoSeleccionado}
                        style={{ ...selectStyle, opacity: !equipoSeleccionado ? 0.5 : 1 }}
                    >
                        <option value="">Selecciona la falla...</option>
                        {fallasDisponibles.map(falla => (
                            <option key={falla} value={falla}>{falla}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Resultado Dinámico */}
            <div style={{
                marginTop: '25px',
                padding: '15px',
                backgroundColor: precioEstimado ? '#1a2e1a' : '#1a1a1a',
                border: `1px solid ${precioEstimado ? '#66bb6a' : '#333'}`,
                borderRadius: '8px',
                textAlign: 'center',
                transition: 'all 0.3s ease'
            }}>
                <span style={{ color: '#aaa', fontSize: '0.9rem' }}>Costo estimado:</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: precioEstimado ? '#66bb6a' : '#fff', marginTop: '5px' }}>
                    {precioEstimado ? `$${precioEstimado.toLocaleString('es-AR')}` : '---'}
                </div>
                <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem', color: '#888' }}>
                    *El precio final puede variar tras la revisión técnica en laboratorio.
                </p>
            </div>
        </div>
    );
}

const selectStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #333',
    backgroundColor: '#1a1a1a',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
    cursor: 'pointer'
};

export default PriceEstimator;