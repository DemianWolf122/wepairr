import React, { useState } from 'react';
import './Settings.css';

function Settings({ config, onUpdate }) {
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        onUpdate({ ...config, [name]: type === 'checkbox' ? checked : value });
    };

    return (
        <div className="settings-layout">

            {/* COLUMNA IZQUIERDA: CONTROLES */}
            <div className="settings-controls glass-effect">
                <h2 className="settings-main-title">Personalizar Vidriera</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Los cambios se guardan automáticamente.</p>

                <div className="settings-form-group">
                    <label className="settings-label">Nombre del Negocio:
                        <input type="text" name="nombreNegocio" value={config.nombreNegocio || ''} onChange={handleChange} className="settings-input" />
                    </label>

                    <label className="settings-label">Título Principal (Hero):
                        <input type="text" name="titulo" value={config.titulo || ''} onChange={handleChange} className="settings-input" />
                    </label>

                    <label className="settings-label">Descripción corta:
                        <textarea name="descripcion" value={config.descripcion || ''} onChange={handleChange} className="settings-input settings-textarea" />
                    </label>

                    <div style={{ display: 'flex', gap: '15px' }}>
                        <div className="color-picker-wrapper" style={{ flex: 1 }}>
                            <label className="settings-label" style={{ margin: 0 }}>Color de Marca:</label>
                            <input type="color" name="colorTema" value={config.colorTema || '#ffffff'} onChange={handleChange} className="color-picker" />
                        </div>
                    </div>

                    <div className="toggle-box">
                        <div>
                            <strong className="toggle-title">Presupuestador IA</strong>
                            <span className="toggle-desc">Mostrar lista de precios al cliente.</span>
                        </div>
                        <label><input type="checkbox" name="mostrarPresupuestador" checked={config.mostrarPresupuestador !== false} onChange={handleChange} className="toggle-checkbox" /></label>
                    </div>
                </div>
            </div>

            {/* COLUMNA DERECHA: VISTA PREVIA (CELULAR) */}
            <div className="settings-preview-container">
                <div className="phone-mockup glass-effect">

                    {/* Header del Mockup */}
                    <div className="phone-header">
                        <div className="phone-notch"></div>
                    </div>

                    {/* Contenido Visual en Tiempo Real */}
                    <div className="phone-screen" style={{ '--dynamic-color': config.colorTema }}>
                        <div className="preview-nav">
                            <span style={{ fontWeight: 'bold' }}>{config.nombreNegocio || 'Mi Negocio'}</span>
                            <span>=</span>
                        </div>

                        <div className="preview-hero">
                            <div className="preview-avatar">🔧</div>
                            <h3 className="preview-title">{config.titulo || 'Título aquí'}</h3>
                            <p className="preview-desc">{config.descripcion || 'Descripción corta...'}</p>
                            <button className="preview-btn" style={{ backgroundColor: config.colorTema, color: '#fff' }}>Iniciar Consulta</button>
                        </div>

                        {config.mostrarPresupuestador && (
                            <div className="preview-prices glass-input-effect">
                                <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem' }}>Nuestros Precios</h4>
                                <div className="preview-price-item"><span>Cambio Pantalla</span> <strong>$---</strong></div>
                                <div className="preview-price-item"><span>Pin de Carga</span> <strong>$---</strong></div>
                            </div>
                        )}
                    </div>
                </div>
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '20px', fontSize: '0.9rem' }}>Vista Previa en Dispositivo Móvil</p>
            </div>
        </div>
    );
}

export default Settings;