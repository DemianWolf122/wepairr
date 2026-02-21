import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

// ICONO CORPORATIVO MINIMALISTA (Círculo de Contraste)
const ContrastIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 2a10 10 0 0 0 0 20z" fill="currentColor"></path>
    </svg>
);

function Home({ theme, toggleTheme }) {
    return (
        <div className="home-wrapper">
            <nav className="home-nav">
                <div className="home-logo">Wepairr<span>.</span></div>
                <div className="home-links">
                    <button type="button" onClick={toggleTheme} className="theme-toggle-btn" title="Cambiar Tema" style={{ marginRight: '15px' }}>
                        <ContrastIcon />
                    </button>
                    <Link to="/login" className="btn-login-nav">Iniciar Sesión</Link>
                </div>
            </nav>

            <main className="home-hero">
                <div className="hero-content">
                    <h1 className="hero-title">El sistema operativo para servicios técnicos.</h1>
                    <p className="hero-desc">
                        Gestioná tus reparaciones, automatizá presupuestos con IA y dale a tus clientes una experiencia premium de marca blanca.
                    </p>
                    <div className="hero-actions">
                        <Link to="/dashboard" className="btn-primary-hero">Crear mi Taller Gratis</Link>
                        <Link to="/taller/electro-fix" className="btn-secondary-hero">Ver Demo de Vidriera</Link>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Home;