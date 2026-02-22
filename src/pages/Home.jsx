import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const MoonIcon = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>;
const SunIcon = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>;

function Home({ theme, toggleTheme }) {
    return (
        <div className="home-wrapper">
            <nav className="home-nav glass-effect">
                <div className="home-logo">Wepairr</div>
                <div className="home-nav-links">
                    <button onClick={toggleTheme} className="theme-toggle-btn">
                        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                    </button>
                    <Link to="/login" className="nav-btn-outline">Acceso Técnicos</Link>
                </div>
            </nav>

            <main className="home-hero">
                <div className="hero-content animate-pop-in">
                    <h1 className="hero-title">El ecosistema definitivo para Servicios Técnicos.</h1>
                    <p className="hero-subtitle">Gestiona reparaciones, controla stock, recibe clientes online y accede a esquemáticos. Todo en una sola plataforma premium.</p>
                    <div className="hero-actions">
                        <Link to="/dashboard" className="hero-btn-primary">Ir a mi Workspace</Link>
                        <Link to="/directorio" className="hero-btn-secondary">Buscar un Taller</Link>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Home;