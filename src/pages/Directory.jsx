import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Directory.css';

// Base de datos de prueba para el Marketplace
const TECNICOS_MOCK = [
    { id: 'electro-fix', nombre: 'ElectroFix', region: 'Buenos Aires', especialidad: 'Apple & Samsung', rating: 4.8, reviews: 124, logo: '📱' },
    { id: 'tecno-mar', nombre: 'TecnoMar', region: 'Mar del Plata', especialidad: 'Microelectrónica', rating: 4.9, reviews: 89, logo: '🔬' },
    { id: 'cordoba-repairs', nombre: 'Cba Repairs', region: 'Córdoba', especialidad: 'Consolas y PC', rating: 4.5, reviews: 42, logo: '🎮' },
    { id: 'rosario-fix', nombre: 'RosarioFix', region: 'Santa Fe', especialidad: 'Multimarca', rating: 3.9, reviews: 15, logo: '🔧' },
    { id: 'wepairr-demo', nombre: 'Wepairr Tech (Demo)', region: 'Buenos Aires', especialidad: 'Laboratorio Avanzado', rating: 5.0, reviews: 312, logo: '⚡' }
];

function Directory({ theme, toggleTheme }) {
    const [regionSeleccionada, setRegionSeleccionada] = useState('Todas');

    const regionesDisponibles = ['Todas', 'Buenos Aires', 'Mar del Plata', 'Córdoba', 'Santa Fe'];

    const tecnicosFiltrados = regionSeleccionada === 'Todas'
        ? TECNICOS_MOCK
        : TECNICOS_MOCK.filter(t => t.region === regionSeleccionada);

    return (
        <div className="directory-wrapper">
            <nav className="home-nav">
                <div className="home-logo"><Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Wepairr<span>.</span></Link></div>
                <div className="home-links">
                    <button type="button" onClick={(e) => { e.preventDefault(); toggleTheme(); }} className="theme-toggle-btn" style={{ marginRight: '15px' }}>
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>
                    <Link to="/login" className="btn-login-nav">Soy Técnico</Link>
                </div>
            </nav>

            <main className="directory-content">
                <header className="directory-header">
                    <h1>Encontrá a los mejores expertos.</h1>
                    <p>Filtrá por tu ubicación y guiáte por las opiniones reales de otros clientes.</p>

                    {/* Filtro de Región (No es buscador de texto) */}
                    <div className="region-filter-glass">
                        <label>📍 Mi Región:</label>
                        <select
                            value={regionSeleccionada}
                            onChange={(e) => setRegionSeleccionada(e.target.value)}
                            className="region-select"
                        >
                            {regionesDisponibles.map(reg => (
                                <option key={reg} value={reg}>{reg}</option>
                            ))}
                        </select>
                    </div>
                </header>

                <div className="directory-grid">
                    {tecnicosFiltrados.map(tecnico => (
                        <div key={tecnico.id} className="tech-directory-card glass-effect">
                            <div className="tech-card-header">
                                <span className="tech-logo-avatar">{tecnico.logo}</span>
                                <div>
                                    <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2rem' }}>{tecnico.nombre}</h3>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>📍 {tecnico.region}</span>
                                </div>
                            </div>

                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: '15px 0' }}>
                                Especialidad: <strong>{tecnico.especialidad}</strong>
                            </p>

                            <div className="tech-rating-box">
                                <div className="stars">
                                    <span className="star-icon">★</span>
                                    <span className="rating-number">{tecnico.rating}</span>
                                </div>
                                <span className="reviews-count">({tecnico.reviews} opiniones)</span>
                            </div>

                            <Link to={`/taller/${tecnico.id}`} className="btn-visit-shop">
                                Visitar Vidriera
                            </Link>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default Directory;