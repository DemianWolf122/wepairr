import React, { useState, useContext } from 'react';
import { TicketContext } from '../context/TicketContext';
import Tesseract from 'tesseract.js'; // INYECTADO: LIBRERÍA OCR
import { Camera, RefreshCw } from 'lucide-react'; // INYECTADO: Iconos para OCR
import './NewTicketForm.css';

const SvgCheckCircle = () => <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const SvgUser = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const SvgPhone = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>;
const SvgAlert = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>;
const SvgTag = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>;

function NewTicketForm({ onTicketCreated }) {
    const { agregarTicketManual } = useContext(TicketContext);

    const [formData, setFormData] = useState({
        cliente: '', telefonoContacto: '', dispositivo: '', modeloDetallado: '', problema: '', prioridad: 'Normal', presupuestoInicial: ''
    });

    const [errores, setErrores] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // INYECTADO: Estado para el escáner OCR
    const [isScanning, setIsScanning] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errores[name]) setErrores(prev => ({ ...prev, [name]: null }));
    };

    // INYECTADO: Lógica Asíncrona de Tesseract OCR
    const handleOCR = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsScanning(true);
        try {
            // Reconocimiento de texto en la imagen subida
            const { data: { text } } = await Tesseract.recognize(file, 'eng');

            // Lógica simple para extraer posibles modelos o números de serie (Ignora líneas muy cortas)
            const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 3);
            const possibleModel = lines.find(l => l.toLowerCase().includes('model') || l.toLowerCase().includes('sn') || l.length > 5) || "";

            if (possibleModel) {
                setFormData(prev => ({
                    ...prev,
                    modeloDetallado: possibleModel.replace(/model/i, '').replace(/s\/n/i, '').trim() || prev.modeloDetallado
                }));
            } else {
                alert("No se detectó un modelo o serie claro. Intenta acercar la cámara a la etiqueta.");
            }
        } catch (err) {
            console.error("Error OCR:", err);
            alert("Hubo un problema al procesar la imagen.");
        } finally {
            setIsScanning(false);
            // Resetea el input file para permitir escanear la misma foto de nuevo si se desea
            e.target.value = null;
        }
    };

    const validarFormulario = () => {
        const nuevosErrores = {};
        if (!formData.cliente.trim()) nuevosErrores.cliente = 'Obligatorio';
        if (!formData.dispositivo.trim()) nuevosErrores.dispositivo = 'Obligatorio';
        if (!formData.problema.trim()) nuevosErrores.problema = 'Describa la falla';
        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validarFormulario()) return;

        setIsSubmitting(true);

        try {
            // Esperamos a que la base de datos confirme que se guardó
            await agregarTicketManual({
                cliente: { nombre: formData.cliente, telefono: formData.telefonoContacto },
                dispositivo: formData.dispositivo + (formData.modeloDetallado ? ` (${formData.modeloDetallado})` : ''),
                problema: formData.problema,
                prioridad: formData.prioridad,
                presupuestoInicial: formData.presupuestoInicial
            });

            setShowSuccess(true);

            setTimeout(() => {
                setShowSuccess(false);
                setFormData({ cliente: '', telefonoContacto: '', dispositivo: '', modeloDetallado: '', problema: '', prioridad: 'Normal', presupuestoInicial: '' });
                if (onTicketCreated) onTicketCreated();
            }, 1500);

        } catch (error) {
            // Si la base de datos falla, liberamos el botón y avisamos
            alert("No se pudo guardar el ticket en la base de datos. Revisa tu conexión a internet o la consola (F12).");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="new-ticket-form-wrapper animate-fade-in">
            <header className="form-header">
                <h3>Ingreso Manual</h3>
                <p>Registra un nuevo dispositivo en el taller.</p>
            </header>

            <form onSubmit={handleSubmit} className="ticket-form-grid">

                <div className="form-section">
                    <h4 className="section-title"><SvgUser /> Cliente</h4>
                    <div className="form-group">
                        <input type="text" name="cliente" value={formData.cliente} onChange={handleChange} placeholder="Nombre y Apellido *" className={errores.cliente ? 'input-error' : ''} maxLength={50} />
                        {errores.cliente && <span className="error-text">{errores.cliente}</span>}
                    </div>
                    <div className="form-group">
                        <input type="tel" name="telefonoContacto" value={formData.telefonoContacto} onChange={handleChange} placeholder="Teléfono de Contacto" maxLength={20} />
                    </div>
                </div>

                <div className="form-section">
                    {/* INYECTADO: Estructura Flex para acomodar el botón OCR al lado del título */}
                    <h4 className="section-title" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><SvgPhone /> Equipo</div>

                        {/* INYECTADO: Botón OCR Tesseract */}
                        <div style={{ position: 'relative' }}>
                            <input type="file" id="ocr-upload" accept="image/*" capture="environment" onChange={handleOCR} hidden />
                            <label htmlFor="ocr-upload" title="Escanear etiqueta con cámara" style={{ cursor: 'pointer', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                {isScanning ? <RefreshCw className="spin-animation" size={18} /> : <Camera size={18} />}
                                {isScanning ? 'Leyendo...' : 'Escanear'}
                            </label>
                        </div>
                    </h4>

                    <div className="form-row">
                        <div className="form-group" style={{ flex: 1 }}>
                            <input type="text" name="dispositivo" value={formData.dispositivo} onChange={handleChange} placeholder="Tipo (Ej. iPhone 13) *" className={errores.dispositivo ? 'input-error' : ''} maxLength={30} />
                            {errores.dispositivo && <span className="error-text">{errores.dispositivo}</span>}
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <input type="text" name="modeloDetallado" value={formData.modeloDetallado} onChange={handleChange} placeholder="Modelo/Serie" maxLength={30} />
                        </div>
                    </div>
                </div>

                <div className="form-section full-width">
                    <h4 className="section-title"><SvgTag /> Cotización y Prioridad</h4>
                    <div className="form-row">
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="input-label">Presupuesto ($)</label>
                            <input type="number" name="presupuestoInicial" value={formData.presupuestoInicial} onChange={handleChange} placeholder="Ej. 15000" min="0" />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="input-label">Nivel de Urgencia</label>
                            <select name="prioridad" value={formData.prioridad} onChange={handleChange} className="form-select-input">
                                <option value="Baja">Baja (Sin apuro)</option>
                                <option value="Normal">Normal (Estándar)</option>
                                <option value="Alta">Alta (Rápido)</option>
                                <option value="Urgente">Urgente (Prioridad Máxima)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="form-section full-width">
                    <h4 className="section-title"><SvgAlert /> Detalles de la Falla</h4>
                    <div className="form-group" style={{ position: 'relative' }}>
                        <textarea name="problema" value={formData.problema} onChange={handleChange} placeholder="Describe el problema que reporta el cliente..." className={`textarea-auto ${errores.problema ? 'input-error' : ''}`} rows={3} maxLength={300} />
                        <span className="char-count">{formData.problema.length}/300</span>
                        {errores.problema && <span className="error-text">{errores.problema}</span>}
                    </div>
                </div>

                <div className="form-actions full-width" style={{ position: 'relative' }}>
                    <button type="submit" className="btn-save-ticket" disabled={isSubmitting}>
                        {isSubmitting ? 'Guardando en la Nube...' : 'Crear Orden de Reparación'}
                    </button>

                    <div className={`success-notification ${showSuccess ? 'show' : ''}`}>
                        <SvgCheckCircle /> Ingresado Correctamente
                    </div>
                </div>
            </form>
        </div>
    );
}

export default NewTicketForm;