import React, { useState, useMemo, useEffect, useRef } from 'react';
import './Settings.css';

const SvgChevronDown = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="chevron-icon"><polyline points="6 9 12 15 18 9"></polyline></svg>;
const SvgLock = () => <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
const SvgBuilding = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path></svg>;
const SvgPalette = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path></svg>;
const SvgMedia = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>;
const SvgZap = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;
const SvgGlobe = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>;
const SvgWhatsApp = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>;
const SvgPhone = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>;
const SvgBattery = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><rect x="2" y="7" width="16" height="10" rx="2" ry="2"></rect><line x1="22" y1="11" x2="22" y2="13"></line></svg>;
const SvgCheckShield = () => <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>;
const SvgClock = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const SvgMobileDevice = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>;
const SvgMonitorDevice = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>;
const SvgMenu = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
const SvgUpload = () => <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>;
const SvgInstagram = () => <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path></svg>;
const SvgLayout = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>;
const SvgEye = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const SvgExternal = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></svg>;
const SvgDollar = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
const SvgLink = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>;
const SvgHelp = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
const SvgTrashSmall = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const SvgPlusSmall = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const SvgX = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

const CURRENCY_OPTIONS = [
    { code: 'ARS', label: 'Peso Argentino', symbol: '$' },
    { code: 'USD', label: 'Dólar Estadounidense', symbol: 'US$' },
    { code: 'EUR', label: 'Euro', symbol: '€' },
    { code: 'BRL', label: 'Real Brasileño', symbol: 'R$' },
    { code: 'CLP', label: 'Peso Chileno', symbol: '$' },
    { code: 'MXN', label: 'Peso Mexicano', symbol: '$' },
    { code: 'COP', label: 'Peso Colombiano', symbol: '$' },
    { code: 'PEN', label: 'Sol Peruano', symbol: 'S/' },
    { code: 'UYU', label: 'Peso Uruguayo', symbol: '$U' }
];

const PremiumGate = ({ children, isPremium }) => {
    if (isPremium) return children;
    return (
        <div className="premium-gate-wrapper">
            <div className="premium-content-blurred">{children}</div>
            <div className="premium-lock-overlay">
                <SvgLock /><span className="premium-label">Función Pro</span>
            </div>
        </div>
    );
};

const ACCENT_COLORS = ['#2563eb', '#10b981', '#8b5cf6', '#e11d48', '#f97316', '#334155', '#06b6d4', '#eab308'];
const FONTS = [{ label: 'Inter (Corp)', value: '"Inter", system-ui, sans-serif' }, { label: 'Helvetica', value: '"Helvetica Neue", Helvetica, sans-serif' }, { label: 'Montserrat', value: '"Montserrat", sans-serif' }];

const TEMPLATES = [
    {
        id: 'dark-tech', name: 'Dark Tech Pro', color: '#141c2f', border: '#2563eb',
        config: { shopDarkMode: true, colorTema: '#2563eb', colorTitulo: '#ffffff', colorSubtitulo: '#cbd5e1', borderRadius: '16px', fontFamily: '"Inter", system-ui, sans-serif' }
    },
    {
        id: 'light-apple', name: 'Minimalist Clean', color: '#f8fafc', border: '#334155',
        config: { shopDarkMode: false, colorTema: '#000000', colorTitulo: '#0f172a', colorSubtitulo: '#64748b', borderRadius: '24px', fontFamily: '"Helvetica Neue", Helvetica, sans-serif' }
    },
    {
        id: 'neon-cyber', name: 'Neon Cyberpunk', color: '#090e17', border: '#10b981',
        config: { shopDarkMode: true, colorTema: '#10b981', colorTitulo: '#10b981', colorSubtitulo: '#a7f3d0', borderRadius: '8px', fontFamily: '"Inter", system-ui, sans-serif' }
    },
    {
        id: 'crimson', name: 'Crimson Blood', color: '#1a0505', border: '#e11d48',
        config: { shopDarkMode: true, colorTema: '#e11d48', colorTitulo: '#ffffff', colorSubtitulo: '#fecdd3', borderRadius: '16px', fontFamily: '"Montserrat", sans-serif' }
    },
    {
        id: 'ocean-breeze', name: 'Ocean Breeze', color: '#f0f9ff', border: '#0ea5e9',
        config: { shopDarkMode: false, colorTema: '#0ea5e9', colorTitulo: '#0c4a6e', colorSubtitulo: '#0284c7', borderRadius: '20px', fontFamily: '"Inter", system-ui, sans-serif' }
    },
    {
        id: 'midnight-gold', name: 'Midnight Gold', color: '#1e1b4b', border: '#f59e0b',
        config: { shopDarkMode: true, colorTema: '#f59e0b', colorTitulo: '#fef3c7', colorSubtitulo: '#fde68a', borderRadius: '12px', fontFamily: '"Montserrat", sans-serif' }
    },
    {
        id: 'forest-eco', name: 'Forest Eco', color: '#f0fdf4', border: '#16a34a',
        config: { shopDarkMode: false, colorTema: '#16a34a', colorTitulo: '#14532d', colorSubtitulo: '#15803d', borderRadius: '16px', fontFamily: '"Helvetica Neue", Helvetica, sans-serif' }
    },
    {
        id: 'pastel-dream', name: 'Pastel Dream', color: '#faf5ff', border: '#c084fc',
        config: { shopDarkMode: false, colorTema: '#c084fc', colorTitulo: '#4c1d95', colorSubtitulo: '#7e22ce', borderRadius: '32px', fontFamily: '"Montserrat", sans-serif' }
    }
];

