import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

// ICONOS SVG CORPORATIVOS
const MoonIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
);

const SunIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
);

function Home({ theme, toggleTheme }) {
    return (
        <div className="home-wrapper">
            <nav className="home-nav">
                <div className="home-logo">Wepairr<span>.</span></div>
                <div className="home-links">
                    <button type="button" onClick={(e) => { e.preventDefault(); toggleTheme(); }} className="theme-toggle-btn" title="Cambiar Tema" style={{ marginRight: '15px' }}>
                        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                    </button>
                    <Link to="/login" className="btn-login-nav">Soy Técnico</Link>
                </div>
            </nav>

            <main className="home-hero">
                <div className="hero-content">
                    <h1 className="hero-title">El sistema operativo para servicios técnicos.</h1>
                    <p className="hero-desc">
                        Gestioná tus reparaciones, automatizá presupuestos con IA y dale a tus clientes una experiencia premium de marca blanca.
                    </p>
                    <div className="hero-actions">
                        {/* BOTONES ACTUALIZADOS PARA EL MARKETPLACE */}
                        <Link to="/directorio" className="btn-primary-hero">Buscar un Técnico</Link>
                        <Link to="/dashboard" className="btn-secondary-hero">Crear mi Taller Gratis</Link>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Home;