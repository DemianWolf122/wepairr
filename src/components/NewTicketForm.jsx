import React, { useState, useContext } from 'react';
import { TicketContext } from '../context/TicketContext';

// SVG Check
const SvgCheckCircle = () => <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;

function NewTicketForm({ onTicketCreated }) {
    const { agregarTicket } = useContext(TicketContext);
    const [nuevoTicket, setNuevoTicket] = useState({ cliente: { nombre: '', telefono: '' }, dispositivo: '', problema: '', tipo: 'ticket' });
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!nuevoTicket.cliente.nombre.trim() || !nuevoTicket.dispositivo.trim()) return;

        agregarTicket(nuevoTicket);
        setNuevoTicket({ cliente: { nombre: '', telefono: '' }, dispositivo: '', problema: '', tipo: 'ticket' });

        // Notificación suave en lugar de alert()
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            if (onTicketCreated) onTicketCreated();
        }, 2000);
    };

    return (
        <div className="new-ticket-form-container glass-effect animate-scale-in">
            <h3 style={{ margin: '0 0 20px 0', color: 'var(--text-primary)' }}>Ingreso de Equipo</h3>

            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <input type="text" placeholder="Nombre del Cliente *" value={nuevoTicket.cliente.nombre} onChange={e => setNuevoTicket({ ...nuevoTicket, cliente: { ...nuevoTicket.cliente, nombre: e.target.value } })} required className="settings-input" />
                    <input type="tel" placeholder="Teléfono / WhatsApp" value={nuevoTicket.cliente.telefono} onChange={e => setNuevoTicket({ ...nuevoTicket, cliente: { ...nuevoTicket.cliente, telefono: e.target.value } })} className="settings-input" />
                </div>
                <input type="text" placeholder="Dispositivo y Modelo *" value={nuevoTicket.dispositivo} onChange={e => setNuevoTicket({ ...nuevoTicket, dispositivo: e.target.value })} required className="settings-input" style={{ marginTop: '15px' }} />
                <textarea placeholder="Descripción del Problema / Falla *" value={nuevoTicket.problema} onChange={e => setNuevoTicket({ ...nuevoTicket, problema: e.target.value })} required className="settings-input settings-textarea" rows={4} style={{ marginTop: '15px' }} />

                <button type="submit" className="btn-add-item" style={{ width: '100%', marginTop: '20px', padding: '15px', fontSize: '1.1rem' }}>+ Crear Orden de Reparación</button>
            </form>

            {/* Notificación de Éxito */}
            <div className={`success-notification ${showSuccess ? 'show' : ''}`}>
                <SvgCheckCircle /> Orden creada correctamente
            </div>
        </div>
    );
}

export default NewTicketForm;