import React, { useState, useMemo, useEffect } from 'react';
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

const COLOR_PRESETS = [
    { name: 'Azul Wepairr', hex: '#2563eb' }, { name: 'Esmeralda Tech', hex: '#10b981' },
    { name: 'Púrpura Pro', hex: '#8b5cf6' }, { name: 'Rojo Carmesí', hex: '#e11d48' },
    { name: 'Naranja Volt', hex: '#f97316' }, { name: 'Carbón Mate', hex: '#334155' },
    { name: 'Rosa Neón', hex: '#ec4899' }, { name: 'Cian Cibernético', hex: '#06b6d4' },
    { name: 'Amarillo Solar', hex: '#eab308' }, { name: 'Índigo Profundo', hex: '#4f46e5' },
    { name: 'Verde Lima', hex: '#84cc16' }, { name: 'Rojo Ladrillo', hex: '#b91c1c' },
];

const FONTS = [
    { label: 'Moderna (Por defecto)', value: 'system-ui, -apple-system, sans-serif' },
    { label: 'Elegante (Serif)', value: 'Georgia, "Times New Roman", serif' },
    { label: 'Tech (Monospace)', value: '"Fira Code", "Courier New", monospace' },
    { label: 'Geométrica', value: '"Trebuchet MS", "Lucida Grande", sans-serif' }
];

const BORDER_STYLES = [
    { label: 'Suaves (Redondeados)', value: '16px' },
    { label: 'Píldora (Ultra Redondos)', value: '30px' },
    { label: 'Profesional (Cuadrados)', value: '4px' }
];

