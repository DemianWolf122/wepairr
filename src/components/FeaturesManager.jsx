import React, { useState } from 'react';
import './FeaturesManager.css';

// SVGs para los módulos
const SvgFaq = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
const SvgCalendar = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
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
                <button className={`feature-nav-btn ${activeModule === 'turnos' ? 'active' : ''}`} onClick={() => setActiveModule('turnos')}>
                    <SvgCalendar /> Agenda de Turnos
                </button>
                <button className={`feature-nav-btn ${activeModule === 'presupuestos' ? 'active' : ''}`} onClick={() => setActiveModule('presupuestos')}>
                    <SvgMoney /> Presupuestador
                </button>
            </div>

            <div className="feature-content-area glass-effect">
                {activeModule === 'faq' && (
                    <div className="module-placeholder">
                        <h2>Gestor de Preguntas Frecuentes</h2>
                        <p>Aquí podrás agregar, editar y eliminar las preguntas y respuestas que aparecen en tu vidriera.</p>
                        <div style={{ marginTop: '30px', padding: '30px', border: '2px dashed var(--border-glass)', borderRadius: '12px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            Próximamente: Editor Drag & Drop de FAQs
                        </div>
                    </div>
                )}
                {activeModule === 'turnos' && (
                    <div className="module-placeholder">
                        <h2>Configuración de Agenda</h2>
                        <p>Define tus horarios de atención, duración de los turnos y días disponibles.</p>
                        <div style={{ marginTop: '30px', padding: '30px', border: '2px dashed var(--border-glass)', borderRadius: '12px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            Próximamente: Calendario Interactivo
                        </div>
                    </div>
                )}
                {activeModule === 'presupuestos' && (
                    <div className="module-placeholder">
                        <h2>Lista de Precios Base</h2>
                        <p>Carga los costos estimados de tus servicios más comunes para el presupuestador online.</p>
                        <div style={{ marginTop: '30px', padding: '30px', border: '2px dashed var(--border-glass)', borderRadius: '12px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            Próximamente: Tabla de Precios Dinámica
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FeaturesManager;