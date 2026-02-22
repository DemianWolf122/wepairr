import React, { createContext, useState, useEffect } from 'react';

export const TicketContext = createContext();

// Datos de prueba iniciales (simula una base de datos)
const TICKETS_INICIALES = [
    { id: 101, tipo: 'consulta', cliente: 'Ana Clara', dispositivo: 'iPhone 11', problema: 'Pantalla rota, táctil no responde en la zona superior.', fecha: '2024-05-20 10:30', estado: 'Pendiente', presupuesto: null, borrado: false },
    { id: 102, tipo: 'ticket', cliente: 'Carlos Ruiz', dispositivo: 'Samsung S21 FE', problema: 'No carga, puerto flojo.', fecha: '2024-05-19 15:45', estado: 'En Proceso', presupuesto: '$45.000', borrado: false },
    { id: 103, tipo: 'ticket', cliente: 'Lucía Méndez', dispositivo: 'MacBook Air M1', problema: 'Derrame de líquido, no enciende.', fecha: '2024-05-18 09:15', estado: 'Ingresado', presupuesto: null, borrado: false },
    { id: 104, tipo: 'consulta', cliente: 'Marcos Paz', dispositivo: 'Xiaomi Redmi Note 10', problema: 'Batería dura poco.', fecha: '2024-05-21 11:00', estado: 'Pendiente', presupuesto: null, borrado: true }
];

export const TicketProvider = ({ children }) => {
    const [tickets, setTickets] = useState(() => {
        const datosGuardados = localStorage.getItem('wepairr_tickets');
        return datosGuardados ? JSON.parse(datosGuardados) : TICKETS_INICIALES;
    });

    useEffect(() => {
        localStorage.setItem('wepairr_tickets', JSON.stringify(tickets));
    }, [tickets]);

    // --- FUNCIONES EXISTENTES ---
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

    // --- NUEVA FUNCIÓN: INGRESO MANUAL ---
    const agregarTicketManual = (datosTicket) => {
        const nuevoId = tickets.length > 0 ? Math.max(...tickets.map(t => t.id)) + 1 : 101;
        const ahora = new Date();
        const fechaFormateada = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}-${String(ahora.getDate()).padStart(2, '0')} ${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;

        const nuevoTicket = {
            id: nuevoId,
            tipo: 'ticket', // Siempre entra como ticket activo
            fecha: fechaFormateada,
            estado: 'Ingresado',
            presupuesto: datosTicket.presupuestoInicial || null,
            borrado: false,
            ...datosTicket // cliente, dispositivo, problema, prioridad, etc.
        };

        setTickets(prev => [nuevoTicket, ...prev]);
    };


    return (
        <TicketContext.Provider value={{
            tickets,
            actualizarEstadoTicket,
            actualizarPresupuesto,
            moverAPapelera,
            restaurarTicket,
            eliminarDefinitivamente,
            convertirATicket,
            agregarTicketManual // Exportamos la nueva función
        }}>
            {children}
        </TicketContext.Provider>
    );
};