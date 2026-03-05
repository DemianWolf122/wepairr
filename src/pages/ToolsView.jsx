import React, { useState } from 'react';
import './ToolsView.css';

const SvgZap = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;
const SvgDollar = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
const SvgMessage = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>;
const SvgSettings = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2-2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;

function ToolsView() {
    // ESTADOS: CALCULADORA MÁRGENES
    const [costo, setCosto] = useState('');
    const [venta, setVenta] = useState('');

    // ESTADOS: LEY DE OHM
    const [voltaje, setVoltaje] = useState('');
    const [corriente, setCorriente] = useState('');
    const [resistencia, setResistencia] = useState('');

    // ESTADOS: WHATSAPP DIRECTO
    const [waNumero, setWaNumero] = useState('');
    const [waMensaje, setWaMensaje] = useState('');

    // CALCULAR MARGEN
    const margenNeto = costo && venta ? ((venta - costo) / venta) * 100 : 0;
    const gananciaNeta = costo && venta ? venta - costo : 0;

    // CALCULAR OHM
    const calcularOhm = () => {
        let v = parseFloat(voltaje);
        let i = parseFloat(corriente);
        let r = parseFloat(resistencia);

        if (v && i && !r) setResistencia((v / i).toFixed(2));
        else if (v && r && !i) setCorriente((v / r).toFixed(2));
        else if (i && r && !v) setVoltaje((i * r).toFixed(2));
        else alert("Llena solo 2 campos para calcular el 3ro.");
    };

    const limpiarOhm = () => { setVoltaje(''); setCorriente(''); setResistencia(''); };

    // ABRIR WHATSAPP
    const enviarWa = () => {
        if (!waNumero) return alert("Ingresa un número");
        const numeroLimpio = waNumero.replace(/\D/g, '');
        window.open(`https://wa.me/${numeroLimpio}?text=${encodeURIComponent(waMensaje)}`, '_blank');
    };

    return (
        <div className="tools-wrapper animate-fade-in">
            <header style={{ marginBottom: '30px' }}>
                <h2 style={{ fontSize: '2rem', margin: '0 0 5px 0', color: 'var(--text-primary)' }}>Caja de Herramientas</h2>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Utilidades rápidas para tu día a día en el taller.</p>
            </header>

            <div className="tools-grid">

                {/* TOOL 1: MARGEN DE GANANCIA */}
                <div className="tool-card glass-effect">
                    <div className="tool-header">
                        <div className="tool-icon" style={{ color: '#10b981', background: 'rgba(16,185,129,0.1)' }}><SvgDollar /></div>
                        <h3>Márgenes y Ganancia</h3>
                    </div>
                    <div className="tool-body">
                        <div className="tool-input-group">
                            <label>Costo del Repuesto ($)</label>
                            <input type="number" value={costo} onChange={e => setCosto(e.target.value)} placeholder="Ej: 5000" />
                        </div>
                        <div className="tool-input-group">
                            <label>Precio Cobrado al Cliente ($)</label>
                            <input type="number" value={venta} onChange={e => setVenta(e.target.value)} placeholder="Ej: 15000" />
                        </div>

                        <div className="tool-result-box">
                            <div className="res-col">
                                <span>Ganancia Neta</span>
                                <strong style={{ color: 'var(--success)' }}>${gananciaNeta.toFixed(2)}</strong>
                            </div>
                            <div className="res-col">
                                <span>Margen</span>
                                <strong style={{ color: margenNeto < 30 ? 'var(--danger)' : 'var(--text-primary)' }}>{margenNeto.toFixed(1)}%</strong>
                            </div>
                        </div>
                    </div>
                </div>

                {/* TOOL 2: LEY DE OHM (MICROELECTRÓNICA) */}
                <div className="tool-card glass-effect">
                    <div className="tool-header">
                        <div className="tool-icon" style={{ color: '#eab308', background: 'rgba(234,179,8,0.1)' }}><SvgZap /></div>
                        <h3>Ley de Ohm</h3>
                    </div>
                    <div className="tool-body">
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>Llena 2 campos para calcular el resto.</p>
                        <div className="ohm-grid">
                            <div className="tool-input-group">
                                <label>Voltaje (V)</label>
                                <input type="number" value={voltaje} onChange={e => setVoltaje(e.target.value)} placeholder="V" />
                            </div>
                            <div className="tool-input-group">
                                <label>Corriente (I - Amp)</label>
                                <input type="number" value={corriente} onChange={e => setCorriente(e.target.value)} placeholder="A" />
                            </div>
                            <div className="tool-input-group" style={{ gridColumn: '1 / -1' }}>
                                <label>Resistencia (R - Ohm)</label>
                                <input type="number" value={resistencia} onChange={e => setResistencia(e.target.value)} placeholder="Ω" />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                            <button onClick={calcularOhm} className="btn-tool-action" style={{ flex: 1, background: 'var(--accent-color)', color: 'white' }}>Calcular</button>
                            <button onClick={limpiarOhm} className="btn-tool-action" style={{ background: 'var(--bg-input-glass)', color: 'var(--text-primary)' }}>Limpiar</button>
                        </div>
                    </div>
                </div>

                {/* TOOL 3: WA DIRECTO */}
                <div className="tool-card glass-effect">
                    <div className="tool-header">
                        <div className="tool-icon" style={{ color: '#25D366', background: 'rgba(37,211,102,0.1)' }}><SvgMessage /></div>
                        <h3>WhatsApp Directo</h3>
                    </div>
                    <div className="tool-body">
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>Envía un mensaje sin guardar el contacto.</p>
                        <div className="tool-input-group">
                            <label>Número (Con código de país)</label>
                            <input type="text" value={waNumero} onChange={e => setWaNumero(e.target.value)} placeholder="Ej: 549112345678" />
                        </div>
                        <div className="tool-input-group">
                            <label>Mensaje</label>
                            <textarea rows="2" value={waMensaje} onChange={e => setWaMensaje(e.target.value)} placeholder="Hola, te contacto del taller..."></textarea>
                        </div>
                        <button onClick={enviarWa} className="btn-tool-action" style={{ width: '100%', marginTop: '10px', background: '#25D366', color: 'white' }}>
                            Abrir Chat
                        </button>
                    </div>
                </div>

                {/* TOOL 4: IDENTIFICADOR DE COMPONENTES */}
                <div className="tool-card glass-effect">
                    <div className="tool-header">
                        <div className="tool-icon" style={{ color: '#8b5cf6', background: 'rgba(139,92,246,0.1)' }}><SvgSettings /></div>
                        <h3>Buscador Datasheets</h3>
                    </div>
                    <div className="tool-body" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textAlign: 'center' }}>Acceso directo a la base de datos mundial de componentes electrónicos.</p>
                        <a href="https://www.alldatasheet.com/" target="_blank" rel="noreferrer" className="btn-tool-action" style={{ width: '100%', marginTop: '15px', background: 'var(--bg-panel)', color: 'var(--text-primary)', border: '1px solid var(--border-glass)', textAlign: 'center', textDecoration: 'none' }}>
                            Abrir Alldatasheet
                        </a>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default ToolsView;