import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // INYECTADO: Conexión al backend

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

    // 2. CARGAR TICKETS AISLADOS POR USUARIO
    useEffect(() => {
        if (isInitialized) {
            if (user) {
                // Sistema Inteligente: Guarda en base de datos local asociada al ID del usuario
                // Esto garantiza que el Taller A no vea los tickets del Taller B.
                const storageKey = `wepairr_tickets_${user.id}`;
                try {
                    const guardados = localStorage.getItem(storageKey);
                    if (guardados) {
                        setTickets(JSON.parse(guardados));
                    } else {
                        setTickets([]); // Si es nuevo, arranca vacío
                    }
                } catch (error) {
                    console.error("Error al leer tickets del usuario", error);
                    setTickets([]);
                }

                // NOTA: Cuando crees la tabla 'tickets' en Supabase, el fetch real iría aquí
                // const { data } = await supabase.from('tickets').select('*').eq('user_id', user.id);
            } else {
                setTickets([]); // Si cierra sesión, se borran los tickets de la pantalla
            }
        }
    }, [user, isInitialized]);

    // 3. GUARDAR CAMBIOS CADA VEZ QUE SE MODIFICA UN TICKET
    useEffect(() => {
        if (user && isInitialized) {
            const storageKey = `wepairr_tickets_${user.id}`;
            try {
                localStorage.setItem(storageKey, JSON.stringify(tickets));
                // NOTA: El upsert a Supabase iría aquí en el futuro
            } catch (error) {
                console.error('Error guardando tickets', error);
            }
        }
    }, [tickets, user, isInitialized]);

    // --- FUNCIONES ORIGINALES INTACTAS ---

    const agregarTicket = (ticketData) => {
        const nuevoTicket = { ...ticketData, id: Date.now(), fecha: new Date().toISOString(), estado: 'Ingresado', tipo: 'consulta' };
        setTickets(prev => [nuevoTicket, ...prev]);
    };

    const agregarTicketManual = (ticketData) => {
        const nuevoTicket = { ...ticketData, id: Date.now(), fecha: new Date().toISOString(), estado: 'Ingresado', tipo: 'ticket' };
        setTickets(prev => [nuevoTicket, ...prev]);
    };

    const convertirATicket = (id) => {
        setTickets(prev => prev.map(t => t.id === id ? { ...t, tipo: 'ticket' } : t));
    };

    const actualizarEstadoTicket = (id, nuevoEstado) => {
        setTickets(prev => prev.map(t => t.id === id ? { ...t, estado: nuevoEstado } : t));
    };

    const actualizarPresupuesto = (id, nuevoPresupuesto) => {
        setTickets(prev => prev.map(t => t.id === id ? { ...t, presupuesto: nuevoPresupuesto } : t));
    };

    const editarTicket = (id, nuevosDatos) => {
        setTickets(prev => prev.map(t => t.id === id ? { ...t, ...nuevosDatos } : t));
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