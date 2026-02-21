import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

// Recibimos las propiedades del tema desde App.jsx
function Home({ theme, toggleTheme }) {
    return (
        <div className="home-wrapper">
            <nav className="home-nav">
                <div className="home-logo">Wepairr<span>.</span></div>
                <div className="home-links">
                    {/* BOTÓN DE TEMA EN LA HOME */}
                    <button onClick={toggleTheme} className="theme-toggle-btn" title="Cambiar Tema" style={{ marginRight: '15px' }}>
                        {theme === 'dark' ? '☀️' : '🌙'}
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