import React, { useState, useMemo, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import './Settings.css';

// --- SVGs PREMIUM ---
const SvgUser = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const SvgText = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>;
const SvgPalette = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path></svg>;
const SvgModules = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>;
const SvgGlobe = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>;
const SvgLink = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>;
const SvgHelp = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
const SvgDollar = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
const SvgImage = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>;
const SvgLock = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
const SvgPhone = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>;
const SvgMonitorDevice = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>;
const SvgBuilding = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path></svg>;
const SvgClock = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const SvgCheckShield = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>;
const SvgBattery = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="16" height="10" rx="2" ry="2"></rect><line x1="22" y1="11" x2="22" y2="13"></line></svg>;
const SvgTrash = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const SvgPlus = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const SvgInstagram = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path></svg>;
const SvgUpload = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>;
const SvgX = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const SvgMenu = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
const SvgWhatsApp = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>;

// --- CONSTANTES ---
const CURRENCY_OPTIONS = [
    { code: 'ARS', label: 'Peso Argentino', symbol: '$' }, { code: 'USD', label: 'Dólar', symbol: 'US$' },
    { code: 'EUR', label: 'Euro', symbol: '€' }, { code: 'MXN', label: 'Peso Mexicano', symbol: '$' },
    { code: 'CLP', label: 'Peso Chileno', symbol: '$' }, { code: 'COP', label: 'Peso Colombiano', symbol: '$' }
];
const ACCENT_COLORS = ['#2563eb', '#10b981', '#8b5cf6', '#e11d48', '#f97316', '#334155', '#06b6d4', '#eab308'];
const FONTS = [
    { label: 'Inter (Moderna)', value: '"Inter", system-ui, sans-serif' },
    { label: 'Helvetica (Clásica)', value: '"Helvetica Neue", Helvetica, sans-serif' },
    { label: 'Montserrat (Elegante)', value: '"Montserrat", sans-serif' }
];

const TEMPLATES = [
    { id: 'dark-tech', name: 'Dark Tech Pro', color: '#0f172a', border: '#2563eb', config: { shopDarkMode: true, colorTema: '#2563eb', colorTitulo: '#ffffff', colorSubtitulo: '#94a3b8', borderRadius: '16px', fontFamily: '"Inter", system-ui, sans-serif' } },
    { id: 'light-apple', name: 'Minimalist Clean', color: '#f8fafc', border: '#334155', config: { shopDarkMode: false, colorTema: '#000000', colorTitulo: '#0f172a', colorSubtitulo: '#64748b', borderRadius: '24px', fontFamily: '"Helvetica Neue", Helvetica, sans-serif' } },
    { id: 'neon-cyber', name: 'Neon Cyberpunk', color: '#000000', border: '#10b981', config: { shopDarkMode: true, colorTema: '#10b981', colorTitulo: '#10b981', colorSubtitulo: '#a7f3d0', borderRadius: '8px', fontFamily: '"Inter", system-ui, sans-serif' } }
];

const getLuminance = (hex) => {
    if (!hex) return 0;
    let c = hex.replace('#', ''); if (c.length === 3) c = c.split('').map(x => x + x).join(''); let rgb = parseInt(c, 16); if (isNaN(rgb)) return 0;
    let r = (rgb >> 16) & 0xff, g = (rgb >> 8) & 0xff, b = (rgb >> 0) & 0xff;
    let a = [r, g, b].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

const getContrastRatio = (hex1, hex2) => { const l1 = getLuminance(hex1), l2 = getLuminance(hex2); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };

const PremiumGate = ({ children, isPremium }) => {
    if (isPremium) return children;
    return (
        <div className="pro-lock-container">
            <div className="pro-blurred">{children}</div>
            <div className="pro-badge"><SvgLock /> Pro</div>
        </div>
    );
};

export default function Settings({ config, onUpdate }) {
    const [currentPlan, setCurrentPlan] = useState(config.plan || 'standard');
    const isPremium = currentPlan === 'premium';
    const [previewMode, setPreviewMode] = useState('mobile');
    const [isAnimatingPreview, setIsAnimatingPreview] = useState(false);
    const [activeTab, setActiveTab] = useState('perfil');
    const [showTemplatesModal, setShowTemplatesModal] = useState(false);
    const [igConnecting, setIgConnecting] = useState(false);
    const fileInputRef = useRef(null);

    // ESTADO LOCAL & DETECCIÓN DE CAMBIOS
    const [localConfig, setLocalConfig] = useState(config);
    const [perfil, setPerfil] = useState({ nombreCompleto: '', nombreArtistico: '', email: '' });
    const [perfilInicial, setPerfilInicial] = useState({ nombreCompleto: '', nombreArtistico: '', email: '' });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const p = { email: user.email, nombreCompleto: user.user_metadata?.nombre || '', nombreArtistico: user.user_metadata?.nombreArtistico || '' };
                setPerfil(p);
                setPerfilInicial(p);
            }
        };
        fetchUserData();
    }, []);

    const isDirty = useMemo(() => {
        const configCambio = JSON.stringify(config) !== JSON.stringify(localConfig);
        const perfilCambio = JSON.stringify(perfil) !== JSON.stringify(perfilInicial);
        return configCambio || perfilCambio;
    }, [config, localConfig, perfil, perfilInicial]);

    // MANEJADORES
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setLocalConfig(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleProfileChange = (e) => setPerfil({ ...perfil, [e.target.name]: e.target.value });

    const handleSaveMaster = async () => {
        setIsSaving(true);
        if (JSON.stringify(perfil) !== JSON.stringify(perfilInicial)) {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) await supabase.auth.updateUser({ data: { nombre: perfil.nombreCompleto, nombreArtistico: perfil.nombreArtistico } });
            setPerfilInicial(perfil);
        }
        if (JSON.stringify(config) !== JSON.stringify(localConfig)) {
            onUpdate(localConfig);
        }
        setIsSaving(false);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => setLocalConfig(prev => ({ ...prev, bannerUrl: reader.result }));
            reader.readAsDataURL(file);
        }
    };

    const handleConnectIg = () => {
        setIgConnecting(true);
        setTimeout(() => { setLocalConfig(prev => ({ ...prev, instagramConnected: true })); setIgConnecting(false); }, 1500);
    };

    const aplicarPlantilla = (tplConfig) => {
        setLocalConfig(prev => ({ ...prev, ...tplConfig }));
        setShowTemplatesModal(false);
    };

    const handlePreviewChange = (mode) => {
        if (mode === previewMode || isAnimatingPreview) return;
        setIsAnimatingPreview(true);
        setTimeout(() => { setPreviewMode(mode); setTimeout(() => setIsAnimatingPreview(false), 50); }, 350);
    };

    const handleAddFaq = () => {
        const faqs = localConfig.faqs || [];
        setLocalConfig({ ...localConfig, faqs: [...faqs, { pregunta: '', respuesta: '' }] });
    };

    const handleRemoveFaq = (idx) => {
        const faqs = [...(localConfig.faqs || [])];
        faqs.splice(idx, 1);
        setLocalConfig({ ...localConfig, faqs });
    };

    const handleChangeFaq = (idx, field, value) => {
        const faqs = [...(localConfig.faqs || [])];
        faqs[idx] = { ...faqs[idx], [field]: value };
        setLocalConfig({ ...localConfig, faqs });
    };

    // GENERADOR DE ESTILOS CSS PARA MOCKUP
    const shopStyles = useMemo(() => {
        const c = localConfig;
        const isDark = c.shopDarkMode;
        const text = c.colorTitulo || (isDark ? '#ffffff' : '#0f172a');
        const subtext = c.colorSubtitulo || (isDark ? '#94a3b8' : '#64748b');
        const accent = c.colorTema || '#2563eb';
        const bg = isDark ? '#090e17' : '#ffffff';
        const btnText = getLuminance(accent) > 0.179 ? '#000000' : '#ffffff';

        return {
            '--shop-bg': bg,
            '--shop-bg-secondary': isDark ? '#141c2f' : '#f8fafc',
            '--shop-border': isDark ? '#1e293b' : '#e2e8f0',
            '--shop-text': text,
            '--shop-text-secondary': subtext,
            '--shop-accent': accent,
            '--shop-accent-icon': accent,
            '--shop-btn-text': btnText,
            '--shop-font': c.fontFamily || '"Inter", system-ui, sans-serif',
            '--shop-radius': c.borderRadius || '16px',
            '--hero-text-color': c.bannerUrl ? '#ffffff' : text,
            '--hero-subtext-color': c.bannerUrl ? 'rgba(255,255,255,0.85)' : subtext,
            '--hero-overlay': c.bannerUrl ? 'linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.9))' : 'none',
            '--shop-bg-rgb': isDark ? '9, 14, 23' : '255, 255, 255'
        };
    }, [localConfig]);

    return (
        <div className="settings-master-container">

            {/* --- MODAL PLANTILLAS --- */}
            {showTemplatesModal && (
                <div className="modal-overlay" onClick={() => setShowTemplatesModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 style={{ margin: 0 }}>Galería de Plantillas</h2>
                            <button className="faq-delete-btn" onClick={() => setShowTemplatesModal(false)}><SvgX /></button>
                        </div>
                        <div className="tpl-grid">
                            {TEMPLATES.map(tpl => (
                                <div key={tpl.id} className="tpl-card" style={{ background: tpl.color, borderColor: tpl.border }} onClick={() => aplicarPlantilla(tpl.config)}>
                                    <div className="tpl-preview">
                                        <div className="tpl-mock-nav"></div>
                                        <div className="tpl-mock-body">
                                            <div className="tpl-line-1" style={{ background: tpl.config.colorTitulo }}></div>
                                            <div className="tpl-line-2" style={{ background: tpl.config.colorSubtitulo }}></div>
                                            <div className="tpl-btn" style={{ background: tpl.config.colorTema }}></div>
                                        </div>
                                    </div>
                                    <h4 style={{ color: tpl.config.shopDarkMode ? '#fff' : '#000', margin: 0 }}>{tpl.name}</h4>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* --- COLUMNA 1: SIDEBAR --- */}
            <aside className="settings-sidebar-nav">
                <div className="sidebar-header">
                    <h2 className="sidebar-title">Ajustes</h2>
                    <p className="sidebar-subtitle">Gestor de plataforma</p>
                </div>
                <nav className="sidebar-menu">
                    <button className={`sidebar-item ${activeTab === 'perfil' ? 'active' : ''}`} onClick={() => setActiveTab('perfil')}><SvgUser /> Mi Perfil</button>
                    <button className={`sidebar-item ${activeTab === 'general' ? 'active' : ''}`} onClick={() => setActiveTab('general')}><SvgText /> Identidad Visual</button>
                    <button className={`sidebar-item ${activeTab === 'diseno' ? 'active' : ''}`} onClick={() => setActiveTab('diseno')}><SvgPalette /> Tema y Colores</button>
                    <button className={`sidebar-item ${activeTab === 'multimedia' ? 'active' : ''}`} onClick={() => setActiveTab('multimedia')}><SvgImage /> Multimedia (Pro)</button>
                    <button className={`sidebar-item ${activeTab === 'modulos' ? 'active' : ''}`} onClick={() => setActiveTab('modulos')}><SvgModules /> Módulos Web</button>
                    <button className={`sidebar-item ${activeTab === 'seo' ? 'active' : ''}`} onClick={() => setActiveTab('seo')}><SvgLink /> SEO y Enlaces</button>
                    <button className={`sidebar-item ${activeTab === 'faq' ? 'active' : ''}`} onClick={() => setActiveTab('faq')}><SvgHelp /> Preguntas (FAQ)</button>
                    <button className={`sidebar-item ${activeTab === 'facturacion' ? 'active' : ''}`} onClick={() => setActiveTab('facturacion')}><SvgDollar /> Facturación</button>
                </nav>
                <div className="sidebar-footer">
                    <button className={`btn-primary-action ${isDirty ? 'active' : 'disabled'}`} onClick={handleSaveMaster} disabled={!isDirty || isSaving}>
                        {isSaving ? 'Guardando...' : (isDirty ? 'Guardar Cambios' : 'Todo al día')}
                    </button>
                </div>
            </aside>

            {/* --- COLUMNA 2: EDITOR --- */}
            <section className="settings-editor-panel">
                <header className="editor-panel-header">
                    <h3 className="editor-panel-title">
                        {activeTab === 'perfil' && 'Información Personal'}
                        {activeTab === 'general' && 'Textos de Vidriera'}
                        {activeTab === 'diseno' && 'Apariencia Visual'}
                        {activeTab === 'multimedia' && 'Archivos Multimedia'}
                        {activeTab === 'modulos' && 'Control de Secciones'}
                        {activeTab === 'seo' && 'Indexación y Rutas'}
                        {activeTab === 'faq' && 'Preguntas Frecuentes'}
                        {activeTab === 'facturacion' && 'Moneda del Sistema'}
                    </h3>
                    <select value={currentPlan} onChange={(e) => { setCurrentPlan(e.target.value); handleChange(e); }} name="plan" style={{ background: 'transparent', border: 'none', color: 'var(--set-accent)', fontWeight: '800', outline: 'none' }}>
                        <option value="standard">PLAN GRATIS</option><option value="premium">PLAN PRO</option>
                    </select>
                </header>

                <div className="editor-scroll-content">

                    {/* PERFIL */}
                    {activeTab === 'perfil' && (
                        <div className="form-section">
                            <h4 className="section-heading">Credenciales</h4>
                            <div className="input-group">
                                <label className="input-label">Email de Sesión (Lectura)</label>
                                <input type="email" value={perfil.email} disabled className="premium-input" />
                            </div>
                            <h4 className="section-heading" style={{ marginTop: '10px' }}>Datos Públicos</h4>
                            <div className="input-group">
                                <label className="input-label">Nombre Real</label>
                                <input type="text" name="nombreCompleto" value={perfil.nombreCompleto} onChange={handleProfileChange} className="premium-input" placeholder="Ej: Juan Pérez" />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Nombre Artístico / Alias</label>
                                <input type="text" name="nombreArtistico" value={perfil.nombreArtistico} onChange={handleProfileChange} className="premium-input" placeholder="Ej: FixMaster" />
                            </div>
                        </div>
                    )}

                    {/* GENERAL */}
                    {activeTab === 'general' && (
                        <div className="form-section">
                            <h4 className="section-heading">Presentación</h4>
                            <div className="input-group">
                                <label className="input-label">Nombre del Taller</label>
                                <input type="text" name="nombreNegocio" value={localConfig.nombreNegocio || ''} onChange={handleChange} className="premium-input" maxLength={30} />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Título Principal (Hero)</label>
                                <input type="text" name="titulo" value={localConfig.titulo || ''} onChange={handleChange} className="premium-input" maxLength={50} />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Descripción</label>
                                <textarea name="descripcion" value={localConfig.descripcion || ''} onChange={handleChange} className="premium-input" maxLength={150} />
                            </div>
                            <h4 className="section-heading" style={{ marginTop: '10px' }}>Contacto Directo</h4>
                            <div className="input-group">
                                <label className="input-label">WhatsApp (Número entero)</label>
                                <input type="text" name="whatsapp" value={localConfig.whatsapp || ''} onChange={handleChange} className="premium-input" placeholder="5491123456789" />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Horarios de Atención</label>
                                <input type="text" name="horariosAtencion" value={localConfig.horariosAtencion || ''} onChange={handleChange} className="premium-input" placeholder="Lun-Vie 9 a 18hs" />
                            </div>
                            <PremiumGate isPremium={isPremium}>
                                <div className="premium-toggle-row" style={{ marginTop: '10px' }}>
                                    <div className="toggle-text"><span className="toggle-title">Feed de Instagram</span><span className="toggle-desc">Muestra fotos en tu web</span></div>
                                    <label className="switch"><input type="checkbox" name="instagramConnected" checked={localConfig.instagramConnected || false} onChange={handleChange} /><span className="slider"></span></label>
                                </div>
                            </PremiumGate>
                        </div>
                    )}

                    {/* DISEÑO */}
                    {activeTab === 'diseno' && (
                        <div className="form-section">
                            <button className="btn-primary-action btn-outline" onClick={() => setShowTemplatesModal(true)} style={{ marginBottom: '10px' }}>Ver Galería de Plantillas</button>
                            <h4 className="section-heading">Tema Base</h4>
                            <div className="premium-toggle-row">
                                <div className="toggle-text"><span className="toggle-title">Forzar Modo Oscuro</span><span className="toggle-desc">Fondo negro para clientes</span></div>
                                <label className="switch"><input type="checkbox" name="shopDarkMode" checked={localConfig.shopDarkMode || false} onChange={handleChange} /><span className="slider"></span></label>
                            </div>
                            <h4 className="section-heading" style={{ marginTop: '10px' }}>Colores</h4>
                            <div className="input-group">
                                <label className="input-label">Color de Marca (Acento)</label>
                                <div className="color-picker-container">
                                    <input type="color" name="colorTema" value={localConfig.colorTema || '#2563eb'} onChange={handleChange} className="color-input-native" />
                                    <div className="color-palette">
                                        {ACCENT_COLORS.map(hex => <div key={hex} onClick={() => setLocalConfig({ ...localConfig, colorTema: hex })} className={`color-swatch ${localConfig.colorTema === hex ? 'active' : ''}`} style={{ backgroundColor: hex }} />)}
                                    </div>
                                </div>
                            </div>
                            <PremiumGate isPremium={isPremium}>
                                <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                                    <div className="input-group" style={{ flex: 1 }}>
                                        <label className="input-label">Títulos</label>
                                        <input type="color" name="colorTitulo" value={localConfig.colorTitulo || '#ffffff'} onChange={handleChange} className="color-input-native" style={{ width: '100%' }} />
                                    </div>
                                    <div className="input-group" style={{ flex: 1 }}>
                                        <label className="input-label">Textos</label>
                                        <input type="color" name="colorSubtitulo" value={localConfig.colorSubtitulo || '#94a3b8'} onChange={handleChange} className="color-input-native" style={{ width: '100%' }} />
                                    </div>
                                </div>
                                <h4 className="section-heading" style={{ marginTop: '20px' }}>Estructura</h4>
                                <div className="input-group">
                                    <label className="input-label">Tipografía Global</label>
                                    <select name="fontFamily" value={localConfig.fontFamily || FONTS[0].value} onChange={handleChange} className="premium-input">
                                        {FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Redondeo (Bordes): {localConfig.borderRadius || '16px'}</label>
                                    <input type="range" min="0" max="40" value={parseInt(localConfig.borderRadius || '16')} onChange={(e) => setLocalConfig({ ...localConfig, borderRadius: `${e.target.value}px` })} style={{ width: '100%' }} />
                                </div>
                            </PremiumGate>
                        </div>
                    )}

                    {/* MULTIMEDIA */}
                    {activeTab === 'multimedia' && (
                        <div className="form-section">
                            <PremiumGate isPremium={isPremium}>
                                <h4 className="section-heading">Banner Principal</h4>
                                <div className="input-group">
                                    <label className="input-label">URL o Archivo</label>
                                    <div className="upload-group">
                                        <input type="text" name="bannerUrl" value={localConfig.bannerUrl || ''} onChange={handleChange} className="premium-input" placeholder="https://..." style={{ borderRadius: '10px 0 0 10px', flex: 1 }} />
                                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" style={{ display: 'none' }} />
                                        <button type="button" className="upload-btn" onClick={triggerFileInput} style={{ borderRadius: '0 10px 10px 0' }}><SvgUpload /> Subir</button>
                                    </div>
                                </div>
                                <h4 className="section-heading" style={{ marginTop: '20px' }}>Video</h4>
                                <div className="input-group">
                                    <label className="input-label">URL de YouTube</label>
                                    <input type="url" name="videoUrl" value={localConfig.videoUrl || ''} onChange={handleChange} className="premium-input" placeholder="https://youtube.com/watch?v=..." />
                                </div>
                            </PremiumGate>
                        </div>
                    )}

                    {/* MODULOS */}
                    {activeTab === 'modulos' && (
                        <div className="form-section">
                            <h4 className="section-heading">Secciones Visibles</h4>
                            <div className="premium-toggle-row">
                                <div className="toggle-text"><span className="toggle-title">Rastreo de Equipo</span><span className="toggle-desc">Buscan su equipo por código</span></div>
                                <label className="switch"><input type="checkbox" name="mostrarTracking" checked={localConfig.mostrarTracking !== false} onChange={handleChange} /><span className="slider"></span></label>
                            </div>
                            <div className="premium-toggle-row">
                                <div className="toggle-text"><span className="toggle-title">Cotizador Rápido</span><span className="toggle-desc">Muestra reparaciones</span></div>
                                <label className="switch"><input type="checkbox" name="mostrarPresupuestador" checked={localConfig.mostrarPresupuestador !== false} onChange={handleChange} /><span className="slider"></span></label>
                            </div>
                            <PremiumGate isPremium={isPremium}>
                                <div className="premium-toggle-row">
                                    <div className="toggle-text"><span className="toggle-title">Sello de Garantía</span><span className="toggle-desc">Aparece en la cabecera</span></div>
                                    <label className="switch"><input type="checkbox" name="mostrarGarantia" checked={localConfig.mostrarGarantia !== false} onChange={handleChange} /><span className="slider"></span></label>
                                </div>
                                {localConfig.mostrarGarantia && (
                                    <div className="input-group" style={{ paddingLeft: '15px', borderLeft: '2px solid var(--set-accent)' }}>
                                        <label className="input-label">Texto de Garantía</label>
                                        <input type="text" name="tiempoGarantia" value={localConfig.tiempoGarantia || ''} onChange={handleChange} className="premium-input" placeholder="Ej: 90 Días" />
                                    </div>
                                )}
                            </PremiumGate>
                        </div>
                    )}

                    {/* SEO */}
                    {activeTab === 'seo' && (
                        <div className="form-section">
                            <h4 className="section-heading">Buscadores (Google)</h4>
                            <div className="input-group">
                                <label className="input-label">URL de tu negocio (Slug)</label>
                                <div className="upload-group" style={{ display: 'flex' }}>
                                    <span style={{ padding: '12px 16px', background: 'var(--set-input-border)', borderRadius: '10px 0 0 10px', fontSize: '0.95rem', fontWeight: 'bold' }}>/taller/</span>
                                    <input type="text" name="slug" value={localConfig.slug || ''} onChange={handleChange} className="premium-input" style={{ borderRadius: '0 10px 10px 0', flex: 1 }} placeholder="nombre-negocio" />
                                </div>
                            </div>
                            <div className="premium-toggle-row" style={{ marginTop: '10px' }}>
                                <div className="toggle-text"><span className="toggle-title">Permitir Indexación</span><span className="toggle-desc">Aparecer en resultados</span></div>
                                <label className="switch"><input type="checkbox" name="indexarGoogle" checked={localConfig.indexarGoogle !== false} onChange={handleChange} /><span className="slider"></span></label>
                            </div>
                            <div className="input-group" style={{ marginTop: '10px' }}>
                                <label className="input-label">Meta Descripción (SEO)</label>
                                <textarea name="metaDescripcion" value={localConfig.metaDescripcion || ''} onChange={handleChange} className="premium-input" maxLength={160} placeholder="Breve descripción..." />
                            </div>
                        </div>
                    )}

                    {/* FAQ */}
                    {activeTab === 'faq' && (
                        <div className="form-section">
                            <h4 className="section-heading">Preguntas de Clientes</h4>
                            {(localConfig.faqs || []).map((faq, idx) => (
                                <div key={idx} className="faq-card">
                                    <button className="faq-delete-btn" onClick={() => handleRemoveFaq(idx)}><SvgTrash /></button>
                                    <div className="input-group" style={{ paddingRight: '30px' }}>
                                        <label className="input-label">Pregunta</label>
                                        <input type="text" value={faq.pregunta} onChange={(e) => handleChangeFaq(idx, 'pregunta', e.target.value)} className="premium-input" placeholder="Ej: ¿Tiene garantía?" />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Respuesta</label>
                                        <textarea value={faq.respuesta} onChange={(e) => handleChangeFaq(idx, 'respuesta', e.target.value)} className="premium-input" style={{ minHeight: '60px' }} />
                                    </div>
                                </div>
                            ))}
                            <button className="btn-primary-action btn-outline" onClick={handleAddFaq}><SvgPlus /> Agregar Pregunta</button>
                        </div>
                    )}

                    {/* FACTURACIÓN */}
                    {activeTab === 'facturacion' && (
                        <div className="form-section">
                            <h4 className="section-heading">Ajustes Contables</h4>
                            <div className="input-group">
                                <label className="input-label">Moneda del Sistema</label>
                                <select name="moneda" value={localConfig.moneda || 'ARS'} onChange={handleChange} className="premium-input">
                                    {CURRENCY_OPTIONS.map(c => <option key={c.code} value={c.code}>{c.label} ({c.code})</option>)}
                                </select>
                            </div>
                            <div className="input-group">
                                <label className="input-label">IVA / Impuesto Local (%)</label>
                                <input type="number" name="impuesto" value={localConfig.impuesto || 21} onChange={handleChange} className="premium-input" />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Prefijo de Orden Interna</label>
                                <input type="text" name="prefijoTickets" value={localConfig.prefijoTickets || 'WEP'} onChange={handleChange} className="premium-input" maxLength={5} style={{ textTransform: 'uppercase' }} />
                            </div>
                        </div>
                    )}

                </div>
            </section>

            {/* --- COLUMNA 3: LIENZO Y MOCKUP (ESCALADO PERFECTO) --- */}
            <section className="settings-preview-canvas">

                <div className="canvas-toolbar">
                    <button className={`device-btn ${previewMode === 'mobile' ? 'active' : ''}`} onClick={() => handlePreviewChange('mobile')}><SvgPhone /> Celular</button>
                    <button className={`device-btn ${previewMode === 'desktop' ? 'active' : ''}`} onClick={() => handlePreviewChange('desktop')}><SvgMonitorDevice /> Monitor</button>
                </div>

                <div className="preview-stage-wrapper">
                    <div className={`mockup-animator ${isAnimatingPreview ? 'hidden' : ''}`}>

                        <div className={previewMode === 'mobile' ? 'iphone-frame' : 'desktop-frame'}>

                            {previewMode === 'mobile' && <div className="iphone-notch"></div>}
                            {previewMode === 'desktop' && (
                                <div className="mac-titlebar">
                                    <div className="mac-dot" style={{ background: '#ff5f56' }}></div><div className="mac-dot" style={{ background: '#ffbd2e' }}></div><div className="mac-dot" style={{ background: '#27c93f' }}></div>
                                    <div style={{ margin: '0 auto', fontSize: '0.8rem', color: 'var(--set-text-secondary)', background: 'var(--set-input-bg)', padding: '4px 60px', borderRadius: '6px' }}>{localConfig.slug || 'mitaller'}.wepairr.com</div>
                                </div>
                            )}

                            {/* PANTALLA INTERNA: VIDRIERA REAL */}
                            <div className="screen-display">
                                <div className="live-preview-shop" style={shopStyles}>

                                    {previewMode === 'mobile' && (
                                        <div className="ios-status-bar"><span>9:41</span><div style={{ display: 'flex', gap: '5px' }}><SvgBattery width="18" /></div></div>
                                    )}

                                    <nav className="lp-nav">
                                        <div className="lp-logo">{localConfig.nombreNegocio || 'Nombre Taller'}</div>
                                        {previewMode === 'desktop' ? <div className="lp-links"><span>Inicio</span><span>Servicios</span></div> : <SvgMenu />}
                                    </nav>

                                    <header className="lp-hero" style={localConfig.bannerUrl && isPremium ? { backgroundImage: `url(${localConfig.bannerUrl})` } : {}}>
                                        <div className="lp-hero-overlay"></div>
                                        <div className="lp-hero-content">
                                            <div className="lp-avatar"><SvgBuilding width="32" height="32" /></div>
                                            <h1 className="lp-title">{localConfig.titulo || 'Tu Título Principal'}</h1>
                                            <p className="lp-desc">{localConfig.descripcion || 'Breve descripción de lo que haces.'}</p>

                                            {localConfig.horariosAtencion && (
                                                <div className="shop-hours-hero" style={{ color: 'var(--hero-subtext-color)', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(0,0,0,0.1)', borderRadius: '99px', fontSize: '0.85rem', fontWeight: '700', marginBottom: '24px' }}>
                                                    <SvgClock /> {localConfig.horariosAtencion}
                                                </div>
                                            )}

                                            <button className="lp-btn">Solicitar Reparación</button>

                                            {localConfig.mostrarGarantia && isPremium && localConfig.tiempoGarantia && (
                                                <div className="shop-trust-badge-hero" style={{ marginTop: '24px', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', borderRadius: '99px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', fontWeight: '800', fontSize: '0.85rem' }}>
                                                    <SvgCheckShield /> {localConfig.tiempoGarantia}
                                                </div>
                                            )}
                                        </div>
                                    </header>

                                    {localConfig.mostrarTracking !== false && (
                                        <div className="lp-section" style={{ padding: 0, border: 'none' }}>
                                            <div className="lp-tracking-card">
                                                <h3>Seguimiento de Orden</h3>
                                                <div className="lp-input-group">
                                                    <input type="text" disabled placeholder="#12345" />
                                                    <button className="lp-btn" style={{ padding: '0 20px', borderRadius: '12px' }}>Buscar</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {localConfig.mostrarPresupuestador !== false && (
                                        <div className="lp-section">
                                            <h2 className="shop-section-title" style={{ fontSize: '1.8rem', fontWeight: '900', textAlign: 'center', marginBottom: '30px' }}>Servicios Destacados</h2>
                                            <div className="lp-grid">
                                                <div className="lp-card"><div style={{ color: 'var(--shop-accent-icon)' }}><SvgPhone width="32" height="32" /></div><span>Pantallas</span></div>
                                                <div className="lp-card"><div style={{ color: 'var(--shop-accent-icon)' }}><SvgBattery width="32" height="32" /></div><span>Baterías</span></div>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}