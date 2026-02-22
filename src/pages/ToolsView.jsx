import React, { useState } from 'react';
import './ToolsView.css';

const SvgZap = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;

function ToolsView() {
    const [voltaje, setVoltaje] = useState('');
    const [resistencia, setResistencia] = useState('');
    const [corriente, setCorriente] = useState('');

    const calcularOhm = () => {
        if (voltaje && resistencia) setCorriente((parseFloat(voltaje) / parseFloat(resistencia)).toFixed(4));
        else if (voltaje && corriente) setResistencia((parseFloat(voltaje) / parseFloat(corriente)).toFixed(2));
        else if (corriente && resistencia) setVoltaje((parseFloat(corriente) * parseFloat(resistencia)).toFixed(2));
    };
    const limpiarCalculadora = () => { setVoltaje(''); setResistencia(''); setCorriente(''); };

    return (
        <div className="tools-wrapper animate-fade-in">
            <header className="tools-header">
                <h2>Herramientas de Taller</h2>
                <p>Utilidades avanzadas para diagnóstico.</p>
            </header>
            <div className="tools-grid">
                <div className="tool-card glass-effect">
                    <div className="tool-card-header"><div className="tool-icon"><SvgZap /></div><h3>Calculadora Ley de Ohm</h3></div>
                    <p className="tool-desc">Ingresa 2 valores para calcular el tercero.</p>
                    <div className="ohm-calculator">
                        <div className="ohm-input-group"><label>Voltaje (V)</label><input type="number" value={voltaje} onChange={e => setVoltaje(e.target.value)} placeholder="0" /></div>
                        <div className="ohm-input-group"><label>Resistencia (Ω)</label><input type="number" value={resistencia} onChange={e => setResistencia(e.target.value)} placeholder="0" /></div>
                        <div className="ohm-input-group"><label>Corriente (A)</label><input type="number" value={corriente} onChange={e => setCorriente(e.target.value)} placeholder="0" /></div>
                        <div className="ohm-actions">
                            <button onClick={calcularOhm} className="btn-tool-action">Calcular</button>
                            <button onClick={limpiarCalculadora} className="btn-tool-ghost">Limpiar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ToolsView;