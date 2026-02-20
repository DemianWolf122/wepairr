import React from 'react';

function Settings({ config, onUpdate }) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onUpdate({ ...config, [name]: value });
    };

    return (
        <div style={{ backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '12px', color: 'white' }}>
            <h3>Personalizá tu Landing Page</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <label>Título de la Web:
                    <input type="text" name="titulo" value={config.titulo} onChange={handleChange} style={inputStyle} />
                </label>
                <label>Descripción corta:
                    <textarea name="descripcion" value={config.descripcion} onChange={handleChange} style={inputStyle} />
                </label>
                <label>Color de Marca (Hex):
                    <input type="color" name="colorTema" value={config.colorTema} onChange={handleChange} style={{ display: 'block', marginTop: '5px' }} />
                </label>
                <label>Link de Video (YouTube):
                    <input type="text" name="videoUrl" value={config.videoUrl} onChange={handleChange} style={inputStyle} />
                </label>
            </div>
        </div>
    );
}

const inputStyle = {
    width: '100%',
    padding: '8px',
    marginTop: '5px',
    backgroundColor: '#333',
    border: '1px solid #444',
    color: 'white',
    borderRadius: '4px'
};

export default Settings;