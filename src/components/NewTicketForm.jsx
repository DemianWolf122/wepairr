import React, { useState, useContext } from 'react';
import { TicketContext } from '../context/TicketContext';
import Tesseract from 'tesseract.js';
import { Camera, RefreshCw } from 'lucide-react';
import './NewTicketForm.css';

const SvgCheckCircle = () => <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const SvgUser = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const SvgPhone = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>;
const SvgAlert = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>;
const SvgTag = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>;
const SvgBriefcase = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>;

function NewTicketForm({ onTicketCreated }) {
    const { agregarTicketManual } = useContext(TicketContext);

    const [formData, setFormData] = useState({
        cliente: '', telefonoContacto: '', dispositivo: '', modeloDetallado: '', problema: '', prioridad: 'Normal', presupuestoInicial: '',
        codigoInterno: '', tecnicoAsignado: '' // INYECTADO: Nuevos campos
    });

    const [errores, setErrores] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isScanning, setIsScanning] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errores[name]) setErrores(prev => ({ ...prev, [name]: null }));
    };

    const handleOCR = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsScanning(true);
        try {
            const { data: { text } } = await Tesseract.recognize(file, 'eng');
            const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 3);
            const possibleModel = lines.find(l => l.toLowerCase().includes('model') || l.toLowerCase().includes('sn') || l.length > 5) || "";

            if (possibleModel) {
                setFormData(prev => ({
                    ...prev,
                    modeloDetallado: possibleModel.replace(/model/i, '').replace(/s\/n/i, '').trim() || prev.modeloDetallado
                }));
            } else {
                alert("No se detectó un modelo claro. Intenta acercar la cámara.");
            }
        } catch (err) {
            alert("Hubo un problema al leer la imagen.");
        } finally {
            setIsScanning(false);
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
            await agregarTicketManual({
                cliente: { nombre: formData.cliente, telefono: formData.telefonoContacto },
                dispositivo: formData.dispositivo + (formData.modeloDetallado ? ` (${formData.modeloDetallado})` : ''),
                problema: formData.problema,
                prioridad: formData.prioridad,
                presupuestoInicial: formData.presupuestoInicial,
                codigo_interno: formData.codigoInterno, // INYECTADO
                tecnico_asignado: formData.tecnicoAsignado // INYECTADO
            });

            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                setFormData({ cliente: '', telefonoContacto: '', dispositivo: '', modeloDetallado: '', problema: '', prioridad: 'Normal', presupuestoInicial: '', codigoInterno: '', tecnicoAsignado: '' });
                if (onTicketCreated) onTicketCreated();
            }, 1500);

        } catch (error) {
            alert("Error al guardar ticket.");
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
                    </div>
                    <div className="form-group">
                        <input type="tel" name="telefonoContacto" value={formData.telefonoContacto} onChange={handleChange} placeholder="Teléfono de Contacto" maxLength={20} />
                    </div>
                </div>

                <div className="form-section">
                    <h4 className="section-title" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><SvgPhone /> Equipo</div>
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
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <input type="text" name="modeloDetallado" value={formData.modeloDetallado} onChange={handleChange} placeholder="Modelo/Serie" maxLength={30} />
                        </div>
                    </div>
                </div>

                {/* INYECTADO: SECCIÓN DE CONTROL INTERNO (ADMINISTRACIÓN DE TALLER) */}
                <div className="form-section full-width">
                    <h4 className="section-title"><SvgBriefcase /> Control Interno y Asignación</h4>
                    <div className="form-row">
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="input-label">Nomenclatura (Cód. Interno)</label>
                            <input type="text" name="codigoInterno" value={formData.codigoInterno} onChange={handleChange} placeholder="Ej. WEP-1004" maxLength={15} style={{ textTransform: 'uppercase' }} />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="input-label">Técnico a Cargo</label>
                            <select name="tecnicoAsignado" value={formData.tecnicoAsignado} onChange={handleChange} className="form-select-input">
                                <option value="">Sin Asignar (Pendiente)</option>
                                <option value="Demian">Demian (Admin)</option>
                                <option value="Lucila">Lucila</option>
                                <option value="Ricardo">Ricardo</option>
                            </select>
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
                                <option value="Baja">Baja</option><option value="Normal">Normal</option><option value="Alta">Alta</option><option value="Urgente">Urgente</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="form-section full-width">
                    <h4 className="section-title"><SvgAlert /> Detalles de la Falla</h4>
                    <div className="form-group" style={{ position: 'relative' }}>
                        <textarea name="problema" value={formData.problema} onChange={handleChange} placeholder="Describe el problema..." className={`textarea-auto ${errores.problema ? 'input-error' : ''}`} rows={3} maxLength={300} />
                        <span className="char-count">{formData.problema.length}/300</span>
                    </div>
                </div>

                <div className="form-actions full-width" style={{ position: 'relative' }}>
                    <button type="submit" className="btn-save-ticket" disabled={isSubmitting}>
                        {isSubmitting ? 'Guardando en Nube...' : 'Crear Orden de Reparación'}
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