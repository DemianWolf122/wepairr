import React, { useState } from 'react';
import './FeaturesManager.css';

const SvgFaq = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
const SvgMoney = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;

function FeaturesManager({ config, onUpdate }) {
    const [activeModule, setActiveModule] = useState('faq');

    return (
        <div className="features-manager-wrapper animate-fade-in">
            <div className="features-sidebar-nav">
                <h3>Módulos Activos</h3>
                <p className="features-nav-subtitle">Configura el contenido de tus herramientas.</p>
                <button className={`feature-nav-btn ${activeModule === 'faq' ? 'active' : ''}`} onClick={() => setActiveModule('faq')}>
                    <SvgFaq /> Preguntas Frecuentes (FAQ)
                </button>
                <button className={`feature-nav-btn ${activeModule === 'presupuestos' ? 'active' : ''}`} onClick={() => setActiveModule('presupuestos')}>
                    <SvgMoney /> Precios y Presupuestos
                </button>
            </div>

            <div className="feature-content-area glass-effect">
                {activeModule === 'faq' && (
                    <div className="module-placeholder">
                        <h2>Gestor de Preguntas Frecuentes</h2>
                        <p>Agrega las preguntas más comunes de tus clientes para que se muestren en tu vidriera.</p>
                        <div className="placeholder-box">Módulo en Desarrollo: Editor Drag & Drop de FAQs</div>
                    </div>
                )}
                {activeModule === 'presupuestos' && (
                    <div className="module-placeholder">
                        <h2>Lista de Precios Base</h2>
                        <p>Carga los costos estimados para el presupuestador online.</p>
                        <div className="placeholder-box">Módulo en Desarrollo: Tabla de Precios Dinámica</div>
                    </div>
                )}
            </div>
        </div>
    );
}
export default FeaturesManager;