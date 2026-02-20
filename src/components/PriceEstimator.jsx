import React, { useState } from 'react';

// Ahora recibe "config" como propiedad para leer los precios reales del técnico
function PriceEstimator({ config }) {
    const [equipoSeleccionado, setEquipoSeleccionado] = useState('');
    const [fallaSeleccionada, setFallaSeleccionada] = useState('');

    // Leemos la tabla dinámica en lugar de la fija
    const TABLA_PRECIOS = config?.tablaPrecios || {};
    const equiposDisponibles = Object.keys(TABLA_PRECIOS);
    const fallasDisponibles = equipoSeleccionado ? Object.keys(TABLA_PRECIOS[equipoSeleccionado]) : [];

    const precioEstimado = (equipoSeleccionado && fallaSeleccionada)
        ? TABLA_PRECIOS[equipoSeleccionado][fallaSeleccionada]
        : null;

    return (
        <div style={{ width: '100%', maxWidth: '500px', margin: '0 auto 40px auto', animation: 'fadeIn 0.5s ease' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '1.2rem', textAlign: 'center', color: '#fff', fontWeight: '400', letterSpacing: '1px' }}>
                Estima tu reparación
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                    <select
                        value={equipoSeleccionado}
                        onChange={(e) => {
                            setEquipoSeleccionado(e.target.value);
                            setFallaSeleccionada('');
                        }}
                        style={minimalistSelectStyle}
                    >
                        <option value="">Selecciona tu equipo...</option>
                        {equiposDisponibles.map(equipo => (
                            <option key={equipo} value={equipo}>{equipo}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <select
                        value={fallaSeleccionada}
                        onChange={(e) => setFallaSeleccionada(e.target.value)}
                        disabled={!equipoSeleccionado}
                        style={{ ...minimalistSelectStyle, opacity: !equipoSeleccionado ? 0.3 : 1 }}
                    >
                        <option value="">¿Qué falla presenta?</option>
                        {fallasDisponibles.map(falla => (
                            <option key={falla} value={falla}>{falla}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Resultado */}
            <div style={{
                marginTop: '30px',
                padding: '20px 0',
                borderTop: '1px solid #333',
                textAlign: 'center',
                opacity: precioEstimado ? 1 : 0.3,
                transition: 'opacity 0.3s ease'
            }}>
                <span style={{ color: '#aaa', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Costo estimado</span>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#ffffff', margin: '10px 0' }}>
                    {precioEstimado ? `$${precioEstimado.toLocaleString('es-AR')}` : '---'}
                </div>
            </div>
        </div>
    );
}

const minimalistSelectStyle = {
    width: '100%',
    padding: '16px 0',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '1px solid #333333',
    color: '#ffffff',
    fontSize: '1.1rem',
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none', // Quita la flecha por defecto para un look más limpio
    borderRadius: '0'
};

export default PriceEstimator;