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

// --- PALETA DE COLORES DE ACENTO (Para Botones/Iconos) ---
const ACCENT_COLORS = [
    { name: 'Azul Wepairr', hex: '#2563eb' }, { name: 'Esmeralda Tech', hex: '#10b981' },
    { name: 'Púrpura Pro', hex: '#8b5cf6' }, { name: 'Rojo Carmesí', hex: '#e11d48' },
    { name: 'Naranja Volt', hex: '#f97316' }, { name: 'Carbón Mate', hex: '#334155' },
    { name: 'Rosa Neón', hex: '#ec4899' }, { name: 'Cian Cibernético', hex: '#06b6d4' },
    { name: 'Amarillo Solar', hex: '#eab308' }, { name: 'Índigo Profundo', hex: '#4f46e5' },
    { name: 'Verde Lima', hex: '#84cc16' }, { name: 'Rojo Ladrillo', hex: '#b91c1c' },
];

// --- PALETA DE COLORES DE TEXTO ---
const TEXT_COLORS = [
    { name: 'Negro Absoluto', hex: '#000000' }, { name: 'Carbón Profundo', hex: '#0f172a' },
    { name: 'Gris Pizarra', hex: '#334155' }, { name: 'Azul Marino', hex: '#1e3a8a' },
    { name: 'Rojo Vino', hex: '#450a0a' }, { name: 'Blanco Puro', hex: '#ffffff' },
    { name: 'Gris Nube', hex: '#f8fafc' }, { name: 'Plata', hex: '#cbd5e1' },
    { name: 'Azul Hielo', hex: '#e0f2fe' }, { name: 'Ámbar Claro', hex: '#fef3c7' },
    { name: 'Crema Suave', hex: '#fffbeb' }, { name: 'Gris Medio', hex: '#64748b' }
];

const FONTS = [
    { label: 'Inter (Corporativa Limpia)', value: '"Inter", system-ui, -apple-system, sans-serif' },
    { label: 'Helvetica Neue (Premium)', value: '"Helvetica Neue", Helvetica, Arial, sans-serif' },
    { label: 'Montserrat (Tech Moderna)', value: '"Montserrat", "Segoe UI", sans-serif' },
    { label: 'Poppins (Amigable y Bold)', value: '"Poppins", Roboto, sans-serif' }
];

const BORDER_STYLES = [
    { label: 'Suaves (Redondeados)', value: '16px' },
    { label: 'Píldora (Ultra Redondos)', value: '30px' },
    { label: 'Profesional (Cuadrados)', value: '4px' }
];

