import React, { useState, useMemo } from 'react';
import './Settings.css';

// --- COMPONENTE PREMIUM GATE ---
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

// --- PALETAS PREDEFINIDAS PREMIUM ---
const COLOR_PRESETS = [
    { name: 'Azul Wepairr', hex: '#2563eb' },
    { name: 'Esmeralda Tech', hex: '#10b981' },
    { name: 'Púrpura Pro', hex: '#8b5cf6' },
    { name: 'Rojo Carmesí', hex: '#e11d48' },
    { name: 'Naranja Volt', hex: '#f97316' },
    { name: 'Carbón Mate', hex: '#334155' },
];

function Settings({ config, onUpdate }) {
    const [currentPlan, setCurrentPlan] = useState(config.plan || 'standard');
    const isPremium = currentPlan === 'premium';

    // Estado para controlar la vista previa (Móvil vs Escritorio)
    const [previewMode, setPreviewMode] = useState('mobile');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        onUpdate({ ...config, [name]: type === 'checkbox' ? checked : value });
    };

    // --- LÓGICA DE COLOR INTELIGENTE ---
    const shopColors = useMemo(() => {
        const accent = config.colorTema || '#2563eb';
        const isDarkMode = config.shopDarkMode;

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
            '--shop-accent': accent,
            '--shop-accent-hover': adjustColor(accent, isDarkMode ? 20 : -20),
            '--shop-bg': isDarkMode ? '#0f172a' : '#ffffff',
            '--shop-bg-secondary': isDarkMode ? '#1e293b' : '#f8fafc',
            '--shop-text': isDarkMode ? '#f8fafc' : '#0f172a',
            '--shop-text-secondary': isDarkMode ? '#94a3b8' : '#64748b',
            '--shop-border': isDarkMode ? '#334155' : '#e2e8f0',
        };
    }, [config.colorTema, config.shopDarkMode]);

    // Función para convertir links de YouTube a formato Embed
    const getEmbedUrl = (url) => {
        if (!url) return null;
        if (url.includes('youtube.com/watch?v=')) {
            return url.replace('watch?v=', 'embed/');
        }
        if (url.includes('youtu.be/')) {
            return url.replace('youtu.be/', 'youtube.com/embed/');
        }
        return url;
    };

    return (
        <div className={`settings-layout ${previewMode === 'desktop' ? 'layout-desktop' : ''}`}>

            {/* --- COLUMNA IZQUIERDA: CONTROLES --- */}
            <div className="settings-controls glass-effect">
                <div className="settings-header-row">
                    <div>
                        <h2 className="settings-main-title">Editor Visual</h2>
                        <p className="settings-subtitle">Personaliza tu vidriera digital.</p>
                    </div>
                    <div className="plan-selector-wrapper">
                        <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>PLAN:</span>
                        <select value={currentPlan} onChange={(e) => { setCurrentPlan(e.target.value); handleChange(e); }} name="plan" className="plan-select glass-input-effect">
                            <option value="standard">Standard (Gratis)</option>
                            <option value="premium">Premium (PRO)</option>
                        </select>
                    </div>
                </div>

                <hr className="settings-divider" />

                {/* IDENTIDAD */}
                <div className="settings-section">
                    <h3 className="settings-section-title">🏢 Identidad del Negocio</h3>
                    <div className="settings-form-group">
                        <label className="settings-label">Nombre Visible:
                            <input type="text" name="nombreNegocio" value={config.nombreNegocio || ''} onChange={handleChange} className="settings-input" placeholder="Ej. Wepairr Tech" />
                        </label>
                        <label className="settings-label">Título Principal:
                            <input type="text" name="titulo" value={config.titulo || ''} onChange={handleChange} className="settings-input" placeholder="Ej. Reparamos tu mundo." />
                        </label>
                        <label className="settings-label">Descripción Corta:
                            <textarea name="descripcion" value={config.descripcion || ''} onChange={handleChange} className="settings-input settings-textarea" placeholder="Especialistas en..." />
                        </label>
                    </div>
                </div>

                <hr className="settings-divider" />

                {/* APARIENCIA (PALETA CUIDADA Y MODO OSCURO EN PLAN BÁSICO) */}
                <div className="settings-section">
                    <h3 className="settings-section-title">🎨 Apariencia</h3>

                    <label className="settings-label" style={{ marginBottom: '15px' }}>Color de Marca:</label>
                    <div className="color-presets-grid">
                        {COLOR_PRESETS.map(preset => (
                            <button
                                key={preset.hex}
                                type="button"
                                className={`color-preset-btn ${config.colorTema === preset.hex ? 'active' : ''}`}
                                style={{ backgroundColor: preset.hex }}
                                onClick={() => onUpdate({ ...config, colorTema: preset.hex })}
                                title={preset.name}
                            />
                        ))}
                    </div>

                    <div style={{ marginTop: '25px' }}></div>

                    {/* MODO OSCURO AHORA ESTÁ EN EL PLAN BÁSICO */}
                    <div className="toggle-box glass-input-effect">
                        <div>
                            <strong className="toggle-title">Modo Oscuro en Vidriera</strong>
                            <span className="toggle-desc">Activa un tema oscuro elegante.</span>
                        </div>
                        <label className="switch">
                            <input type="checkbox" name="shopDarkMode" checked={config.shopDarkMode || false} onChange={handleChange} />
                            <span className="slider round"></span>
                        </label>
                    </div>
                </div>

                <hr className="settings-divider" />

                {/* MULTIMEDIA (PREMIUM) */}
                <div className="settings-section">
                    <h3 className="settings-section-title">🖼️ Multimedia (Pro)</h3>
                    <PremiumGate isPremium={isPremium}>
                        <div className="settings-form-group">
                            <label className="settings-label">URL Imagen de Portada:
                                <input type="text" name="bannerUrl" value={config.bannerUrl || ''} onChange={handleChange} className="settings-input" placeholder="https://ejemplo.com/imagen.jpg" />
                            </label>

                            <label className="settings-label">Video Promocional (YouTube):
                                <input type="text" name="videoUrl" value={config.videoUrl || ''} onChange={handleChange} className="settings-input" placeholder="https://www.youtube.com/watch?v=..." />
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Se mostrará en la sección "Sobre Nosotros".</span>
                            </label>
                        </div>
                    </PremiumGate>
                </div>
            </div>


            {/* --- COLUMNA DERECHA: VISTA PREVIA --- */}
            <div className="settings-preview-container animate-fade-in">

                {/* Controles de Dispositivo */}
                <div className="device-toggles glass-effect">
                    <button type="button" className={`device-btn ${previewMode === 'mobile' ? 'active' : ''}`} onClick={() => setPreviewMode('mobile')}>📱 Celular</button>
                    <button type="button" className={`device-btn ${previewMode === 'desktop' ? 'active' : ''}`} onClick={() => setPreviewMode('desktop')}>💻 Monitor</button>
                </div>

                {/* EL MOCKUP DINÁMICO */}
                <div className={previewMode === 'mobile' ? 'phone-mockup' : 'desktop-mockup'}>

                    {/* Header condicional según dispositivo */}
                    {previewMode === 'mobile' ? (
                        <div className="phone-header-bar">
                            <div className="phone-notch"></div>
                            <div className="phone-status-bar"><span>9:41</span><span>📶 🔋</span></div>
                        </div>
                    ) : (
                        <div className="desktop-header-bar">
                            <div className="mac-dot mac-red"></div>
                            <div className="mac-dot mac-yellow"></div>
                            <div className="mac-dot mac-green"></div>
                            <div className="desktop-url-bar">www.wepairr.com/taller/tu-negocio</div>
                        </div>
                    )}

                    {/* LA PANTALLA RENDERIZADA */}
                    <div className="shop-screen" style={shopColors}>

                        <div className="shop-nav">
                            <span className="shop-logo">{config.nombreNegocio || 'Tu Negocio'}</span>
                            <div className="shop-nav-links">
                                <span>Inicio</span> <span>Servicios</span> <span>Contacto</span>
                            </div>
                            <div className="shop-menu-icon">☰</div>
                        </div>

                        <div className="shop-hero" style={config.bannerUrl && isPremium ? { backgroundImage: `url(${config.bannerUrl})` } : {}}>
                            <div className="shop-hero-overlay"></div>
                            <div className="shop-hero-content animate-slide-up">
                                <div className="shop-avatar-placeholder">Logo</div>
                                <h1 className="shop-title">{config.titulo || 'Tu Título Principal'}</h1>
                                <p className="shop-desc animate-delayed">{config.descripcion || 'Tu descripción corta aparecerá aquí...'}</p>
                                <button className="shop-cta-btn">Solicitar Reparación</button>
                            </div>
                        </div>

                        {/* SECCIÓN VIDEO PREMIUM */}
                        {config.videoUrl && isPremium && getEmbedUrl(config.videoUrl) && (
                            <div className="shop-section animate-slide-up-delayed" style={{ background: 'var(--shop-bg-secondary)' }}>
                                <h2 className="shop-section-title">Sobre Nosotros</h2>
                                <div className="shop-video-wrapper">
                                    <iframe
                                        src={getEmbedUrl(config.videoUrl)}
                                        title="YouTube video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="shop-iframe"
                                    ></iframe>
                                </div>
                            </div>
                        )}

                        {config.mostrarPresupuestador && (
                            <div className="shop-section animate-slide-up-delayed">
                                <h2 className="shop-section-title">Nuestros Servicios</h2>
                                <div className="shop-services-grid">
                                    <div className="shop-service-card"><span className="service-icon" style={{ color: 'var(--shop-accent)' }}>📱</span><span>Pantallas</span><strong>Consultar</strong></div>
                                    <div className="shop-service-card"><span className="service-icon" style={{ color: 'var(--shop-accent)' }}>🔋</span><span>Baterías</span><strong>Consultar</strong></div>
                                </div>
                            </div>
                        )}

                        <div className="shop-footer">
                            <p>© 2024 {config.nombreNegocio}.</p>
                        </div>

                    </div>
                    {previewMode === 'mobile' && <div className="phone-home-bar"></div>}
                </div>
            </div>
        </div>
    );
}

export default Settings;