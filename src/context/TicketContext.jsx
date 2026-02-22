import React, { createContext, useState, useEffect } from 'react';

export const TicketContext = createContext();

const TICKETS_INICIALES = [
    { id: 101, tipo: 'consulta', cliente: { nombre: 'Ana Clara', telefono: '112345678' }, dispositivo: 'iPhone 11', problema: 'Pantalla rota, táctil no responde en la zona superior.', fechaIngreso: '2024-05-20T10:30:00Z', estado: 'Pendiente', presupuesto: null, borrado: false },
    { id: 102, tipo: 'ticket', cliente: { nombre: 'Carlos Ruiz', telefono: '119876543' }, dispositivo: 'Samsung S21 FE', problema: 'No carga, puerto flojo.', fechaIngreso: '2024-05-19T15:45:00Z', estado: 'En Proceso', presupuesto: '45000', borrado: false }
];

export const TicketProvider = ({ children }) => {
    const [tickets, setTickets] = useState(() => {
        try {
            const datosGuardados = localStorage.getItem('wepairr_tickets');
            if (datosGuardados) {
                const parsed = JSON.parse(datosGuardados);
                if (Array.isArray(parsed)) return parsed;
            }
        } catch (e) {
            console.error("Error leyendo tickets, restaurando base de prueba.");
        }
        return TICKETS_INICIALES;
    });

    useEffect(() => {
        localStorage.setItem('wepairr_tickets', JSON.stringify(tickets));
    }, [tickets]);

    const actualizarEstadoTicket = (id, nuevoEstado) => {
        setTickets(prev => prev.map(t => t.id === id ? { ...t, estado: nuevoEstado } : t));
    };

    const actualizarPresupuesto = (id, nuevoPresupuesto) => {
        setTickets(prev => prev.map(t => t.id === id ? { ...t, presupuesto: nuevoPresupuesto, estado: t.estado === 'Ingresado' ? 'Presupuestado' : t.estado } : t));
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
        const ahora = new Date();
        const nuevoTicket = {
            id: nuevoId,
            tipo: 'ticket',
            fechaIngreso: ahora.toISOString(),
            estado: 'Ingresado',
            presupuesto: datosTicket.presupuestoInicial || null,
            borrado: false,
            ...datosTicket
        };
        setTickets(prev => [nuevoTicket, ...prev]);
    };

    // NUEVA FUNCIÓN: Editar contenido del ticket
    const editarTicket = (id, datosActualizados) => {
        setTickets(prev => prev.map(t => t.id === id ? { ...t, ...datosActualizados } : t));
    };

    return (
        <TicketContext.Provider value={{
            tickets, actualizarEstadoTicket, actualizarPresupuesto, moverAPapelera,
            restaurarTicket, eliminarDefinitivamente, convertirATicket, agregarTicketManual, editarTicket
        }}>
            {children}
        </TicketContext.Provider>
    );
};