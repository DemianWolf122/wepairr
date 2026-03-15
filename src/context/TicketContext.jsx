import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const TicketContext = createContext();

export const TicketProvider = ({ children }) => {
    const [tickets, setTickets] = useState([]);
    const [user, setUser] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // 1. DETECTAR EL USUARIO LOGUEADO
    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || null);
            setIsInitialized(true);
        };
        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        return () => subscription.unsubscribe();
    }, []);

    // 2. CARGAR TICKETS DESDE SUPABASE EN TIEMPO REAL
    useEffect(() => {
        if (isInitialized) {
            if (user) {
                const fetchTickets = async () => {
                    // Carga los tickets del taller específico desde la nube
                    const { data, error } = await supabase
                        .from('tickets')
                        .select('*')
                        .eq('user_id', user.id)
                        .order('id', { ascending: false });

                    if (error) {
                        console.error("Error al cargar tickets de Supabase:", error);
                    } else if (data) {
                        setTickets(data);
                    }
                };

                fetchTickets();

                // Opcional: Aquí podrías agregar un canal de Supabase Realtime
                // para que si un empleado crea un ticket, aparezca en la pantalla de los demás.
            } else {
                setTickets([]); // Seguridad: vaciar estado si no hay sesión
            }
        }
    }, [user, isInitialized]);

    // COLUMNAS VÁLIDAS: Solo estos campos se envían a Supabase para evitar errores PGRST204
    const VALID_COLUMNS = [
        'id', 'user_id', 'fecha', 'estado', 'tipo', 'borrado',
        'cliente', 'dispositivo', 'problema', 'prioridad', 'presupuesto',
        'codigo_interno', 'tecnico_asignado', 'nota_interna', 'tiempoGarantia'
    ];

    const sanitizeForDB = (obj) => {
        const clean = {};
        for (const key of VALID_COLUMNS) {
            if (key in obj) clean[key] = obj[key];
        }
        return clean;
    };


    // 3. FUNCIONES CRUD SINCRONIZADAS CON LA NUBE

    const agregarTicket = async (ticketData) => {
        if (!user) return;
        const nuevoTicket = {
            ...ticketData,
            id: Date.now(), // En producción podrías usar UUID de Supabase
            user_id: user.id,
            fecha: new Date().toISOString(),
            estado: 'Ingresado',
            tipo: 'consulta',
            borrado: false
        };

        // Optimistic UI (Aparece al instante en la pantalla)
        setTickets(prev => [nuevoTicket, ...prev]);

        // Guardado en Backend
        const { error } = await supabase.from('tickets').insert([sanitizeForDB(nuevoTicket)]);
        if (error) console.error("❌ Error insertando consulta:", error.message, error.details, error);
    };

    const agregarTicketManual = async (ticketData) => {
        if (!user) return;
        const nuevoTicket = {
            ...ticketData,
            id: Date.now(),
            user_id: user.id,
            fecha: new Date().toISOString(),
            estado: 'Ingresado',
            tipo: 'ticket',
            borrado: false
        };

        setTickets(prev => [nuevoTicket, ...prev]);

        const { error } = await supabase.from('tickets').insert([sanitizeForDB(nuevoTicket)]);
        if (error) console.error("❌ Error insertando ticket manual:", error.message, error.details, error);
    };

    const convertirATicket = async (id) => {
        setTickets(prev => prev.map(t => t.id === id ? { ...t, tipo: 'ticket' } : t));
        if (user) {
            await supabase.from('tickets').update({ tipo: 'ticket' }).eq('id', id);
        }
    };

    const actualizarEstadoTicket = async (id, nuevoEstado) => {
        setTickets(prev => prev.map(t => t.id === id ? { ...t, estado: nuevoEstado } : t));
        if (user) {
            await supabase.from('tickets').update({ estado: nuevoEstado }).eq('id', id);
        }
    };

    const actualizarPresupuesto = async (id, nuevoPresupuesto) => {
        setTickets(prev => prev.map(t => t.id === id ? { ...t, presupuesto: nuevoPresupuesto } : t));
        if (user) {
            await supabase.from('tickets').update({ presupuesto: nuevoPresupuesto }).eq('id', id);
        }
    };

    const editarTicket = async (id, nuevosDatos) => {
        setTickets(prev => prev.map(t => t.id === id ? { ...t, ...nuevosDatos } : t));
        if (user) {
            await supabase.from('tickets').update(nuevosDatos).eq('id', id);
        }
    };

    const moverAPapelera = async (id) => {
        setTickets(prev => prev.map(t => t.id === id ? { ...t, borrado: true } : t));
        if (user) {
            await supabase.from('tickets').update({ borrado: true }).eq('id', id);
        }
    };

    const restaurarTicket = async (id) => {
        setTickets(prev => prev.map(t => t.id === id ? { ...t, borrado: false } : t));
        if (user) {
            await supabase.from('tickets').update({ borrado: false }).eq('id', id);
        }
    };

    const eliminarDefinitivamente = async (id) => {
        setTickets(prev => prev.filter(t => t.id !== id));
        if (user) {
            await supabase.from('tickets').delete().eq('id', id);
        }
    };

    return (
        <TicketContext.Provider value={{
            tickets, agregarTicket, agregarTicketManual, actualizarEstadoTicket,
            actualizarPresupuesto, editarTicket, moverAPapelera, restaurarTicket,
            eliminarDefinitivamente, convertirATicket
        }}>
            {children}
        </TicketContext.Provider>
    );
};