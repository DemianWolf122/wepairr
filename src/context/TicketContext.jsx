import React, { createContext, useState, useEffect } from 'react';

export const TicketContext = createContext();

const TICKETS_INICIALES = [
    { id: 101, tipo: 'ticket', cliente: { nombre: 'Julián Rossi', telefono: '112345678' }, dispositivo: 'Nvidia RTX 3080 Ti', problema: 'Artefactos en pantalla.', fechaIngreso: '2024-05-20T10:30:00Z', estado: 'Ingresado', prioridad: 'Alta', presupuesto: '85000', borrado: false },
    { id: 102, tipo: 'ticket', cliente: { nombre: 'Martín Gómez', telefono: '119876543' }, dispositivo: 'iPhone 13 Pro', problema: 'Cambio de módulo.', fechaIngreso: '2024-05-19T15:45:00Z', estado: 'En Proceso', prioridad: 'Normal', presupuesto: '120000', borrado: false }
];

export const TicketProvider = ({ children }) => {
    const [tickets, setTickets] = useState(() => {
        try {
            const datosGuardados = localStorage.getItem('wepairr_tickets');
            if (datosGuardados) {
                const parsed = JSON.parse(datosGuardados);
                if (Array.isArray(parsed)) return parsed;
            }
        } catch (e) { console.error("Error leyendo tickets."); }
        return TICKETS_INICIALES;
    });

    useEffect(() => {
        localStorage.setItem('wepairr_tickets', JSON.stringify(tickets));
    }, [tickets]);

    const actualizarEstadoTicket = (id, nuevoEstado) => {
        setTickets(prev => prev.map(t => t.id === id ? { ...t, estado: nuevoEstado } : t));
    };

    const actualizarPresupuesto = (id, nuevoPresupuesto) => {
        setTickets(prev => prev.map(t => t.id === id ? { ...t, presupuesto: nuevoPresupuesto } : t));
    };

    const editarTicket = (id, datosActualizados) => {
        setTickets(prev => prev.map(t => t.id === id ? { ...t, ...datosActualizados } : t));
    };

    const moverAPapelera = (id) => {
        setTickets(prev => prev.map(t => t.id === id ? { ...t, borrado: true } : t));
    };

    const restaurarTicket = (id) => {
        setTickets(prev => prev.map(t => t.id === id ? { ...t, borrado: false } : t));
    };

    const eliminarDefinitivamente = (id) => {
        setTickets(prev => prev.filter(t => t.id !== id));
    };

    const convertirATicket = (id) => {
        setTickets(prev => prev.map(t => t.id === id ? { ...t, tipo: 'ticket', estado: 'Ingresado' } : t));
    };

    const agregarTicketManual = (datosTicket) => {
        const nuevoId = tickets.length > 0 ? Math.max(...tickets.map(t => t.id)) + 1 : 101;
        const nuevoTicket = {
            id: nuevoId,
            tipo: 'ticket',
            fechaIngreso: new Date().toISOString(),
            estado: 'Ingresado',
            presupuesto: null,
            prioridad: datosTicket.prioridad || 'Normal',
            borrado: false,
            ...datosTicket
        };
        setTickets(prev => [nuevoTicket, ...prev]);
    };

    return (
        <TicketContext.Provider value={{
            tickets, actualizarEstadoTicket, actualizarPresupuesto, editarTicket,
            moverAPapelera, restaurarTicket, eliminarDefinitivamente, convertirATicket, agregarTicketManual
        }}>
            {children}
        </TicketContext.Provider>
    );
};