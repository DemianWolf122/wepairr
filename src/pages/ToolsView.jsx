import React, { useState, useEffect, useCallback } from 'react';
import { Keyboard, Monitor, ShieldAlert, Smartphone, Download, UploadCloud } from 'lucide-react';
import './ToolsView.css';

// CSS INYECTADO PARA COMPONENTES ESPECÍFICOS
const toolsStyles = `
    .keyboard-grid { display: flex; flex-direction: column; gap: 8px; margin-top: 20px; align-items: center;}
    .key-row { display: flex; gap: 8px; justify-content: center; }
    .key-box { width: 45px; height: 45px; border-radius: 8px; border: 2px solid var(--border-glass); display: flex; justify-content: center; align-items: center; font-weight: bold; background: var(--bg-input-glass); color: var(--text-primary); transition: all 0.1s; }
    .key-box.active { background: var(--accent-color); color: white; transform: scale(0.95); border-color: var(--accent-color); box-shadow: 0 0 15px rgba(37, 99, 235, 0.5);}
    
    .vt-result-box { margin-top: 20px; padding: 20px; border-radius: 16px; background: rgba(0,0,0,0.2); border: 1px solid var(--border-glass); }
    .vt-badge { padding: 5px 10px; border-radius: 8px; font-weight: bold; font-size: 0.8rem; }
    .vt-clean { background: rgba(16, 185, 129, 0.2); color: #10b981; }
    .vt-infected { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
    
    .firmware-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 20px; }
    .firmware-card { background: var(--bg-input-glass); padding: 15px; border-radius: 12px; border: 1px solid var(--border-glass); text-align: center; cursor: pointer; transition: transform 0.2s; }
    .firmware-card:hover { transform: translateY(-5px); border-color: var(--accent-color); }
`;

