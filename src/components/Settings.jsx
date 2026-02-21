import React, { useState, useEffect, useMemo } from 'react';
import './Settings.css';

// --- COMPONENTE PARA BLOQUEAR FUNCIONES PREMIUM ---
const PremiumGate = ({ children, isPremium }) => {
    if (isPremium) return children;
    return (
        <div className="premium-gate-wrapper">
            <div className="premium-content-blurred">{children}</div>
            <div className="premium-lock-overlay">
                <span className="lock-icon">🔒</span>
                <span className="premium-label">Función Premium</span>
                <button className="btn-upgrade-tiny">Mejorar Plan</button>
            </div>
        </div>
    );
};

function Settings({ config, onUpdate }) {
    // Simulamos el estado del plan (esto vendría del backend)
    const [currentPlan, setCurrentPlan] = useState(config.plan || 'standard');
    const isPremium = currentPlan === 'premium';

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        onUpdate({ ...config, [name]: type === 'checkbox' ? checked : value });
    };

    // --- LÓGICA DE COLOR INTELIGENTE ---
    // Genera una paleta de colores con buen contraste basada en el color de acento y el modo
    const shopColors = useMemo(() => {
        const accent = config.colorTema || '#2563eb';
        const isDarkMode = config.shopDarkMode;

        // Función simple para oscurecer/aclarar (se podría usar una librería para ser más preciso)
        const adjustColor = (col, amt) => {
            let usePound = false;
            if (col[0] === "#") { col = col.slice(1); usePound = true; }
            let num = parseInt(col, 16);
            let r = (num >> 16) + amt;
            let b = ((num >> 8) & 0x00FF) + amt;
            let g = (num & 0x0000FF) + amt;
            if (r > 255) r = 255; else if (r < 0) r = 0;
            if (b > 255) b = 255; else if (b < 0) b = 0;
            if (g > 255) g = 255; else if (g < 0) g = 0;
            return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
        };

        return {
            // Variables CSS que se inyectarán en la vista previa
            '--shop-accent': accent,
            '--shop-accent-hover': adjustColor(accent, isDarkMode ? 20 : -20),
            '--shop-bg': isDarkMode ? '#0f172a' : '#ffffff',
            '--shop-bg-secondary': isDarkMode ? '#1e293b' : '#f8fafc',
            '--shop-text': isDarkMode ? '#f8fafc' : '#0f172a',
            '--shop-text-secondary': isDarkMode ? '#94a3b8' : '#64748b',
            '--shop-border': isDarkMode ? '#334155' : '#e2e8f0',
        };
    }, [config.colorTema, config.shopDarkMode]);


    return (
        <div className="settings-layout">

            {/* --- COLUMNA IZQUIERDA: CONTROLES DEL EDITOR --- */}
            <div className="settings-controls glass-effect">
                <div className="settings-header-row">
                    <div>
                        <h2 className="settings-main-title">Editor Visual</h2>
                        <p className="settings-subtitle">Personaliza tu vidriera digital en tiempo real.</p>
                    </div>
                    {/* Selector de Plan (Para simular) */}
                    <div className="plan-selector-wrapper">
                        <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>PLAN ACTUAL:</span>
                        <select value={currentPlan} onChange={(e) => { setCurrentPlan(e.target.value); handleChange(e); }} name="plan" className="plan-select glass-input-effect">
                            <option value="standard">Standard (Gratis)</option>
                            <option value="premium">Premium (PRO)</option>
                        </select>
                    </div>
                </div>

                <hr className="settings-divider" />

                {/* SECCIÓN 1: IDENTIDAD BÁSICA */}
                <div className="settings-section">
                    <h3 className="settings-section-title">🏢 Identidad del Negocio</h3>
                    <div className="settings-form-group">
                        <label className="settings-label">Nombre Visible:
                            <input type="text" name="nombreNegocio" value={config.nombreNegocio || ''} onChange={handleChange} className="settings-input" placeholder="Ej. Wepairr Tech" />
                        </label>
                        <label className="settings-label">Título Principal (Hero):
                            <input type="text" name="titulo" value={config.titulo || ''} onChange={handleChange} className="settings-input" placeholder="Ej. Reparamos tu mundo." />
                        </label>
                        <label className="settings-label">Descripción Corta:
                            <textarea name="descripcion" value={config.descripcion || ''} onChange={handleChange} className="settings-input settings-textarea" placeholder="Especialistas en..." />
                        </label>
                    </div>
                </div>

                <hr className="settings-divider" />

                {/* SECCIÓN 2: APARIENCIA Y MARCA */}
                <div className="settings-section">
                    <h3 className="settings-section-title">🎨 Apariencia</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '15px' }}>Elige un color de acento. Nosotros generamos el resto para asegurar un buen contraste.</p>

                    <div className="color-picker-wrapper glass-input-effect">
                        <label className="settings-label" style={{ margin: 0, flex: 1 }}>Color de Acento Principal:</label>
                        <input type="color" name="colorTema" value={config.colorTema || '#2563eb'} onChange={handleChange} className="color-picker" />
                    </div>

                    <div style={{ marginTop: '15px' }}></div>

                    {/* FUNCIÓN PREMIUM: MODO OSCURO DE LA TIENDA */}
                    <PremiumGate isPremium={isPremium}>
                        <div className="toggle-box glass-input-effect">
                            <div>
                                <strong className="toggle-title">Modo Oscuro en Vidriera</strong>
                                <span className="toggle-desc">Activa un tema oscuro elegante para tu tienda.</span>
                            </div>
                            <label className="switch">
                                <input type="checkbox" name="shopDarkMode" checked={config.shopDarkMode || false} onChange={handleChange} />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </PremiumGate>
                </div>

                <hr className="settings-divider" />

                {/* SECCIÓN 3: MULTIMEDIA */}
                <div className="settings-section">
                    <h3 className="settings-section-title">🖼️ Multimedia</h3>

                    {/* FUNCIÓN PREMIUM: IMAGEN DE PORTADA */}
                    <PremiumGate isPremium={isPremium}>
                        <label className="settings-label">URL Imagen de Portada (Banner):
                            <input type="text" name="bannerUrl" value={config.bannerUrl || ''} onChange={handleChange} className="settings-input" placeholder="https://ejemplo.com/imagen.jpg" />
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Pega el enlace directo a una imagen (ej. de Unsplash).</span>
                        </label>
                    </PremiumGate>
                </div>

                <hr className="settings-divider" />

                {/* SECCIÓN 4: FUNCIONALIDADES */}
                <div className="settings-section">
                    <h3 className="settings-section-title">⚡ Funcionalidades</h3>
                    <div className="toggle-box glass-input-effect">
                        <div>
                            <strong className="toggle-title">Presupuestador Online</strong>
                            <span className="toggle-desc">Muestra tu lista de precios orientativos.</span>
                        </div>
                        <label className="switch">
                            <input type="checkbox" name="mostrarPresupuestador" checked={config.mostrarPresupuestador !== false} onChange={handleChange} />
                            <span className="slider round"></span>
                        </label>
                    </div>
                </div>

            </div>


            {/* --- COLUMNA DERECHA: VISTA PREVIA VIVA --- */}
            <div className="settings-preview-container animate-fade-in">
                <div className="phone-mockup glass-effect">
                    <div className="phone-header-bar">
                        <div className="phone-notch"></div>
                        <div className="phone-status-bar"><span>9:41</span><span>📶 🔋</span></div>
                    </div>

                    {/* PANTALLA DEL CELULAR: Se le inyectan las variables CSS dinámicas */}
                    <div className="phone-screen" style={shopColors}>

                        {/* Navbar de la tienda */}
                        <div className="shop-nav">
                            <span className="shop-logo">{config.nombreNegocio || 'Tu Negocio'}</span>
                            <div className="shop-menu-icon">☰</div>
                        </div>

                        {/* Hero Section con Banner */}
                        <div className="shop-hero" style={config.bannerUrl && isPremium ? { backgroundImage: `url(${config.bannerUrl})` } : {}}>
                            <div className="shop-hero-overlay"></div>
                            <div className="shop-hero-content animate-slide-up">
                                <div className="shop-avatar-placeholder">Logo</div>
                                <h1 className="shop-title">{config.titulo || 'Tu Título Principal'}</h1>
                                <p className="shop-desc animate-delayed">{config.descripcion || 'Tu descripción corta aparecerá aquí...'}</p>
                                <button className="shop-cta-btn">Solicitar Reparación</button>
                            </div>
                        </div>

                        {/* Sección de Servicios/Precios */}
                        {config.mostrarPresupuestador && (
                            <div className="shop-section animate-slide-up-delayed">
                                <h2 className="shop-section-title">Nuestros Servicios</h2>
                                <div className="shop-services-grid">
                                    <div className="shop-service-card">
                                        <span className="service-icon" style={{ color: 'var(--shop-accent)' }}>📱</span>
                                        <span>Cambio de Pantalla</span>
                                        <strong>Consultar</strong>
                                    </div>
                                    <div className="shop-service-card">
                                        <span className="service-icon" style={{ color: 'var(--shop-accent)' }}>🔋</span>
                                        <span>Cambio de Batería</span>
                                        <strong>Consultar</strong>
                                    </div>
                                    <div className="shop-service-card">
                                        <span className="service-icon" style={{ color: 'var(--shop-accent)' }}>💧</span>
                                        <span>Limpieza Química</span>
                                        <strong>Consultar</strong>
                                    </div>
                                    <div className="shop-service-card">
                                        <span className="service-icon" style={{ color: 'var(--shop-accent)' }}>🔬</span>
                                        <span>Microelectrónica</span>
                                        <strong>A medida</strong>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Footer simple */}
                        <div className="shop-footer">
                            <p>© 2024 {config.nombreNegocio}.</p>
                            {!isPremium && <p style={{ fontSize: '0.7rem', opacity: 0.7, marginTop: '5px' }}>Powered by Wepairr</p>}
                        </div>

                    </div>
                    {/* Barra de navegación inferior del celular */}
                    <div className="phone-home-bar"></div>
                </div>
                <div className="preview-badge glass-effect">
                    <span>📱 Vista Previa en Vivo</span>
                </div>
            </div>
        </div>
    );
}

export default Settings;