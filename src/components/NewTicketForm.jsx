import React, { useState, useContext } from 'react';
import { TicketContext } from '../context/TicketContext';
import './NewTicketForm.css';

// SVGs
const SvgUser = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const SvgPhone = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>;
const SvgAlert = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>;
const SvgSave = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>;

function NewTicketForm({ onTicketCreated }) {
    const { agregarTicketManual } = useContext(TicketContext);
    const [formData, setFormData] = useState({
        cliente: '',
        telefonoContacto: '',
        dispositivo: '',
        modeloDetallado: '',
        problema: '',
        prioridad: 'Normal',
        presupuestoInicial: '',
        notasInternas: ''
    });
    const [errores, setErrores] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errores[name]) setErrores(prev => ({ ...prev, [name]: null }));
    };

    const validarFormulario = () => {
        const nuevosErrores = {};
        if (!formData.cliente.trim()) nuevosErrores.cliente = 'El nombre del cliente es obligatorio.';
        if (!formData.dispositivo.trim()) nuevosErrores.dispositivo = 'El tipo de dispositivo es obligatorio.';
        if (!formData.problema.trim()) nuevosErrores.problema = 'Debe describir la falla reportada.';
        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validarFormulario()) return;

        agregarTicketManual(formData);
        setFormData({ cliente: '', telefonoContacto: '', dispositivo: '', modeloDetallado: '', problema: '', prioridad: 'Normal', presupuestoInicial: '', notasInternas: '' });
        if (onTicketCreated) onTicketCreated(); // Callback para cambiar de pestaña si es necesario
        alert('Ticket ingresado correctamente.');
    };

    return (
        <div className="new-ticket-form-wrapper animate-fade-in">
            <header className="form-header">
                <h3>Ingreso Manual de Equipo</h3>
                <p>Registra un nuevo dispositivo recibido en el taller.</p>
            </header>

            <form onSubmit={handleSubmit} className="ticket-form-grid">
                {/* SECCIÓN CLIENTE */}
                <div className="form-section">
                    <h4 className="section-title"><SvgUser /> Datos del Cliente</h4>
                    <div className="form-group icon-input">
                        <input type="text" name="cliente" value={formData.cliente} onChange={handleChange} placeholder="Nombre y Apellido *" className={errores.cliente ? 'input-error' : ''} maxLength={50} />
                        {errores.cliente && <span className="error-msg">{errores.cliente}</span>}
                    </div>
                    <div className="form-group">
                        <input type="tel" name="telefonoContacto" value={formData.telefonoContacto} onChange={handleChange} placeholder="Teléfono de Contacto (Opcional)" maxLength={20} />
                    </div>
                </div>

                {/* SECCIÓN DISPOSITIVO */}
                <div className="form-section">
                    <h4 className="section-title"><SvgPhone /> Datos del Equipo</h4>
                    <div className="form-row">
                        <div className="form-group icon-input" style={{ flex: 1 }}>
                            <input type="text" name="dispositivo" value={formData.dispositivo} onChange={handleChange} placeholder="Tipo (Ej. iPhone 13) *" className={errores.dispositivo ? 'input-error' : ''} maxLength={30} />
                            {errores.dispositivo && <span className="error-msg">{errores.dispositivo}</span>}
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <input type="text" name="modeloDetallado" value={formData.modeloDetallado} onChange={handleChange} placeholder="Modelo/Serie (Opcional)" maxLength={30} />
                        </div>
                    </div>
                </div>

                {/* SECCIÓN FALLA Y ESTADO */}
                <div className="form-section full-width">
                    <h4 className="section-title"><SvgAlert /> Detalles de la Falla</h4>
                    <div className="form-group">
                        <textarea name="problema" value={formData.problema} onChange={handleChange} placeholder="Descripción detallada de la falla reportada por el cliente *" className={`textarea-auto ${errores.problema ? 'input-error' : ''}`} rows={3} maxLength={300} />
                        {errores.problema && <span className="error-msg">{errores.problema}</span>}
                        <span className="char-count">{formData.problema.length}/300</span>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Prioridad:</label>
                            <select name="prioridad" value={formData.prioridad} onChange={handleChange} className="select-input">
                                <option value="Baja">Baja</option>
                                <option value="Normal">Normal</option>
                                <option value="Alta">Alta (Urgente)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Presupuesto Aprox. (Opcional):</label>
                            <input type="text" name="presupuestoInicial" value={formData.presupuestoInicial} onChange={handleChange} placeholder="$0.00" maxLength={15} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Notas Internas (Solo técnicos):</label>
                        <textarea name="notasInternas" value={formData.notasInternas} onChange={handleChange} placeholder="Observaciones, estado físico, contraseñas..." className="textarea-auto" rows={2} maxLength={200} />
                    </div>
                </div>

                <div className="form-actions full-width">
                    <button type="submit" className="btn-save-ticket">
                        <SvgSave /> Ingresar Equipo
                    </button>
                </div>
            </form>
        </div>
    );
}

export default NewTicketForm;