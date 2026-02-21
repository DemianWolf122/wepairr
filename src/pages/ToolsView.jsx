import React, { useState } from 'react';
import './ToolsView.css';

// SVGs Minimalistas
const SvgMap = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>;
const SvgZap = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;
const SvgSearch = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;

function ToolsView() {
    // Calculadora de Ley de Ohm
    const [voltaje, setVoltaje] = useState('');
    const [resistencia, setResistencia] = useState('');
    const [corriente, setCorriente] = useState('');

    const calcularOhm = () => {
        if (voltaje && resistencia) setCorriente((parseFloat(voltaje) / parseFloat(resistencia)).toFixed(4));
        else if (voltaje && corriente) setResistencia((parseFloat(voltaje) / parseFloat(corriente)).toFixed(2));
        else if (corriente && resistencia) setVoltaje((parseFloat(corriente) * parseFloat(resistencia)).toFixed(2));
    };

    const limpiarCalculadora = () => { setVoltaje(''); setResistencia(''); setCorriente(''); };

    // Buscador de Datasheets
    const [componente, setComponente] = useState('');
    const buscarDatasheet = (e) => {
        e.preventDefault();
        if (componente) window.open(`https://www.alldatasheet.com/view.jsp?Searchword=${componente}`, '_blank');
    };

    return (
        <div className="tools-wrapper">
            <header className="tools-header">
                <h2>Herramientas de Taller</h2>
                <p>Utilidades avanzadas para diagnóstico y microelectrónica.</p>
            </header>

            <div className="tools-grid">

                {/* TOOL 1: Visor de Planos */}
                <div className="tool-card glass-effect">
                    <div className="tool-card-header">
                        <div className="tool-icon"><SvgMap /></div>
                        <h3>Visor de Esquemas (Boardviews)</h3>
                    </div>
                    <p className="tool-desc">Carga PDFs o archivos de esquemáticos para analizar las líneas de la placa base.</p>
                    <div className="upload-zone">
                        <span style={{ fontSize: '2rem', marginBottom: '10px', display: 'block' }}>📄</span>
                        <p>Arrastra tu PDF/Boardview aquí</p>
                        <button className="btn-tool-action">Seleccionar Archivo</button>
                    </div>
                </div>

                {/* TOOL 2: Calculadora Ley de Ohm */}
                <div className="tool-card glass-effect">
                    <div className="tool-card-header">
                        <div className="tool-icon"><SvgZap /></div>
                        <h3>Calculadora Ley de Ohm</h3>
                    </div>
                    <p className="tool-desc">Ingresa 2 valores para calcular el tercero automáticamente.</p>

                    <div className="ohm-calculator">
                        <div className="ohm-input-group">
                            <label>Voltaje (V)</label>
                            <input type="number" value={voltaje} onChange={e => setVoltaje(e.target.value)} placeholder="Ej. 5.0" />
                        </div>
                        <div className="ohm-input-group">
                            <label>Resistencia (Ω)</label>
                            <input type="number" value={resistencia} onChange={e => setResistencia(e.target.value)} placeholder="Ej. 1000" />
                        </div>
                        <div className="ohm-input-group">
                            <label>Corriente (A)</label>
                            <input type="number" value={corriente} onChange={e => setCorriente(e.target.value)} placeholder="Ej. 0.005" />
                        </div>
                        <div className="ohm-actions">
                            <button onClick={calcularOhm} className="btn-tool-action">Calcular</button>
                            <button onClick={limpiarCalculadora} className="btn-tool-ghost">Limpiar</button>
                        </div>
                    </div>
                </div>

                {/* TOOL 3: Buscador de Datasheets */}
                <div className="tool-card glass-effect">
                    <div className="tool-card-header">
                        <div className="tool-icon"><SvgSearch /></div>
                        <h3>Buscador de Datasheets</h3>
                    </div>
                    <p className="tool-desc">Encuentra hojas de datos de ICs, Mosfets y componentes SMD al instante.</p>

                    <form onSubmit={buscarDatasheet} className="datasheet-form">
                        <input
                            type="text"
                            value={componente}
                            onChange={e => setComponente(e.target.value)}
                            placeholder="Ej. BQ24193, MAX77838..."
                            className="datasheet-input"
                        />
                        <button type="submit" className="btn-tool-action" style={{ width: '100%' }}>Buscar Datasheet →</button>
                    </form>
                </div>

            </div>
        </div>
    );
}

export default ToolsView;