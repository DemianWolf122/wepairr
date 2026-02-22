import React, { useState, useMemo, useEffect, useRef } from 'react';
import './Settings.css';

// --- SVGs MINIMALISTAS ---
const SvgChevronDown = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>;
const SvgLock = () => <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
const SvgBuilding = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path></svg>;
const SvgPalette = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path></svg>;
const SvgMedia = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>;
const SvgZap = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;
const SvgShare = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="18" cy="5" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line></svg>;
const SvgInstagram = () => <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path></svg>;
const SvgWhatsApp = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>;
const SvgPhone = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>;
const SvgBattery = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><rect x="2" y="7" width="16" height="10" rx="2" ry="2"></rect><line x1="22" y1="11" x2="22" y2="13"></line></svg>;
const SvgCheckShield = () => <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>;
const SvgCalendar = () => <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const SvgMobileDevice = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>;
const SvgMonitorDevice = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>;
const SvgMenu = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
const SvgUpload = () => <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>;
const SvgMapPin = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>;

const PremiumGate = ({ children, isPremium }) => {
    if (isPremium) return children;
    return (
        <div className="premium-gate-wrapper">
            <div className="premium-content-blurred">{children}</div>
            <div className="premium-lock-overlay">
                <SvgLock />
                <span className="premium-label">Función Pro</span>
            </div>
        </div>
    );
};

const ACCENT_COLORS = [
    { name: 'Azul Wepairr', hex: '#2563eb' }, { name: 'Esmeralda', hex: '#10b981' },
    { name: 'Púrpura', hex: '#8b5cf6' }, { name: 'Carmesí', hex: '#e11d48' },
    { name: 'Naranja', hex: '#f97316' }, { name: 'Carbón', hex: '#334155' },
    { name: 'Rosa Neón', hex: '#ec4899' }, { name: 'Cian', hex: '#06b6d4' },
    { name: 'Amarillo', hex: '#eab308' }, { name: 'Índigo', hex: '#4f46e5' },
];

const TEXT_COLORS = [
    { name: 'Negro', hex: '#000000' }, { name: 'Carbón', hex: '#0f172a' },
    { name: 'Gris', hex: '#334155' }, { name: 'Azul Oscuro', hex: '#1e3a8a' },
    { name: 'Blanco', hex: '#ffffff' }, { name: 'Gris Claro', hex: '#f8fafc' },
    { name: 'Plata', hex: '#cbd5e1' }, { name: 'Hielo', hex: '#e0f2fe' }
];

const FONTS = [
    { label: 'Inter (Corporativa)', value: '"Inter", system-ui, sans-serif' },
    { label: 'Helvetica (Premium)', value: '"Helvetica Neue", Helvetica, sans-serif' },
    { label: 'Montserrat (Tech)', value: '"Montserrat", sans-serif' }
];

const BORDER_STYLES = [
    { label: 'Suaves (16px)', value: '16px' },
    { label: 'Píldora (30px)', value: '30px' },
    { label: 'Cuadrados (4px)', value: '4px' }
];

const getLuminance = (hex) => {
    if (!hex || typeof hex !== 'string') return 0;
    let cleanHex = hex.replace('#', '');
    if (cleanHex.length === 3) cleanHex = cleanHex.split('').map(x => x + x).join('');
    let rgb = parseInt(cleanHex, 16);
    if (isNaN(rgb)) return 0;
    let r = (rgb >> 16) & 0xff; let g = (rgb >> 8) & 0xff; let b = (rgb >> 0) & 0xff;
    let a = [r, g, b].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

const getContrastRatio = (hex1, hex2) => {
    const l1 = getLuminance(hex1);
    const l2 = getLuminance(hex2);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};

const AutoResizeTextarea = ({ name, value, onChange, placeholder, maxLength, className }) => {
    const textareaRef = useRef(null);
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [value]);
    return (
        <div className="textarea-container">
            <textarea ref={textareaRef} name={name} value={value || ''} onChange={onChange} placeholder={placeholder} className={`${className} no-resize-handle`} maxLength={maxLength} rows={2} />
            <span className="char-count">{value?.length || 0}/{maxLength}</span>
        </div>
    );
};

