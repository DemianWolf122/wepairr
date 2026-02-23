import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const TicketContext = createContext();

export const TicketProvider = ({ children }) => {
    const [tickets, setTickets] = useState([]);

    // Cargar tickets desde Supabase al iniciar
    useEffect(() => {
        const fetchTickets = async () => {
            const { data, error } = await supabase
                .from('tickets')
                .select('*')
                .order('id', { ascending: false });

            if (data) setTickets(data);
            if (error) console.error("Error cargando tickets:", error);
        };

        fetchTickets();
    }, []);

    const actualizarEstadoTicket = async (id, nuevoEstado) => {
        setTickets(prev => prev.map(t => t.id === id ? { ...t, estado: nuevoEstado } : t));
        await supabase.from('tickets').update({ estado: nuevoEstado }).eq('id', id);
    };

    const actualizarPresupuesto = async (id, nuevoPresupuesto) => {
        setTickets(prev => prev.map(t => {
            if (t.id === id) {
                const nuevoEst = t.estado === 'Ingresado' ? 'Presupuestado' : t.estado;
                return { ...t, presupuesto: nuevoPresupuesto, estado: nuevoEst };
            }
            return t;
        }));

        const ticketActual = tickets.find(t => t.id === id);
        const estadoFinal = ticketActual?.estado === 'Ingresado' ? 'Presupuestado' : ticketActual?.estado;

        await supabase.from('tickets').update({
            presupuesto: nuevoPresupuesto,
            estado: estadoFinal
        }).eq('id', id);
    };

    const moverAPapelera = async (id) => {
        setTickets(prev => prev.map(t => t.id === id ? { ...t, borrado: true } : t));
        await supabase.from('tickets').update({ borrado: true }).eq('id', id);
    };

    const restaurarTicket = async (id) => {
        setTickets(prev => prev.map(t => t.id === id ? { ...t, borrado: false } : t));
        await supabase.from('tickets').update({ borrado: false }).eq('id', id);
    };

    const eliminarDefinitivamente = async (id) => {
        setTickets(prev => prev.filter(t => t.id !== id));
        await supabase.from('tickets').delete().eq('id', id);
    };

    const convertirATicket = async (id) => {
        setTickets(prev => prev.map(t => t.id === id ? { ...t, tipo: 'ticket', estado: 'Ingresado' } : t));
        await supabase.from('tickets').update({ tipo: 'ticket', estado: 'Ingresado' }).eq('id', id);
    };

    const agregarTicketManual = async (datosTicket) => {
        const nuevoId = tickets.length > 0 ? Math.max(...tickets.map(t => t.id)) + 1 : 101;
        const ahora = new Date();
        const nuevoTicket = {
            id: nuevoId,
            tipo: 'ticket',
            fechaIngreso: ahora.toISOString(),
            estado: 'Ingresado',
            presupuesto: datosTicket.presupuestoInicial || null,
            prioridad: datosTicket.prioridad || 'Normal',
            borrado: false,
            ...datosTicket
        };

        setTickets(prev => [nuevoTicket, ...prev]);
        await supabase.from('tickets').insert([nuevoTicket]);
    };

    const editarTicket = async (id, datosActualizados) => {
        setTickets(prev => prev.map(t => t.id === id ? { ...t, ...datosActualizados } : t));
        await supabase.from('tickets').update(datosActualizados).eq('id', id);
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