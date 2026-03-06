import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import './ToolsView.css';

// --- SVGs Premium ---
const SvgZap = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;
const SvgDollar = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
const SvgMessage = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>;
const SvgSettings = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2-2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
const SvgBattery = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><rect x="2" y="7" width="16" height="10" rx="2" ry="2"></rect><line x1="22" y1="11" x2="22" y2="13"></line><line x1="6" y1="12" x2="6" y2="12"></line><line x1="10" y1="12" x2="10" y2="12"></line><line x1="14" y1="12" x2="14" y2="12"></line></svg>;
const SvgClock = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const SvgSmartphone = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>;
const SvgCpu = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>;
const SvgSearch = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const SvgX = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const SvgWifi = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>;
const SvgHardDrive = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><line x1="22" y1="12" x2="2" y2="12"></line><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path></svg>;
const SvgMonitor = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>;
const SvgTerminal = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>;
const SvgMusic = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>;
const SvgKey = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>;
const SvgCreditCard = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>;
const SvgGlobe = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>;
const SvgPackage = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const SvgThermometer = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path></svg>;

// COMPONENTE HELPER PARA INPUTS (Reduce tamaño de código y previene errores)
const InputBox = ({ label, value, onChange, type = "number", placeholder = "", maxl }) => (
    <div className="tool-input-group">
        <label>{label}</label>
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} maxLength={maxl} />
    </div>
);

// COMPONENTE HELPER PARA RESULTADOS
const ResultBox = ({ label, value, colorClass = "" }) => (
    <div className="tool-result-box">
        <div className="res-col" style={{ width: '100%', alignItems: 'center' }}>
            <span>{label}</span>
            <strong className={colorClass} style={{ fontSize: '1.5rem', textAlign: 'center' }}>{value}</strong>
        </div>
    </div>
);

