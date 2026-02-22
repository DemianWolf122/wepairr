import React, { useMemo, useState } from 'react';
import './ClientReception.css';

const SvgBuilding = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path></svg>;
const SvgCheckShield = () => <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>;
const SvgClock = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const SvgPhone = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect></svg>;
const SvgBattery = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><rect x="2" y="7" width="16" height="10" rx="2" ry="2"></rect></svg>;
const SvgWhatsApp = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>;
const SvgMenu = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
const SvgMapPin = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>;

const getLuminance = (hex) => {
    if (!hex) return 0;
    let c = hex.replace('#', ''); if (c.length === 3) c = c.split('').map(x => x + x).join(''); let rgb = parseInt(c, 16); if (isNaN(rgb)) return 0;
    let r = (rgb >> 16) & 0xff, g = (rgb >> 8) & 0xff, b = (rgb >> 0) & 0xff;
    let a = [r, g, b].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

const getContrastRatio = (hex1, hex2) => { const l1 = getLuminance(hex1), l2 = getLuminance(hex2); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };

function ClientReception({ config }) {
    const isPremium = config.plan === 'premium';
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const shopStyles = useMemo(() => {
        const accent = config.colorTema || '#2563eb';
        const isDarkMode = config.shopDarkMode;
        const hasBanner = !!config.bannerUrl && isPremium;

        const autoBtnText = getLuminance(accent) > 0.179 ? '#000000' : '#ffffff';
        let safeIconColor = accent;
        const bgLuminance = getLuminance(isDarkMode ? '#090e17' : '#ffffff');
        if (getContrastRatio(safeIconColor, bgLuminance) < 3.0) {
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
    }, [config]);

    const getEmbedUrl = (url) => {
        if (!url) return null;
        if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/');
        if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'youtube.com/embed/');
        return url;
    };

    return (
        <div className="public-shop-wrapper" style={shopStyles}>
            <div className="shop-nav">
                <span className="shop-logo">{config.nombreNegocio}</span>
                <div className="shop-nav-links"><span>Inicio</span> <span>Servicios</span></div>
                <div className="shop-menu-icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}><SvgMenu /></div>
                {mobileMenuOpen && (<div className="mobile-nav-dropdown"><span>Inicio</span><span>Servicios</span></div>)}
            </div>

            <div className="shop-hero" style={config.bannerUrl && isPremium ? { backgroundImage: `url(${config.bannerUrl})` } : {}}>
                <div className="shop-hero-overlay" style={{ background: 'var(--hero-overlay)' }}></div>
                <div className="shop-hero-content animate-pop-in">
                    <div className="shop-avatar-placeholder"><SvgBuilding /></div>
                    <h1 className="shop-title" style={{ color: 'var(--hero-text-color)' }}>{config.titulo}</h1>
                    <p className="shop-desc" style={{ color: 'var(--hero-subtext-color)' }}>{config.descripcion}</p>

                    {config.horariosAtencion && (
                        <div className="shop-hours-hero" style={{ color: 'var(--hero-subtext-color)' }}>
                            <SvgClock /> {config.horariosAtencion}
                        </div>
                    )}

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
                        <h3 style={{ margin: '0 0 10px 0', fontSize: '1.5rem', color: 'var(--shop-text)' }}>Seguimiento de Equipo</h3>
                        <p style={{ fontSize: '1rem', color: 'var(--shop-text-secondary)', marginBottom: '20px' }}>Ingresá tu N° de orden para ver el estado.</p>
                        <div className="tracking-input-group">
                            <input type="text" placeholder="#12345" />
                            <button className="shop-cta-btn">Buscar</button>
                        </div>
                    </div>
                </div>
            )}

            {config.mostrarPresupuestador !== false && (
                <div className="shop-section">
                    <h2 className="shop-section-title">Cotizar Reparación</h2>
                    <div className="shop-services-grid">
                        <div className="shop-service-card"><div className="service-icon" style={{ color: 'var(--shop-accent-icon)' }}><SvgPhone /></div><span>Pantallas</span></div>
                        <div className="shop-service-card"><div className="service-icon" style={{ color: 'var(--shop-accent-icon)' }}><SvgBattery /></div><span>Baterías</span></div>
                    </div>
                </div>
            )}

            {config.videoUrl && isPremium && getEmbedUrl(config.videoUrl) && (
                <div className="shop-section" style={{ background: 'var(--shop-bg-secondary)' }}>
                    <h2 className="shop-section-title">Presentación</h2>
                    <div className="shop-video-container">
                        <iframe src={getEmbedUrl(config.videoUrl)} title="Video" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                    </div>
                </div>
            )}

            {config.mostrarMapa && isPremium && config.mapaUrl && (
                <div className="shop-section" style={{ background: 'var(--shop-bg-secondary)' }}>
                    <h2 className="shop-section-title">Nuestra Ubicación</h2>
                    <div className="shop-map-preview">
                        <SvgMapPin style={{ color: 'var(--shop-accent)', width: '40px', height: '40px' }} />
                        <p style={{ margin: '15px 0', fontSize: '1.1rem', color: 'var(--shop-text-secondary)' }}>Encuéntranos en Google Maps</p>
                        <a href={config.mapaUrl} target="_blank" rel="noopener noreferrer" className="shop-secondary-btn" style={{ textDecoration: 'none' }}>Ver Ubicación Exacta</a>
                    </div>
                </div>
            )}

            <div className="shop-footer">
                <p>© 2024 {config.nombreNegocio}.</p>
            </div>

            {config.whatsapp && (
                <a href={`https://wa.me/${config.whatsapp}`} target="_blank" rel="noreferrer" className="floating-wa-btn-public"><SvgWhatsApp /></a>
            )}
        </div>
    );
}

export default ClientReception;