const getLuminance = (hex) => {
    if (!hex) return 0;
    let c = hex.replace('#', ''); if (c.length === 3) c = c.split('').map(x => x + x).join(''); let rgb = parseInt(c, 16); if (isNaN(rgb)) return 0;
    let r = (rgb >> 16) & 0xff, g = (rgb >> 8) & 0xff, b = (rgb >> 0) & 0xff;
    let a = [r, g, b].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

const getContrastRatio = (hex1, hex2) => { const l1 = getLuminance(hex1), l2 = getLuminance(hex2); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };

const AutoResizeTextarea = ({ name, value, onChange, placeholder, maxLength, className }) => {
    const textareaRef = useRef(null);
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const scrollHeight = textareaRef.current.scrollHeight;
            if (scrollHeight > 0) {
                textareaRef.current.style.height = `${scrollHeight}px`;
            }
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
    const [seccionAbierta, setSeccionAbierta] = useState('plantillas');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [igConnecting, setIgConnecting] = useState(false);
    const [showTemplatesModal, setShowTemplatesModal] = useState(false);
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        onUpdate({ ...config, [name]: type === 'checkbox' ? checked : value });
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => onUpdate({ ...config, bannerUrl: reader.result });
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => fileInputRef.current?.click();
    const toggleSeccion = (seccion) => setSeccionAbierta(prev => prev === seccion ? null : seccion);

    const handleConnectIg = () => {
        setIgConnecting(true);
        setTimeout(() => {
            onUpdate({ ...config, instagramConnected: true });
            setIgConnecting(false);
        }, 1500);
    };

    const handlePreviewChange = (mode) => {
        if (mode === previewMode || isAnimatingPreview) return;
        setIsAnimatingPreview(true);
        setMobileMenuOpen(false);
        setTimeout(() => { setPreviewMode(mode); setTimeout(() => setIsAnimatingPreview(false), 50); }, 350);
    };

    const aplicarPlantilla = (templateConfig) => {
        onUpdate({ ...config, ...templateConfig });
        setShowTemplatesModal(false);
    };

    // --- FAQ handlers ---
    const handleAddFaq = () => {
        const faqs = config.faqs || [];
        onUpdate({ ...config, faqs: [...faqs, { pregunta: '', respuesta: '' }] });
    };
    const handleRemoveFaq = (idx) => {
        const faqs = [...(config.faqs || [])];
        faqs.splice(idx, 1);
        onUpdate({ ...config, faqs });
    };
    const handleChangeFaq = (idx, field, value) => {
        const faqs = [...(config.faqs || [])];
        faqs[idx] = { ...faqs[idx], [field]: value };
        onUpdate({ ...config, faqs });
    };

    const currentBgColor = config.shopDarkMode ? '#090e17' : '#ffffff';
    const checkColorSafety = (textColor, bgColor = currentBgColor) => getContrastRatio(textColor || '#ffffff', bgColor) >= 4.5;

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
        const isDarkMode = config.shopDarkMode || false;
        const hasBanner = !!config.bannerUrl && isPremium;

        const autoBtnText = getLuminance(accent) > 0.179 ? '#000000' : '#ffffff';
        let safeIconColor = accent;
        const bgLuminance = getLuminance(isDarkMode ? '#090e17' : '#ffffff');

        if (getContrastRatio(safeIconColor, bgLuminance < 0.5 ? '#090e17' : '#ffffff') < 3.0) {
            let amt = isDarkMode ? 60 : -60; let c = accent.replace('#', ''); if (c.length === 3) c = c.split('').map(x => x + x).join('');
            let num = parseInt(c, 16);
            if (!isNaN(num)) { let r = Math.min(255, Math.max(0, (num >> 16) + amt)); let b = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amt)); let g = Math.min(255, Math.max(0, (num & 0x0000FF) + amt)); safeIconColor = "#" + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0'); }
        }

        const userTitleColor = config.colorTitulo || (isDarkMode ? '#ffffff' : '#0f172a');
        const userSubtitleColor = config.colorSubtitulo || (isDarkMode ? '#94a3b8' : '#64748b');

        const heroOverlayStyle = hasBanner
            ? 'linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.9))'
            : 'linear-gradient(to bottom, transparent, transparent)';

        const heroTextColor = hasBanner ? '#ffffff' : userTitleColor;
        const heroSubtextColor = hasBanner ? 'rgba(255,255,255,0.85)' : userSubtitleColor;

        return {
            '--shop-accent': accent, '--shop-accent-icon': safeIconColor, '--shop-btn-text': autoBtnText,
            '--shop-bg': isDarkMode ? '#090e17' : '#ffffff', '--shop-bg-secondary': isDarkMode ? '#141c2f' : '#f8fafc',
            '--shop-text': userTitleColor, '--shop-text-secondary': userSubtitleColor, '--shop-border': isDarkMode ? '#1e293b' : '#e2e8f0',
            '--shop-font': config.fontFamily || '"Inter", system-ui, sans-serif', '--shop-radius': config.borderRadius || '16px',
            '--hero-overlay': heroOverlayStyle, '--hero-text-color': heroTextColor, '--hero-subtext-color': heroSubtextColor
        };
    }, [config, isPremium]);

    return (
        <div className="settings-editor-layout">

            {showTemplatesModal && (
                <div className="settings-modal-overlay" onClick={() => setShowTemplatesModal(false)}>
                    <div className="settings-modal-container animate-scale-in" onClick={e => e.stopPropagation()}>
                        <div className="modal-header-settings">
                            <h3>Biblioteca de Plantillas</h3>
                            <button className="btn-close-modal" onClick={() => setShowTemplatesModal(false)}><SvgX /></button>
                        </div>
                        <div className="templates-grid">
                            {TEMPLATES.map(tpl => (
                                <div key={tpl.id} className="template-card" style={{ background: tpl.color, borderColor: tpl.border }}>
                                    <div className="template-preview-mock">
                                        <div className="mock-nav" style={{ borderBottom: `1px solid ${tpl.border}50` }}></div>
                                        <div className="mock-hero">
                                            <div className="mock-title" style={{ background: tpl.config.colorTitulo }}></div>
                                            <div className="mock-subtitle" style={{ background: tpl.config.colorSubtitulo }}></div>
                                            <div className="mock-btn" style={{ background: tpl.config.colorTema }}></div>
                                        </div>
                                    </div>
                                    <h4 style={{ color: tpl.config.shopDarkMode ? '#fff' : '#000' }}>{tpl.name}</h4>
                                    <button className="btn-apply-template" onClick={() => aplicarPlantilla(tpl.config)}>Elegir Plantilla</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="settings-controls-panel glass-effect">
                <div className="dev-plan-selector-inline glass-effect">
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>PLAN ACTUAL</span>
                    <select value={currentPlan} onChange={(e) => { setCurrentPlan(e.target.value); handleChange(e); }} name="plan" className="plan-select">
                        <option value="standard">Gratis</option>
                        <option value="premium">PRO</option>
                    </select>
                </div>

                <div className="settings-header-row">
                    <div>
                        <h2 className="settings-main-title">Personalización</h2>
                        <p className="settings-subtitle">Edita el aspecto de tu web pública.</p>
                    </div>
                    {/* INYECTADO: BOTÓN VER VIDRIERA EN SETTINGS */}
                    <a href={`/taller/${config.nombreNegocio?.toLowerCase().replace(/\s+/g, '-') || 'tu-local'}`} target="_blank" rel="noreferrer" className="btn-view-site-settings" title="Abrir página en otra pestaña">
                        <SvgEye /> Ver Vidriera
                    </a>
                </div>

                <div className="accordions-container">

                    <div className={`accordion-item ${seccionAbierta === 'plantillas' ? 'active' : ''}`}>
                        <div className="accordion-header" onClick={() => toggleSeccion('plantillas')}>
                            <span className="accordion-title"><SvgLayout /> Plantillas (Themes)</span>
                            <span className="accordion-chevron"><SvgChevronDown /></span>
                        </div>
                        {seccionAbierta === 'plantillas' && (
                            <div className="accordion-content">
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '15px' }}>Acelera tu diseño eligiendo una base prediseñada. (Aplica colores automáticamente).</p>
                                <div className="templates-inline-grid">
                                    {TEMPLATES.map(tpl => (
                                        <div key={tpl.id} className="template-card-inline" style={{ background: tpl.color, borderColor: tpl.border }} onClick={() => aplicarPlantilla(tpl.config)}>
                                            <div className="template-preview-mock">
                                                <div className="mock-nav" style={{ borderBottom: `1px solid ${tpl.border}50` }}></div>
                                                <div className="mock-hero">
                                                    <div className="mock-title" style={{ background: tpl.config.colorTitulo }}></div>
                                                    <div className="mock-subtitle" style={{ background: tpl.config.colorSubtitulo }}></div>
                                                    <div className="mock-btn" style={{ background: tpl.config.colorTema, borderRadius: tpl.config.borderRadius }}></div>
                                                </div>
                                            </div>
                                            <h4 style={{ color: tpl.config.shopDarkMode ? '#ffffff' : '#0f172a', textShadow: tpl.config.shopDarkMode ? '0 1px 2px rgba(0,0,0,0.5)' : 'none' }}>{tpl.name}</h4>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={() => setShowTemplatesModal(true)} className="btn-open-templates" style={{ marginTop: '15px' }}>
                                    <SvgEye /> Ver en Galería Completa
                                </button>
                            </div>
                        )}
                    </div>

                    <div className={`accordion-item ${seccionAbierta === 'identidad' ? 'active' : ''}`}>
                        <div className="accordion-header" onClick={() => toggleSeccion('identidad')}>
                            <span className="accordion-title"><SvgBuilding /> Textos</span>
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
                                        <textarea name="descripcion" value={config.descripcion || ''} onChange={handleChange} className="settings-input settings-textarea" maxLength={120} rows={3} style={{ resize: 'vertical' }} />
                                    </label>
                                    <label className="settings-label">Horarios de Atención:
                                        <input type="text" name="horariosAtencion" value={config.horariosAtencion || ''} onChange={handleChange} className="settings-input" placeholder="Ej. Lun a Vie 9 a 18hs" maxLength={50} />
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={`accordion-item ${seccionAbierta === 'apariencia' ? 'active' : ''}`}>
                        <div className="accordion-header" onClick={() => setSeccionAbierta(prev => prev === 'apariencia' ? null : 'apariencia')}>
                            <span className="accordion-title"><SvgPalette /> Diseño & Colores</span>
                            <span className="accordion-chevron"><SvgChevronDown /></span>
                        </div>
                        {seccionAbierta === 'apariencia' && (
                            <div className="accordion-content">
                                <label className="settings-label">Color de Marca (Acento):</label>
                                <div className="color-picker-modern">
                                    <input type="color" name="colorTema" value={config.colorTema || '#2563eb'} onChange={handleChange} className="native-color-input" title="Elegir color personalizado" />
                                    <div className="color-presets-row">
                                        {ACCENT_COLORS.map(hex => (
                                            <button key={hex} type="button" className={`color-dot ${config.colorTema === hex ? 'active' : ''}`} style={{ backgroundColor: hex }} onClick={() => onUpdate({ ...config, colorTema: hex })} />
                                        ))}
                                    </div>
                                </div>

                                <PremiumGate isPremium={isPremium}>
                                    <div className="settings-form-group" style={{ marginTop: '20px' }}>
                                        <div className="color-picker-modern">
                                            <input type="color" name="colorTitulo" value={config.colorTitulo || (config.shopDarkMode ? '#ffffff' : '#0f172a')} onChange={handleChange} className="native-color-input" />
                                            <label className="settings-label" style={{ marginBottom: 0 }}>Color de Título</label>
                                        </div>
                                        <div className="color-picker-modern">
                                            <input type="color" name="colorSubtitulo" value={config.colorSubtitulo || (config.shopDarkMode ? '#94a3b8' : '#64748b')} onChange={handleChange} className="native-color-input" />
                                            <label className="settings-label" style={{ marginBottom: 0 }}>Color de Subtítulos</label>
                                        </div>

                                        <label className="settings-label" style={{ marginTop: '10px' }}>
                                            Redondeo de bordes (Botones y tarjetas):
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <input type="range" min="0" max="32" value={parseInt(config.borderRadius || '16')} onChange={(e) => onUpdate({ ...config, borderRadius: `${e.target.value}px` })} style={{ flex: 1 }} />
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{config.borderRadius || '16px'}</span>
                                            </div>
                                        </label>

                                        <label className="settings-label" style={{ marginTop: '10px' }}>Tipografía Global:
                                            <select name="fontFamily" value={config.fontFamily || FONTS[0].value} onChange={handleChange} className="settings-input select-input">
                                                {FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                                            </select>
                                        </label>
                                    </div>
                                </PremiumGate>
                            </div>
                        )}
                    </div>

                    <div className={`accordion-item ${seccionAbierta === 'multimedia' ? 'active' : ''}`}>
                        <div className="accordion-header" onClick={() => setSeccionAbierta(prev => prev === 'multimedia' ? null : 'multimedia')}>
                            <span className="accordion-title"><SvgMedia /> Multimedia (Pro)</span>
                            <span className="accordion-chevron"><SvgChevronDown /></span>
                        </div>
                        {seccionAbierta === 'multimedia' && (
                            <div className="accordion-content">
                                <PremiumGate isPremium={isPremium}>
                                    <div className="settings-form-group">
                                        <label className="settings-label">Imagen de Portada:</label>
                                        <div className="file-upload-container">
                                            <input type="text" name="bannerUrl" value={config.bannerUrl || ''} onChange={handleChange} className="settings-input file-url-input" placeholder="URL web o archivo →" />
                                            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" style={{ display: 'none' }} />
                                            <button type="button" className="btn-upload-file" onClick={triggerFileInput}><SvgUpload /> Subir</button>
                                        </div>
                                    </div>
                                </PremiumGate>
                            </div>
                        )}
                    </div>

                    <div className={`accordion-item ${seccionAbierta === 'redes' ? 'active' : ''}`}>
                        <div className="accordion-header" onClick={() => setSeccionAbierta(prev => prev === 'redes' ? null : 'redes')}>
                            <span className="accordion-title"><SvgGlobe /> Contacto & Redes</span>
                            <span className="accordion-chevron"><SvgChevronDown /></span>
                        </div>
                        {seccionAbierta === 'redes' && (
                            <div className="accordion-content">
                                <div className="settings-form-group">
                                    <label className="settings-label">WhatsApp (Máx 15):
                                        <input type="text" name="whatsapp" value={config.whatsapp || ''} onChange={handleChange} className="settings-input" placeholder="Ej. 1123456789" maxLength={15} />
                                    </label>
                                    <PremiumGate isPremium={isPremium}>
                                        <hr className="settings-divider-soft" />
                                        <label className="settings-label">Instagram Feed:</label>
                                        {!config.instagramConnected ? (
                                            <button type="button" onClick={handleConnectIg} className="btn-connect-ig" disabled={igConnecting}>
                                                <SvgInstagram /> {igConnecting ? 'Conectando...' : 'Vincular Cuenta'}
                                            </button>
                                        ) : (
                                            <div className="ig-connected-box animate-fade-in">
                                                <div className="ig-status"><SvgInstagram /> Conectado como @tu_taller</div>
                                                <button type="button" onClick={() => onUpdate({ ...config, instagramConnected: false })} className="btn-disconnect">Desvincular</button>
                                            </div>
                                        )}
                                    </PremiumGate>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={`accordion-item ${seccionAbierta === 'funcionalidades' ? 'active' : ''}`}>
                        <div className="accordion-header" onClick={() => setSeccionAbierta(prev => prev === 'funcionalidades' ? null : 'funcionalidades')}>
                            <span className="accordion-title"><SvgZap /> Módulos</span>
                            <span className="accordion-chevron"><SvgChevronDown /></span>
                        </div>
                        {seccionAbierta === 'funcionalidades' && (
                            <div className="accordion-content">
                                <div className="settings-form-group">
                                    <div className="toggle-box glass-input-effect">
                                        <div><strong className="toggle-title">Cotizar Reparación</strong></div>
                                        <label className="switch"><input type="checkbox" name="mostrarPresupuestador" checked={config.mostrarPresupuestador !== false} onChange={handleChange} /><span className="slider round"></span></label>
                                    </div>
                                    <div className="toggle-box glass-input-effect">
                                        <div><strong className="toggle-title">Seguimiento de Equipo</strong></div>
                                        <label className="switch"><input type="checkbox" name="mostrarTracking" checked={config.mostrarTracking || false} onChange={handleChange} /><span className="slider round"></span></label>
                                    </div>
                                    <PremiumGate isPremium={isPremium}>
                                        <div className="toggle-box glass-input-effect">
                                            <div><strong className="toggle-title">Sello de Garantía</strong></div>
                                            <label className="switch"><input type="checkbox" name="mostrarGarantia" checked={config.mostrarGarantia || false} onChange={handleChange} /><span className="slider round"></span></label>
                                        </div>
                                        {config.mostrarGarantia && (
                                            <div>
                                                <label className="settings-label">Texto de Garantía:</label>
                                                <input type="text" name="tiempoGarantia" value={config.tiempoGarantia || ''} onChange={handleChange} className="settings-input" placeholder="Ej. 6 Meses / De por vida" maxLength={30} />
                                            </div>
                                        )}
                                    </PremiumGate>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={`accordion-item ${seccionAbierta === 'moneda' ? 'active' : ''}`}>
                        <div className="accordion-header" onClick={() => toggleSeccion('moneda')}>
                            <span className="accordion-title"><SvgDollar /> Moneda y Facturación</span>
                            <span className="accordion-chevron"><SvgChevronDown /></span>
                        </div>
                        {seccionAbierta === 'moneda' && (
                            <div className="accordion-content">
                                <div className="settings-form-group">
                                    <label className="settings-label">Moneda Principal:
                                        <select name="moneda" value={config.moneda || 'ARS'} onChange={handleChange} className="settings-input select-input">
                                            {CURRENCY_OPTIONS.map(c => (
                                                <option key={c.code} value={c.code}>{c.label} ({c.code} {c.symbol})</option>
                                            ))}
                                        </select>
                                    </label>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '5px 0 15px 0' }}>
                                        Se aplica automáticamente en Tickets, Métricas e Inventario.
                                    </p>
                                    <label className="settings-label">Impuesto / IVA (%):
                                        <input type="number" name="impuesto" value={config.impuesto || 21} onChange={handleChange} className="settings-input" min={0} max={100} />
                                    </label>
                                    <label className="settings-label" style={{ marginTop: '10px' }}>Prefijo de Tickets:
                                        <input type="text" name="prefijoTickets" value={config.prefijoTickets || 'WEP'} onChange={handleChange} className="settings-input" maxLength={5} placeholder="Ej: WEP" style={{ textTransform: 'uppercase' }} />
                                    </label>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '5px 0 0 0' }}>
                                        Los tickets se mostrarán como {config.prefijoTickets || 'WEP'}-001
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={`accordion-item ${seccionAbierta === 'seo' ? 'active' : ''}`}>
                        <div className="accordion-header" onClick={() => toggleSeccion('seo')}>
                            <span className="accordion-title"><SvgLink /> SEO y URL</span>
                            <span className="accordion-chevron"><SvgChevronDown /></span>
                        </div>
                        {seccionAbierta === 'seo' && (
                            <div className="accordion-content">
                                <div className="settings-form-group">
                                    <label className="settings-label">Slug Personalizado (URL):
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
                                            <span style={{ background: 'var(--bg-input-glass)', border: '1px solid var(--border-glass)', borderRight: 'none', padding: '10px 12px', borderRadius: '10px 0 0 10px', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 'bold', whiteSpace: 'nowrap' }}>/taller/</span>
                                            <input type="text" name="slug" value={config.slug || config.nombreNegocio?.toLowerCase().replace(/\s+/g, '-') || ''} onChange={handleChange} className="settings-input" style={{ borderRadius: '0 10px 10px 0', margin: 0 }} placeholder="mi-taller" />
                                        </div>
                                    </label>
                                    <label className="settings-label" style={{ marginTop: '15px' }}>Meta Descripción (SEO):
                                        <textarea name="metaDescripcion" value={config.metaDescripcion || ''} onChange={handleChange} className="settings-input settings-textarea" maxLength={160} rows={2} placeholder="Descripción para buscadores como Google (máx 160 caracteres)" style={{ resize: 'vertical' }} />
                                    </label>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{(config.metaDescripcion || '').length}/160</span>
                                    <div className="toggle-box glass-input-effect" style={{ marginTop: '15px' }}>
                                        <div><strong className="toggle-title">Indexar en Google</strong><p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '3px 0 0 0' }}>Permite que Google encuentre tu vidriera</p></div>
                                        <label className="switch"><input type="checkbox" name="indexarGoogle" checked={config.indexarGoogle !== false} onChange={handleChange} /><span className="slider round"></span></label>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={`accordion-item ${seccionAbierta === 'faq' ? 'active' : ''}`}>
                        <div className="accordion-header" onClick={() => toggleSeccion('faq')}>
                            <span className="accordion-title"><SvgHelp /> Preguntas Frecuentes</span>
                            <span className="accordion-chevron"><SvgChevronDown /></span>
                        </div>
                        {seccionAbierta === 'faq' && (
                            <div className="accordion-content">
                                <div className="settings-form-group">
                                    {(config.faqs || []).map((faq, idx) => (
                                        <div key={idx} className="faq-editor-item glass-input-effect" style={{ padding: '15px', borderRadius: '12px', marginBottom: '12px', border: '1px solid var(--border-glass)', position: 'relative' }}>
                                            <button type="button" onClick={() => handleRemoveFaq(idx)} style={{ position: 'absolute', top: '8px', right: '8px', background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '4px' }} title="Eliminar pregunta"><SvgTrashSmall /></button>
                                            <label className="settings-label" style={{ fontSize: '0.85rem' }}>Pregunta:
                                                <input type="text" value={faq.pregunta} onChange={e => handleChangeFaq(idx, 'pregunta', e.target.value)} className="settings-input" placeholder="¿Cuánto tarda la reparación?" maxLength={100} />
                                            </label>
                                            <label className="settings-label" style={{ fontSize: '0.85rem', marginTop: '8px' }}>Respuesta:
                                                <textarea value={faq.respuesta} onChange={e => handleChangeFaq(idx, 'respuesta', e.target.value)} className="settings-input settings-textarea" placeholder="Generalmente entre 24 y 72hs..." maxLength={300} rows={2} style={{ resize: 'vertical' }} />
                                            </label>
                                        </div>
                                    ))}
                                    <button type="button" onClick={handleAddFaq} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-input-glass)', border: '1px dashed var(--border-glass)', borderRadius: '10px', padding: '12px', width: '100%', justifyContent: 'center', color: 'var(--accent-color)', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem' }}><SvgPlusSmall /> Agregar Pregunta</button>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '10px 0 0 0', textAlign: 'center' }}>Las preguntas frecuentes se mostrarán en tu vidriera pública.</p>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            <div className="settings-preview-canvas">
                <div className="canvas-header">
                    <div className="device-toggles glass-effect">
                        <button type="button" className={`device-btn ${previewMode === 'mobile' ? 'active' : ''}`} onClick={() => handlePreviewChange('mobile')}><SvgMobileDevice /> Celular</button>
                        <button type="button" className={`device-btn ${previewMode === 'desktop' ? 'active' : ''}`} onClick={() => handlePreviewChange('desktop')}><SvgMonitorDevice /> Monitor</button>
                    </div>
                </div>

                <div className={`preview-stage ${isAnimatingPreview ? 'animating-stage' : ''}`}>
                    <div className="mockup-protector">
                        <div className={previewMode === 'mobile' ? 'phone-mockup-final' : 'desktop-mockup-final'}>
                            {previewMode === 'mobile' && (
                                <div className="phone-header-bar">
                                    <div className="phone-notch"></div>
                                    <div className="phone-status-bar" style={{ marginLeft: 'auto' }}><span>9:41</span></div>
                                </div>
                            )}

                            <div className="shop-screen-container" style={{ position: 'relative', overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div className="shop-screen" style={shopStyles}>
                                    <div className="shop-nav">
                                        <span className="shop-logo" style={{ color: 'var(--shop-text)' }}>{config.nombreNegocio || 'Tu Negocio'}</span>
                                        {previewMode === 'mobile' ? (
                                            <div className="shop-menu-icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}><SvgMenu /></div>
                                        ) : (
                                            <div className="shop-nav-links"><span>Inicio</span> <span>Servicios</span></div>
                                        )}
                                    </div>

                                    <div className="shop-hero" style={config.bannerUrl && isPremium ? { backgroundImage: `url(${config.bannerUrl})` } : {}}>
                                        <div className="shop-hero-overlay" style={{ background: 'var(--hero-overlay)' }}></div>
                                        <div className="shop-hero-content">
                                            <div className="shop-avatar-placeholder"><SvgBuilding /></div>
                                            <h1 className="shop-title" style={{ color: 'var(--hero-text-color)' }}>{config.titulo || 'Tu Título Principal'}</h1>
                                            <p className="shop-desc" style={{ color: 'var(--hero-subtext-color)' }}>{config.descripcion || 'Tu descripción corta aparecerá aquí...'}</p>

                                            {config.horariosAtencion && (
                                                <div className="shop-hours-hero" style={{ color: 'var(--hero-subtext-color)' }}>
                                                    <SvgClock /> {config.horariosAtencion}
                                                </div>
                                            )}

                                            <div className="shop-hero-actions"><button className="shop-cta-btn">Solicitar Reparación</button></div>

                                            {config.mostrarGarantia && isPremium && config.tiempoGarantia && (
                                                <div className="shop-trust-badge-hero"><SvgCheckShield /><span>Garantía: {config.tiempoGarantia}</span></div>
                                            )}
                                        </div>
                                    </div>

                                    {config.mostrarTracking && (
                                        <div className="shop-section shop-section-tracking">
                                            <div className="tracking-inner glass-effect">
                                                <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', color: 'var(--shop-text)' }}>Seguimiento</h3>
                                                <div className="tracking-input-group">
                                                    <input type="text" placeholder="#12345" disabled />
                                                    <button className="shop-cta-btn">Buscar</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {config.mostrarPresupuestador !== false && (
                                        <div className="shop-section">
                                            <h2 className="shop-section-title">Servicios</h2>
                                            <div className="shop-services-grid">
                                                <div className="shop-service-card"><div className="service-icon" style={{ color: 'var(--shop-accent-icon)' }}><SvgPhone /></div><span style={{ color: 'var(--shop-text-secondary)' }}>Pantallas</span></div>
                                                <div className="shop-service-card"><div className="service-icon" style={{ color: 'var(--shop-accent-icon)' }}><SvgBattery /></div><span style={{ color: 'var(--shop-text-secondary)' }}>Baterías</span></div>
                                            </div>
                                        </div>
                                    )}

                                    {config.instagramConnected && isPremium && (
                                        <div className="shop-section">
                                            <h2 className="shop-section-title" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}><SvgInstagram /> Nuestro Instagram</h2>
                                            <div className="ig-preview-mockup-grid">
                                                <div className="ig-mockup-item"></div>
                                                <div className="ig-mockup-item"></div>
                                                <div className="ig-mockup-item"></div>
                                                <div className="ig-mockup-item" style={{ display: previewMode === 'desktop' ? 'block' : 'none' }}></div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {config.whatsapp && config.whatsapp.length > 0 && (
                                    <div className="floating-wa-btn-preview"><SvgWhatsApp /></div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;