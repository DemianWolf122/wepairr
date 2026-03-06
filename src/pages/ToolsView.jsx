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
const SvgWifi = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>;
const SvgHardDrive = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><line x1="22" y1="12" x2="2" y2="12"></line><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path><line x1="6" y1="16" x2="6.01" y2="16"></line><line x1="10" y1="16" x2="10.01" y2="16"></line></svg>;
const SvgMonitor = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>;
const SvgTerminal = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>;
const SvgMusic = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>;
const SvgKey = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>;
const SvgCreditCard = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>;

function ToolsView() {
    const [busqueda, setBusqueda] = useState('');
    const [activeCategory, setActiveCategory] = useState('Todas');

    // ==========================================
    // ESTADOS: CATEGORÍA 1 - FINANZAS Y GESTIÓN
    // ==========================================
    const [costo, setCosto] = useState('');
    const [venta, setVenta] = useState('');
    const margenNeto = costo && venta ? ((venta - costo) / venta) * 100 : 0;
    const gananciaNeta = costo && venta ? venta - costo : 0;

    const [tarifaHora, setTarifaHora] = useState('');
    const [horasTrabajo, setHorasTrabajo] = useState('');
    const [minutosTrabajo, setMinutosTrabajo] = useState('');
    const costoManoObra = (parseFloat(tarifaHora) || 0) * ((parseFloat(horasTrabajo) || 0) + ((parseFloat(minutosTrabajo) || 0) / 60));

    const [precioNeto, setPrecioNeto] = useState('');
    const [porcentajeIva, setPorcentajeIva] = useState('21');
    const valorIva = (parseFloat(precioNeto) || 0) * ((parseFloat(porcentajeIva) || 0) / 100);
    const precioBruto = (parseFloat(precioNeto) || 0) + valorIva;

    const [precioOriginal, setPrecioOriginal] = useState('');
    const [porcentajeDesc, setPorcentajeDesc] = useState('');
    const valorDesc = (parseFloat(precioOriginal) || 0) * ((parseFloat(porcentajeDesc) || 0) / 100);
    const precioFinalDesc = (parseFloat(precioOriginal) || 0) - valorDesc;

    // API DIVISAS
    const [usdRate, setUsdRate] = useState(null);
    const [arsInput, setArsInput] = useState('');
    const [usdInput, setUsdInput] = useState('');

    useEffect(() => {
        fetch('https://api.exchangerate-api.com/v4/latest/USD')
            .then(r => r.json())
            .then(data => setUsdRate(data.rates.ARS))
            .catch(e => console.log(e));
    }, []);

    // CUOTAS
    const [montoCuota, setMontoCuota] = useState('');
    const [interesCuota, setInteresCuota] = useState('15');
    const [cantCuotas, setCantCuotas] = useState('3');
    const totalCuotas = montoCuota ? parseFloat(montoCuota) * (1 + (parseFloat(interesCuota) / 100)) : 0;
    const valorPorCuota = totalCuotas / (parseInt(cantCuotas) || 1);

    // ==========================================
    // ESTADOS: CATEGORÍA 2 - ELECTRÓNICA
    // ==========================================
    const [voltaje, setVoltaje] = useState('');
    const [corriente, setCorriente] = useState('');
    const [resistencia, setResistencia] = useState('');
    const calcularOhm = () => {
        let v = parseFloat(voltaje), i = parseFloat(corriente), r = parseFloat(resistencia);
        if (v && i && !r) setResistencia((v / i).toFixed(2));
        else if (v && r && !i) setCorriente((v / r).toFixed(2));
        else if (i && r && !v) setVoltaje((i * r).toFixed(2));
        else alert("Llena exactamente 2 campos.");
    };
    const limpiarOhm = () => { setVoltaje(''); setCorriente(''); setResistencia(''); };

    const [wattV, setWattV] = useState('');
    const [wattI, setWattI] = useState('');
    const [wattP, setWattP] = useState('');
    const calcularWatt = () => {
        let v = parseFloat(wattV), i = parseFloat(wattI), p = parseFloat(wattP);
        if (v && i && !p) setWattP((v * i).toFixed(2));
        else if (p && v && !i) setWattI((p / v).toFixed(2));
        else if (p && i && !v) setWattV((p / i).toFixed(2));
        else alert("Llena exactamente 2 campos.");
    };
    const limpiarWatt = () => { setWattV(''); setWattI(''); setWattP(''); };

    const [vIn, setVIn] = useState('');
    const [r1, setR1] = useState('');
    const [r2, setR2] = useState('');
    const vOut = vIn && r1 && r2 ? (parseFloat(vIn) * (parseFloat(r2) / (parseFloat(r1) + parseFloat(r2)))).toFixed(2) : 0;

    const [band1, setBand1] = useState('1');
    const [band2, setBand2] = useState('0');
    const [multiplier, setMultiplier] = useState('100');
    const [tolerance, setTolerance] = useState('5');
    const calcularResistenciaColor = () => {
        const val = (parseInt(band1) * 10 + parseInt(band2)) * parseFloat(multiplier);
        if (val >= 1000000) return `${(val / 1000000).toFixed(2)} MΩ`;
        if (val >= 1000) return `${(val / 1000).toFixed(2)} kΩ`;
        return `${val.toFixed(2)} Ω`;
    };

    const [smdCode, setSmdCode] = useState('');
    const [smdResult, setSmdResult] = useState('');
    const calcSmd = () => {
        if (smdCode.length < 3) return setSmdResult("Inválido");
        const base = parseInt(smdCode.substring(0, smdCode.length - 1));
        const mult = Math.pow(10, parseInt(smdCode.slice(-1)));
        let val = base * mult;
        if (val >= 1000000) setSmdResult(`${(val / 1000000).toFixed(2)} MΩ`);
        else if (val >= 1000) setSmdResult(`${(val / 1000).toFixed(2)} kΩ`);
        else setSmdResult(`${val} Ω`);
    };

    const [rSerieA, setRSerieA] = useState('');
    const [rSerieB, setRSerieB] = useState('');
    const rSerieTotal = (parseFloat(rSerieA) || 0) + (parseFloat(rSerieB) || 0);
    const rParaleloTotal = rSerieA && rSerieB ? ((parseFloat(rSerieA) * parseFloat(rSerieB)) / ((parseFloat(rSerieA) + (parseFloat(rSerieB))))).toFixed(2) : 0;

    const [cParaleloA, setCParaleloA] = useState('');
    const [cParaleloB, setCParaleloB] = useState('');
    const cParaleloTotal = (parseFloat(cParaleloA) || 0) + (parseFloat(cParaleloB) || 0);
    const cSerieTotal = cParaleloA && cParaleloB ? ((parseFloat(cParaleloA) * parseFloat(cParaleloB)) / ((parseFloat(cParaleloA) + (parseFloat(cParaleloB))))).toFixed(2) : 0;

    const awgToMm = { "10": "2.588", "12": "2.052", "14": "1.628", "16": "1.291", "18": "1.024", "20": "0.812", "22": "0.645", "24": "0.511", "26": "0.404", "28": "0.320", "30": "0.254", "32": "0.203", "34": "0.160", "36": "0.127", "38": "0.101", "40": "0.080" };
    const [awgInput, setAwgInput] = useState('22');

    const [hzInput, setHzInput] = useState('1000');
    const msResult = hzInput ? (1000 / parseFloat(hzInput)).toFixed(4) : 0;

    // ==========================================
    // ESTADOS: CATEGORÍA 3 - DIAGNÓSTICO
    // ==========================================
    const [capDiseño, setCapDiseño] = useState('');
    const [capActual, setCapActual] = useState('');
    const saludBateria = capDiseño && capActual ? Math.min(100, Math.max(0, (capActual / capDiseño) * 100)) : 0;

    const [imeiQuery, setImeiQuery] = useState('');
    const checkImei = (e) => {
        e.preventDefault();
        if (!imeiQuery.trim() || imeiQuery.length < 14) return alert("Ingresa un IMEI válido (15 dígitos).");
        navigator.clipboard.writeText(imeiQuery);
        alert("IMEI copiado. Pégalo en la página oficial que se abrirá.");
        window.open(`https://imeicheck.com/imei-check`, '_blank');
    };

    const [almacenamientoGb, setAlmacenamientoGb] = useState('');
    const almacenamientoReal = almacenamientoGb ? (parseFloat(almacenamientoGb) * 0.93132257).toFixed(2) : 0;

    const [resX, setResX] = useState('1920');
    const [resY, setResY] = useState('1080');
    const [pulgadas, setPulgadas] = useState('6.1');
    const ppiTotal = resX && resY && pulgadas ? (Math.sqrt(Math.pow(resX, 2) + Math.pow(resY, 2)) / pulgadas).toFixed(0) : 0;

    const [tdpCpu, setTdpCpu] = useState('65');
    const [tdpGpu, setTdpGpu] = useState('200');
    const psuTotal = (parseFloat(tdpCpu) || 0) + (parseFloat(tdpGpu) || 0) + 100;

    const [testKey, setTestKey] = useState('');
    const [deadPixelActive, setDeadPixelActive] = useState(false);
    const [pixelColorIdx, setPixelColorIdx] = useState(0);
    const pixelColors = ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF'];

    // AUDIO TEST
    const playTone = (freq) => {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.5);
    };

    // ==========================================
    // ESTADOS: CATEGORÍA 4 - SOFTWARE Y COMMS
    // ==========================================
    const [waNumero, setWaNumero] = useState('');
    const [waMensaje, setWaMensaje] = useState('');
    const enviarWa = () => {
        if (!waNumero) return alert("Ingresa un número");
        const numeroLimpio = waNumero.replace(/\D/g, '');
        window.open(`https://wa.me/${numeroLimpio}?text=${encodeURIComponent(waMensaje)}`, '_blank');
    };

    const [datasheetQuery, setDatasheetQuery] = useState('');
    const searchDatasheet = (e) => {
        e.preventDefault();
        if (!datasheetQuery.trim()) return;
        window.open(`https://search.alldatasheet.com/v2/exec/search.jsp?sSearchword=${encodeURIComponent(datasheetQuery)}`, '_blank');
    };

    const [firmwareBrand, setFirmwareBrand] = useState('apple');
    const [firmwareModel, setFirmwareModel] = useState('');
    const searchFirmware = (e) => {
        e.preventDefault();
        if (firmwareBrand === 'apple') window.open(`https://ipsw.me/`, '_blank');
        if (firmwareBrand === 'samsung') window.open(`https://samfw.com/search/${encodeURIComponent(firmwareModel)}`, '_blank');
        if (firmwareBrand === 'xiaomi') window.open(`https://mifirm.net/model/${encodeURIComponent(firmwareModel.toLowerCase())}`, '_blank');
    };

    const [qrText, setQrText] = useState('https://wepairr.com');

    const [warrantyType, setWarrantyType] = useState('pantalla');
    const warrantyTexts = {
        'pantalla': "La garantía de la pantalla cubre exclusivamente fallas de táctil espontáneas o defectos de imagen no originados por golpes. NO CUBRE: roturas, rayones o presión.",
        'bateria': "La garantía de la batería cubre descargas irregulares. NO CUBRE: desgaste natural (ciclos) o baterías infladas por cargadores genéricos.",
        'placa': "La reparación en placa base cuenta con garantía sobre el circuito específico reparado. NO CUBRE: fallas ajenas a la reparación, humedad o golpes."
    };

    const [genPassword, setGenPassword] = useState('');
    const generatePass = () => {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let pass = "";
        for (let i = 0; i < 16; i++) pass += charset.charAt(Math.floor(Math.random() * charset.length));
        setGenPassword(pass);
    };

    const [formatText, setFormatText] = useState('');
    const copyFormat = (type) => {
        if (!formatText) return;
        let final = formatText;
        if (type === 'bold') final = `*${formatText}*`;
        if (type === 'italic') final = `_${formatText}_`;
        if (type === 'strike') final = `~${formatText}~`;
        navigator.clipboard.writeText(final);
        alert("Copiado con formato WhatsApp.");
    };


    // ==========================================
    // ESTRUCTURA DE 30 HERRAMIENTAS
    // ==========================================
    const TOOLS_DATA = [
        // FINANZAS
        {
            cat: 'Finanzas y Gestión', id: '1', icon: <SvgDollar />, title: 'Márgenes y Ganancia', desc: 'Rentabilidad neta.', keys: 'dinero costo venta', render: () => (
                <><div className="tool-input-group"><label>Costo ($)</label><input type="number" value={costo} onChange={e => setCosto(e.target.value)} /></div><div className="tool-input-group"><label>Venta ($)</label><input type="number" value={venta} onChange={e => setVenta(e.target.value)} /></div><div className="tool-result-box"><div className="res-col"><span>Ganancia</span><strong style={{ color: 'var(--success)' }}>${gananciaNeta.toFixed(2)}</strong></div><div className="res-col"><span>Margen</span><strong style={{ color: margenNeto < 30 ? 'var(--danger)' : 'var(--text-primary)' }}>{margenNeto.toFixed(1)}%</strong></div></div></>
            )
        },
        {
            cat: 'Finanzas y Gestión', id: '2', icon: <SvgClock />, title: 'Mano de Obra', desc: 'Cobro por tiempo.', keys: 'tiempo hora', render: () => (
                <><div className="tool-input-group"><label>Tarifa Hora ($)</label><input type="number" value={tarifaHora} onChange={e => setTarifaHora(e.target.value)} /></div><div className="grid-2-col"><div className="tool-input-group"><label>Horas</label><input type="number" value={horasTrabajo} onChange={e => setHorasTrabajo(e.target.value)} /></div><div className="tool-input-group"><label>Minutos</label><input type="number" value={minutosTrabajo} onChange={e => setMinutosTrabajo(e.target.value)} /></div></div><div className="tool-result-box"><div className="res-col" style={{ width: '100%', alignItems: 'center' }}><span>Total</span><strong>${costoManoObra.toFixed(2)}</strong></div></div></>
            )
        },
        {
            cat: 'Finanzas y Gestión', id: '3', icon: <SvgDollar />, title: 'Calc. Impuestos', desc: 'Agrega IVA/Taxes.', keys: 'iva afip', render: () => (
                <><div className="tool-input-group"><label>Neto ($)</label><input type="number" value={precioNeto} onChange={e => setPrecioNeto(e.target.value)} /></div><div className="tool-input-group"><label>IVA (%)</label><input type="number" value={porcentajeIva} onChange={e => setPorcentajeIva(e.target.value)} /></div><div className="tool-result-box"><div className="res-col" style={{ width: '100%', alignItems: 'center' }}><span>Bruto Final</span><strong>${precioBruto.toFixed(2)}</strong></div></div></>
            )
        },
        {
            cat: 'Finanzas y Gestión', id: '4', icon: <SvgDollar />, title: 'Descuentos', desc: 'Aplica % de rebaja.', keys: 'promo descuento', render: () => (
                <><div className="tool-input-group"><label>Original ($)</label><input type="number" value={precioOriginal} onChange={e => setPrecioOriginal(e.target.value)} /></div><div className="tool-input-group"><label>Desc. (%)</label><input type="number" value={porcentajeDesc} onChange={e => setPorcentajeDesc(e.target.value)} /></div><div className="tool-result-box"><div className="res-col" style={{ width: '100%', alignItems: 'center' }}><span>Final</span><strong style={{ color: 'var(--success)' }}>${precioFinalDesc.toFixed(2)}</strong></div></div></>
            )
        },
        {
            cat: 'Finanzas y Gestión', id: '5', icon: <SvgGlobe />, title: 'Divisas (En Vivo)', desc: 'Dólar Internacional', keys: 'usd euro pesos', render: () => (
                <><p className="tool-hint">Cotización actual: 1 USD = ${usdRate || '...'} ARS</p><div className="grid-2-col"><div className="tool-input-group"><label>USD</label><input type="number" value={usdInput} onChange={e => { setUsdInput(e.target.value); setArsInput((e.target.value * usdRate).toFixed(2)) }} /></div><div className="tool-input-group"><label>ARS</label><input type="number" value={arsInput} onChange={e => { setArsInput(e.target.value); setUsdInput((e.target.value / usdRate).toFixed(2)) }} /></div></div></>
            )
        },
        {
            cat: 'Finanzas y Gestión', id: '6', icon: <SvgCreditCard />, title: 'Tarjetas / Cuotas', desc: 'Interés por pagos.', keys: 'posnet mercadopago cuota', render: () => (
                <><div className="tool-input-group"><label>Monto ($)</label><input type="number" value={montoCuota} onChange={e => setMontoCuota(e.target.value)} /></div><div className="grid-2-col"><div className="tool-input-group"><label>Interés (%)</label><input type="number" value={interesCuota} onChange={e => setInteresCuota(e.target.value)} /></div><div className="tool-input-group"><label>Cuotas</label><input type="number" value={cantCuotas} onChange={e => setCantCuotas(e.target.value)} /></div></div><div className="tool-result-box"><div className="res-col" style={{ width: '100%', alignItems: 'center' }}><span>Cada Cuota</span><strong style={{ fontSize: '1.3rem' }}>${valorPorCuota.toFixed(2)}</strong><span style={{ fontSize: '0.75rem', marginTop: '5px' }}>Total: ${totalCuotas.toFixed(2)}</span></div></div></>
            )
        },

        // ELECTRONICA
        {
            cat: 'Microelectrónica', id: '7', icon: <SvgZap />, title: 'Ley de Ohm', desc: 'V = I x R', keys: 'voltaje corriente ohmio', render: () => (
                <><div className="grid-2-col"><div className="tool-input-group"><label>V</label><input type="number" value={voltaje} onChange={e => setVoltaje(e.target.value)} /></div><div className="tool-input-group"><label>I</label><input type="number" value={corriente} onChange={e => setCorriente(e.target.value)} /></div><div className="tool-input-group" style={{ gridColumn: '1/-1' }}><label>R</label><input type="number" value={resistencia} onChange={e => setResistencia(e.target.value)} /></div></div><div className="tool-action-row"><button onClick={calcularOhm} className="btn-tool-action primary">Calcular</button><button onClick={limpiarOhm} className="btn-tool-action secondary">Limpiar</button></div></>
            )
        },
        {
            cat: 'Microelectrónica', id: '8', icon: <SvgZap />, title: 'Ley de Watt', desc: 'P = V x I', keys: 'potencia watts', render: () => (
                <><div className="grid-2-col"><div className="tool-input-group"><label>W</label><input type="number" value={wattP} onChange={e => setWattP(e.target.value)} /></div><div className="tool-input-group"><label>V</label><input type="number" value={wattV} onChange={e => setWattV(e.target.value)} /></div><div className="tool-input-group" style={{ gridColumn: '1/-1' }}><label>I</label><input type="number" value={wattI} onChange={e => setWattI(e.target.value)} /></div></div><div className="tool-action-row"><button onClick={calcularWatt} className="btn-tool-action primary">Calcular</button><button onClick={limpiarWatt} className="btn-tool-action secondary">Limpiar</button></div></>
            )
        },
        {
            cat: 'Microelectrónica', id: '9', icon: <SvgCpu />, title: 'Divisor de Tensión', desc: 'Vout para 2 R.', keys: 'caida divisor voltaje', render: () => (
                <><div className="tool-input-group"><label>Vin</label><input type="number" value={vIn} onChange={e => setVIn(e.target.value)} /></div><div className="grid-2-col"><div className="tool-input-group"><label>R1</label><input type="number" value={r1} onChange={e => setR1(e.target.value)} /></div><div className="tool-input-group"><label>R2</label><input type="number" value={r2} onChange={e => setR2(e.target.value)} /></div></div><div className="tool-result-box"><div className="res-col" style={{ width: '100%', alignItems: 'center' }}><span>V Out</span><strong>{vOut} V</strong></div></div></>
            )
        },
        {
            cat: 'Microelectrónica', id: '10', icon: <SvgCpu />, title: 'Bandas (Color)', desc: 'R de 4 bandas DIP.', keys: 'colores ohms', render: () => (
                <><div className="grid-2-col"><div className="tool-input-group"><label>B1</label><select value={band1} onChange={e => setBand1(e.target.value)} className="resistor-select"><option value="0">Negro</option><option value="1">Marr</option><option value="2">Rojo</option><option value="3">Nara</option><option value="4">Amar</option></select></div><div className="tool-input-group"><label>B2</label><select value={band2} onChange={e => setBand2(e.target.value)} className="resistor-select"><option value="0">Negro</option><option value="1">Marr</option><option value="2">Rojo</option><option value="5">Verde</option><option value="6">Azul</option></select></div><div className="tool-input-group"><label>Mult</label><select value={multiplier} onChange={e => setMultiplier(e.target.value)} className="resistor-select"><option value="1">x1</option><option value="10">x10</option><option value="100">x100</option><option value="1000">x1k</option></select></div><div className="tool-input-group"><label>Tol</label><select value={tolerance} onChange={e => setTolerance(e.target.value)} className="resistor-select"><option value="5">5%</option></select></div></div><div className="tool-result-box"><div className="res-col" style={{ width: '100%', alignItems: 'center' }}><span>Valor</span><strong>{calcularResistenciaColor()}</strong></div></div></>
            )
        },
        {
            cat: 'Microelectrónica', id: '11', icon: <SvgCpu />, title: 'Códigos SMD', desc: 'Ej: 103, 472...', keys: 'smd placa smt', render: () => (
                <><div className="tool-input-group"><label>Código Impreso</label><input type="text" value={smdCode} onChange={e => setSmdCode(e.target.value)} placeholder="Ej: 103" maxLength="4" /></div><button onClick={calcSmd} className="btn-tool-action primary">Traducir SMD</button><div className="tool-result-box" style={{ marginTop: '15px' }}><div className="res-col" style={{ width: '100%', alignItems: 'center' }}><span>Valor Real</span><strong>{smdResult || '-'}</strong></div></div></>
            )
        },
        {
            cat: 'Microelectrónica', id: '12', icon: <SvgCpu />, title: 'Res. Serie/Paralelo', desc: 'R Totales', keys: 'equivalente suma', render: () => (
                <><div className="grid-2-col"><div className="tool-input-group"><label>R1</label><input type="number" value={rSerieA} onChange={e => setRSerieA(e.target.value)} /></div><div className="tool-input-group"><label>R2</label><input type="number" value={rSerieB} onChange={e => setRSerieB(e.target.value)} /></div></div><div className="tool-result-box" style={{ flexDirection: 'column', gap: '10px' }}><div className="res-col" style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}><span>Serie:</span><strong>{rSerieTotal} Ω</strong></div><div className="res-col" style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}><span>Paralelo:</span><strong>{rParaleloTotal} Ω</strong></div></div></>
            )
        },
        {
            cat: 'Microelectrónica', id: '13', icon: <SvgCpu />, title: 'Cap. Serie/Paralelo', desc: 'C Totales (Inverso a R)', keys: 'capacitor faradios', render: () => (
                <><div className="grid-2-col"><div className="tool-input-group"><label>C1</label><input type="number" value={cParaleloA} onChange={e => setCParaleloA(e.target.value)} /></div><div className="tool-input-group"><label>C2</label><input type="number" value={cParaleloB} onChange={e => setCParaleloB(e.target.value)} /></div></div><div className="tool-result-box" style={{ flexDirection: 'column', gap: '10px' }}><div className="res-col" style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}><span>Paralelo (Suma):</span><strong>{cParaleloTotal} F</strong></div><div className="res-col" style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}><span>Serie (Inv):</span><strong>{cSerieTotal} F</strong></div></div></>
            )
        },
        {
            cat: 'Microelectrónica', id: '14', icon: <SvgSettings />, title: 'Cables AWG a mm', desc: 'Jumper thickness.', keys: 'hilo cobre milimetros', render: () => (
                <><div className="tool-input-group"><label>AWG</label><select value={awgInput} onChange={e => setAwgInput(e.target.value)} className="resistor-select">{Object.keys(awgToMm).map(k => <option key={k} value={k}>{k} AWG</option>)}</select></div><div className="tool-result-box"><div className="res-col" style={{ width: '100%', alignItems: 'center' }}><span>Diámetro</span><strong>{awgToMm[awgInput]} mm</strong></div></div></>
            )
        },
        {
            cat: 'Microelectrónica', id: '15', icon: <SvgZap />, title: 'Frecuencia (Osc)', desc: 'Hz a milisegundos.', keys: 'osciloscopio tiempo onda', render: () => (
                <><div className="tool-input-group"><label>Frecuencia (Hz)</label><input type="number" value={hzInput} onChange={e => setHzInput(e.target.value)} /></div><div className="tool-result-box"><div className="res-col" style={{ width: '100%', alignItems: 'center' }}><span>Periodo (T)</span><strong>{msResult} ms</strong></div></div></>
            )
        },

        // DIAGNOSTICO
        {
            cat: 'Diagnóstico y Hardware', id: '16', icon: <SvgBattery />, title: 'Salud Batería', desc: 'Capacidad real.', keys: 'mah vida iphone', render: () => (
                <><div className="tool-input-group"><label>Fábrica (mAh)</label><input type="number" value={capDiseño} onChange={e => setCapDiseño(e.target.value)} /></div><div className="tool-input-group"><label>Actual (mAh)</label><input type="number" value={capActual} onChange={e => setCapActual(e.target.value)} /></div><div className="tool-result-box"><div className="res-col" style={{ width: '100%', alignItems: 'center' }}><span>Vida Útil</span><strong style={{ color: saludBateria < 80 ? 'var(--danger)' : 'var(--success)' }}>{saludBateria.toFixed(1)}%</strong></div></div></>
            )
        },
        {
            cat: 'Diagnóstico y Hardware', id: '17', icon: <SvgSmartphone />, title: 'IMEI Check', desc: 'Blacklist Global.', keys: 'reporte banda negativa', render: () => (
                <><form onSubmit={checkImei} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}><div className="tool-search-input"><SvgSearch /><input type="text" value={imeiQuery} onChange={e => setImeiQuery(e.target.value)} placeholder="15 dígitos..." maxLength="15" required /></div><button type="submit" className="btn-tool-action primary" style={{ background: '#e11d48' }}>Verificar en IMEICheck</button></form></>
            )
        },
        {
            cat: 'Diagnóstico y Hardware', id: '18', icon: <SvgHardDrive />, title: 'GB a GiB (Discos)', desc: 'Espacio real Windows.', keys: 'ssd hdd almacenamiento', render: () => (
                <><div className="tool-input-group"><label>Caja (GB)</label><input type="number" value={almacenamientoGb} onChange={e => setAlmacenamientoGb(e.target.value)} /></div><div className="tool-result-box"><div className="res-col" style={{ width: '100%', alignItems: 'center' }}><span>Windows (GiB)</span><strong>{almacenamientoReal} GiB</strong></div></div></>
            )
        },
        {
            cat: 'Diagnóstico y Hardware', id: '19', icon: <SvgMonitor />, title: 'Densidad PPI', desc: 'Píxeles por pulgada.', keys: 'pantalla resolucion display', render: () => (
                <><div className="grid-2-col"><div className="tool-input-group"><label>X</label><input type="number" value={resX} onChange={e => setResX(e.target.value)} /></div><div className="tool-input-group"><label>Y</label><input type="number" value={resY} onChange={e => setResY(e.target.value)} /></div><div className="tool-input-group" style={{ gridColumn: '1/-1' }}><label>Pulgadas</label><input type="number" value={pulgadas} onChange={e => setPulgadas(e.target.value)} /></div></div><div className="tool-result-box"><div className="res-col" style={{ width: '100%', alignItems: 'center' }}><span>Densidad</span><strong>{ppiTotal} PPI</strong></div></div></>
            )
        },
        {
            cat: 'Diagnóstico y Hardware', id: '20', icon: <SvgZap />, title: 'PSU Calc', desc: 'Fuente de PC requerida.', keys: 'watts gamer consumo', render: () => (
                <><div className="tool-input-group"><label>TDP CPU (W)</label><input type="number" value={tdpCpu} onChange={e => setTdpCpu(e.target.value)} /></div><div className="tool-input-group"><label>TDP GPU (W)</label><input type="number" value={tdpGpu} onChange={e => setTdpGpu(e.target.value)} /></div><div className="tool-result-box"><div className="res-col" style={{ width: '100%', alignItems: 'center' }}><span>Fuente Sugerida</span><strong>{psuTotal} W</strong></div></div></>
            )
        },
        {
            cat: 'Diagnóstico y Hardware', id: '21', icon: <SvgMonitor />, title: 'Test Píxeles', desc: 'Full screen RGB.', keys: 'muertos mancha display', render: () => (
                <><button onClick={() => setDeadPixelActive(true)} className="btn-tool-action primary" style={{ marginTop: 'auto' }}>Iniciar Test</button></>
            )
        },
        {
            cat: 'Diagnóstico y Hardware', id: '22', icon: <SvgTerminal />, title: 'Test Teclado', desc: 'Verifica códigos.', keys: 'notebook key ghost', render: () => (
                <><input type="text" onKeyDown={e => { e.preventDefault(); setTestKey(`Key: [${e.key}] - Code: ${e.keyCode}`); }} value={testKey} placeholder="Presiona una tecla..." readOnly className="tool-search-input" style={{ width: '100%', padding: '15px', textAlign: 'center', fontWeight: 'bold', marginTop: 'auto' }} /></>
            )
        },
        {
            cat: 'Diagnóstico y Hardware', id: '23', icon: <SvgMusic />, title: 'Test de Audio', desc: 'Generador de Tonos.', keys: 'parlante speaker sonido', render: () => (
                <><div className="grid-2-col"><button onClick={() => playTone(200)} className="btn-tool-action secondary">200 Hz</button><button onClick={() => playTone(440)} className="btn-tool-action secondary">440 Hz</button><button onClick={() => playTone(1000)} className="btn-tool-action secondary">1 kHz</button><button onClick={() => playTone(5000)} className="btn-tool-action secondary">5 kHz</button></div></>
            )
        },

        // SOFTWARE
        {
            cat: 'Software y Comunicación', id: '24', icon: <SvgMessage />, title: 'WA Directo', desc: 'Chat sin agendar.', keys: 'whatsapp mensaje', render: () => (
                <><div className="tool-input-group"><label>Número</label><input type="text" value={waNumero} onChange={e => setWaNumero(e.target.value)} /></div><div className="tool-input-group"><label>Mensaje</label><textarea rows="2" value={waMensaje} onChange={e => setWaMensaje(e.target.value)}></textarea></div><button onClick={enviarWa} className="btn-tool-action" style={{ background: '#25D366', color: 'white' }}>Abrir Chat</button></>
            )
        },
        {
            cat: 'Software y Comunicación', id: '25', icon: <SvgSettings />, title: 'Datasheets', desc: 'PDFs Oficiales.', keys: 'integrado chip', render: () => (
                <><form onSubmit={searchDatasheet} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: 'auto' }}><div className="tool-search-input"><SvgSearch /><input type="text" value={datasheetQuery} onChange={e => setDatasheetQuery(e.target.value)} required /></div><button type="submit" className="btn-tool-action primary">Buscar PDF</button></form></>
            )
        },
        {
            cat: 'Software y Comunicación', id: '26', icon: <SvgHardDrive />, title: 'Firmwares', desc: 'Sistemas de fábrica.', keys: 'rom flash', render: () => (
                <><form onSubmit={searchFirmware} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}><select value={firmwareBrand} onChange={e => setFirmwareBrand(e.target.value)} className="resistor-select"><option value="apple">Apple</option><option value="samsung">Samsung</option><option value="xiaomi">Xiaomi</option></select>{firmwareBrand !== 'apple' && <input type="text" value={firmwareModel} onChange={e => setFirmwareModel(e.target.value)} className="resistor-select" placeholder="Modelo" required />}<button type="submit" className="btn-tool-action primary">Buscar ROM</button></form></>
            )
        },
        {
            cat: 'Software y Comunicación', id: '27', icon: <SvgWifi />, title: 'Generador QR', desc: 'Crea códigos.', keys: 'link escanear', render: () => (
                <><div className="tool-input-group"><input type="text" value={qrText} onChange={e => setQrText(e.target.value)} /></div><div style={{ display: 'flex', justifyContent: 'center', padding: '10px', background: 'white', borderRadius: '12px' }}><QRCodeCanvas value={qrText || ' '} size={80} /></div></>
            )
        },
        {
            cat: 'Software y Comunicación', id: '28', icon: <SvgMessage />, title: 'Garantías', desc: 'Legales para tickets.', keys: 'terminos cliente', render: () => (
                <><select value={warrantyType} onChange={e => setWarrantyType(e.target.value)} className="resistor-select" style={{ marginBottom: '10px' }}><option value="pantalla">Pantallas</option><option value="bateria">Baterías</option><option value="placa">Placas Base</option></select><button onClick={copyWarranty} className="btn-tool-action secondary">Copiar Texto Legal</button></>
            )
        },
        {
            cat: 'Software y Comunicación', id: '29', icon: <SvgKey />, title: 'Contraseñas', desc: 'Claves seguras (Routers).', keys: 'password seguridad', render: () => (
                <><div className="tool-search-input" style={{ marginBottom: '10px', justifyContent: 'center', fontWeight: 'bold', letterSpacing: '1px' }}>{genPassword || '...'}</div><button onClick={generatePass} className="btn-tool-action primary">Generar Clave</button></>
            )
        },
        {
            cat: 'Software y Comunicación', id: '30', icon: <SvgMessage />, title: 'Formato WA', desc: 'Negritas y tachados.', keys: 'texto cursiva', render: () => (
                <><input type="text" value={formatText} onChange={e => setFormatText(e.target.value)} className="resistor-select" style={{ marginBottom: '10px' }} placeholder="Texto..." /><div className="grid-2-col"><button onClick={() => copyFormat('bold')} className="btn-tool-action secondary">Negrita</button><button onClick={() => copyFormat('strike')} className="btn-tool-action secondary">Tachado</button></div></>
            )
        }
    ];

    // ==========================================
    // NAVEGACIÓN Y FILTROS ESTRUCTURADOS
    // ==========================================
    const categoryNames = [...new Set(TOOLS_DATA.map(t => t.cat))];

    const herramientasFiltradas = TOOLS_DATA.filter(tool => {
        // Si hay busqueda global, ignora la categoria
        if (busqueda.trim() !== '') {
            const query = busqueda.toLowerCase();
            return tool.title.toLowerCase().includes(query) || tool.keys.includes(query) || tool.cat.toLowerCase().includes(query);
        }
        // Si no hay busqueda, filtra por categoria activa (o muestra todas)
        return activeCategory === 'Todas' || tool.cat === activeCategory;
    });

    return (
        <div className="tools-layout-modern animate-fade-in">

            {deadPixelActive && (
                <div onClick={() => setPixelColorIdx((pixelColorIdx + 1) % pixelColors.length)} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 999999, background: pixelColors[pixelColorIdx], cursor: 'crosshair' }}>
                    <div style={{ background: 'rgba(0,0,0,0.7)', color: 'white', padding: '10px 20px', position: 'absolute', top: 20, left: 20, borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', backdropFilter: 'blur(5px)' }} onClick={(e) => { e.stopPropagation(); setDeadPixelActive(false) }}>
                        Salir del Test (Click aquí)
                    </div>
                </div>
            )}

            {/* SIDEBAR NAVEGACIÓN */}
            <aside className="tools-sidebar glass-effect">
                <div className="sidebar-header">
                    <h2>Arsenal Digital</h2>
                    <p>30 Herramientas Pro</p>
                </div>

                <div className="tools-search-bar">
                    <SvgSearch />
                    <input
                        type="text"
                        placeholder="Buscar herramienta..."
                        value={busqueda}
                        onChange={e => { setBusqueda(e.target.value); if (e.target.value) setActiveCategory('Todas'); }}
                    />
                </div>

                <nav className="tools-nav-menu">
                    <button className={`tool-nav-item ${activeCategory === 'Todas' && !busqueda ? 'active' : ''}`} onClick={() => { setActiveCategory('Todas'); setBusqueda(''); }}>
                        Todas las Herramientas
                    </button>
                    {categoryNames.map(cat => (
                        <button key={cat} className={`tool-nav-item ${activeCategory === cat && !busqueda ? 'active' : ''}`} onClick={() => { setActiveCategory(cat); setBusqueda(''); }}>
                            {cat}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* AREA CENTRAL - GRILLA */}
            <main className="tools-main-content">
                <div className="tools-grid animate-fade-in">
                    {herramientasFiltradas.length === 0 ? (
                        <div className="tools-empty-state">No se encontraron herramientas con ese término.</div>
                    ) : (
                        herramientasFiltradas.map(tool => (
                            <div key={tool.id} className="tool-card glass-effect">
                                <div className="tool-header">
                                    <div className="tool-icon">{tool.icon}</div>
                                    <div className="tool-header-text">
                                        <h3>{tool.title}</h3>
                                        <span className="tool-cat-badge">{tool.cat}</span>
                                    </div>
                                </div>
                                <div className="tool-body">
                                    {tool.render()}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}

export default ToolsView;