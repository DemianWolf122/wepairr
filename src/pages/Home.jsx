import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
    return (
        <div className="home-wrapper">
            {/* Barra de Navegación de Wepairr */}
            <nav className="home-nav">
                <div className="home-logo">Wepairr<span>.</span></div>
                <div className="home-links">
                    <Link to="/login" className="btn-login-nav">Iniciar Sesión</Link>
                </div>
            </nav>

            {/* Sección Principal (Hero) */}
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