import React, { useState } from 'react';
import './Settings.css';

function Settings({ config, onUpdate }) {
    const [nuevoEquipo, setNuevoEquipo] = useState('');
    const [nuevaFalla, setNuevaFalla] = useState({ equipo: '', nombre: '', precio: '' });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        onUpdate({ ...config, [name]: type === 'checkbox' ? checked : value });
    };

    const tablaPrecios = config.tablaPrecios || {};

    const handleAgregarEquipo = () => {
        if (!nuevoEquipo.trim() || tablaPrecios[nuevoEquipo]) return;
        onUpdate({ ...config, tablaPrecios: { ...tablaPrecios, [nuevoEquipo]: {} } });
        setNuevoEquipo('');
    };

    const handleEliminarEquipo = (equipo) => {
        if (!window.confirm(`¿Seguro que querés eliminar "${equipo}"?`)) return;
        const nuevaTabla = { ...tablaPrecios };
        delete nuevaTabla[equipo];
        onUpdate({ ...config, tablaPrecios: nuevaTabla });
    };

    const handleAgregarFalla = (equipo) => {
        if (!nuevaFalla.nombre.trim() || !nuevaFalla.precio || nuevaFalla.equipo !== equipo) return;
        onUpdate({
            ...config, tablaPrecios: { ...tablaPrecios, [equipo]: { ...tablaPrecios[equipo], [nuevaFalla.nombre]: Number(nuevaFalla.precio) } }
        });
        setNuevaFalla({ equipo: '', nombre: '', precio: '' });
    };

    const handleEliminarFalla = (equipo, falla) => {
        const nuevaTabla = { ...tablaPrecios };
        delete nuevaTabla[equipo][falla];
        onUpdate({ ...config, tablaPrecios: nuevaTabla });
    };

    return (
        <div className="settings-wrapper">
            <h3 className="settings-section-title">Configuración de tu Vidriera</h3>

            <div className="settings-form-group">
                <label className="settings-label">Título de la Web:
                    <input type="text" name="titulo" value={config.titulo || ''} onChange={handleChange} className="settings-input" />
                </label>
                <label className="settings-label">Descripción corta:
                    <textarea name="descripcion" value={config.descripcion || ''} onChange={handleChange} className="settings-input settings-textarea" />
                </label>
                <label className="settings-label">URL Imagen "Antes" (Equipo Roto):
                    <input type="text" name="imagenAntes" value={config.imagenAntes || ''} onChange={handleChange} placeholder="https://ejemplo.com/roto.jpg" className="settings-input" />
                </label>
                <label className="settings-label">URL Imagen "Después" (Equipo Reparado):
                    <input type="text" name="imagenDespues" value={config.imagenDespues || ''} onChange={handleChange} placeholder="https://ejemplo.com/reparado.jpg" className="settings-input" />
                </label>

                <div className="color-picker-wrapper">
                    <label className="settings-label" style={{ margin: 0 }}>Color de Marca (Hex):</label>
                    <input type="color" name="colorTema" value={config.colorTema || '#ffffff'} onChange={handleChange} className="color-picker" />
                </div>

                <div className="toggle-box">
                    <div>
                        <strong className="toggle-title">Presupuestador Automático</strong>
                        <span className="toggle-desc">Muestra los precios al cliente antes del chat.</span>
                    </div>
                    <label><input type="checkbox" name="mostrarPresupuestador" checked={config.mostrarPresupuestador !== false} onChange={handleChange} className="toggle-checkbox" /></label>
                </div>
            </div>

            {config.mostrarPresupuestador !== false && (
                <>
                    <h3 className="settings-section-title">Gestión de Lista de Precios</h3>
                    <div className="price-list-container">
                        {Object.keys(tablaPrecios).map(equipo => (
                            <div key={equipo} className="equipment-card">
                                <div className="equipment-header">
                                    <h4 className="equipment-title">{equipo}</h4>
                                    <button onClick={() => handleEliminarEquipo(equipo)} className="btn-delete-equipment">🗑️ Borrar Equipo</button>
                                </div>
                                <div className="fault-list">
                                    {Object.entries(tablaPrecios[equipo]).map(([falla, precio]) => (
                                        <div key={falla} className="fault-item">
                                            <span className="fault-name">{falla}</span>
                                            <div className="fault-price-wrapper">
                                                <span className="fault-price">${precio.toLocaleString('es-AR')}</span>
                                                <button onClick={() => handleEliminarFalla(equipo, falla)} className="btn-delete-fault">×</button>
                                            </div>
                                        </div>
                                    ))}
                                    {Object.keys(tablaPrecios[equipo]).length === 0 && <span className="empty-faults">No hay fallas cargadas.</span>}
                                </div>
                                <div className="add-fault-form">
                                    <input type="text" placeholder="Nueva falla..." value={nuevaFalla.equipo === equipo ? nuevaFalla.nombre : ''} onChange={(e) => setNuevaFalla({ equipo, nombre: e.target.value, precio: nuevaFalla.precio })} className="settings-input" style={{ marginTop: 0, flex: 2, padding: '10px' }} />
                                    <input type="number" placeholder="Precio $" value={nuevaFalla.equipo === equipo ? nuevaFalla.precio : ''} onChange={(e) => setNuevaFalla({ ...nuevaFalla, equipo, precio: e.target.value })} className="settings-input" style={{ marginTop: 0, flex: 1, padding: '10px' }} />
                                    <button onClick={() => handleAgregarFalla(equipo)} className="btn-add btn-add-fault">+</button>
                                </div>
                            </div>
                        ))}
                        <div className="add-equipment-form">
                            <input type="text" placeholder="Nombre del nuevo equipo (Ej. iPhone 15)" value={nuevoEquipo} onChange={(e) => setNuevoEquipo(e.target.value)} className="settings-input" style={{ marginTop: 0, flex: 1 }} />
                            <button onClick={handleAgregarEquipo} className="btn-add btn-add-equipment">Agregar Equipo</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
export default Settings;