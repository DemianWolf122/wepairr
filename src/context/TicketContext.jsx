// ... (mismo inicio)
export function TicketProvider({ children }) {
    const [tickets, setTickets] = useState(() => {
        const guardados = localStorage.getItem('wepairr_tickets');
        return guardados ? JSON.parse(guardados) : [
            { id: 1, equipo: 'Ejemplo', falla: 'Prueba', tipo: 'ticket', estado: 'Ingresado', borrado: false }
        ];
    });

    // ... (efecto de guardado igual)

    const agregarTicket = (nuevoTicket) => {
        // Por defecto, todo lo que entra por la web es una 'consulta'
        setTickets(prev => [...prev, { ...nuevoTicket, tipo: 'consulta', borrado: false }]);
    };

    // Función nueva para "Promover" una consulta a Reparación Real
    const convertirATicket = (id) => {
        setTickets(prev => prev.map(t =>
            t.id === id ? { ...t, tipo: 'ticket' } : t
        ));
    };

    // ... (resto de funciones igual)

    return (
        <TicketContext.Provider value={{
            tickets, agregarTicket, actualizarEstadoTicket,
            moverAPapelera, restaurarTicket, eliminarDefinitivamente,
            convertirATicket // <-- Exportamos la nueva función
        }}>
            {children}
        </TicketContext.Provider>
    );
}