function Settings({ config, onUpdate }) {
    const [currentPlan, setCurrentPlan] = useState(config.plan || 'standard');
    const isPremium = currentPlan === 'premium';
    const [previewMode, setPreviewMode] = useState('mobile');
    const [isAnimatingPreview, setIsAnimatingPreview] = useState(false);
    const [seccionAbierta, setSeccionAbierta] = useState('identidad');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        onUpdate({ ...config, [name]: type === 'checkbox' ? checked : value });
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => { onUpdate({ ...config, bannerUrl: reader.result }); };
            reader.readAsDataURL(file);
        }
    };
    const triggerFileInput = () => fileInputRef.current.click();
    const toggleSeccion = (seccion) => setSeccionAbierta(prev => prev === seccion ? null : seccion);

    const handleConnectIg = () => {
        alert("Simulación: Instagram Conectado");
        onUpdate({ ...config, instagramConnected: true });
    };

    const handlePreviewChange = (mode) => {
        if (mode === previewMode || isAnimatingPreview) return;
        setIsAnimatingPreview(true);
        setTimeout(() => {
            setPreviewMode(mode);
            setTimeout(() => setIsAnimatingPreview(false), 50);
        }, 350);
    };

    const currentBgColor = config.shopDarkMode ? '#090e17' : '#ffffff';
    const checkColorSafety = (textColor, bgColor = currentBgColor) => getContrastRatio(textColor, bgColor) >= 4.5;

    useEffect(() => {
        let updates = {};
        const isDark = config.shopDarkMode;
        const defaultText = isDark ? '#ffffff' : '#0f172a';
        const defaultSub = isDark ? '#f8fafc' : '#334155';

        if (config.colorTitulo && !checkColorSafety(config.colorTitulo, currentBgColor)) {
            updates.colorTitulo = defaultText;
        }
        if (config.colorSubtitulo && !checkColorSafety(config.colorSubtitulo, currentBgColor)) {
            updates.colorSubtitulo = defaultSub;
        }
        if (Object.keys(updates).length > 0) onUpdate({ ...config, ...updates });
    }, [config.shopDarkMode, config.colorTema]);

    const shopStyles = useMemo(() => {
        const accent = config.colorTema || '#2563eb';
        const isDarkMode = config.shopDarkMode;
        const hasBanner = !!config.bannerUrl && isPremium;

        const accentLuminance = getLuminance(accent);
        const autoBtnText = accentLuminance > 0.179 ? '#000000' : '#ffffff';

        let safeIconColor = accent;
        const bgLuminance = getLuminance(isDarkMode ? '#090e17' : '#ffffff');
        if (getContrastRatio(safeIconColor, isDarkMode ? '#090e17' : '#ffffff') < 3.0) {
            let amt = isDarkMode ? 60 : -60;
            let c = accent.replace('#', '');
            if (c.length === 3) c = c.split('').map(x => x + x).join('');
            let num = parseInt(c, 16);
            if (!isNaN(num)) {
                let r = Math.min(255, Math.max(0, (num >> 16) + amt)); let b = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amt)); let g = Math.min(255, Math.max(0, (num & 0x0000FF) + amt));
                safeIconColor = "#" + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
            }
        }

        const userTitleColor = config.colorTitulo || (isDarkMode ? '#ffffff' : '#0f172a');
        const userSubtitleColor = config.colorSubtitulo || (isDarkMode ? '#94a3b8' : '#64748b');

        const heroOverlayStyle = hasBanner
            ? 'linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.9))'
            : 'linear-gradient(to bottom, transparent, transparent)';

        const heroTextColor = hasBanner ? '#ffffff' : userTitleColor;
        const heroSubtextColor = hasBanner ? 'rgba(255,255,255,0.85)' : userSubtitleColor;

        return {
            '--shop-accent': accent,
            '--shop-accent-icon': safeIconColor,
            '--shop-btn-text': autoBtnText,
            '--shop-bg': isDarkMode ? '#090e17' : '#ffffff',
            '--shop-bg-secondary': isDarkMode ? '#141c2f' : '#f8fafc',
            '--shop-text': userTitleColor,
            '--shop-text-secondary': userSubtitleColor,
            '--shop-border': isDarkMode ? '#1e293b' : '#e2e8f0',
            '--shop-font': config.fontFamily || '"Inter", system-ui, sans-serif',
            '--shop-radius': config.borderRadius || '16px',
            '--hero-overlay': heroOverlayStyle,
            '--hero-text-color': heroTextColor,
            '--hero-subtext-color': heroSubtextColor
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
            <div className="dev-plan-selector glass-effect">
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>DEV: PLAN</span>
                <select value={currentPlan} onChange={(e) => { setCurrentPlan(e.target.value); handleChange(e); }} name="plan" className="plan-select">
                    <option value="standard">Gratis</option>
                    <option value="premium">PRO</option>
                </select>
            </div>

            <div className="settings-controls-panel glass-effect">
                <div className="settings-header-row">
                    <div>
                        <h2 className="settings-main-title">Editor Visual</h2>
                        <p className="settings-subtitle">Define el aspecto de tu vidriera.</p>
                    </div>
                </div>

                <div className="accordions-container">
                    {/* IDENTIDAD */}
                    <div className={`accordion-item ${seccionAbierta === 'identidad' ? 'active' : ''}`}>
                        <div className="accordion-header" onClick={() => toggleSeccion('identidad')}>
                            <span className="accordion-title"><SvgBuilding /> Identidad del Negocio</span>
                            <span className="accordion-chevron"><SvgChevronDown /></span>
                        </div>
                        {seccionAbierta === 'identidad' && (
                            <div className="accordion-content">
                                <div className="settings-form-group">
                                    <label className="settings-label">Nombre Visible (Máx 25):
                                        <input type="text" name="nombreNegocio" value={config.nombreNegocio || ''} onChange={handleChange} className="settings-input" maxLength={25} />
                                    </label>
                                    <label className="settings-label">Título Principal (Máx 45):
                                        <input type="text" name="titulo" value={config.titulo || ''} onChange={handleChange} className="settings-input" maxLength={45} />
                                    </label>
                                    <label className="settings-label">Descripción Corta (Máx 120):
                                        <AutoResizeTextarea name="descripcion" value={config.descripcion} onChange={handleChange} className="settings-input settings-textarea" maxLength={120} />
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* APARIENCIA */}
                    <div className={`accordion-item ${seccionAbierta === 'apariencia' ? 'active' : ''}`}>
                        <div className="accordion-header" onClick={() => toggleSeccion('apariencia')}>
                            <span className="accordion-title"><SvgPalette /> Apariencia y Colores</span>
                            <span className="accordion-chevron"><SvgChevronDown /></span>
                        </div>
                        {seccionAbierta === 'apariencia' && (
                            <div className="accordion-content">
                                <div className="toggle-box glass-input-effect" style={{ marginBottom: '20px' }}>
                                    <div><strong className="toggle-title">Modo Oscuro</strong></div>
                                    <label className="switch"><input type="checkbox" name="shopDarkMode" checked={config.shopDarkMode || false} onChange={handleChange} /><span className="slider round"></span></label>
                                </div>

                                <label className="settings-label">Color de Marca (Botones):</label>
                                <div className="color-presets-grid accent-grid" style={{ marginBottom: '20px' }}>
                                    {ACCENT_COLORS.map(preset => (
                                        <button key={preset.hex} type="button" className={`color-preset-btn accent-btn ${config.colorTema === preset.hex ? 'active' : ''}`} style={{ backgroundColor: preset.hex }} onClick={() => onUpdate({ ...config, colorTema: preset.hex })} title={preset.name} />
                                    ))}
                                </div>

                                <PremiumGate isPremium={isPremium}>
                                    <label className="settings-label">Color de Textos Principales:</label>
                                    <div className="color-presets-grid text-grid" style={{ marginBottom: '15px' }}>
                                        {TEXT_COLORS.map(preset => {
                                            const isSafe = checkColorSafety(preset.hex, currentBgColor);
                                            return (<button key={'tit-' + preset.hex} type="button" className={`color-preset-btn text-color-btn ${config.colorTitulo === preset.hex ? 'active' : ''} ${!isSafe ? 'disabled-contrast' : ''}`} style={{ backgroundColor: preset.hex }} onClick={() => isSafe && onUpdate({ ...config, colorTitulo: preset.hex })} />);
                                        })}
                                    </div>
                                    <div className="settings-form-group" style={{ marginTop: '20px' }}>
                                        <label className="settings-label">Tipografía Corporativa:
                                            <select name="fontFamily" value={config.fontFamily || FONTS[0].value} onChange={handleChange} className="settings-input">
                                                {FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                                            </select>
                                        </label>
                                    </div>
                                </PremiumGate>
                            </div>
                        )}
                    </div>

                    {/* MULTIMEDIA */}
                    <div className={`accordion-item ${seccionAbierta === 'multimedia' ? 'active' : ''}`}>
                        <div className="accordion-header" onClick={() => toggleSeccion('multimedia')}>
                            <span className="accordion-title"><SvgMedia /> Multimedia (Pro)</span>
                            <span className="accordion-chevron"><SvgChevronDown /></span>
                        </div>
                        {seccionAbierta === 'multimedia' && (
                            <div className="accordion-content">
                                <PremiumGate isPremium={isPremium}>
                                    <div className="settings-form-group">
                                        <label className="settings-label">Carga tu imagen de portada:</label>
                                        <div className="file-upload-container">
                                            <input type="text" name="bannerUrl" value={config.bannerUrl || ''} onChange={handleChange} className="settings-input file-url-input" placeholder="URL web o..." />
                                            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" style={{ display: 'none' }} />
                                            <button type="button" className="btn-upload-file" onClick={triggerFileInput}><SvgUpload /> Subir</button>
                                        </div>
                                    </div>
                                </PremiumGate>
                            </div>
                        )}
                    </div>

                    {/* REDES */}
                    <div className={`accordion-item ${seccionAbierta === 'redes' ? 'active' : ''}`}>
                        <div className="accordion-header" onClick={() => toggleSeccion('redes')}>
                            <span className="accordion-title"><SvgShare /> Redes Sociales</span>
                            <span className="accordion-chevron"><SvgChevronDown /></span>
                        </div>
                        {seccionAbierta === 'redes' && (
                            <div className="accordion-content">
                                <div className="settings-form-group">
                                    <label className="settings-label">WhatsApp de Contacto:
                                        <input type="text" name="whatsapp" value={config.whatsapp || ''} onChange={handleChange} className="settings-input" placeholder="Ej. 1123456789" maxLength={15} />
                                    </label>
                                    <hr className="settings-divider-soft" />
                                    <label className="settings-label">Instagram Feed:</label>
                                    {!config.instagramConnected ? (
                                        <button type="button" onClick={handleConnectIg} className="btn-connect-ig" disabled={igConnecting}>
                                            <SvgInstagram /> {igConnecting ? 'Conectando...' : 'Vincular Cuenta'}
                                        </button>
                                    ) : (
                                        <div className="ig-connected-box">
                                            <div className="ig-status"><SvgInstagram /> Conectado</div>
                                            <button type="button" onClick={() => onUpdate({ ...config, instagramConnected: false })} className="btn-disconnect">Desvincular</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* FUNCIONALIDADES */}
                    <div className={`accordion-item ${seccionAbierta === 'funcionalidades' ? 'active' : ''}`}>
                        <div className="accordion-header" onClick={() => toggleSeccion('funcionalidades')}>
                            <span className="accordion-title"><SvgZap /> Visibilidad de Módulos</span>
                            <span className="accordion-chevron"><SvgChevronDown /></span>
                        </div>
                        {seccionAbierta === 'funcionalidades' && (
                            <div className="accordion-content">
                                <p className="settings-subtitle" style={{ marginBottom: '15px' }}>Edita el contenido en la pestaña "Gestión".</p>
                                <div className="settings-form-group">
                                    <div className="toggle-box glass-input-effect">
                                        <div><strong className="toggle-title">Presupuestador Online</strong></div>
                                        <label className="switch"><input type="checkbox" name="mostrarPresupuestador" checked={config.mostrarPresupuestador !== false} onChange={handleChange} /><span className="slider round"></span></label>
                                    </div>
                                    <div className="toggle-box glass-input-effect">
                                        <div><strong className="toggle-title">Estado de Reparación</strong></div>
                                        <label className="switch"><input type="checkbox" name="mostrarTracking" checked={config.mostrarTracking || false} onChange={handleChange} /><span className="slider round"></span></label>
                                    </div>

                                    <PremiumGate isPremium={isPremium}>
                                        <div className="toggle-box glass-input-effect">
                                            <div><strong className="toggle-title">Sello de Confianza</strong></div>
                                            <label className="switch"><input type="checkbox" name="mostrarGarantia" checked={config.mostrarGarantia || false} onChange={handleChange} /><span className="slider round"></span></label>
                                        </div>
                                        {config.mostrarGarantia && (
                                            <div style={{ padding: '0 10px' }}>
                                                <label className="settings-label" style={{ fontSize: '0.8rem' }}>Texto de Garantía:</label>
                                                <input type="text" name="tiempoGarantia" value={config.tiempoGarantia || ''} onChange={handleChange} className="settings-input" placeholder="Ej. 90 Días Escritos" maxLength={30} style={{ padding: '10px', fontSize: '0.9rem' }} />
                                            </div>
                                        )}

                                        <div className="toggle-box glass-input-effect" style={{ marginTop: '10px' }}>
                                            <div><strong className="toggle-title">Ubicación (Google Maps)</strong></div>
                                            <label className="switch"><input type="checkbox" name="mostrarMapa" checked={config.mostrarMapa || false} onChange={handleChange} /><span className="slider round"></span></label>
                                        </div>
                                        {config.mostrarMapa && (
                                            <div style={{ padding: '0 10px' }}>
                                                <input type="text" name="mapaUrl" value={config.mapaUrl || ''} onChange={handleChange} className="settings-input" placeholder="Pega el enlace de tu ubicación en Google Maps" style={{ padding: '10px', fontSize: '0.9rem' }} />
                                            </div>
                                        )}
                                    </PremiumGate>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* === COLUMNA DERECHA: LIENZO DE VISTA PREVIA === */}
            <div className="settings-preview-canvas">
                <div className="canvas-header">
                    <div className="device-toggles glass-effect">
                        <button type="button" className={`device-btn ${previewMode === 'mobile' ? 'active' : ''}`} onClick={() => handlePreviewChange('mobile')}><SvgMobileDevice /> Celular</button>
                        <button type="button" className={`device-btn ${previewMode === 'desktop' ? 'active' : ''}`} onClick={() => handlePreviewChange('desktop')}><SvgMonitorDevice /> Monitor</button>
                    </div>
                </div>

                <div className={`preview-stage ${isAnimatingPreview ? 'animating-stage' : ''}`}>
                    <div className={previewMode === 'mobile' ? 'phone-mockup-final' : 'desktop-mockup-final'}>
                        {previewMode === 'mobile' && (
                            <div className="phone-header-bar">
                                <div className="phone-notch"></div>
                                <div className="phone-status-bar" style={{ marginLeft: 'auto' }}><span>9:41</span></div>
                            </div>
                        )}

                        {/* CONTENEDOR DE PANTALLA: Atrapa el botón de WhatsApp */}
                        <div className="shop-screen-container">
                            <div className="shop-screen" style={shopStyles}>
                                <div className="shop-nav">
                                    <span className="shop-logo" style={{ color: 'var(--shop-text)' }}>{config.nombreNegocio || 'Tu Negocio'}</span>
                                    {previewMode === 'mobile' ? (
                                        <div className="shop-menu-icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}><SvgMenu /></div>
                                    ) : (
                                        <div className="shop-nav-links"><span>Inicio</span> <span>Servicios</span></div>
                                    )}
                                    {previewMode === 'mobile' && mobileMenuOpen && (
                                        <div className="mobile-nav-dropdown glass-effect">
                                            <span>Inicio</span><span>Servicios</span>
                                        </div>
                                    )}
                                </div>

                                <div className="shop-hero" style={config.bannerUrl && isPremium ? { backgroundImage: `url(${config.bannerUrl})` } : {}}>
                                    <div className="shop-hero-overlay" style={{ background: 'var(--hero-overlay)' }}></div>
                                    <div className="shop-hero-content">
                                        <div className="shop-avatar-placeholder"><SvgBuilding /></div>
                                        <h1 className="shop-title" style={{ color: 'var(--hero-text-color)' }}>{config.titulo || 'Tu Título Principal'}</h1>
                                        <p className="shop-desc" style={{ color: 'var(--hero-subtext-color)' }}>{config.descripcion || 'Tu descripción corta aparecerá aquí...'}</p>

                                        <div className="shop-hero-actions">
                                            <button className="shop-cta-btn">Solicitar Reparación</button>
                                        </div>

                                        {config.mostrarGarantia && isPremium && config.tiempoGarantia && (
                                            <div className="shop-trust-badge-hero">
                                                <SvgCheckShield />
                                                <span>Garantía: {config.tiempoGarantia}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {config.mostrarTracking && (
                                    <div className="shop-section shop-section-tracking">
                                        <div className="tracking-inner glass-effect">
                                            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', color: 'var(--shop-text)' }}>Seguimiento de Equipo</h3>
                                            {/* INPUT FIX: No se sale del contenedor */}
                                            <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                                                <input type="text" placeholder="#12345" style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--shop-border)', minWidth: 0 }} disabled />
                                                <button className="shop-cta-btn" style={{ padding: '10px 20px', fontSize: '0.9rem', flexShrink: 0 }}>Buscar</button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {config.mostrarPresupuestador !== false && (
                                    <div className="shop-section">
                                        <h2 className="shop-section-title">Cotizar Reparación</h2>
                                        <div className="shop-services-grid">
                                            <div className="shop-service-card"><div className="service-icon" style={{ color: 'var(--shop-accent-icon)' }}><SvgPhone /></div><span style={{ color: 'var(--shop-text-secondary)' }}>Pantallas</span></div>
                                            <div className="shop-service-card"><div className="service-icon" style={{ color: 'var(--shop-accent-icon)' }}><SvgBattery /></div><span style={{ color: 'var(--shop-text-secondary)' }}>Baterías</span></div>
                                        </div>
                                    </div>
                                )}

                                {config.mostrarMapa && isPremium && config.mapaUrl && (
                                    <div className="shop-section" style={{ background: 'var(--shop-bg-secondary)' }}>
                                        <h2 className="shop-section-title">Nuestra Ubicación</h2>
                                        <div className="shop-map-preview">
                                            <SvgMapPin style={{ color: 'var(--shop-accent)' }} />
                                            <p style={{ margin: '10px 0', fontSize: '0.9rem', color: 'var(--shop-text-secondary)' }}>Vista previa del mapa</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* FIX WHATSAPP: Posición Absoluta dentro del contenedor relativo de la pantalla */}
                            {config.whatsapp && (
                                <div className="floating-wa-btn-preview"><SvgWhatsApp /></div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;