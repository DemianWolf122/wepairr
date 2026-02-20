import React, { createContext, useState } from 'react';

export const TicketContext = createContext();

export function TicketProvider({ children }) {
    const [tickets, setTickets] = useState([
        { id: 1, equipo: 'Samsung S23 Ultra', falla: 'No carga', presupuesto: 45000, estado: 'Ingresado', tecnicoId: 'electro-fix', borrado: false }
    ]);

    const agregarTicket = (nuevoTicket) => {
        setTickets(prev => [...prev, { ...nuevoTicket, borrado: false }]);
    };

    const actualizarEstadoTicket = (id, nuevoEstado) => {
        setTickets(prev => prev.map(ticket =>
            ticket.id === id ? { ...ticket, estado: nuevoEstado } : ticket
        ));
    };

    // Función para mover a la papelera (Soft Delete)
    const moverAPapelera = (id) => {
        setTickets(prev => prev.map(ticket =>
            ticket.id === id ? { ...ticket, borrado: true } : ticket
        ));
    };

    // Función para restaurar desde la papelera
    const restaurarTicket = (id) => {
        setTickets(prev => prev.map(ticket =>
            ticket.id === id ? { ...ticket, borrado: false } : ticket
        ));
    };

    // Función para borrar definitivamente (Hard Delete)
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