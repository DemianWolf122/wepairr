import React from 'react';

function Settings({ config, onUpdate }) {
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        // Si es un checkbox, tomamos 'checked', si no, tomamos 'value'
        const newValue = type === 'checkbox' ? checked : value;
        onUpdate({ ...config, [name]: newValue });
    };

    return (
        <div style={{ backgroundColor: '#111', padding: '25px', borderRadius: '12px', border: '1px solid #222', color: 'white' }}>
            <h3 style={{ marginTop: 0, marginBottom: '25px', fontSize: '1.2rem', color: '#fff', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
                Configuración de tu Vidriera
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <label style={labelStyle}>
                    Título de la Web:
                    <input type="text" name="titulo" value={config.titulo || ''} onChange={handleChange} style={inputStyle} />
                </label>

                <label style={labelStyle}>
                    Descripción corta:
                    <textarea name="descripcion" value={config.descripcion || ''} onChange={handleChange} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} />
                </label>

                <label style={labelStyle}>
                    Color de Marca (Hex):
                    <input type="color" name="colorTema" value={config.colorTema || '#ffffff'} onChange={handleChange} style={{ display: 'block', marginTop: '8px', width: '60px', height: '40px', padding: 0, cursor: 'pointer', border: 'none', borderRadius: '4px' }} />
                </label>

                {/* INTERRUPTOR DEL PRESUPUESTADOR */}
                <div style={{
                    marginTop: '10px',
                    padding: '20px',
                    backgroundColor: '#1a1a1a',
                    borderRadius: '8px',
                    border: '1px solid #333',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div>
                        <strong style={{ display: 'block', marginBottom: '5px', fontSize: '1rem' }}>Presupuestador Automático</strong>
                        <span style={{ fontSize: '0.85rem', color: '#888' }}>Permite al cliente estimar precios antes de ingresar al chat.</span>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            name="mostrarPresupuestador"
                            // Validamos que sea false solo si está explícitamente apagado
                            checked={config.mostrarPresupuestador !== false}
                            onChange={handleChange}
                            style={{ width: '24px', height: '24px', accentColor: '#ffffff', cursor: 'pointer' }}
                        />
                    </label>
                </div>

            </div>
        </div>
    );
}

const labelStyle = { display: 'block', color: '#ccc', fontSize: '0.9rem', fontWeight: '500' };

const inputStyle = {
    width: '100%', padding: '14px', marginTop: '8px', backgroundColor: '#0a0a0a',
    border: '1px solid #333', color: 'white', borderRadius: '6px', boxSizing: 'border-box',
    outline: 'none', fontFamily: 'inherit', fontSize: '1rem', transition: 'border-color 0.2s'
};

export default Settings;