import React, { useState } from 'react';
import './ToolsView.css';

const SvgZap = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;

function ToolsView() {
    // 1. Calculadora Ley de Ohm
    const [vOhm, setVOhm] = useState('');
    const [rOhm, setROhm] = useState('');
    const [iOhm, setIOhm] = useState('');

    const calcOhm = () => {
        if (vOhm && rOhm) setIOhm((parseFloat(vOhm) / parseFloat(rOhm)).toFixed(4));
        else if (vOhm && iOhm) setROhm((parseFloat(vOhm) / parseFloat(iOhm)).toFixed(2));
        else if (iOhm && rOhm) setVOhm((parseFloat(iOhm) * parseFloat(rOhm)).toFixed(2));
    };

    // 2. Decodificador SMD Resistor
    const [smdCode, setSmdCode] = useState('');
    const [smdRes, setSmdRes] = useState('0 Ω');

    const calcSmd = () => {
        if (!smdCode || smdCode.length < 3) return;
        const code = smdCode.trim();
        let val = 0;

        if (code.includes('R')) {
            val = parseFloat(code.replace('R', '.'));
        } else {
            const base = parseInt(code.substring(0, code.length - 1));
            const mult = Math.pow(10, parseInt(code.substring(code.length - 1)));
            val = base * mult;
        }

        if (val >= 1000000) setSmdRes((val / 1000000).toFixed(2) + " MΩ");
        else if (val >= 1000) setSmdRes((val / 1000).toFixed(2) + " kΩ");
        else setSmdRes(val + " Ω");
    };

    // 3. Divisor de Tensión (Voltage Divider)
    const [vin, setVin] = useState('');
    const [r1, setR1] = useState('');
    const [r2, setR2] = useState('');
    const [vout, setVout] = useState('0 V');

    const calcDiv = () => {
        if (vin && r1 && r2) {
            const v = parseFloat(vin) * (parseFloat(r2) / (parseFloat(r1) + parseFloat(r2)));
            setVout(v.toFixed(3) + " V");
        }
    };

    // 4. Calculadora de Potencia (Watts)
    const [vWat, setVWat] = useState('');
    const [iWat, setIWat] = useState('');
    const [pWat, setPWat] = useState('0 W');

    const calcWat = () => {
        if (vWat && iWat) {
            const w = parseFloat(vWat) * parseFloat(iWat);
            setPWat(w.toFixed(2) + " W");
        }
    };

    return (
        <div className="tools-wrapper animate-fade-in">
            <header className="tools-header">
                <h2>Laboratorio de Diagnóstico</h2>
                <p>Calculadoras de precisión para microsoldadura y análisis de placas.</p>
            </header>

            <div className="tools-grid">
                {/* LEY DE OHM */}
                <div className="tool-card glass-effect">
                    <div className="tool-card-header"><div className="tool-icon"><SvgZap /></div><h3>Ley de Ohm</h3></div>
                    <p className="tool-desc">Ingresa 2 valores para calcular el tercero.</p>
                    <div className="ohm-calculator">
                        <div className="ohm-input-group"><label>Voltaje (V)</label><input type="number" value={vOhm} onChange={e => setVOhm(e.target.value)} placeholder="0" /></div>
                        <div className="ohm-input-group"><label>Resistencia (Ω)</label><input type="number" value={rOhm} onChange={e => setROhm(e.target.value)} placeholder="0" /></div>
                        <div className="ohm-input-group"><label>Corriente (A)</label><input type="number" value={iOhm} onChange={e => setIOhm(e.target.value)} placeholder="0" /></div>
                        <div className="ohm-actions">
                            <button onClick={calcOhm} className="btn-tool-action">Calcular</button>
                            <button onClick={() => { setVOhm(''); setROhm(''); setIOhm(''); }} className="btn-tool-ghost">Limpiar</button>
                        </div>
                    </div>
                </div>

                {/* SMD DECODER */}
                <div className="tool-card glass-effect">
                    <div className="tool-card-header"><div className="tool-icon"><SvgZap /></div><h3>Código SMD</h3></div>
                    <p className="tool-desc">Decodifica valores de resistencias SMD (Ej: 103, 4R7).</p>
                    <div className="ohm-calculator">
                        <div className="ohm-input-group"><label>Código impreso</label><input type="text" value={smdCode} onChange={e => setSmdCode(e.target.value)} placeholder="Ej: 103" maxLength="4" /></div>
                        <div className="tool-result-box">Valor: <span>{smdRes}</span></div>
                        <div className="ohm-actions">
                            <button onClick={calcSmd} className="btn-tool-action">Decodificar</button>
                            <button onClick={() => { setSmdCode(''); setSmdRes('0 Ω'); }} className="btn-tool-ghost">Limpiar</button>
                        </div>
                    </div>
                </div>

                {/* DIVISOR DE TENSIÓN */}
                <div className="tool-card glass-effect">
                    <div className="tool-card-header"><div className="tool-icon"><SvgZap /></div><h3>Divisor de Tensión</h3></div>
                    <p className="tool-desc">Calcula el Vout al pasar por dos resistencias.</p>
                    <div className="ohm-calculator">
                        <div className="ohm-input-group"><label>V de Entrada (Vin)</label><input type="number" value={vin} onChange={e => setVin(e.target.value)} placeholder="0" /></div>
                        <div className="ohm-input-group"><label>Resistencia 1 (R1)</label><input type="number" value={r1} onChange={e => setR1(e.target.value)} placeholder="0 Ω" /></div>
                        <div className="ohm-input-group"><label>Resistencia 2 (R2)</label><input type="number" value={r2} onChange={e => setR2(e.target.value)} placeholder="0 Ω" /></div>
                        <div className="tool-result-box">V de Salida: <span>{vout}</span></div>
                        <div className="ohm-actions">
                            <button onClick={calcDiv} className="btn-tool-action">Calcular</button>
                            <button onClick={() => { setVin(''); setR1(''); setR2(''); setVout('0 V'); }} className="btn-tool-ghost">Limpiar</button>
                        </div>
                    </div>
                </div>

                {/* POTENCIA */}
                <div className="tool-card glass-effect">
                    <div className="tool-card-header"><div className="tool-icon"><SvgZap /></div><h3>Consumo y Potencia</h3></div>
                    <p className="tool-desc">Mide los Watts disipados por un componente.</p>
                    <div className="ohm-calculator">
                        <div className="ohm-input-group"><label>Voltaje (V)</label><input type="number" value={vWat} onChange={e => setVWat(e.target.value)} placeholder="0" /></div>
                        <div className="ohm-input-group"><label>Amperaje (A)</label><input type="number" value={iWat} onChange={e => setIWat(e.target.value)} placeholder="0" /></div>
                        <div className="tool-result-box">Potencia: <span>{pWat}</span></div>
                        <div className="ohm-actions">
                            <button onClick={calcWat} className="btn-tool-action">Calcular Watts</button>
                            <button onClick={() => { setVWat(''); setIWat(''); setPWat('0 W'); }} className="btn-tool-ghost">Limpiar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ToolsView;