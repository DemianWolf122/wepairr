import React, { useState, useContext } from 'react';
import { TicketContext } from '../context/TicketContext';
import './NewTicketForm.css';

const SvgCheckCircle = () => <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const SvgUser = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const SvgPhone = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>;
const SvgAlert = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>;

function NewTicketForm({ onTicketCreated }) {
    const { agregarTicketManual } = useContext(TicketContext);
    const [formData, setFormData] = useState({
        cliente: '', telefonoContacto: '', dispositivo: '', modeloDetallado: '', problema: '', prioridad: 'Normal', presupuestoInicial: '', notasInternas: ''
    });
    const [errores, setErrores] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errores[name]) setErrores(prev => ({ ...prev, [name]: null }));
    };

    const validarFormulario = () => {
        const nuevosErrores = {};
        if (!formData.cliente.trim()) nuevosErrores.cliente = 'Obligatorio';
        if (!formData.dispositivo.trim()) nuevosErrores.dispositivo = 'Obligatorio';
        if (!formData.problema.trim()) nuevosErrores.problema = 'Describa la falla';
        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validarFormulario()) return;

        agregarTicketManual({
            cliente: { nombre: formData.cliente, telefono: formData.telefonoContacto },
            dispositivo: formData.dispositivo + (formData.modeloDetallado ? ` (${formData.modeloDetallado})` : ''),
            problema: formData.problema
        });

        setFormData({ cliente: '', telefonoContacto: '', dispositivo: '', modeloDetallado: '', problema: '', prioridad: 'Normal', presupuestoInicial: '', notasInternas: '' });

        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            if (onTicketCreated) onTicketCreated();
        }, 1500);
    };

    return (
        <div className="new-ticket-form-wrapper animate-fade-in">
            <header className="form-header">
                <h3>Ingreso Manual de Equipo</h3>
                <p>Registra un nuevo dispositivo recibido en el taller.</p>
            </header>

            <form onSubmit={handleSubmit} className="ticket-form-grid">
                <div className="form-section">
                    <h4 className="section-title"><SvgUser /> Datos del Cliente</h4>
                    <div className="form-group icon-input">
                        <input type="text" name="cliente" value={formData.cliente} onChange={handleChange} placeholder="Nombre y Apellido *" className={errores.cliente ? 'input-error' : ''} maxLength={50} />
                    </div>
                    <div className="form-group">
                        <input type="tel" name="telefonoContacto" value={formData.telefonoContacto} onChange={handleChange} placeholder="Teléfono de Contacto" maxLength={20} />
                    </div>
                </div>

                <div className="form-section">
                    <h4 className="section-title"><SvgPhone /> Datos del Equipo</h4>
                    <div className="form-row">
                        <div className="form-group icon-input" style={{ flex: 1 }}>
                            <input type="text" name="dispositivo" value={formData.dispositivo} onChange={handleChange} placeholder="Tipo (Ej. iPhone 13) *" className={errores.dispositivo ? 'input-error' : ''} maxLength={30} />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <input type="text" name="modeloDetallado" value={formData.modeloDetallado} onChange={handleChange} placeholder="Modelo/Serie" maxLength={30} />
                        </div>
                    </div>
                </div>

                <div className="form-section full-width">
                    <h4 className="section-title"><SvgAlert /> Detalles de la Falla</h4>
                    <div className="form-group" style={{ position: 'relative' }}>
                        <textarea name="problema" value={formData.problema} onChange={handleChange} placeholder="Descripción de la falla reportada *" className={`textarea-auto ${errores.problema ? 'input-error' : ''}`} rows={3} maxLength={300} />
                        <span className="char-count">{formData.problema.length}/300</span>
                    </div>
                </div>

                <div className="form-actions full-width" style={{ position: 'relative' }}>
                    <button type="submit" className="btn-save-ticket">Crear Orden de Reparación</button>
                    <div className={`success-notification ${showSuccess ? 'show' : ''}`}><SvgCheckCircle /> Ingresado Correctamente</div>
                </div>
            </form>
        </div>
    );
}

export default NewTicketForm;