function ToolsView() {
    const [activeTab, setActiveTab] = useState('vt');

    // --- TOOL 1: VIRUSTOTAL (ARCHIVOS) ---
    const [selectedFile, setSelectedFile] = useState(null);
    const [vtState, setVtState] = useState({ loading: false, result: null });

    const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

    const scanFile = async () => {
        if (!selectedFile) return;
        setVtState({ loading: true, result: null });

        // SIMULACIÓN API VIRUSTOTAL V3
        setTimeout(() => {
            const isVirus = selectedFile.name.toLowerCase().includes('crack') || selectedFile.name.toLowerCase().includes('patch');
            setVtState({
                loading: false,
                result: {
                    malicious: isVirus ? 12 : 0,
                    undetected: isVirus ? 60 : 72,
                    sha256: "a1b2c3d4e5...",
                    name: selectedFile.name
                }
            });
        }, 2500);
    };

    // --- TOOL 2: CHECKMEND (IMEI) ---
    const [imei, setImei] = useState('');
    const [checkResult, setCheckResult] = useState(null);

    const checkIMEI = () => {
        if (imei.length < 15) return alert("IMEI inválido (mínimo 15 dígitos)");
        setCheckResult({ loading: true });

        // SIMULACIÓN CHECKMEND API
        setTimeout(() => {
            const isBlacklisted = imei.endsWith('000');
            setCheckResult({
                loading: false,
                clean: !isBlacklisted,
                carrier: "Movistar AR",
                model: "Samsung S21 Ultra",
                status: isBlacklisted ? "REPORTADO (Banda Negativa)" : "CLEAN (Habilitado)"
            });
        }, 1500);
    };

    // --- TOOL 3: MONITOR TEST (Píxeles Muertos) ---
    // Inyectado: Lógica de pantalla completa y cambio de colores
    const [monitorColorIndex, setMonitorColorIndex] = useState(-1);
    const monitorColors = ['#FF0000', '#00FF00', '#0000FF', '#FFFFFF', '#000000'];

    const handleMonitorClick = useCallback(() => {
        setMonitorColorIndex(prev => (prev + 1) % monitorColors.length);
    }, [monitorColors.length]);

    const closeMonitorTest = () => setMonitorColorIndex(-1);

    // --- TOOL 4: KEYBOARD TESTER ---
    const [pressedKeys, setPressedKeys] = useState(new Set());
    useEffect(() => {
        if (activeTab !== 'keyboard') return;
        const handleKeyDown = (e) => { e.preventDefault(); setPressedKeys(prev => new Set(prev).add(e.code)); };
        const handleKeyUp = (e) => { e.preventDefault(); setPressedKeys(prev => { const next = new Set(prev); next.delete(e.code); return next; }); };
        window.addEventListener('keydown', handleKeyDown); window.addEventListener('keyup', handleKeyUp);
        return () => { window.removeEventListener('keydown', handleKeyDown); window.removeEventListener('keyup', handleKeyUp); };
    }, [activeTab]);

    const keyboardLayout = [['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP'], ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL'], ['KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM']];

    return (
        <div className="tools-wrapper animate-fade-in" style={{ padding: '30px' }}>
            <style>{toolsStyles}</style>

            {/* OVERLAY DE MONITOR TEST (Aparece solo si está activo) */}
            {monitorColorIndex >= 0 && (
                <div
                    style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: monitorColors[monitorColorIndex], zIndex: 999999, cursor: 'pointer' }}
                    onClick={handleMonitorClick}
                >
                    <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,0,0,0.5)', padding: '10px 20px', borderRadius: '8px', color: 'white', fontWeight: 'bold' }} onClick={(e) => { e.stopPropagation(); closeMonitorTest(); }}>
                        Salir (Esc)
                    </div>
                    <div style={{ position: 'absolute', bottom: '20px', width: '100%', textAlign: 'center', color: 'rgba(255,255,255,0.5)', pointerEvents: 'none' }}>
                        Clic para cambiar color
                    </div>
                </div>
            )}

            <header style={{ marginBottom: '30px' }}>
                <h2 style={{ fontSize: '2rem', margin: '0 0 10px 0', color: 'var(--text-primary)' }}>Laboratorio Técnico</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Herramientas de diagnóstico de hardware y seguridad.</p>
            </header>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
                <button onClick={() => setActiveTab('vt')} className={`tab-btn ${activeTab === 'vt' ? 'tab-active' : 'tab-inactive'}`}><ShieldAlert size={18} /> VirusTotal</button>
                <button onClick={() => setActiveTab('imei')} className={`tab-btn ${activeTab === 'imei' ? 'tab-active' : 'tab-inactive'}`}><Smartphone size={18} /> Check IMEI</button>
                <button onClick={() => setActiveTab('firmware')} className={`tab-btn ${activeTab === 'firmware' ? 'tab-active' : 'tab-inactive'}`}><Download size={18} /> Firmwares</button>
                {/* Nuevo Botón Monitor */}
                <button onClick={() => setActiveTab('monitor')} className={`tab-btn ${activeTab === 'monitor' ? 'tab-active' : 'tab-inactive'}`}><Monitor size={18} /> Monitor Test</button>
                <button onClick={() => setActiveTab('keyboard')} className={`tab-btn ${activeTab === 'keyboard' ? 'tab-active' : 'tab-inactive'}`}><Keyboard size={18} /> Teclado</button>
            </div>

            <div className="glass-effect" style={{ padding: '30px', borderRadius: '20px' }}>

                {/* 1. VIRUSTOTAL FILE SCANNER */}
                {activeTab === 'vt' && (
                    <div>
                        <h3 style={{ color: 'var(--text-primary)' }}>Análisis de Archivos (BIOS / EXE)</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Sube binarios dudosos antes de flashear.</p>

                        <div style={{ border: '2px dashed var(--border-glass)', padding: '40px', textAlign: 'center', borderRadius: '16px', marginTop: '20px', cursor: 'pointer' }}>
                            <input type="file" id="vt-upload" hidden onChange={handleFileChange} />
                            <label htmlFor="vt-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                                <UploadCloud size={40} color="var(--accent-color)" />
                                <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{selectedFile ? selectedFile.name : "Click para subir archivo (.bin, .exe)"}</span>
                            </label>
                        </div>

                        {selectedFile && (
                            <button onClick={scanFile} disabled={vtState.loading} style={{ width: '100%', marginTop: '20px', padding: '15px', background: 'var(--accent-color)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                                {vtState.loading ? 'Escaneando con 70 antivirus...' : 'Analizar Fichero'}
                            </button>
                        )}

                        {vtState.result && (
                            <div className="vt-result-box animate-scale-in">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '1.2rem', fontWeight: '900', color: vtState.result.malicious > 0 ? '#ef4444' : '#10b981' }}>
                                        {vtState.result.malicious > 0 ? '⚠️ AMENAZA DETECTADA' : '✅ ARCHIVO SEGURO'}
                                    </span>
                                    <span className="vt-badge vt-clean">Score: {vtState.result.malicious} / 72</span>
                                </div>
                                <p style={{ margin: '10px 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>SHA256: {vtState.result.sha256}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* 2. CHECKMEND IMEI */}
                {activeTab === 'imei' && (
                    <div>
                        <h3 style={{ color: 'var(--text-primary)' }}>Validación Legal (CheckMend)</h3>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            <input type="number" placeholder="Ingresa IMEI / Serie" value={imei} onChange={e => setImei(e.target.value)} style={{ flex: 1, padding: '15px', borderRadius: '12px', border: '1px solid var(--border-glass)', background: 'var(--bg-input-glass)', color: 'var(--text-primary)', outline: 'none' }} />
                            <button onClick={checkIMEI} style={{ padding: '0 30px', background: 'var(--accent-color)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Verificar</button>
                        </div>

                        {checkResult && !checkResult.loading && (
                            <div className="vt-result-box animate-scale-in" style={{ borderColor: checkResult.clean ? '#10b981' : '#ef4444' }}>
                                <h4 style={{ margin: '0 0 10px 0', fontSize: '1.5rem' }}>{checkResult.status}</h4>
                                <p>Modelo: <strong>{checkResult.model}</strong></p>
                                <p>Operador: {checkResult.carrier}</p>
                            </div>
                        )}
                        {checkResult?.loading && <p style={{ marginTop: '20px', textAlign: 'center' }}>Consultando bases de datos globales...</p>}
                    </div>
                )}

                {/* 3. SAMFW FIRMWARES */}
                {activeTab === 'firmware' && (
                    <div>
                        <h3 style={{ color: 'var(--text-primary)' }}>Repositorio Oficial</h3>
                        <div className="firmware-grid">
                            <div className="firmware-card" onClick={() => window.open('https://samfw.com/', '_blank')}>
                                <h4 style={{ color: '#2563eb' }}>Samsung (SamFW)</h4>
                                <p style={{ fontSize: '0.8rem' }}>Roms Odin, FRP Reset</p>
                            </div>
                            <div className="firmware-card" onClick={() => window.open('https://mirom.net/', '_blank')}>
                                <h4 style={{ color: '#f97316' }}>Xiaomi (MiRom)</h4>
                                <p style={{ fontSize: '0.8rem' }}>Fastboot & Recovery</p>
                            </div>
                            <div className="firmware-card" onClick={() => window.open('https://ipsw.me/', '_blank')}>
                                <h4 style={{ color: '#000000' }}>Apple (IPSW)</h4>
                                <p style={{ fontSize: '0.8rem' }}>iOS Restore Images</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. MONITOR TEST (Nueva Funcionalidad) */}
                {activeTab === 'monitor' && (
                    <div style={{ textAlign: 'center' }}>
                        <h3 style={{ color: 'var(--text-primary)' }}>Detector de Píxeles Muertos</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Se mostrarán fondos sólidos en pantalla completa para detectar anomalías en el panel.</p>
                        <button
                            onClick={() => setMonitorColorIndex(0)}
                            style={{ marginTop: '20px', padding: '15px 30px', background: 'var(--accent-color)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem' }}
                        >
                            Iniciar Test RGB
                        </button>
                    </div>
                )}

                {/* 5. KEYBOARD TESTER */}
                {activeTab === 'keyboard' && (
                    <div style={{ textAlign: 'center' }}>
                        <h3 style={{ color: 'var(--text-primary)' }}>Prueba de Teclado</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Presiona teclas físicas para verificar respuesta.</p>
                        <div className="keyboard-grid">
                            {keyboardLayout.map((row, i) => (
                                <div key={i} className="key-row">
                                    {row.map(code => (
                                        <div key={code} className={`key-box ${pressedKeys.has(code) ? 'active' : ''}`}>
                                            {code.replace('Key', '')}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ToolsView;