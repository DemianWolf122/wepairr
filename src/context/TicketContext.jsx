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

            if (data) {
                setTickets(data);
            }
            if (error) {
                console.error("❌ ERROR CARGANDO TICKETS DE SUPABASE:", error.message, error.details);
            }
        };

        fetchTickets();
    }, []);

    const actualizarEstadoTicket = async (id, nuevoEstado) => {
        setTickets(prev => prev.map(t => t.id === id ? { ...t, estado: nuevoEstado } : t));
        const { error } = await supabase.from('tickets').update({ estado: nuevoEstado }).eq('id', id);
        if (error) console.error("❌ ERROR ACTUALIZANDO ESTADO:", error.message);
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

        const { error } = await supabase.from('tickets').update({
            presupuesto: nuevoPresupuesto,
            estado: estadoFinal
        }).eq('id', id);
        if (error) console.error("❌ ERROR ACTUALIZANDO PRESUPUESTO:", error.message);
    };

    const moverAPapelera = async (id) => {
        setTickets(prev => prev.map(t => t.id === id ? { ...t, borrado: true } : t));
        const { error } = await supabase.from('tickets').update({ borrado: true }).eq('id', id);
        if (error) console.error("❌ ERROR MOVIENDO A PAPELERA:", error.message);
    };

    const restaurarTicket = async (id) => {
        setTickets(prev => prev.map(t => t.id === id ? { ...t, borrado: false } : t));
        const { error } = await supabase.from('tickets').update({ borrado: false }).eq('id', id);
        if (error) console.error("❌ ERROR RESTAURANDO TICKET:", error.message);
    };

    const eliminarDefinitivamente = async (id) => {
        setTickets(prev => prev.filter(t => t.id !== id));
        const { error } = await supabase.from('tickets').delete().eq('id', id);
        if (error) console.error("❌ ERROR ELIMINANDO TICKET:", error.message);
    };

    const convertirATicket = async (id) => {
        setTickets(prev => prev.map(t => t.id === id ? { ...t, tipo: 'ticket', estado: 'Ingresado' } : t));
        const { error } = await supabase.from('tickets').update({ tipo: 'ticket', estado: 'Ingresado' }).eq('id', id);
        if (error) console.error("❌ ERROR CONVIRTIENDO CONSULTA:", error.message);
    };

    const agregarTicketManual = async (datosTicket) => {
        // Generar un ID numérico basado en la fecha para evitar colisiones
        const nuevoId = new Date().getTime();
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

        // Actualizamos la UI instantáneamente
        setTickets(prev => [nuevoTicket, ...prev]);

        // Mandamos a Supabase
        const { error } = await supabase.from('tickets').insert([nuevoTicket]);
        if (error) {
            console.error("❌ ERROR GUARDANDO EN SUPABASE:", error.message, error.details);
            alert("Hubo un error al guardar en Supabase. Revisa la consola (F12).");
        }
    };

    const editarTicket = async (id, datosActualizados) => {
        setTickets(prev => prev.map(t => t.id === id ? { ...t, ...datosActualizados } : t));
        const { error } = await supabase.from('tickets').update(datosActualizados).eq('id', id);
        if (error) console.error("❌ ERROR EDITANDO TICKET:", error.message);
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