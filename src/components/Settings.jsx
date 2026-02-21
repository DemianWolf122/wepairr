import React, { useState } from 'react';

function Settings({ config, onUpdate }) {
    // Estados temporales para los inputs de creación
    const [nuevoEquipo, setNuevoEquipo] = useState('');
    const [nuevaFalla, setNuevaFalla] = useState({ equipo: '', nombre: '', precio: '' });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        onUpdate({ ...config, [name]: newValue });
    };

    // --- LÓGICA DEL MOTOR DE PRECIOS ---
    const tablaPrecios = config.tablaPrecios || {};

    const handleAgregarEquipo = () => {
        if (!nuevoEquipo.trim() || tablaPrecios[nuevoEquipo]) return;
        onUpdate({
            ...config,
            tablaPrecios: { ...tablaPrecios, [nuevoEquipo]: {} }
        });
        setNuevoEquipo('');
    };

    const handleEliminarEquipo = (equipo) => {
        if (!window.confirm(`¿Seguro que querés eliminar "${equipo}" y todos sus precios?`)) return;
        const nuevaTabla = { ...tablaPrecios };
        delete nuevaTabla[equipo];
        onUpdate({ ...config, tablaPrecios: nuevaTabla });
    };

    const handleAgregarFalla = (equipo) => {
        if (!nuevaFalla.nombre.trim() || !nuevaFalla.precio || nuevaFalla.equipo !== equipo) return;
        onUpdate({
            ...config,
            tablaPrecios: {
                ...tablaPrecios,
                [equipo]: {
                    ...tablaPrecios[equipo],
                    [nuevaFalla.nombre]: Number(nuevaFalla.precio)
                }
            }
        });
        setNuevaFalla({ equipo: '', nombre: '', precio: '' }); // Reseteamos el input
    };

    const handleEliminarFalla = (equipo, falla) => {
        const nuevaTabla = { ...tablaPrecios };
        const fallasEquipo = { ...nuevaTabla[equipo] };
        delete fallasEquipo[falla];
        nuevaTabla[equipo] = fallasEquipo;
        onUpdate({ ...config, tablaPrecios: nuevaTabla });
    };

    return (
        <div style={{ backgroundColor: '#111', padding: '25px', borderRadius: '12px', border: '1px solid #222', color: 'white', height: '100%', overflowY: 'auto' }}>

            {/* SECCIÓN 1: CONFIGURACIÓN GENERAL */}
            <h3 style={{ marginTop: 0, marginBottom: '25px', fontSize: '1.2rem', color: '#fff', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
                Configuración de tu Vidriera
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
                <label style={labelStyle}>
                    Título de la Web:
                    <input type="text" name="titulo" value={config.titulo || ''} onChange={handleChange} style={inputStyle} />
                </label>

                <label style={labelStyle}>
                    Descripción corta:
                    <textarea name="descripcion" value={config.descripcion || ''} onChange={handleChange} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} />
                </label>

                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <label style={{ ...labelStyle, margin: 0 }}>Color de Marca (Hex):</label>
                    <input type="color" name="colorTema" value={config.colorTema || '#ffffff'} onChange={handleChange} style={{ width: '40px', height: '40px', padding: 0, cursor: 'pointer', border: 'none', borderRadius: '4px', backgroundColor: 'transparent' }} />
                </div>

                <div style={{
                    padding: '15px',
                    backgroundColor: '#1a1a1a',
                    borderRadius: '8px',
                    border: '1px solid #333',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div>
                        <strong style={{ display: 'block', marginBottom: '5px', fontSize: '1rem' }}>Presupuestador Automático</strong>
                        <span style={{ fontSize: '0.85rem', color: '#888' }}>Muestra los precios al cliente antes del chat.</span>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            name="mostrarPresupuestador"
                            checked={config.mostrarPresupuestador !== false}
                            onChange={handleChange}
                            style={{ width: '20px', height: '20px', accentColor: '#ffffff', cursor: 'pointer' }}
                        />
                    </label>
                </div>
            </div>

            {/* SECCIÓN 2: GESTOR DE PRECIOS */}
            {config.mostrarPresupuestador !== false && (
                <>
                    <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.2rem', color: '#fff', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
                        Gestión de Lista de Precios
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        {/* Iteramos sobre los equipos existentes */}
                        {Object.keys(tablaPrecios).map(equipo => (
                            <div key={equipo} style={{ backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: '8px', padding: '15px' }}>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                    <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#66bb6a' }}>{equipo}</h4>
                                    <button onClick={() => handleEliminarEquipo(equipo)} style={btnEliminarStyle}>🗑️ Borrar Equipo</button>
                                </div>

                                {/* Lista de Fallas por Equipo */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '15px' }}>
                                    {Object.entries(tablaPrecios[equipo]).map(([falla, precio]) => (
                                        <div key={falla} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#111', padding: '10px', borderRadius: '4px', border: '1px solid #222' }}>
                                            <span style={{ fontSize: '0.9rem' }}>{falla}</span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <span style={{ fontWeight: 'bold' }}>${precio.toLocaleString('es-AR')}</span>
                                                <button onClick={() => handleEliminarFalla(equipo, falla)} style={{ background: 'transparent', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '1rem' }}>×</button>
                                            </div>
                                        </div>
                                    ))}
                                    {Object.keys(tablaPrecios[equipo]).length === 0 && <span style={{ fontSize: '0.85rem', color: '#666' }}>No hay fallas cargadas.</span>}
                                </div>

                                {/* Formulario para agregar nueva falla a este equipo */}
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input
                                        type="text"
                                        placeholder="Nueva falla..."
                                        value={nuevaFalla.equipo === equipo ? nuevaFalla.nombre : ''}
                                        onChange={(e) => setNuevaFalla({ equipo, nombre: e.target.value, precio: nuevaFalla.precio })}
                                        style={{ ...inputStyle, marginTop: 0, flex: 2, padding: '10px' }}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Precio $"
                                        value={nuevaFalla.equipo === equipo ? nuevaFalla.precio : ''}
                                        onChange={(e) => setNuevaFalla({ ...nuevaFalla, equipo, precio: e.target.value })}
                                        style={{ ...inputStyle, marginTop: 0, flex: 1, padding: '10px' }}
                                    />
                                    <button onClick={() => handleAgregarFalla(equipo)} style={btnAgregarStyle}>+</button>
                                </div>

                            </div>
                        ))}

                        {/* Agregar Nuevo Equipo */}
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <input
                                type="text"
                                placeholder="Nombre del nuevo equipo (Ej. iPhone 15)"
                                value={nuevoEquipo}
                                onChange={(e) => setNuevoEquipo(e.target.value)}
                                style={{ ...inputStyle, marginTop: 0, flex: 1 }}
                            />
                            <button onClick={handleAgregarEquipo} style={{ ...btnAgregarStyle, padding: '0 20px' }}>Agregar Equipo</button>
                        </div>

                    </div>
                </>
            )}

        </div>
    );
}

// --- ESTILOS ---
const labelStyle = { display: 'block', color: '#ccc', fontSize: '0.9rem', fontWeight: '500' };

const inputStyle = {
    width: '100%', padding: '14px', marginTop: '8px', backgroundColor: '#0a0a0a',
    border: '1px solid #333', color: 'white', borderRadius: '6px', boxSizing: 'border-box',
    outline: 'none', fontFamily: 'inherit', fontSize: '1rem', transition: 'border-color 0.2s'
};

const btnEliminarStyle = {
    backgroundColor: 'transparent', color: '#ff4d4d', border: 'none', cursor: 'pointer', fontSize: '0.85rem'
};

const btnAgregarStyle = {
    backgroundColor: '#ffffff', color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', padding: '0 15px'
};

export default Settings;