import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const TicketContext = createContext();

export const TicketProvider = ({ children }) => {
    const [tickets, setTickets] = useState([]);

    // Cargar tickets desde Supabase
    useEffect(() => {
        const fetchTickets = async () => {
            const { data, error } = await supabase
                .from('tickets')
                .select('*')
                .order('id', { ascending: false });

            if (data) setTickets(data);
            if (error) console.error("❌ ERROR CARGANDO TICKETS:", error);
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
        const nuevoId = new Date().getTime();
        const ahora = new Date();

        // FIX CRÍTICO: Construimos el objeto EXACTO que Supabase espera,
        // descartando variables extrañas como "presupuestoInicial" que rompen el insert.
        const nuevoTicket = {
            id: nuevoId,
            tipo: 'ticket',
            cliente: datosTicket.cliente,
            dispositivo: datosTicket.dispositivo,
            problema: datosTicket.problema,
            fechaIngreso: ahora.toISOString(),
            estado: 'Ingresado',
            prioridad: datosTicket.prioridad || 'Normal',
            presupuesto: datosTicket.presupuestoInicial || null,
            borrado: false
        };

        const { error } = await supabase.from('tickets').insert([nuevoTicket]);

        if (error) {
            console.error("❌ ERROR AL GUARDAR TICKET EN SUPABASE:", error);
            throw error; // Lanza el error para que el formulario lo atrape
        }

        // Si se guardó con éxito en la base de datos, lo mostramos en la pantalla
        setTickets(prev => [nuevoTicket, ...prev]);
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