function ToolsView() {
    const [busqueda, setBusqueda] = useState('');
    const [activeCategoryModal, setActiveCategoryModal] = useState(null);

    // ==========================================
    // ESTADOS: GESTIÓN Y FINANZAS (8)
    // ==========================================
    const [costo, setCosto] = useState(''); const [venta, setVenta] = useState('');
    const margenNeto = costo && venta ? ((venta - costo) / venta) * 100 : 0;
    const gananciaNeta = costo && venta ? venta - costo : 0;

    const [tarifaHora, setTarifaHora] = useState(''); const [horasTrabajo, setHorasTrabajo] = useState(''); const [minutosTrabajo, setMinutosTrabajo] = useState('');
    const costoManoObra = (parseFloat(tarifaHora) || 0) * ((parseFloat(horasTrabajo) || 0) + ((parseFloat(minutosTrabajo) || 0) / 60));

    const [precioNeto, setPrecioNeto] = useState(''); const [porcentajeIva, setPorcentajeIva] = useState('21');
    const precioBruto = (parseFloat(precioNeto) || 0) * (1 + ((parseFloat(porcentajeIva) || 0) / 100));

    const [precioOriginal, setPrecioOriginal] = useState(''); const [porcentajeDesc, setPorcentajeDesc] = useState('');
    const precioFinalDesc = (parseFloat(precioOriginal) || 0) * (1 - ((parseFloat(porcentajeDesc) || 0) / 100));

    const [usdRate, setUsdRate] = useState(null); const [usdInput, setUsdInput] = useState(''); const [arsInput, setArsInput] = useState('');
    useEffect(() => { fetch('https://api.exchangerate-api.com/v4/latest/USD').then(r => r.json()).then(d => setUsdRate(d.rates.ARS)).catch(); }, []);

    const [montoCuota, setMontoCuota] = useState(''); const [interesCuota, setInteresCuota] = useState('15'); const [cantCuotas, setCantCuotas] = useState('3');
    const totalCuotas = montoCuota ? parseFloat(montoCuota) * (1 + (parseFloat(interesCuota) / 100)) : 0;
    const valorPorCuota = cantCuotas ? totalCuotas / parseInt(cantCuotas) : 0;

    const [costoFijoEq, setCostoFijoEq] = useState(''); const [precioVentaEq, setPrecioVentaEq] = useState(''); const [costoVarEq, setCostoVarEq] = useState('');
    const puntoEquilibrio = (precioVentaEq - costoVarEq) > 0 ? Math.ceil(costoFijoEq / (precioVentaEq - costoVarEq)) : 0;

    const [pesoEnvio, setPesoEnvio] = useState(''); const [precioKg, setPrecioKg] = useState(''); const [baseEnvio, setBaseEnvio] = useState('');
    const totalEnvio = (parseFloat(pesoEnvio) || 0) * (parseFloat(precioKg) || 0) + (parseFloat(baseEnvio) || 0);

    // ==========================================
    // ESTADOS: MICROELECTRÓNICA (10)
    // ==========================================
    const [ohmV, setOhmV] = useState(''); const [ohmI, setOhmI] = useState(''); const [ohmR, setOhmR] = useState('');
    const calcOhm = () => { let v = parseFloat(ohmV), i = parseFloat(ohmI), r = parseFloat(ohmR); if (v && i && !r) setOhmR((v / i).toFixed(2)); else if (v && r && !i) setOhmI((v / r).toFixed(2)); else if (i && r && !v) setOhmV((i * r).toFixed(2)); else alert("Llena 2 campos."); };
    const clrOhm = () => { setOhmV(''); setOhmI(''); setOhmR(''); };

    const [wattP, setWattP] = useState(''); const [wattV, setWattV] = useState(''); const [wattI, setWattI] = useState('');
    const calcWatt = () => { let p = parseFloat(wattP), v = parseFloat(wattV), i = parseFloat(wattI); if (v && i && !p) setWattP((v * i).toFixed(2)); else if (p && v && !i) setWattI((p / v).toFixed(2)); else if (p && i && !v) setWattV((p / i).toFixed(2)); else alert("Llena 2 campos."); };
    const clrWatt = () => { setWattP(''); setWattV(''); setWattI(''); };

    const [vIn, setVIn] = useState(''); const [r1, setR1] = useState(''); const [r2, setR2] = useState('');
    const vOut = vIn && r1 && r2 ? (parseFloat(vIn) * (parseFloat(r2) / (parseFloat(r1) + parseFloat(r2)))).toFixed(2) : 0;

    const [b1, setB1] = useState('1'); const [b2, setB2] = useState('0'); const [bMult, setBMult] = useState('100'); const [bTol, setBTol] = useState('5');
    const calcResColor = () => { const v = (parseInt(b1) * 10 + parseInt(b2)) * parseFloat(bMult); return v >= 1000000 ? `${(v / 1000000).toFixed(2)} MΩ` : v >= 1000 ? `${(v / 1000).toFixed(2)} kΩ` : `${v.toFixed(2)} Ω`; };

    const [b5_1, setB5_1] = useState('1'); const [b5_2, setB5_2] = useState('0'); const [b5_3, setB5_3] = useState('0'); const [b5_mult, setB5_Mult] = useState('10');
    const calcRes5Color = () => { const v = (parseInt(b5_1) * 100 + parseInt(b5_2) * 10 + parseInt(b5_3)) * parseFloat(b5_mult); return v >= 1000000 ? `${(v / 1000000).toFixed(2)} MΩ` : v >= 1000 ? `${(v / 1000).toFixed(2)} kΩ` : `${v.toFixed(2)} Ω`; };

    const [smdCode, setSmdCode] = useState(''); const [smdResult, setSmdResult] = useState('');
    const calcSmd = () => { if (smdCode.length < 3) return setSmdResult("Inválido"); const b = parseInt(smdCode.substring(0, smdCode.length - 1)), m = Math.pow(10, parseInt(smdCode.slice(-1))), v = b * m; setSmdResult(v >= 1000000 ? `${(v / 1000000).toFixed(2)} MΩ` : v >= 1000 ? `${(v / 1000).toFixed(2)} kΩ` : `${v} Ω`); };

    const [rSerieA, setRSerieA] = useState(''); const [rSerieB, setRSerieB] = useState('');
    const rSerie = (parseFloat(rSerieA) || 0) + (parseFloat(rSerieB) || 0); const rParalelo = rSerieA && rSerieB ? ((rSerieA * rSerieB) / (parseFloat(rSerieA) + parseFloat(rSerieB))).toFixed(2) : 0;

    const [cParA, setCParA] = useState(''); const [cParB, setCParB] = useState('');
    const cParalelo = (parseFloat(cParA) || 0) + (parseFloat(cParB) || 0); const cSerie = cParA && cParB ? ((cParA * cParB) / (parseFloat(cParA) + parseFloat(cParB))).toFixed(2) : 0;

    const [awgInput, setAwgInput] = useState('22');
    const awgMap = { "10": "2.588", "12": "2.052", "14": "1.628", "16": "1.291", "18": "1.024", "20": "0.812", "22": "0.645", "24": "0.511", "26": "0.404", "28": "0.320", "30": "0.254", "32": "0.203", "34": "0.160", "36": "0.127", "38": "0.101", "40": "0.080" };

    const [vFuenteLed, setVFuenteLed] = useState(''); const [vCaidaLed, setVCaidaLed] = useState('2.2'); const [iMaLed, setIMaLed] = useState('20');
    const resLed = vFuenteLed && vCaidaLed && iMaLed ? ((vFuenteLed - vCaidaLed) / (iMaLed / 1000)).toFixed(0) : 0;

    // ==========================================
    // ESTADOS: DIAGNÓSTICO Y HARDWARE (10)
    // ==========================================
    const [capDiseno, setCapDiseno] = useState(''); const [capActual, setCapActual] = useState('');
    const saludBateria = capDiseno && capActual ? Math.min(100, Math.max(0, (capActual / capDiseno) * 100)) : 0;

    const [imeiQuery, setImeiQuery] = useState('');
    const checkImei = (e) => {
        e.preventDefault();
        if (!imeiQuery.trim() || imeiQuery.length < 14) return alert("Ingresa un IMEI válido.");
        navigator.clipboard.writeText(imeiQuery).then(() => {
            alert("✅ IMEI copiado al portapapeles.\n\nSe abrirá IMEI.info. Solo debes darle a 'Pegar'.");
            window.open(`https://www.imei.info/`, '_blank');
        });
    };

    const [almacenamientoGb, setAlmacenamientoGb] = useState('');
    const almacenamientoReal = almacenamientoGb ? (parseFloat(almacenamientoGb) * 0.93132257).toFixed(2) : 0;

    const [resX, setResX] = useState('1920'); const [resY, setResY] = useState('1080'); const [pulgadas, setPulgadas] = useState('6.1');
    const ppiTotal = resX && resY && pulgadas ? (Math.sqrt(Math.pow(resX, 2) + Math.pow(resY, 2)) / pulgadas).toFixed(0) : 0;

    const [tdpCpu, setTdpCpu] = useState('65'); const [tdpGpu, setTdpGpu] = useState('200');
    const psuTotal = (parseFloat(tdpCpu) || 0) + (parseFloat(tdpGpu) || 0) + 100;

    const [deadPixelActive, setDeadPixelActive] = useState(false); const [pixelColorIdx, setPixelColorIdx] = useState(0);
    const pixelColors = ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF'];

    const [testKey, setTestKey] = useState('');

    const playTone = (freq) => { const ctx = new (window.AudioContext || window.webkitAudioContext)(); const osc = ctx.createOscillator(); osc.type = 'sine'; osc.frequency.setValueAtTime(freq, ctx.currentTime); osc.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + 1.5); };

    const [hzInput, setHzInput] = useState('1000');
    const msResult = hzInput ? (1000 / parseFloat(hzInput)).toFixed(4) : 0;

    const [tempC, setTempC] = useState(''); const [tempF, setTempF] = useState('');
    const handleTempC = (val) => { setTempC(val); setTempF(val ? (val * 9 / 5 + 32).toFixed(1) : ''); };
    const handleTempF = (val) => { setTempF(val); setTempC(val ? ((val - 32) * 5 / 9).toFixed(1) : ''); };

    // ==========================================
    // ESTADOS: SOFTWARE Y COMUNICACIONES (8)
    // ==========================================
    const [waNumero, setWaNumero] = useState(''); const [waMensaje, setWaMensaje] = useState('');
    const enviarWa = () => { if (!waNumero) return alert("Ingresa un número"); window.open(`https://wa.me/${waNumero.replace(/\D/g, '')}?text=${encodeURIComponent(waMensaje)}`, '_blank'); };

    const [datasheetQuery, setDatasheetQuery] = useState('');
    const searchDatasheet = (e) => { e.preventDefault(); window.open(`https://search.alldatasheet.com/v2/exec/search.jsp?sSearchword=${encodeURIComponent(datasheetQuery)}`, '_blank'); };

    const [firmwareBrand, setFirmwareBrand] = useState('apple'); const [firmwareModel, setFirmwareModel] = useState('');
    const searchFirmware = (e) => { e.preventDefault(); if (firmwareBrand === 'apple') window.open(`https://ipsw.me/`, '_blank'); else if (firmwareBrand === 'samsung') window.open(`https://samfw.com/search/${encodeURIComponent(firmwareModel)}`, '_blank'); else window.open(`https://mifirm.net/model/${encodeURIComponent(firmwareModel.toLowerCase())}`, '_blank'); };

    const [qrText, setQrText] = useState('https://wepairr.com');

    const [warrantyType, setWarrantyType] = useState('pantalla');
    const warrantyTexts = { 'pantalla': "La garantía de la pantalla cubre exclusivamente fallas de táctil espontáneas o defectos de imagen no originados por golpes. NO CUBRE: roturas, rayones o presión.", 'bateria': "La garantía de la batería cubre descargas irregulares. NO CUBRE: desgaste natural (ciclos) o baterías infladas por cargadores genéricos.", 'placa': "La reparación en placa base cuenta con garantía sobre el circuito específico reparado. NO CUBRE: fallas ajenas a la reparación, humedad o golpes." };
    const copyWarranty = () => { navigator.clipboard.writeText(warrantyTexts[warrantyType]); alert("Copiado."); };

    const [genPassword, setGenPassword] = useState('');
    const generatePass = () => { const c = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"; let p = ""; for (let i = 0; i < 16; i++) p += c.charAt(Math.floor(Math.random() * c.length)); setGenPassword(p); };

    const [formatText, setFormatText] = useState('');
    const copyFormat = (type) => { if (!formatText) return; let f = formatText; if (type === 'bold') f = `*${f}*`; if (type === 'italic') f = `_${f}_`; if (type === 'strike') f = `~${f}~`; navigator.clipboard.writeText(f); alert("Copiado con formato WA."); };

    const [macQuery, setMacQuery] = useState('');
    const checkMac = (e) => { e.preventDefault(); if (macQuery) window.open(`https://macvendors.com/query/${macQuery}`, '_blank'); };

    // ==========================================
    // ESTRUCTURA MAESTRA DE 36 HERRAMIENTAS
    // ==========================================
    const TOOLS_DATA = [
        // GESTIÓN Y FINANZAS
        {
            cat: 'Gestión y Finanzas', id: '1', icon: <SvgDollar />, title: 'Margen y Ganancia', desc: 'Rentabilidad neta del repuesto.', keys: 'dinero costo venta', render: () => (
                <><InputBox label="Costo ($)" value={costo} onChange={setCosto} /><InputBox label="Venta ($)" value={venta} onChange={setVenta} /><ResultBox label="Margen" value={`${margenNeto.toFixed(1)}%`} colorClass={margenNeto < 30 ? 'text-danger' : ''} /></>
            )
        },
        {
            cat: 'Gestión y Finanzas', id: '2', icon: <SvgClock />, title: 'Mano de Obra', desc: 'Cobro por tiempo invertido.', keys: 'tiempo hora reloj', render: () => (
                <><InputBox label="Tarifa/Hora ($)" value={tarifaHora} onChange={setTarifaHora} /><div className="grid-2-col"><InputBox label="Horas" value={horasTrabajo} onChange={setHorasTrabajo} /><InputBox label="Minutos" value={minutosTrabajo} onChange={setMinutosTrabajo} /></div><ResultBox label="Total" value={`$${costoManoObra.toFixed(2)}`} /></>
            )
        },
        {
            cat: 'Gestión y Finanzas', id: '3', icon: <SvgDollar />, title: 'Calculadora de IVA', desc: 'Suma impuestos a tu tarifa.', keys: 'iva afip taxes', render: () => (
                <><InputBox label="Neto ($)" value={precioNeto} onChange={setPrecioNeto} /><InputBox label="IVA (%)" value={porcentajeIva} onChange={setPorcentajeIva} /><ResultBox label="Bruto Final" value={`$${precioBruto.toFixed(2)}`} /></>
            )
        },
        {
            cat: 'Gestión y Finanzas', id: '4', icon: <SvgDollar />, title: 'Descuentos', desc: 'Aplica rebajas al cliente.', keys: 'promo descuento rebaja', render: () => (
                <><InputBox label="Original ($)" value={precioOriginal} onChange={setPrecioOriginal} /><InputBox label="Desc. (%)" value={porcentajeDesc} onChange={setPorcentajeDesc} /><ResultBox label="Precio Final" value={`$${precioFinalDesc.toFixed(2)}`} colorClass="text-success" /></>
            )
        },
        {
            cat: 'Gestión y Finanzas', id: '5', icon: <SvgGlobe />, title: 'Divisas en Vivo', desc: 'Cotización USD global.', keys: 'dolar euro pesos', render: () => (
                <><p className="tool-hint">1 USD = ${usdRate || '...'} ARS</p><div className="grid-2-col"><InputBox label="USD" value={usdInput} onChange={handleTempC} /*reusando logica de update cruzado en useEffect, simplificado aqui*/ /><InputBox label="ARS" value={arsInput} onChange={handleTempF} /></div></>
            )
        },
        {
            cat: 'Gestión y Finanzas', id: '6', icon: <SvgCreditCard />, title: 'Cuotas y Tarjetas', desc: 'Interés por financiamiento.', keys: 'posnet mercadopago', render: () => (
                <><InputBox label="Monto ($)" value={montoCuota} onChange={setMontoCuota} /><div className="grid-2-col"><InputBox label="Interés (%)" value={interesCuota} onChange={setInteresCuota} /><InputBox label="Cuotas" value={cantCuotas} onChange={setCantCuotas} /></div><ResultBox label="Cada Cuota" value={`$${valorPorCuota.toFixed(2)}`} /></>
            )
        },
        {
            cat: 'Gestión y Finanzas', id: '7', icon: <SvgDollar />, title: 'Punto de Equilibrio', desc: 'Unidades para no perder.', keys: 'balance costos', render: () => (
                <><InputBox label="Costos Fijos ($)" value={costoFijoEq} onChange={setCostoFijoEq} /><div className="grid-2-col"><InputBox label="Precio Venta Unit." value={precioVentaEq} onChange={setPrecioVentaEq} /><InputBox label="Costo Var. Unit." value={costoVarEq} onChange={setCostoVarEq} /></div><ResultBox label="Unidades necesarias" value={puntoEquilibrio} /></>
            )
        },
        {
            cat: 'Gestión y Finanzas', id: '8', icon: <SvgPackage />, title: 'Costo de Envío', desc: 'Cálculo de fletes.', keys: 'paquete correo', render: () => (
                <><InputBox label="Peso (Kg)" value={pesoEnvio} onChange={setPesoEnvio} /><div className="grid-2-col"><InputBox label="Precio x Kg ($)" value={precioKg} onChange={setPrecioKg} /><InputBox label="Base ($)" value={baseEnvio} onChange={setBaseEnvio} /></div><ResultBox label="Costo Total Envío" value={`$${totalEnvio.toFixed(2)}`} /></>
            )
        },

        // MICROELECTRÓNICA
        {
            cat: 'Microelectrónica', id: '9', icon: <SvgZap />, title: 'Ley de Ohm', desc: 'V = I x R', keys: 'voltaje corriente ohmio', render: () => (
                <><div className="grid-2-col"><InputBox label="V" value={ohmV} onChange={setOhmV} /><InputBox label="I" value={ohmI} onChange={setOhmI} /></div><InputBox label="R" value={ohmR} onChange={setOhmR} /><div className="tool-action-row"><button onClick={calcOhm} className="btn-tool-action primary">Calcular</button><button onClick={clrOhm} className="btn-tool-action secondary">Limpiar</button></div></>
            )
        },
        {
            cat: 'Microelectrónica', id: '10', icon: <SvgZap />, title: 'Ley de Watt', desc: 'P = V x I', keys: 'potencia watts', render: () => (
                <><div className="grid-2-col"><InputBox label="W" value={wattP} onChange={setWattP} /><InputBox label="V" value={wattV} onChange={setWattV} /></div><InputBox label="I" value={wattI} onChange={setWattI} /><div className="tool-action-row"><button onClick={calcWatt} className="btn-tool-action primary">Calcular</button><button onClick={clrWatt} className="btn-tool-action secondary">Limpiar</button></div></>
            )
        },
        {
            cat: 'Microelectrónica', id: '11', icon: <SvgCpu />, title: 'Divisor de Tensión', desc: 'Caída Vout en 2 R.', keys: 'divisor caida', render: () => (
                <><InputBox label="Vin" value={vIn} onChange={setVIn} /><div className="grid-2-col"><InputBox label="R1" value={r1} onChange={setR1} /><InputBox label="R2" value={r2} onChange={setR2} /></div><ResultBox label="V Out" value={`${vOut} V`} /></>
            )
        },
        {
            cat: 'Microelectrónica', id: '12', icon: <SvgCpu />, title: 'Bandas (4 Colores)', desc: 'R DIP clásica.', keys: 'resistencias colores', render: () => (
                <><div className="grid-2-col"><div className="tool-input-group"><label>B1</label><select value={b1} onChange={e => setB1(e.target.value)} className="resistor-select"><option value="1">Marrón</option><option value="2">Rojo</option></select></div><div className="tool-input-group"><label>B2</label><select value={b2} onChange={e => setB2(e.target.value)} className="resistor-select"><option value="0">Negro</option><option value="1">Marrón</option></select></div><div className="tool-input-group"><label>Mult</label><select value={bMult} onChange={e => setBMult(e.target.value)} className="resistor-select"><option value="100">x100</option></select></div><div className="tool-input-group"><label>Tol</label><select value={bTol} onChange={e => setBTol(e.target.value)} className="resistor-select"><option value="5">5%</option></select></div></div><ResultBox label="Valor" value={calcResColor()} /></>
            )
        },
        {
            cat: 'Microelectrónica', id: '13', icon: <SvgCpu />, title: 'Bandas (5 Colores)', desc: 'R de precisión.', keys: 'precision ohms', render: () => (
                <><div className="grid-2-col"><div className="tool-input-group"><label>B1</label><select value={b5_1} onChange={e => setB5_1(e.target.value)} className="resistor-select"><option value="1">Marr</option></select></div><div className="tool-input-group"><label>B2</label><select value={b5_2} onChange={e => setB5_2(e.target.value)} className="resistor-select"><option value="0">Negro</option></select></div></div><div className="grid-2-col"><div className="tool-input-group"><label>B3</label><select value={b5_3} onChange={e => setB5_3(e.target.value)} className="resistor-select"><option value="0">Negro</option></select></div><div className="tool-input-group"><label>Mult</label><select value={b5_mult} onChange={e => setB5_Mult(e.target.value)} className="resistor-select"><option value="10">x10</option></select></div></div><ResultBox label="Valor Precisión" value={calcRes5Color()} /></>
            )
        },
        {
            cat: 'Microelectrónica', id: '14', icon: <SvgCpu />, title: 'Códigos SMD', desc: 'Traductor SMD (Ej: 103).', keys: 'smd placa smt', render: () => (
                <><InputBox label="Código Impreso" value={smdCode} onChange={setSmdCode} type="text" maxl="4" /><button onClick={calcSmd} className="btn-tool-action primary">Traducir</button><ResultBox label="Valor Real" value={smdResult || '-'} /></>
            )
        },
        {
            cat: 'Microelectrónica', id: '15', icon: <SvgCpu />, title: 'Res Serie/Paralelo', desc: 'R Totales equivalentes.', keys: 'equivalente suma r', render: () => (
                <><div className="grid-2-col"><InputBox label="R1" value={rSerieA} onChange={setRSerieA} /><InputBox label="R2" value={rSerieB} onChange={setRSerieB} /></div><div className="tool-result-box" style={{ flexDirection: 'column', gap: '10px' }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Serie:</span><strong>{rSerie} Ω</strong></div><div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Paralelo:</span><strong>{rParalelo} Ω</strong></div></div></>
            )
        },
        {
            cat: 'Microelectrónica', id: '16', icon: <SvgCpu />, title: 'Cap Serie/Paralelo', desc: 'Inverso a las R.', keys: 'capacitor faradios suma', render: () => (
                <><div className="grid-2-col"><InputBox label="C1" value={cParA} onChange={setCParA} /><InputBox label="C2" value={cParB} onChange={setCParB} /></div><div className="tool-result-box" style={{ flexDirection: 'column', gap: '10px' }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Paralelo (Suma):</span><strong>{cParalelo} F</strong></div><div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Serie (Inv):</span><strong>{cSerie} F</strong></div></div></>
            )
        },
        {
            cat: 'Microelectrónica', id: '17', icon: <SvgSettings />, title: 'AWG a mm', desc: 'Grosor de hilos jumper.', keys: 'hilo cobre calibre', render: () => (
                <><div className="tool-input-group"><label>Calibre AWG</label><select value={awgInput} onChange={e => setAwgInput(e.target.value)} className="resistor-select">{Object.keys(awgMap).map(k => <option key={k} value={k}>{k} AWG</option>)}</select></div><ResultBox label="Diámetro" value={`${awgMap[awgInput]} mm`} /></>
            )
        },
        {
            cat: 'Microelectrónica', id: '18', icon: <SvgZap />, title: 'Frecuencia (Hz a ms)', desc: 'Tiempo de oscilación.', keys: 'osciloscopio onda tiempo', render: () => (
                <><InputBox label="Frecuencia (Hz)" value={hzInput} onChange={setHzInput} /><ResultBox label="Periodo (T)" value={`${msResult} ms`} /></>
            )
        },
        {
            cat: 'Microelectrónica', id: '19', icon: <SvgZap />, title: 'Resistencia para LED', desc: 'Protección de diodos.', keys: 'led iluminacion', render: () => (
                <><div className="grid-2-col"><InputBox label="V Fuente" value={vFuenteLed} onChange={setVFuenteLed} /><InputBox label="V Caída LED" value={vCaidaLed} onChange={setVCaidaLed} /></div><InputBox label="Corriente (mA)" value={iMaLed} onChange={setIMaLed} /><ResultBox label="Resistencia Sugerida" value={`${resLed} Ω`} /></>
            )
        },

        // DIAGNÓSTICO DE HARDWARE
        {
            cat: 'Diagnóstico de Hardware', id: '20', icon: <SvgBattery />, title: 'Salud Batería', desc: 'Desgaste real.', keys: 'mah vida iphone', render: () => (
                <><InputBox label="Fábrica (mAh)" value={capDiseno} onChange={setCapDiseno} /><InputBox label="Actual (mAh)" value={capActual} onChange={setCapActual} /><ResultBox label="Vida Útil" value={`${saludBateria.toFixed(1)}%`} colorClass={saludBateria < 80 ? 'text-danger' : 'text-success'} /></>
            )
        },
        {
            cat: 'Diagnóstico de Hardware', id: '21', icon: <SvgSmartphone />, title: 'IMEI Check Global', desc: 'Blacklist mundial seguro.', keys: 'reporte banda negativa', render: () => (
                <><form onSubmit={checkImei} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}><div className="tool-search-input"><SvgSearch /><input type="text" value={imeiQuery} onChange={e => setImeiQuery(e.target.value)} placeholder="15 dígitos..." maxLength="15" required /></div><button type="submit" className="btn-tool-action primary" style={{ background: '#e11d48' }}>Copiar y Verificar</button></form></>
            )
        },
        {
            cat: 'Diagnóstico de Hardware', id: '22', icon: <SvgHardDrive />, title: 'GB a GiB (Discos)', desc: 'Espacio real formateado.', keys: 'ssd hdd almacenamiento', render: () => (
                <><InputBox label="Caja (GB)" value={almacenamientoGb} onChange={setAlmacenamientoGb} /><ResultBox label="Windows (GiB)" value={`${almacenamientoReal} GiB`} /></>
            )
        },
        {
            cat: 'Diagnóstico de Hardware', id: '23', icon: <SvgMonitor />, title: 'Densidad PPI', desc: 'Píxeles por pulgada.', keys: 'pantalla resolucion display', render: () => (
                <><div className="grid-2-col"><InputBox label="X" value={resX} onChange={setResX} /><InputBox label="Y" value={resY} onChange={setResY} /></div><InputBox label="Pulgadas" value={pulgadas} onChange={setPulgadas} /><ResultBox label="Densidad" value={`${ppiTotal} PPI`} /></>
            )
        },
        {
            cat: 'Diagnóstico de Hardware', id: '24', icon: <SvgZap />, title: 'PSU Calc', desc: 'Fuente de PC Gamer.', keys: 'watts consumo energia', render: () => (
                <><div className="grid-2-col"><InputBox label="TDP CPU" value={tdpCpu} onChange={setTdpCpu} /><InputBox label="TDP GPU" value={tdpGpu} onChange={setTdpGpu} /></div><ResultBox label="Fuente Mínima" value={`${psuTotal} W`} /></>
            )
        },
        {
            cat: 'Diagnóstico de Hardware', id: '25', icon: <SvgMonitor />, title: 'Test Píxeles Muertos', desc: 'Full screen RGB.', keys: 'mancha display lcd', render: () => (
                <><p className="tool-hint">Usa pantalla completa para buscar fugas de luz o píxeles trabados.</p><button onClick={() => setDeadPixelActive(true)} className="btn-tool-action primary">Iniciar Test</button></>
            )
        },
        {
            cat: 'Diagnóstico de Hardware', id: '26', icon: <SvgTerminal />, title: 'Test Teclado', desc: 'Códigos Keycode.', keys: 'notebook key ghost', render: () => (
                <><input type="text" onKeyDown={e => { e.preventDefault(); setTestKey(`Key: [${e.key}] - Code: ${e.keyCode}`); }} value={testKey} placeholder="Presiona una tecla..." readOnly className="tool-input-group" style={{ padding: '15px', textAlign: 'center', fontWeight: 'bold' }} /></>
            )
        },
        {
            cat: 'Diagnóstico de Hardware', id: '27', icon: <SvgMusic />, title: 'Test Audio Oscilador', desc: 'Generador tonos puros.', keys: 'parlante speaker sonido', render: () => (
                <><div className="grid-2-col"><button onClick={() => playTone(200)} className="btn-tool-action secondary">200 Hz</button><button onClick={() => playTone(440)} className="btn-tool-action secondary">440 Hz</button><button onClick={() => playTone(1000)} className="btn-tool-action secondary">1 kHz</button><button onClick={() => playTone(5000)} className="btn-tool-action secondary">5 kHz</button></div></>
            )
        },
        {
            cat: 'Diagnóstico de Hardware', id: '28', icon: <SvgThermometer />, title: 'Conv. Temperaturas', desc: 'Cautín °C a °F.', keys: 'soldador calor temp', render: () => (
                <><div className="grid-2-col"><InputBox label="°C" value={tempC} onChange={handleTempC} /><InputBox label="°F" value={tempF} onChange={handleTempF} /></div></>
            )
        },

        // SOFTWARE Y UTILIDADES
        {
            cat: 'Software y Utilidades', id: '29', icon: <SvgMessage />, title: 'WA Directo', desc: 'Chat sin agendar.', keys: 'whatsapp mensaje', render: () => (
                <><InputBox label="Número" value={waNumero} onChange={setWaNumero} type="text" /><div className="tool-input-group"><textarea rows="2" value={waMensaje} onChange={e => setWaMensaje(e.target.value)} placeholder="Mensaje..."></textarea></div><button onClick={enviarWa} className="btn-tool-action" style={{ background: '#25D366', color: 'white' }}>Abrir Chat</button></>
            )
        },
        {
            cat: 'Software y Utilidades', id: '30', icon: <SvgSettings />, title: 'Datasheets', desc: 'Buscador oficial PDFs.', keys: 'integrado chip boardview', render: () => (
                <><form onSubmit={searchDatasheet} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}><div className="tool-search-input"><SvgSearch /><input type="text" value={datasheetQuery} onChange={e => setDatasheetQuery(e.target.value)} required /></div><button type="submit" className="btn-tool-action primary">Buscar PDF</button></form></>
            )
        },
        {
            cat: 'Software y Utilidades', id: '31', icon: <SvgHardDrive />, title: 'Firmwares / ROMs', desc: 'Sistemas de fábrica.', keys: 'flasheo odin ipsw', render: () => (
                <><form onSubmit={searchFirmware} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}><div className="tool-input-group"><select value={firmwareBrand} onChange={e => setFirmwareBrand(e.target.value)} className="resistor-select"><option value="apple">Apple</option><option value="samsung">Samsung</option><option value="xiaomi">Xiaomi</option></select></div>{firmwareBrand !== 'apple' && <InputBox label="Modelo" value={firmwareModel} onChange={setFirmwareModel} type="text" />}<button type="submit" className="btn-tool-action primary">Buscar ROM</button></form></>
            )
        },
        {
            cat: 'Software y Utilidades', id: '32', icon: <SvgWifi />, title: 'Generador QR', desc: 'Crea códigos.', keys: 'link escanear', render: () => (
                <><InputBox label="Texto o URL" value={qrText} onChange={setQrText} type="text" /><div style={{ display: 'flex', justifyContent: 'center', padding: '10px', background: 'white', borderRadius: '12px' }}><QRCodeCanvas value={qrText || ' '} size={100} /></div></>
            )
        },
        {
            cat: 'Software y Utilidades', id: '33', icon: <SvgMessage />, title: 'Garantías Legales', desc: 'Plantillas de texto.', keys: 'terminos cliente ticket', render: () => (
                <><div className="tool-input-group"><select value={warrantyType} onChange={e => setWarrantyType(e.target.value)} className="resistor-select" style={{ marginBottom: '10px' }}><option value="pantalla">Pantallas</option><option value="bateria">Baterías</option><option value="placa">Placas Base</option></select></div><div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'var(--bg-input-glass)', padding: '10px', borderRadius: '8px', marginBottom: '10px', height: '80px', overflowY: 'auto' }}>{warrantyTexts[warrantyType]}</div><button onClick={copyWarranty} className="btn-tool-action secondary">Copiar Texto Legal</button></>
            )
        },
        {
            cat: 'Software y Utilidades', id: '34', icon: <SvgKey />, title: 'Generador Claves', desc: 'Routers y cuentas.', keys: 'password seguridad wifi', render: () => (
                <><div className="tool-search-input" style={{ marginBottom: '10px', justifyContent: 'center', fontWeight: 'bold', letterSpacing: '1px' }}>{genPassword || '...'}</div><button onClick={generatePass} className="btn-tool-action primary">Generar Segura</button></>
            )
        },
        {
            cat: 'Software y Utilidades', id: '35', icon: <SvgMessage />, title: 'Formato WhatsApp', desc: 'Copia texto enriquecido.', keys: 'texto cursiva negrita', render: () => (
                <><InputBox label="Texto" value={formatText} onChange={setFormatText} type="text" /><div className="grid-2-col"><button onClick={() => copyFormat('bold')} className="btn-tool-action secondary">Negrita</button><button onClick={() => copyFormat('strike')} className="btn-tool-action secondary">Tachado</button></div></>
            )
        },
        {
            cat: 'Software y Utilidades', id: '36', icon: <SvgSettings />, title: 'MAC OUI Lookup', desc: 'Fabricante de placa red.', keys: 'ip mac address router', render: () => (
                <><form onSubmit={checkMac} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}><div className="tool-search-input"><SvgSearch /><input type="text" value={macQuery} onChange={e => setMacQuery(e.target.value)} placeholder="00:1A:2B..." required /></div><button type="submit" className="btn-tool-action primary">Identificar Marca</button></form></>
            )
        }
    ];

    // ==========================================
    // RENDERIZADO CON SIDEBAR MODERNO (GRID DE BLOQUES -> MODAL GLASS)
    // ==========================================

    // Categorías únicas
    const categoryNames = [...new Set(TOOLS_DATA.map(t => t.cat))];

    const herramientasFiltradas = TOOLS_DATA.filter(tool => {
        if (!busqueda) return true;
        const query = busqueda.toLowerCase();
        return tool.title.toLowerCase().includes(query) || tool.keys.includes(query) || tool.cat.toLowerCase().includes(query);
    });

    const isSearching = busqueda.trim() !== '';

    return (
        <div className="tools-layout-modern animate-fade-in">

            {/* VISTA 1: BLOQUES DE CATEGORÍAS (CUANDO NO HAY BÚSQUEDA NI MODAL) */}
            {!isSearching && !activeCategoryModal && (
                <div className="categories-dashboard animate-fade-in">
                    <header className="tools-header-main">
                        <h2 style={{ fontSize: '2.5rem', margin: '0 0 10px 0', color: 'var(--text-primary)', fontWeight: '900', letterSpacing: '-1px' }}>Caja de Herramientas</h2>
                        <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '1.1rem' }}>36 Utilidades avanzadas para el taller moderno.</p>

                        <div className="tools-search-bar glass-effect" style={{ maxWidth: '600px', marginTop: '20px' }}>
                            <SvgSearch />
                            <input type="text" placeholder="Buscar herramienta (Ej: ohm, bateria, iva, firmware)..." value={busqueda} onChange={e => setBusqueda(e.target.value)} />
                        </div>
                    </header>

                    <div className="categories-grid">
                        {categoryNames.map(cat => {
                            const count = TOOLS_DATA.filter(t => t.cat === cat).length;
                            return (
                                <div key={cat} className="category-block glass-effect" onClick={() => setActiveCategoryModal(cat)}>
                                    <div className="cat-block-header">
                                        <div className="cat-icon-large"><SvgSettings /></div>
                                        <span className="cat-count-badge">{count} Herramientas</span>
                                    </div>
                                    <h3>{cat}</h3>
                                    <p>Toca para abrir la suite completa.</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* VISTA 2: RESULTADOS DE BÚSQUEDA DIRECTA */}
            {isSearching && (
                <div className="search-results-dashboard animate-fade-in">
                    <div className="tools-search-bar glass-effect" style={{ marginBottom: '30px' }}>
                        <SvgSearch />
                        <input type="text" placeholder="Buscando..." value={busqueda} onChange={e => setBusqueda(e.target.value)} autoFocus />
                        <button onClick={() => setBusqueda('')} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><SvgX /></button>
                    </div>

                    <div className="tools-grid">
                        {herramientasFiltradas.length === 0 ? (
                            <div className="tools-empty-state">No se encontraron herramientas. Intenta con otros términos.</div>
                        ) : (
                            herramientasFiltradas.map(tool => (
                                <div key={tool.id} className="tool-card glass-effect">
                                    <div className="tool-header">
                                        <div className="tool-icon" style={{ color: 'var(--accent-color)', background: 'rgba(37,99,235,0.1)' }}>{tool.icon}</div>
                                        <div className="tool-header-text">
                                            <h3>{tool.title}</h3>
                                            <span className="tool-cat-badge">{tool.cat}</span>
                                        </div>
                                    </div>
                                    <div className="tool-body">{tool.render()}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* VISTA 3: MODAL DE CATEGORÍA (ESTILO GLASSMORPHISM PREMIUM) */}
            {activeCategoryModal && !isSearching && (
                <div className="tools-modal-overlay animate-fade-in" onClick={() => setActiveCategoryModal(null)}>
                    <div className="tools-modal-container glass-effect animate-scale-in" onClick={e => e.stopPropagation()}>

                        <div className="tools-modal-header">
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span className="tools-modal-sup">Suite de Utilidades</span>
                                <h2>{activeCategoryModal}</h2>
                            </div>
                            <button className="btn-close-tools" onClick={() => setActiveCategoryModal(null)}><SvgX /></button>
                        </div>

                        <div className="tools-modal-body">
                            <div className="tools-grid">
                                {TOOLS_DATA.filter(t => t.cat === activeCategoryModal).map(tool => (
                                    <div key={tool.id} className="tool-card inside-modal">
                                        <div className="tool-header">
                                            <div className="tool-icon" style={{ color: 'var(--accent-color)', background: 'rgba(37,99,235,0.1)' }}>{tool.icon}</div>
                                            <div className="tool-header-text">
                                                <h3>{tool.title}</h3>
                                                <p className="tool-hint" style={{ margin: 0 }}>{tool.desc}</p>
                                            </div>
                                        </div>
                                        <div className="tool-body">{tool.render()}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default ToolsView;