function Settings({ config, onUpdate }) {
    const [currentPlan, setCurrentPlan] = useState(config.plan || 'standard');
    const isPremium = currentPlan === 'premium';

    // Estados para la lógica del cambio de vista previa
    const [previewMode, setPreviewMode] = useState('mobile');
    const [isAnimatingPreview, setIsAnimatingPreview] = useState(false);
    const [nextPreviewMode, setNextPreviewMode] = useState(null);

    const [seccionAbierta, setSeccionAbierta] = useState('identidad');

    // --- LÓGICA DE LA ANIMACIÓN DE TRANSICIÓN ---
    const handlePreviewChange = (mode) => {
        if (mode === previewMode || isAnimatingPreview) return;
        // 1. Iniciamos la animación de salida
        setIsAnimatingPreview(true);
        setNextPreviewMode(mode);

        // 2. Esperamos a que termine la animación de salida (400ms) antes de cambiar el DOM
        setTimeout(() => {
            setPreviewMode(mode);
            setNextPreviewMode(null);
            // 3. El estado 'isAnimatingPreview' sigue true un momento para la animación de entrada
            setTimeout(() => setIsAnimatingPreview(false), 50);
        }, 400); // Este tiempo debe coincidir con la duración de la animación CSS
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        onUpdate({ ...config, [name]: type === 'checkbox' ? checked : value });
    };

    const toggleSeccion = (seccion) => {
        setSeccionAbierta(prev => prev === seccion ? null : seccion);
    };

    const shopStyles = useMemo(() => {
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
            '--shop-font': config.fontFamily || 'system-ui, -apple-system, sans-serif',
            '--shop-radius': config.borderRadius || '16px',
        };
    }, [config.colorTema, config.shopDarkMode, config.fontFamily, config.borderRadius]);

    const getEmbedUrl = (url) => {
        if (!url) return null;
        if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/');
        if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'youtube.com/embed/');
        return url;
    };

    // Clase dinámica para el contenedor de vista previa según el estado de animación
    const previewContainerClass = `settings-preview-container ${isAnimatingPreview && nextPreviewMode ? 'animating-out' : 'animating-in'}`;

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

                <div className="accordions-container">
                    {/* ACORDEÓN 1: IDENTIDAD */}
                    <div className={`accordion-item ${seccionAbierta === 'identidad' ? 'active' : ''}`}>
                        <div className="accordion-header" onClick={() => toggleSeccion('identidad')}>
                            <span>🏢 Identidad del Negocio</span>
                            <span className="accordion-chevron">{seccionAbierta === 'identidad' ? '▲' : '▼'}</span>
                        </div>
                        {seccionAbierta === 'identidad' && (
                            <div className="accordion-content">
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
                        )}
                    </div>

                    {/* ACORDEÓN 2: APARIENCIA */}
                    <div className={`accordion-item ${seccionAbierta === 'apariencia' ? 'active' : ''}`}>
                        <div className="accordion-header" onClick={() => toggleSeccion('apariencia')}>
                            <span>🎨 Apariencia Global</span>
                            <span className="accordion-chevron">{seccionAbierta === 'apariencia' ? '▲' : '▼'}</span>
                        </div>
                        {seccionAbierta === 'apariencia' && (
                            <div className="accordion-content">
                                <label className="settings-label" style={{ marginBottom: '15px' }}>Color de Marca (Alta Conversión):</label>
                                <div className="color-presets-grid">
                                    {COLOR_PRESETS.map(preset => (
                                        <button
                                            key={preset.hex} type="button"
                                            className={`color-preset-btn ${config.colorTema === preset.hex ? 'active' : ''}`}
                                            style={{ backgroundColor: preset.hex }}
                                            onClick={() => onUpdate({ ...config, colorTema: preset.hex })}
                                            title={preset.name}
                                        />
                                    ))}
                                </div>

                                <div className="toggle-box glass-input-effect" style={{ marginTop: '25px', marginBottom: '25px' }}>
                                    <div>
                                        <strong className="toggle-title">Modo Oscuro en Vidriera</strong>
                                        <span className="toggle-desc">Fondo oscuro elegante.</span>
                                    </div>
                                    <label className="switch">
                                        <input type="checkbox" name="shopDarkMode" checked={config.shopDarkMode || false} onChange={handleChange} />
                                        <span className="slider round"></span>
                                    </label>
                                </div>

                                <PremiumGate isPremium={isPremium}>
                                    <div className="settings-form-group">
                                        <label className="settings-label">Estilo de Tipografía:
                                            <select name="fontFamily" value={config.fontFamily || FONTS[0].value} onChange={handleChange} className="settings-input">
                                                {FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                                            </select>
                                        </label>
                                        <label className="settings-label">Estilo de Botones y Tarjetas:
                                            <select name="borderRadius" value={config.borderRadius || '16px'} onChange={handleChange} className="settings-input">
                                                {BORDER_STYLES.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
                                            </select>
                                        </label>
                                    </div>
                                </PremiumGate>
                            </div>
                        )}
                    </div>

                    {/* ACORDEÓN 3: MULTIMEDIA & REDES */}
                    <div className={`accordion-item ${seccionAbierta === 'multimedia' ? 'active' : ''}`}>
                        <div className="accordion-header" onClick={() => toggleSeccion('multimedia')}>
                            <span>🖼️ Multimedia & Redes (Pro)</span>
                            <span className="accordion-chevron">{seccionAbierta === 'multimedia' ? '▲' : '▼'}</span>
                        </div>
                        {seccionAbierta === 'multimedia' && (
                            <div className="accordion-content">
                                <PremiumGate isPremium={isPremium}>
                                    <div className="settings-form-group">
                                        <label className="settings-label">URL Imagen de Portada (Banner):
                                            <input type="text" name="bannerUrl" value={config.bannerUrl || ''} onChange={handleChange} className="settings-input" placeholder="https://ejemplo.com/imagen.jpg" />
                                        </label>
                                        <label className="settings-label">Video Promocional (YouTube):
                                            <input type="text" name="videoUrl" value={config.videoUrl || ''} onChange={handleChange} className="settings-input" placeholder="https://www.youtube.com/watch?v=..." />
                                        </label>
                                        <hr style={{ borderColor: 'var(--border-glass)', opacity: 0.5, margin: '10px 0' }} />
                                        <label className="settings-label">WhatsApp (Número):
                                            <input type="text" name="whatsapp" value={config.whatsapp || ''} onChange={handleChange} className="settings-input" placeholder="Ej. 549112345678" />
                                        </label>
                                        <label className="settings-label">Instagram (Usuario):
                                            <input type="text" name="instagram" value={config.instagram || ''} onChange={handleChange} className="settings-input" placeholder="Ej. @mitaller" />
                                        </label>
                                    </div>
                                </PremiumGate>
                            </div>
                        )}
                    </div>

                    {/* ACORDEÓN 4: FUNCIONALIDADES */}
                    <div className={`accordion-item ${seccionAbierta === 'funcionalidades' ? 'active' : ''}`}>
                        <div className="accordion-header" onClick={() => toggleSeccion('funcionalidades')}>
                            <span>⚡ Funcionalidades</span>
                            <span className="accordion-chevron">{seccionAbierta === 'funcionalidades' ? '▲' : '▼'}</span>
                        </div>
                        {seccionAbierta === 'funcionalidades' && (
                            <div className="accordion-content">
                                <div className="toggle-box glass-input-effect">
                                    <div>
                                        <strong className="toggle-title">Presupuestador Online</strong>
                                        <span className="toggle-desc">Muestra tu lista de precios.</span>
                                    </div>
                                    <label className="switch">
                                        <input type="checkbox" name="mostrarPresupuestador" checked={config.mostrarPresupuestador !== false} onChange={handleChange} />
                                        <span className="slider round"></span>
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>


            {/* --- COLUMNA DERECHA: VISTA PREVIA CON ANIMACIÓN PREMIUM --- */}
            <div className={previewContainerClass}>

                <div className="device-toggles glass-effect">
                    {/* Usamos la nueva función handlePreviewChange */}
                    <button type="button" className={`device-btn ${previewMode === 'mobile' && !nextPreviewMode ? 'active' : ''}`} onClick={() => handlePreviewChange('mobile')}>📱 Celular</button>
                    <button type="button" className={`device-btn ${previewMode === 'desktop' || nextPreviewMode === 'desktop' ? 'active' : ''}`} onClick={() => handlePreviewChange('desktop')}>💻 Monitor</button>
                </div>

                {/* EL MOCKUP QUE SE RENDERIZA (Móvil o Desktop) */}
                <div className={previewMode === 'mobile' ? 'phone-mockup' : 'desktop-mockup'}>

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
                    <div className="shop-screen" style={shopStyles}>

                        <div className="shop-nav">
                            <span className="shop-logo">{config.nombreNegocio || 'Tu Negocio'}</span>
                            <div className="shop-nav-links">
                                <span>Inicio</span> <span>Servicios</span>
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

                        {config.videoUrl && isPremium && getEmbedUrl(config.videoUrl) && (
                            <div className="shop-section animate-slide-up-delayed" style={{ background: 'var(--shop-bg-secondary)' }}>
                                <h2 className="shop-section-title">Sobre Nosotros</h2>
                                <div className="shop-video-wrapper">
                                    <iframe src={getEmbedUrl(config.videoUrl)} title="Video promocional" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="shop-iframe"></iframe>
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
                            {isPremium && (config.whatsapp || config.instagram) && (
                                <div className="shop-social-links">
                                    {config.whatsapp && <span className="social-badge">WhatsApp</span>}
                                    {config.instagram && <span className="social-badge">Insta</span>}
                                </div>
                            )}
                            <p>© 2024 {config.nombreNegocio}.</p>
                        </div>

                        {isPremium && config.whatsapp && (
                            <div className="floating-wa-btn">💬</div>
                        )}

                    </div>
                    {previewMode === 'mobile' && <div className="phone-home-bar"></div>}
                </div>
            </div>
        </div>
    );
}

export default Settings;