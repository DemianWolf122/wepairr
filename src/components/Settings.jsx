import React, { useState, useMemo, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import './Settings.css';

// ==========================================================================
// 1. LIBRERÍA DE ICONOS PREMIUM (SVGs)
// ==========================================================================
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
const SvgShieldAlert = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>;
const SvgBell = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>;
const SvgSettings = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
const SvgAlertTriangle = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;

// ==========================================================================
// 2. CONSTANTES GLOBALES Y TEMAS
// ==========================================================================
const CURRENCY_OPTIONS = [
    { code: 'ARS', label: 'Peso Argentino', symbol: '$' },
    { code: 'USD', label: 'Dólar Estadounidense', symbol: 'US$' },
    { code: 'EUR', label: 'Euro', symbol: '€' },
    { code: 'MXN', label: 'Peso Mexicano', symbol: '$' },
    { code: 'CLP', label: 'Peso Chileno', symbol: '$' },
    { code: 'COP', label: 'Peso Colombiano', symbol: '$' },
    { code: 'BRL', label: 'Real Brasileño', symbol: 'R$' }
];

// 🎨 PALETA DE COLORES SEGURAS (WCAG AA) - Prohíbe inputs libres por SEO
const ACCENT_COLORS = ['#2563eb', '#10b981', '#8b5cf6', '#e11d48', '#f97316', '#334155', '#06b6d4', '#eab308', '#000000', '#ffffff'];

const FONTS = [
    { label: 'Inter (Corporativa Moderna)', value: '"Inter", system-ui, sans-serif' },
    { label: 'Helvetica (Minimalista Clásica)', value: '"Helvetica Neue", Helvetica, sans-serif' },
    { label: 'Montserrat (Geométrica Elegante)', value: '"Montserrat", sans-serif' }
];

const TEMPLATES = [
    { id: 'dark-tech', name: 'Dark Tech Pro', color: '#0f172a', border: '#2563eb', config: { shopDarkMode: true, colorTema: '#2563eb', fontFamily: '"Inter", system-ui, sans-serif' } },
    { id: 'light-apple', name: 'Minimalist Clean', color: '#f8fafc', border: '#334155', config: { shopDarkMode: false, colorTema: '#000000', fontFamily: '"Helvetica Neue", Helvetica, sans-serif' } },
    { id: 'neon-cyber', name: 'Neon Cyberpunk', color: '#000000', border: '#10b981', config: { shopDarkMode: true, colorTema: '#10b981', fontFamily: '"Inter", system-ui, sans-serif' } }
];

// ==========================================================================
// 3. UTILIDADES DE CÁLCULO DE COLOR
// ==========================================================================
const getLuminance = (hex) => {
    if (!hex) return 0;
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    let rgb = parseInt(c, 16);
    if (isNaN(rgb)) return 0;
    let r = (rgb >> 16) & 0xff, g = (rgb >> 8) & 0xff, b = (rgb >> 0) & 0xff;
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

// ==========================================================================
// 4. COMPONENTES REUTILIZABLES INTERNOS
// ==========================================================================
const PremiumGate = ({ children, isPremium }) => {
    if (isPremium) return children;
    return (
        <div className="pro-lock-container">
            <div className="pro-blurred">{children}</div>
            <div className="pro-badge"><SvgLock /> Función Pro</div>
        </div>
    );
};

// ==========================================================================
// 5. COMPONENTE MAESTRO: SETTINGS (DOBLE ENTORNO)
// ==========================================================================
export default function Settings({ mode, config, setConfig, onUpdate }) {
    // Definimos el entorno real (Perfil vs Vidriera)
    const isModePerfil = mode === 'perfil';
    const isPremium = config?.plan === 'premium' || true;

    // Estado del Mockup (Solo usado en modo Vidriera)
    const [previewMode, setPreviewMode] = useState('mobile');
    const [isAnimatingPreview, setIsAnimatingPreview] = useState(false);

    // Control de la pestaña activa dependiendo del modo
    const [activeTab, setActiveTab] = useState(isModePerfil ? 'cuenta' : 'general');

    // Modales y Refs
    const [showTemplatesModal, setShowTemplatesModal] = useState(false);
    const [igConnecting, setIgConnecting] = useState(false);
    const fileInputRef = useRef(null);

    // ==========================================
    // ESTADOS GLOBALES DE LA BASE DE DATOS
    // ==========================================
    const [localConfig, setLocalConfig] = useState(config || {});
    const [perfil, setPerfil] = useState({ nombreCompleto: '', nombreArtistico: '', email: '' });
    const [perfilInicial, setPerfilInicial] = useState({ nombreCompleto: '', nombreArtistico: '', email: '' });
    const [sesionesActivas, setSesionesActivas] = useState([]);
    const [preferencias, setPreferencias] = useState({
        idioma: 'es',
        zonaHoraria: 'America/Argentina/Buenos_Aires',
        notificacionesEmail: true,
        notificacionesTickets: true
    });
    const [isSaving, setIsSaving] = useState(false);

    // Carga de Datos al Montar
    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const p = {
                    email: session.user.email,
                    nombreCompleto: session.user.user_metadata?.nombre || '',
                    nombreArtistico: session.user.user_metadata?.nombreArtistico || ''
                };
                setPerfil(p);
                setPerfilInicial(p);

                // Cargar sesiones (Simulación de seguridad para la UI)
                setSesionesActivas([
                    { id: 1, device: 'Mac OS - Chrome', location: 'Buenos Aires, AR', current: true, time: 'Ahora mismo' },
                    { id: 2, device: 'iPhone 14 - Safari', location: 'Buenos Aires, AR', current: false, time: 'Hace 2 horas' }
                ]);
            }
        };
        fetchUserData();
    }, []);

    // LÓGICA DE DETECCIÓN DE CAMBIOS (isDirty)
    const isDirty = useMemo(() => {
        const configCambio = JSON.stringify(config) !== JSON.stringify(localConfig);
        const perfilCambio = JSON.stringify(perfil) !== JSON.stringify(perfilInicial);
        return configCambio || perfilCambio;
    }, [config, localConfig, perfil, perfilInicial]);

    // MANEJADORES DE EVENTOS
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setLocalConfig(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleProfileChange = (e) => {
        setPerfil({ ...perfil, [e.target.name]: e.target.value });
    };

    const handlePrefChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPreferencias(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSaveMaster = async () => {
        setIsSaving(true);
        try {
            if (JSON.stringify(perfil) !== JSON.stringify(perfilInicial)) {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    await supabase.auth.updateUser({
                        data: { nombre: perfil.nombreCompleto, nombreArtistico: perfil.nombreArtistico }
                    });
                }
                setPerfilInicial(perfil);
            }
            if (JSON.stringify(config) !== JSON.stringify(localConfig)) {
                if (onUpdate) onUpdate(localConfig);
                if (setConfig) setConfig(localConfig);
                localStorage.setItem('wepairr_config', JSON.stringify(localConfig));
            }
            setTimeout(() => { setIsSaving(false); }, 500);
        } catch (error) {
            console.error("Error guardando ajustes:", error);
            setIsSaving(false);
            alert("Error de conexión al guardar los ajustes.");
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => setLocalConfig(prev => ({ ...prev, bannerUrl: reader.result }));
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => fileInputRef.current?.click();

    const handleConnectIg = () => {
        setIgConnecting(true);
        setTimeout(() => {
            setLocalConfig(prev => ({ ...prev, instagramConnected: true }));
            setIgConnecting(false);
        }, 1500);
    };

    const aplicarPlantilla = (tplConfig) => {
        setLocalConfig(prev => ({ ...prev, ...tplConfig }));
        setShowTemplatesModal(false);
    };

    const handlePreviewChange = (mode) => {
        if (mode === previewMode || isAnimatingPreview) return;
        setIsAnimatingPreview(true);
        setTimeout(() => {
            setPreviewMode(mode);
            setTimeout(() => setIsAnimatingPreview(false), 50);
        }, 350);
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

    const handleCerrarSesiones = () => {
        if (window.confirm("¿Seguro que deseas cerrar sesión en todos los demás dispositivos?")) {
            setSesionesActivas(sesionesActivas.filter(s => s.current));
            alert("Sesiones finalizadas con éxito.");
        }
    };

    const handleBorrarCuenta = () => {
        const emailConfirm = prompt(`Para confirmar, escribe tu correo electrónico: ${perfil.email}`);
        if (emailConfirm === perfil.email) {
            alert("Proceso de eliminación iniciado. Te contactaremos por correo en 24hs.");
        }
    };

    // GENERADOR DE ESTILOS CSS EN VIVO (MOCKUP) - 100% Automático para SEO
    const shopStyles = useMemo(() => {
        if (isModePerfil) return {};

        const c = localConfig;
        const isDark = c.shopDarkMode;

        // 🎨 TEXTOS AUTOMÁTICOS POR SEO: Ya no se eligen a mano, garantizan contraste perfecto.
        const text = isDark ? '#ffffff' : '#0f172a';
        const subtext = isDark ? '#94a3b8' : '#64748b';

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
    }, [localConfig, isModePerfil]);
    // ==========================================
    // RENDERIZADO DEL COMPONENTE
    // ==========================================
    return (
        <div className={`settings-master-container ${isModePerfil ? 'mode-perfil' : ''}`}>

            {/* --- MODAL PLANTILLAS (Solo Vidriera) --- */}
            {showTemplatesModal && !isModePerfil && (
                <div className="modal-overlay" onClick={() => setShowTemplatesModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 style={{ margin: 0 }}>Galería de Plantillas</h2>
                            <button className="btn-close-modal" onClick={() => setShowTemplatesModal(false)}><SvgX /></button>
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
                    <h2 className="sidebar-title">{isModePerfil ? 'Cuenta' : 'Vidriera'}</h2>
                    <p className="sidebar-subtitle">{isModePerfil ? 'Seguridad y Privacidad' : 'Editor en Tiempo Real'}</p>
                </div>

                <nav className="sidebar-menu">
                    {/* MENÚ MODO PERFIL */}
                    {isModePerfil && (
                        <>
                            <button className={`sidebar-item ${activeTab === 'cuenta' ? 'active' : ''}`} onClick={() => setActiveTab('cuenta')}><SvgUser /> Perfil Público</button>
                            <button className={`sidebar-item ${activeTab === 'seguridad' ? 'active' : ''}`} onClick={() => setActiveTab('seguridad')}><SvgShieldAlert /> Seguridad</button>
                            <button className={`sidebar-item ${activeTab === 'notificaciones' ? 'active' : ''}`} onClick={() => setActiveTab('notificaciones')}><SvgBell /> Notificaciones</button>
                            <button className={`sidebar-item ${activeTab === 'preferencias' ? 'active' : ''}`} onClick={() => setActiveTab('preferencias')}><SvgSettings /> Preferencias</button>
                            <div style={{ margin: '15px 0', borderBottom: '1px solid var(--set-panel-border)' }}></div>
                            <button className={`sidebar-item danger-tab ${activeTab === 'danger' ? 'active' : ''}`} onClick={() => setActiveTab('danger')}><SvgAlertTriangle /> Zona de Peligro</button>
                        </>
                    )}

                    {/* MENÚ MODO VIDRIERA */}
                    {!isModePerfil && (
                        <>
                            <button className={`sidebar-item ${activeTab === 'general' ? 'active' : ''}`} onClick={() => setActiveTab('general')}><SvgText /> Identidad Visual</button>
                            <button className={`sidebar-item ${activeTab === 'diseno' ? 'active' : ''}`} onClick={() => setActiveTab('diseno')}><SvgPalette /> Tema y Colores</button>
                            <button className={`sidebar-item ${activeTab === 'multimedia' ? 'active' : ''}`} onClick={() => setActiveTab('multimedia')}><SvgImage /> Multimedia (Pro)</button>
                            <button className={`sidebar-item ${activeTab === 'modulos' ? 'active' : ''}`} onClick={() => setActiveTab('modulos')}><SvgModules /> Módulos Web</button>
                            <button className={`sidebar-item ${activeTab === 'seo' ? 'active' : ''}`} onClick={() => setActiveTab('seo')}><SvgLink /> SEO y Enlaces</button>
                            <button className={`sidebar-item ${activeTab === 'faq' ? 'active' : ''}`} onClick={() => setActiveTab('faq')}><SvgHelp /> Preguntas (FAQ)</button>
                            <button className={`sidebar-item ${activeTab === 'facturacion' ? 'active' : ''}`} onClick={() => setActiveTab('facturacion')}><SvgDollar /> Facturación</button>
                        </>
                    )}
                </nav>

                <div className="sidebar-footer">
                    <button className={`btn-primary-action ${isDirty ? 'active' : 'disabled'}`} onClick={handleSaveMaster} disabled={!isDirty || isSaving}>
                        {isSaving ? 'Guardando...' : (isDirty ? 'Guardar Cambios' : 'Todo al día')}
                    </button>
                </div>
            </aside>

            {/* --- COLUMNA 2: PANEL DE EDICIÓN --- */}
            <section className="settings-editor-panel">
                <header className="editor-panel-header">
                    <h3 className="editor-panel-title">
                        {isModePerfil && activeTab === 'cuenta' && 'Información de tu Cuenta'}
                        {isModePerfil && activeTab === 'seguridad' && 'Seguridad y Accesos'}
                        {isModePerfil && activeTab === 'notificaciones' && 'Avisos y Correos'}
                        {isModePerfil && activeTab === 'preferencias' && 'Configuración Local'}
                        {isModePerfil && activeTab === 'danger' && 'Zona de Peligro'}

                        {!isModePerfil && activeTab === 'general' && 'Textos de Vidriera'}
                        {!isModePerfil && activeTab === 'diseno' && 'Apariencia Visual'}
                        {!isModePerfil && activeTab === 'multimedia' && 'Archivos Multimedia'}
                        {!isModePerfil && activeTab === 'modulos' && 'Control de Secciones'}
                        {!isModePerfil && activeTab === 'seo' && 'Indexación y Rutas'}
                        {!isModePerfil && activeTab === 'faq' && 'Preguntas Frecuentes'}
                        {!isModePerfil && activeTab === 'facturacion' && 'Moneda del Sistema'}
                    </h3>
                </header>

                <div className="editor-scroll-content">

                    {/* ============================================================== */}
                    {/* ZONA DE PESTAÑAS: MODO PERFIL                                  */}
                    {/* ============================================================== */}

                    {/* TAB: CUENTA Y PERFIL */}
                    {isModePerfil && activeTab === 'cuenta' && (
                        <div className="form-section">
                            <h4 className="section-heading">Avatar de Usuario</h4>
                            <div className="avatar-upload-zone">
                                <div className="avatar-circle-large">
                                    {perfil.nombreArtistico ? perfil.nombreArtistico.substring(0, 2).toUpperCase() : 'WP'}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <button className="btn-outline" style={{ padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold' }}>Cambiar Foto</button>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--set-text-secondary)' }}>Recomendado: 500x500px, PNG o JPG.</span>
                                </div>
                            </div>

                            <h4 className="section-heading" style={{ marginTop: '20px' }}>Datos Públicos</h4>
                            <div className="input-group">
                                <label className="input-label">Nombre Real</label>
                                <input type="text" name="nombreCompleto" value={perfil.nombreCompleto} onChange={handleProfileChange} className="premium-input" placeholder="Ej: Juan Pérez" />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Nombre Artístico / Alias (Recomendado)</label>
                                <input type="text" name="nombreArtistico" value={perfil.nombreArtistico} onChange={handleProfileChange} className="premium-input" placeholder="Ej: FixMaster" />
                                <span className="input-hint">Este es el nombre que verán los clientes en la plataforma.</span>
                            </div>

                            <h4 className="section-heading" style={{ marginTop: '20px' }}>Contacto Interno</h4>
                            <div className="input-group">
                                <label className="input-label">Correo Electrónico (Solo Lectura)</label>
                                <input type="email" value={perfil.email} disabled className="premium-input" />
                                <span className="input-hint">Para cambiar tu correo de inicio de sesión, contacta a soporte.</span>
                            </div>
                        </div>
                    )}

                    {/* TAB: SEGURIDAD */}
                    {isModePerfil && activeTab === 'seguridad' && (
                        <div className="form-section">
                            <h4 className="section-heading">Contraseña</h4>
                            <div className="input-group">
                                <button className="btn-outline" style={{ padding: '12px', borderRadius: '10px', width: '100%', fontWeight: 'bold' }}>
                                    Enviar correo de recuperación de contraseña
                                </button>
                            </div>

                            <h4 className="section-heading" style={{ marginTop: '20px' }}>Autenticación en 2 Pasos (2FA)</h4>
                            <div className="premium-toggle-row">
                                <div className="toggle-text">
                                    <span className="toggle-title">Aplicación Autenticadora</span>
                                    <span className="toggle-desc">Usa Google Authenticator o Authy</span>
                                </div>
                                <label className="switch"><input type="checkbox" disabled /><span className="slider"></span></label>
                            </div>

                            <h4 className="section-heading" style={{ marginTop: '20px' }}>Sesiones Activas</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {sesionesActivas.map(sesion => (
                                    <div key={sesion.id} className="session-card">
                                        <div className="session-info">
                                            <span style={{ fontWeight: 'bold', color: 'var(--set-text-primary)' }}>{sesion.device}</span>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--set-text-secondary)' }}>{sesion.location} • {sesion.time}</span>
                                        </div>
                                        {sesion.current ? (
                                            <span style={{ fontSize: '0.8rem', color: 'var(--set-success)', fontWeight: 'bold', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 8px', borderRadius: '6px' }}>Actual</span>
                                        ) : (
                                            <button style={{ background: 'transparent', border: 'none', color: 'var(--set-danger)', cursor: 'pointer', fontWeight: 'bold' }}>Cerrar</button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button onClick={handleCerrarSesiones} className="btn-outline" style={{ padding: '10px', borderRadius: '10px', width: '100%', color: 'var(--set-danger)', borderColor: 'rgba(239, 68, 68, 0.3)', marginTop: '10px' }}>
                                Cerrar todas las demás sesiones
                            </button>
                        </div>
                    )}

                    {/* TAB: NOTIFICACIONES */}
                    {isModePerfil && activeTab === 'notificaciones' && (
                        <div className="form-section">
                            <h4 className="section-heading">Correos Electrónicos</h4>
                            <div className="premium-toggle-row">
                                <div className="toggle-text">
                                    <span className="toggle-title">Nuevos Tickets</span>
                                    <span className="toggle-desc">Avisar cuando un cliente crea una orden web</span>
                                </div>
                                <label className="switch">
                                    <input type="checkbox" name="notificacionesTickets" checked={preferencias.notificacionesTickets} onChange={handlePrefChange} />
                                    <span className="slider"></span>
                                </label>
                            </div>
                            <div className="premium-toggle-row">
                                <div className="toggle-text">
                                    <span className="toggle-title">Resumen Semanal</span>
                                    <span className="toggle-desc">Reporte financiero de caja los viernes</span>
                                </div>
                                <label className="switch">
                                    <input type="checkbox" name="notificacionesEmail" checked={preferencias.notificacionesEmail} onChange={handlePrefChange} />
                                    <span className="slider"></span>
                                </label>
                            </div>
                            <div className="premium-toggle-row">
                                <div className="toggle-text">
                                    <span className="toggle-title">Actualizaciones de Wepairr</span>
                                    <span className="toggle-desc">Nuevas funciones y mejoras del sistema</span>
                                </div>
                                <label className="switch">
                                    <input type="checkbox" defaultChecked />
                                    <span className="slider"></span>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* TAB: PREFERENCIAS */}
                    {isModePerfil && activeTab === 'preferencias' && (
                        <div className="form-section">
                            <h4 className="section-heading">Localización</h4>
                            <div className="input-group">
                                <label className="input-label">Idioma del Panel</label>
                                <select name="idioma" value={preferencias.idioma} onChange={handlePrefChange} className="premium-input">
                                    <option value="es">Español (Latinoamérica)</option>
                                    <option value="en">English (US)</option>
                                    <option value="pt">Português (Brasil)</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label className="input-label">Zona Horaria</label>
                                <select name="zonaHoraria" value={preferencias.zonaHoraria} onChange={handlePrefChange} className="premium-input">
                                    <option value="America/Argentina/Buenos_Aires">Buenos Aires (GMT-3)</option>
                                    <option value="America/Santiago">Santiago (GMT-4)</option>
                                    <option value="America/Bogota">Bogotá (GMT-5)</option>
                                    <option value="America/Mexico_City">Ciudad de México (GMT-6)</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* TAB: DANGER ZONE */}
                    {isModePerfil && activeTab === 'danger' && (
                        <div className="form-section">
                            <h4 className="section-heading">Exportación de Datos</h4>
                            <p style={{ fontSize: '0.9rem', color: 'var(--set-text-secondary)', marginBottom: '10px', lineHeight: '1.4' }}>Descarga una copia completa de todos tus tickets, clientes e inventario en formato CSV para tu respaldo personal.</p>
                            <button className="btn-outline" style={{ padding: '12px', borderRadius: '10px', width: '100%', fontWeight: 'bold' }}>Exportar Base de Datos (CSV)</button>

                            <h4 className="section-heading" style={{ marginTop: '30px' }}>Eliminar Cuenta</h4>
                            <div className="danger-zone-box">
                                <h4>Borrar Taller Definitivamente</h4>
                                <p>Esta acción es <strong>irreversible</strong>. Se eliminarán permanentemente todos tus tickets, historial de clientes, bases de datos financieras y tu vidriera web dejará de existir al instante.</p>
                                <button onClick={handleBorrarCuenta} className="btn-danger-outline">Eliminar mi cuenta</button>
                            </div>
                        </div>
                    )}

                    {/* ============================================================== */}
                    {/* ZONA DE PESTAÑAS: MODO VIDRIERA                                */}
                    {/* ============================================================== */}

                    {/* TAB: GENERAL (VIDRIERA) */}
                    {!isModePerfil && activeTab === 'general' && (
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
                                <label className="input-label">Descripción Corta</label>
                                <textarea name="descripcion" value={localConfig.descripcion || ''} onChange={handleChange} className="premium-input" maxLength={150} />
                                <span className="input-hint">Máximo 150 caracteres.</span>
                            </div>

                            <h4 className="section-heading" style={{ marginTop: '10px' }}>Contacto Directo</h4>
                            <div className="input-group">
                                <label className="input-label">WhatsApp (Número entero sin signos)</label>
                                <input type="text" name="whatsapp" value={localConfig.whatsapp || ''} onChange={handleChange} className="premium-input" placeholder="Ej: 5491123456789" />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Horarios de Atención</label>
                                <input type="text" name="horariosAtencion" value={localConfig.horariosAtencion || ''} onChange={handleChange} className="premium-input" placeholder="Lun-Vie 9 a 18hs" />
                            </div>

                            <PremiumGate isPremium={isPremium}>
                                <div className="premium-toggle-row" style={{ marginTop: '10px' }}>
                                    <div className="toggle-text">
                                        <span className="toggle-title">Feed de Instagram</span>
                                        <span className="toggle-desc">Muestra fotos recientes en tu web</span>
                                    </div>
                                    <label className="switch">
                                        <input type="checkbox" name="instagramConnected" checked={localConfig.instagramConnected || false} onChange={handleChange} />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                            </PremiumGate>
                        </div>
                    )}

                    {/* TAB: DISEÑO (VIDRIERA) */}
                    {!isModePerfil && activeTab === 'diseno' && (
                        <div className="form-section">
                            <button className="btn-primary-action btn-outline" onClick={() => setShowTemplatesModal(true)} style={{ marginBottom: '10px' }}>
                                Explorar Galería de Plantillas Rápidas
                            </button>

                            <h4 className="section-heading">Tema Base</h4>
                            <div className="premium-toggle-row">
                                <div className="toggle-text">
                                    <span className="toggle-title">Forzar Modo Oscuro</span>
                                    <span className="toggle-desc">El cliente verá la página con fondo oscuro.</span>
                                </div>
                                <label className="switch">
                                    <input type="checkbox" name="shopDarkMode" checked={localConfig.shopDarkMode || false} onChange={handleChange} />
                                    <span className="slider"></span>
                                </label>
                            </div>

                            <h4 className="section-heading" style={{ marginTop: '10px' }}>Paleta de Colores</h4>
                            <div className="input-group">
                                <label className="input-label">Color Principal (Acento)</label>
                                <div className="color-picker-container">
                                    <div className="color-palette">
                                        {ACCENT_COLORS.map(hex => (
                                            <div key={hex} onClick={() => setLocalConfig({ ...localConfig, colorTema: hex })} className={`color-swatch ${localConfig.colorTema === hex ? 'active' : ''}`} style={{ backgroundColor: hex }} />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <PremiumGate isPremium={isPremium}>
                                <h4 className="section-heading" style={{ marginTop: '20px' }}>Estructura Tipográfica</h4>
                                <div className="input-group">
                                    <label className="input-label">Fuente Principal</label>
                                    <select name="fontFamily" value={localConfig.fontFamily || FONTS[0].value} onChange={handleChange} className="premium-input">
                                        {FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Redondeo de Bordes (Global): {localConfig.borderRadius || '16px'}</label>
                                    <input type="range" min="0" max="40" value={parseInt(localConfig.borderRadius || '16')} onChange={(e) => setLocalConfig({ ...localConfig, borderRadius: `${e.target.value}px` })} style={{ width: '100%', marginTop: '10px' }} />
                                </div>
                            </PremiumGate>
                        </div>
                    )}

                    {/* TAB: MULTIMEDIA (VIDRIERA) */}
                    {!isModePerfil && activeTab === 'multimedia' && (
                        <div className="form-section">
                            <PremiumGate isPremium={isPremium}>
                                <h4 className="section-heading">Banner de Portada</h4>
                                <div className="input-group">
                                    <label className="input-label">URL de Imagen o Subida Local</label>
                                    <div className="upload-group">
                                        <input type="text" name="bannerUrl" value={localConfig.bannerUrl || ''} onChange={handleChange} className="premium-input" placeholder="https://..." style={{ borderRadius: '10px 0 0 10px', flex: 1 }} />
                                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" style={{ display: 'none' }} />
                                        <button type="button" className="upload-btn" onClick={triggerFileInput} style={{ borderRadius: '0 10px 10px 0' }}><SvgUpload /> Explorar</button>
                                    </div>
                                </div>

                                <h4 className="section-heading" style={{ marginTop: '20px' }}>Video Promocional</h4>
                                <div className="input-group">
                                    <label className="input-label">Enlace de YouTube</label>
                                    <input type="url" name="videoUrl" value={localConfig.videoUrl || ''} onChange={handleChange} className="premium-input" placeholder="https://youtube.com/watch?v=..." />
                                </div>
                            </PremiumGate>
                        </div>
                    )}

                    {/* TAB: MODULOS (VIDRIERA) */}
                    {!isModePerfil && activeTab === 'modulos' && (
                        <div className="form-section">
                            <h4 className="section-heading">Activar / Desactivar Bloques</h4>
                            <div className="premium-toggle-row">
                                <div className="toggle-text">
                                    <span className="toggle-title">Rastreo de Equipo</span>
                                    <span className="toggle-desc">Permite buscar estado por N° de Orden</span>
                                </div>
                                <label className="switch">
                                    <input type="checkbox" name="mostrarTracking" checked={localConfig.mostrarTracking !== false} onChange={handleChange} />
                                    <span className="slider"></span>
                                </label>
                            </div>
                            <div className="premium-toggle-row">
                                <div className="toggle-text">
                                    <span className="toggle-title">Cotizador de Servicios</span>
                                    <span className="toggle-desc">Tarjetas de reparaciones frecuentes</span>
                                </div>
                                <label className="switch">
                                    <input type="checkbox" name="mostrarPresupuestador" checked={localConfig.mostrarPresupuestador !== false} onChange={handleChange} />
                                    <span className="slider"></span>
                                </label>
                            </div>
                            <PremiumGate isPremium={isPremium}>
                                <div className="premium-toggle-row">
                                    <div className="toggle-text">
                                        <span className="toggle-title">Sello de Garantía</span>
                                        <span className="toggle-desc">Insignia de confianza en el Header</span>
                                    </div>
                                    <label className="switch">
                                        <input type="checkbox" name="mostrarGarantia" checked={localConfig.mostrarGarantia !== false} onChange={handleChange} />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                                {localConfig.mostrarGarantia && (
                                    <div className="input-group" style={{ paddingLeft: '15px', borderLeft: '2px solid var(--set-accent)' }}>
                                        <label className="input-label">Texto Público de Garantía</label>
                                        <input type="text" name="tiempoGarantia" value={localConfig.tiempoGarantia || ''} onChange={handleChange} className="premium-input" placeholder="Ej: 90 Días Cubiertos" />
                                    </div>
                                )}
                            </PremiumGate>
                        </div>
                    )}

                    {/* TAB: SEO (VIDRIERA) */}
                    {!isModePerfil && activeTab === 'seo' && (
                        <div className="form-section">
                            <h4 className="section-heading">Posicionamiento Web</h4>
                            <div className="input-group">
                                <label className="input-label">URL Oficial de tu Negocio (Slug)</label>
                                <div className="upload-group" style={{ display: 'flex' }}>
                                    <span style={{ padding: '12px 16px', background: 'var(--set-input-border)', borderRadius: '10px 0 0 10px', fontSize: '0.95rem', fontWeight: 'bold' }}>/taller/</span>
                                    <input type="text" name="slug" value={localConfig.slug || ''} onChange={handleChange} className="premium-input" style={{ borderRadius: '0 10px 10px 0', flex: 1 }} placeholder="mi-negocio-pro" />
                                </div>
                            </div>
                            <div className="premium-toggle-row" style={{ marginTop: '10px' }}>
                                <div className="toggle-text">
                                    <span className="toggle-title">Permitir Indexación</span>
                                    <span className="toggle-desc">Aparecer en los resultados de Google</span>
                                </div>
                                <label className="switch">
                                    <input type="checkbox" name="indexarGoogle" checked={localConfig.indexarGoogle !== false} onChange={handleChange} />
                                    <span className="slider"></span>
                                </label>
                            </div>
                            <div className="input-group" style={{ marginTop: '10px' }}>
                                <label className="input-label">Meta Descripción (Para Google)</label>
                                <textarea name="metaDescripcion" value={localConfig.metaDescripcion || ''} onChange={handleChange} className="premium-input" maxLength={160} placeholder="Escribe un breve resumen de tu taller..." />
                            </div>
                        </div>
                    )}

                    {/* TAB: FAQ (VIDRIERA) */}
                    {!isModePerfil && activeTab === 'faq' && (
                        <div className="form-section">
                            <h4 className="section-heading">Gestor de Preguntas Frecuentes</h4>
                            {(localConfig.faqs || []).map((faq, idx) => (
                                <div key={idx} className="faq-card">
                                    <button className="faq-delete-btn" onClick={() => handleRemoveFaq(idx)}><SvgTrash /></button>
                                    <div className="input-group" style={{ paddingRight: '30px' }}>
                                        <label className="input-label">Pregunta</label>
                                        <input type="text" value={faq.pregunta} onChange={(e) => handleChangeFaq(idx, 'pregunta', e.target.value)} className="premium-input" placeholder="Ej: ¿Hacen envíos a domicilio?" />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Respuesta</label>
                                        <textarea value={faq.respuesta} onChange={(e) => handleChangeFaq(idx, 'respuesta', e.target.value)} className="premium-input" style={{ minHeight: '60px' }} />
                                    </div>
                                </div>
                            ))}
                            <button className="btn-primary-action btn-outline" onClick={handleAddFaq}><SvgPlus /> Nueva Pregunta</button>
                        </div>
                    )}

                    {/* TAB: FACTURACIÓN (VIDRIERA) */}
                    {!isModePerfil && activeTab === 'facturacion' && (
                        <div className="form-section">
                            <h4 className="section-heading">Configuración Financiera Local</h4>
                            <div className="input-group">
                                <label className="input-label">Moneda del Sistema</label>
                                <select name="moneda" value={localConfig.moneda || 'ARS'} onChange={handleChange} className="premium-input">
                                    {CURRENCY_OPTIONS.map(c => <option key={c.code} value={c.code}>{c.label} ({c.code})</option>)}
                                </select>
                            </div>
                            <div className="input-group">
                                <label className="input-label">Tasa de Impuesto Local / IVA (%)</label>
                                <input type="number" name="impuesto" value={localConfig.impuesto || 21} onChange={handleChange} className="premium-input" />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Prefijo de Orden de Trabajo</label>
                                <input type="text" name="prefijoTickets" value={localConfig.prefijoTickets || 'WEP'} onChange={handleChange} className="premium-input" maxLength={5} style={{ textTransform: 'uppercase' }} />
                                <span className="input-hint">Tus tickets se guardarán con el formato: {localConfig.prefijoTickets || 'WEP'}-1024</span>
                            </div>
                        </div>
                    )}

                </div>
            </section>

            {/* --- COLUMNA 3: LIENZO Y MOCKUP (ESCALADO PERFECTO) --- */}
            {/* Solo se renderiza si no estamos en Modo Perfil */}
            {!isModePerfil && (
                <section className="settings-preview-canvas">
                    <div className="canvas-toolbar">
                        <button className={`device-btn ${previewMode === 'mobile' ? 'active' : ''}`} onClick={() => handlePreviewChange('mobile')}><SvgPhone /> Celular</button>
                        <button className={`device-btn ${previewMode === 'desktop' ? 'active' : ''}`} onClick={() => handlePreviewChange('desktop')}><SvgMonitorDevice /> Monitor</button>
                    </div>

                    <div className="preview-stage-wrapper">
                        <div className={`mockup-animator ${isAnimatingPreview ? 'hidden' : ''}`}>
                            <div className={previewMode === 'mobile' ? 'iphone-frame' : 'desktop-frame'}>

                                {/* DETALLES DE HARDWARE FÍSICO */}
                                {previewMode === 'mobile' && <div className="iphone-notch"></div>}
                                {previewMode === 'desktop' && (
                                    <div className="mac-titlebar">
                                        <div className="mac-dot" style={{ background: '#ff5f56' }}></div>
                                        <div className="mac-dot" style={{ background: '#ffbd2e' }}></div>
                                        <div className="mac-dot" style={{ background: '#27c93f' }}></div>
                                        <div style={{ marginLeft: 'auto', marginRight: 'auto', fontSize: '0.8rem', color: 'var(--set-text-secondary)', background: 'var(--set-input-bg)', padding: '4px 60px', borderRadius: '6px', fontWeight: 'bold' }}>{localConfig.slug || 'mitaller'}.wepairr.com</div>
                                    </div>
                                )}

                                {/* PANTALLA INTERNA: VIDRIERA REAL EN VIVO */}
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
                                                <p className="lp-desc">{localConfig.descripcion || 'Breve descripción de lo que haces en tu taller día a día.'}</p>

                                                {localConfig.horariosAtencion && (
                                                    <div style={{ color: 'var(--hero-subtext-color)', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(0,0,0,0.1)', borderRadius: '99px', fontSize: '0.85rem', fontWeight: '700', marginBottom: '24px' }}>
                                                        <SvgClock /> {localConfig.horariosAtencion}
                                                    </div>
                                                )}

                                                <button className="lp-btn">Solicitar Reparación</button>

                                                {localConfig.mostrarGarantia && isPremium && localConfig.tiempoGarantia && (
                                                    <div style={{ marginTop: '24px', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', borderRadius: '99px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', fontWeight: '800', fontSize: '0.85rem' }}>
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
                                                <h2 style={{ fontSize: '1.8rem', fontWeight: '900', textAlign: 'center', marginBottom: '30px', color: 'var(--shop-text)' }}>Servicios Destacados</h2>
                                                <div className="lp-grid">
                                                    <div className="lp-card"><div style={{ color: 'var(--shop-accent-icon)' }}><SvgPhone width="32" height="32" /></div><span style={{ color: 'var(--shop-text-secondary)' }}>Pantallas</span></div>
                                                    <div className="lp-card"><div style={{ color: 'var(--shop-accent-icon)' }}><SvgBattery width="32" height="32" /></div><span style={{ color: 'var(--shop-text-secondary)' }}>Baterías</span></div>
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

        </div>
    );
}