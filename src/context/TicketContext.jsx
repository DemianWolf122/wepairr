import React, { createContext, useState, useEffect } from 'react';

export const TicketContext = createContext();

export function TicketProvider({ children }) {
    const [tickets, setTickets] = useState(() => {
        const guardados = localStorage.getItem('wepairr_tickets');
        return guardados ? JSON.parse(guardados) : [
            { id: 1, equipo: 'Ejemplo Web', falla: 'Pantalla Rota', presupuesto: 0, estado: 'Ingresado', tipo: 'consulta', borrado: false }
        ];
    });

    useEffect(() => {
        localStorage.setItem('wepairr_tickets', JSON.stringify(tickets));
    }, [tickets]);

    const agregarTicket = (nuevoTicket) => {
        setTickets(prev => [...prev, { ...nuevoTicket, borrado: false }]);
    };

    const convertirATicket = (id) => {
        setTickets(prev => prev.map(t =>
            t.id === id ? { ...t, tipo: 'ticket' } : t
        ));
    };

    const actualizarEstadoTicket = (id, nuevoEstado) => {
        setTickets(prev => prev.map(ticket =>
            ticket.id === id ? { ...ticket, estado: nuevoEstado } : ticket
        ));
    };

    // NUEVO: Función para actualizar el valor monetario
    const actualizarPresupuesto = (id, nuevoMonto) => {
        setTickets(prev => prev.map(ticket =>
            ticket.id === id ? { ...ticket, presupuesto: nuevoMonto } : ticket
        ));
    };

    const moverAPapelera = (id) => {
        setTickets(prev => prev.map(ticket =>
            ticket.id === id ? { ...ticket, borrado: true } : ticket
        ));
    };

    const restaurarTicket = (id) => {
        setTickets(prev => prev.map(ticket =>
            ticket.id === id ? { ...ticket, borrado: false } : ticket
        ));
    };

    const eliminarDefinitivamente = (id) => {
        setTickets(prev => prev.filter(ticket => ticket.id !== id));
    };

    return (
        <TicketContext.Provider value={{
            tickets,
            agregarTicket,
            convertirATicket,
            actualizarEstadoTicket,
            actualizarPresupuesto, // Exportamos la nueva función
            moverAPapelera,
            restaurarTicket,
            eliminarDefinitivamente
        }}>
            {children}
        </TicketContext.Provider>
    );
}