// --- ALGORITMO MATEMÁTICO DE CONTRASTE (WCAG) ---
const getLuminance = (hex) => {
    let rgb = parseInt(hex.replace('#', ''), 16);
    let r = (rgb >> 16) & 0xff; let g = (rgb >> 8) & 0xff; let b = (rgb >> 0) & 0xff;
    let a = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

const getContrastRatio = (hex1, hex2) => {
    const l1 = getLuminance(hex1);
    const l2 = getLuminance(hex2);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};


function Settings({ config, onUpdate }) {
    const [currentPlan, setCurrentPlan] = useState(config.plan || 'standard');
    const isPremium = currentPlan === 'premium';

    // Estados para animación de estudio (GPU Accelerated)
    const [previewMode, setPreviewMode] = useState('mobile');
    const [isAnimatingPreview, setIsAnimatingPreview] = useState(false);
    const [seccionAbierta, setSeccionAbierta] = useState('identidad');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        onUpdate({ ...config, [name]: type === 'checkbox' ? checked : value });
    };

    const toggleSeccion = (seccion) => {
        setSeccionAbierta(prev => prev === seccion ? null : seccion);
    };

    // ANIMACIÓN GPU-ACCELERATED: Sin afectar el layout, solo opacidad y escala
    const handlePreviewChange = (mode) => {
        if (mode === previewMode || isAnimatingPreview) return;
        setIsAnimatingPreview(true);
        // Tiempo de espera para que la animación de salida CSS termine
        setTimeout(() => {
            setPreviewMode(mode);
            // Pequeño delay para iniciar la animación de entrada
            setTimeout(() => setIsAnimatingPreview(false), 50);
        }, 350);
    };

    const currentBgColor = config.shopDarkMode ? '#0f172a' : '#ffffff';
    const currentAccentColor = config.colorTema || '#2563eb';

    // --- FUNCIÓN DE VERIFICACIÓN DE CONTRASTE MULTIDIMENSIONAL ---
    // Verifica un color de texto contra el fondo Y contra el color de acento
    const checkColorSafety = (textColor) => {
        const ratioBg = getContrastRatio(textColor, currentBgColor);
        const ratioAccent = getContrastRatio(textColor, currentAccentColor);
        // Un color es seguro solo si tiene buen contraste con el fondo (para leerlo)
        // Y si tiene buen contraste con el acento (para iconos/botones donde se superpone)
        // Usamos 4.5 como estándar estricto (AA) para textos normales.
        return ratioBg >= 4.5 && ratioAccent >= 3.0; // Un poco más permisivo con el acento
    };

    // EFECTO DE SEGURIDAD: Resetea colores si el contexto cambia y se vuelven inseguros
    useEffect(() => {
        let updates = {};
        // Si el color actual ya no es seguro, lo reseteamos a null para que el sistema use el default
        if (config.colorTitulo && !checkColorSafety(config.colorTitulo)) updates.colorTitulo = null;
        if (config.colorSubtitulo && !checkColorSafety(config.colorSubtitulo)) updates.colorSubtitulo = null;

        if (Object.keys(updates).length > 0) {
            onUpdate({ ...config, ...updates });
        }
    }, [config.shopDarkMode, currentAccentColor]);


    const shopStyles = useMemo(() => {
        const accent = config.colorTema || '#2563eb';
        const isDarkMode = config.shopDarkMode;

        const adjustColor = (col, amt) => {
            let usePound = false;
            if (col[0] === "#") { col = col.slice(1); usePound = true; }
            let num = parseInt(col, 16);
            let r = (num >> 16) + amt; let b = ((num >> 8) & 0x00FF) + amt; let g = (num & 0x0000FF) + amt;
            if (r > 255) r = 255; else if (r < 0) r = 0;
            if (b > 255) b = 255; else if (b < 0) b = 0;
            if (g > 255) g = 255; else if (g < 0) g = 0;
            return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
        };

        // Usamos los colores seguros calculados por useEffect, o defaults si son null
        const safeTitleColor = config.colorTitulo || (isDarkMode ? '#ffffff' : '#0f172a');
        const safeSubtitleColor = config.colorSubtitulo || (isDarkMode ? '#94a3b8' : '#64748b');

        return {
            '--shop-accent': accent,
            '--shop-accent-hover': adjustColor(accent, isDarkMode ? 20 : -20),
            '--shop-bg': isDarkMode ? '#0f172a' : '#ffffff',
            '--shop-bg-secondary': isDarkMode ? '#1e293b' : '#f8fafc',
            '--shop-text': safeTitleColor,
            '--shop-text-secondary': safeSubtitleColor,
            '--shop-border': isDarkMode ? '#334155' : '#e2e8f0',
            '--shop-font': config.fontFamily || '"Inter", system-ui, -apple-system, sans-serif',
            '--shop-radius': config.borderRadius || '16px',
        };
    }, [config]);

    const getEmbedUrl = (url) => {
        if (!url) return null;
        if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/');
        if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'youtube.com/embed/');
        return url;
    };

    return (
        <div className="settings-editor-layout">

            {/* --- COLUMNA IZQUIERDA: PANEL DE CONTROLES --- */}
            <div className="settings-controls-panel glass-effect">
                <div className="settings-header-row">
                    <div>
                        <h2 className="settings-main-title">Editor Visual</h2>
                        <p className="settings-subtitle">Diseña tu vidriera digital.</p>
                    </div>
                    <div className="plan-selector-wrapper">
                        <select value={currentPlan} onChange={(e) => { setCurrentPlan(e.target.value); handleChange(e); }} name="plan" className="plan-select glass-input-effect">
                            <option value="standard">PLAN GRATIS</option>
                            <option value="premium">PLAN PRO</option>
                        </select>
                    </div>
                </div>

                <div className="accordions-container">

                    {/* ACORDEÓN 1: IDENTIDAD & CONTACTO (Redes ahora aquí) */}
                    <div className={`accordion-item ${seccionAbierta === 'identidad' ? 'active' : ''}`}>
                        <div className="accordion-header" onClick={() => toggleSeccion('identidad')}>
                            <span>🏢 Identidad y Contacto</span>
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

                                    <hr className="settings-divider-soft" />

                                    {/* REDES SOCIALES AHORA EN PLAN STANDARD */}
                                    <label className="settings-label">WhatsApp (Sin +549):
                                        <input type="text" name="whatsapp" value={config.whatsapp || ''} onChange={handleChange} className="settings-input" placeholder="Ej. 1123456789" />
                                    </label>
                                    <label className="settings-label">Instagram (Usuario):
                                        <input type="text" name="instagram" value={config.instagram || ''} onChange={handleChange} className="settings-input" placeholder="Ej. @mitaller" />
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ACORDEÓN 2: APARIENCIA GLOBAL */}
                    <div className={`accordion-item ${seccionAbierta === 'apariencia' ? 'active' : ''}`}>
                        <div className="accordion-header" onClick={() => toggleSeccion('apariencia')}>
                            <span>🎨 Colores y Estilo</span>
                            <span className="accordion-chevron">{seccionAbierta === 'apariencia' ? '▲' : '▼'}</span>
                        </div>
                        {seccionAbierta === 'apariencia' && (
                            <div className="accordion-content">

                                <div className="toggle-box glass-input-effect" style={{ marginBottom: '25px' }}>
                                    <div>
                                        <strong className="toggle-title">Modo Oscuro en Vidriera</strong>
                                        <span className="toggle-desc">Fondo oscuro elegante.</span>
                                    </div>
                                    <label className="switch">
                                        <input type="checkbox" name="shopDarkMode" checked={config.shopDarkMode || false} onChange={handleChange} />
                                        <span className="slider round"></span>
                                    </label>
                                </div>

                                <label className="settings-label" style={{ marginBottom: '10px' }}>Color de Acento (Botones/Iconos):</label>
                                <div className="color-presets-grid accent-grid" style={{ marginBottom: '25px' }}>
                                    {ACCENT_COLORS.map(preset => {
                                        // El acento siempre debe contrastar con el fondo, sino se bloquea
                                        const isSafe = getContrastRatio(preset.hex, currentBgColor) >= 3.0;
                                        return (
                                            <button key={preset.hex} type="button"
                                                className={`color-preset-btn accent-btn ${config.colorTema === preset.hex ? 'active' : ''} ${!isSafe ? 'disabled-contrast' : ''}`}
                                                style={{ backgroundColor: preset.hex }}
                                                onClick={() => isSafe && onUpdate({ ...config, colorTema: preset.hex })}
                                                title={isSafe ? preset.name : 'Bajo Contraste con Fondo'}
                                            />
                                        );
                                    })}
                                </div>

                                {/* MOTOR DE RESTRICCIÓN MULTIDIMENSIONAL (Premium) */}
                                <PremiumGate isPremium={isPremium}>
                                    <label className="settings-label" style={{ marginBottom: '10px' }}>Color de Títulos Principales:</label>
                                    <div className="color-presets-grid text-grid" style={{ marginBottom: '20px' }}>
                                        {TEXT_COLORS.map(preset => {
                                            // Verifica contra el fondo Y el acento
                                            const isSafe = checkColorSafety(preset.hex);
                                            return (
                                                <button key={'tit-' + preset.hex} type="button"
                                                    className={`color-preset-btn text-color-btn ${config.colorTitulo === preset.hex ? 'active' : ''} ${!isSafe ? 'disabled-contrast' : ''}`}
                                                    style={{ backgroundColor: preset.hex }}
                                                    onClick={() => isSafe && onUpdate({ ...config, colorTitulo: preset.hex })}
                                                    title={isSafe ? preset.name : 'Bloqueado: Contraste Insuficiente'}
                                                />
                                            );
                                        })}
                                    </div>

                                    <label className="settings-label" style={{ marginBottom: '10px' }}>Color de Subtítulos y Textos Secundarios:</label>
                                    <div className="color-presets-grid text-grid" style={{ marginBottom: '25px' }}>
                                        {TEXT_COLORS.map(preset => {
                                            // Verifica contra el fondo Y el acento
                                            const isSafe = checkColorSafety(preset.hex);
                                            return (
                                                <button key={'sub-' + preset.hex} type="button"
                                                    className={`color-preset-btn text-color-btn ${config.colorSubtitulo === preset.hex ? 'active' : ''} ${!isSafe ? 'disabled-contrast' : ''}`}
                                                    style={{ backgroundColor: preset.hex }}
                                                    onClick={() => isSafe && onUpdate({ ...config, colorSubtitulo: preset.hex })}
                                                    title={isSafe ? preset.name : 'Bloqueado: Contraste Insuficiente'}
                                                />
                                            );
                                        })}
                                    </div>

                                    <div className="settings-form-group">
                                        <label className="settings-label">Tipografía (Marketing):
                                            <select name="fontFamily" value={config.fontFamily || FONTS[0].value} onChange={handleChange} className="settings-input">
                                                {FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                                            </select>
                                        </label>
                                        <label className="settings-label">Estilo de Formas:
                                            <select name="borderRadius" value={config.borderRadius || '16px'} onChange={handleChange} className="settings-input">
                                                {BORDER_STYLES.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
                                            </select>
                                        </label>
                                    </div>
                                </PremiumGate>
                            </div>
                        )}
                    </div>

                    {/* ACORDEÓN 3: MULTIMEDIA (Premium) */}
                    <div className={`accordion-item ${seccionAbierta === 'multimedia' ? 'active' : ''}`}>
                        <div className="accordion-header" onClick={() => toggleSeccion('multimedia')}>
                            <span>🖼️ Multimedia (Pro)</span>
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
                                    </div>
                                </PremiumGate>
                            </div>
                        )}
                    </div>
                </div>
            </div>


            {/* --- COLUMNA DERECHA: LIENZO DE VISTA PREVIA CENTRADO --- */}
            <div className="settings-preview-canvas">

                <div className="device-toggles-floating glass-effect">
                    <button type="button" className={`device-btn ${previewMode === 'mobile' ? 'active' : ''}`} onClick={() => handlePreviewChange('mobile')}>📱 Celular</button>
                    <button type="button" className={`device-btn ${previewMode === 'desktop' ? 'active' : ''}`} onClick={() => handlePreviewChange('desktop')}>💻 Monitor</button>
                </div>

                {/* CONTENEDOR ANIMADO: Aplica la transición GPU */}
                <div className={`preview-stage ${isAnimatingPreview ? 'animating-stage' : ''}`}>

                    {/* MOCKUPS CON NUEVOS TAMAÑOS Y CENTRADO */}
                    <div className={previewMode === 'mobile' ? 'phone-mockup-final' : 'desktop-mockup-final'}>

                        {previewMode === 'mobile' ? (
                            <div className="phone-header-bar">
                                <div className="phone-notch"></div>
                                <div className="phone-status-bar"><span>9:41</span><span>📶</span></div>
                            </div>
                        ) : (
                            <div className="desktop-header-bar">
                                <div className="mac-dot mac-red"></div>
                                <div className="mac-dot mac-yellow"></div>
                                <div className="mac-dot mac-green"></div>
                                <div className="desktop-url-bar">wepairr.com/{config.nombreNegocio?.toLowerCase().replace(/\s+/g, '-') || 'tu-negocio'}</div>
                            </div>
                        )}

                        <div className="shop-screen" style={shopStyles}>

                            <div className="shop-nav">
                                <span className="shop-logo" style={{ color: 'var(--shop-text)' }}>{config.nombreNegocio || 'Tu Negocio'}</span>
                                <div className="shop-nav-links">
                                    <span>Inicio</span> <span>Servicios</span>
                                </div>
                                <div className="shop-menu-icon">☰</div>
                            </div>

                            <div className="shop-hero" style={config.bannerUrl && isPremium ? { backgroundImage: `url(${config.bannerUrl})` } : {}}>
                                <div className="shop-hero-overlay"></div>
                                <div className="shop-hero-content animate-pop-in">
                                    <div className="shop-avatar-placeholder">Logo</div>
                                    <h1 className="shop-title">{config.titulo || 'Tu Título Principal'}</h1>
                                    <p className="shop-desc">{config.descripcion || 'Tu descripción corta aparecerá aquí...'}</p>
                                    <button className="shop-cta-btn">Solicitar Reparación</button>
                                </div>
                            </div>

                            {config.videoUrl && isPremium && getEmbedUrl(config.videoUrl) && (
                                <div className="shop-section" style={{ background: 'var(--shop-bg-secondary)' }}>
                                    <h2 className="shop-section-title">Sobre Nosotros</h2>
                                    <div className="shop-video-wrapper">
                                        <iframe src={getEmbedUrl(config.videoUrl)} title="Video promocional" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="shop-iframe"></iframe>
                                    </div>
                                </div>
                            )}

                            {config.mostrarPresupuestador !== false && (
                                <div className="shop-section">
                                    <h2 className="shop-section-title">Nuestros Servicios</h2>
                                    <div className="shop-services-grid">
                                        <div className="shop-service-card"><span className="service-icon" style={{ color: 'var(--shop-accent)' }}>📱</span><span style={{ color: 'var(--shop-text-secondary)' }}>Pantallas</span><strong style={{ color: 'var(--shop-text)' }}>Consultar</strong></div>
                                        <div className="shop-service-card"><span className="service-icon" style={{ color: 'var(--shop-accent)' }}>🔋</span><span style={{ color: 'var(--shop-text-secondary)' }}>Baterías</span><strong style={{ color: 'var(--shop-text)' }}>Consultar</strong></div>
                                    </div>
                                </div>
                            )}

                            <div className="shop-footer">
                                {(config.whatsapp || config.instagram) && (
                                    <div className="shop-social-links">
                                        {config.whatsapp && <span className="social-badge">WhatsApp</span>}
                                        {config.instagram && <span className="social-badge">Insta</span>}
                                    </div>
                                )}
                                <p>© 2024 {config.nombreNegocio}.</p>
                            </div>

                            {config.whatsapp && (
                                <div className="floating-wa-btn">💬</div>
                            )}

                        </div>
                        {previewMode === 'mobile' && <div className="phone-home-bar"></div>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;