import React, { createContext, useState, useEffect } from 'react';

export const TicketContext = createContext();

export function TicketProvider({ children }) {
    // Inicialización: Lee del localStorage o carga el ticket por defecto
    const [tickets, setTickets] = useState(() => {
        const ticketsGuardados = localStorage.getItem('wepairr_tickets');
        if (ticketsGuardados) {
            return JSON.parse(ticketsGuardados);
        }
        return [
            { id: 1, equipo: 'Samsung S23 Ultra', falla: 'No carga', presupuesto: 45000, estado: 'Ingresado', tecnicoId: 'electro-fix', borrado: false }
        ];
    });

    // Sincronización: Guarda en localStorage cada vez que el array de tickets se modifica
    useEffect(() => {
        localStorage.setItem('wepairr_tickets', JSON.stringify(tickets));
    }, [tickets]);

    const agregarTicket = (nuevoTicket) => {
        setTickets(prev => [...prev, { ...nuevoTicket, borrado: false }]);
    };

    const actualizarEstadoTicket = (id, nuevoEstado) => {
        setTickets(prev => prev.map(ticket =>
            ticket.id === id ? { ...ticket, estado: nuevoEstado } : ticket
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
            actualizarEstadoTicket,
            moverAPapelera,
            restaurarTicket,
            eliminarDefinitivamente
        }}>
            {children}
        </TicketContext.Provider>
    );
}