// src/utils/AgentActionDispatcher.js

export const executeAgentAction = async (actionType, payload, appContext) => {
    const {
        theme, toggleTheme, config, setConfig,
        tickets, agregarTicketManual, actualizarEstadoTicket,
        actualizarPresupuesto, editarTicket, // FIX 2: Recibimos las nuevas herramientas
        navigate // 🚀 NUEVO: El poder de viajar entre páginas
    } = appContext;

    let responseMessage = "";
    let isSuccess = true;

    // FIX 3: Función de seguridad para limpiar cualquier caracter raro y convertir a Número (Obligatorio para TicketContext)
    const secureTicketId = (strId) => parseInt(strId.replace(/\D/g, ''), 10);

    try {
        switch (actionType) {
            // ==========================================
            // 🚀 NAVEGACIÓN AUTÓNOMA DE LA IA
            // ==========================================
            case 'NAVIGATE':
                if (navigate && payload.length > 0) {
                    const ruta = payload[0].replace(/['"]/g, '').trim();
                    navigate(ruta);
                    responseMessage = `Te he redirigido a la pantalla solicitada.`;
                } else {
                    responseMessage = `No pude encontrar la ruta especificada.`;
                    isSuccess = false;
                }
                break;

            // ==========================================
            // 🎨 INTERFAZ Y AJUSTES VISUALES
            // ==========================================
            case 'UI_THEME':
                if (payload[0] === 'dark' && theme !== 'dark') { toggleTheme(); responseMessage = "Modo Oscuro activado. Protegiendo tus ojos."; }
                else if (payload[0] === 'light' && theme !== 'light') { toggleTheme(); responseMessage = "Modo Claro activado. Que se haga la luz."; }
                else { responseMessage = "El tema ya está configurado así."; }
                break;
            case 'CONFIG_CURRENCY':
                if (setConfig) { setConfig(p => ({ ...p, moneda: payload[0] })); responseMessage = `Moneda global actualizada a ${payload[0]}.`; }
                break;
            case 'CONFIG_NAME':
                if (setConfig) { setConfig(p => ({ ...p, nombreNegocio: payload[0].replace(/^"|"$/g, '') })); responseMessage = `Renombré el taller a ${payload[0]}.`; }
                break;

            // ==========================================
            // 🛠️ CONTROL DE TICKETS Y WORKFLOW
            // ==========================================
            case 'TICKET_CREATE':
                if (agregarTicketManual && payload.length >= 4) {
                    agregarTicketManual({
                        cliente: { nombre: payload[0], telefono: payload[1], email: '' },
                        dispositivo: payload[2],
                        problema: payload[3],
                        presupuestoInicial: '0',
                        tipo: 'reparacion'
                    });
                    responseMessage = `Ingresé el equipo de ${payload[0]} (${payload[2]}) al sistema.`;
                }
                break;
            case 'TICKET_MOVE':
                if (actualizarEstadoTicket && payload.length >= 2) {
                    const ticketId = secureTicketId(payload[0]);
                    actualizarEstadoTicket(ticketId, payload[1]);
                    responseMessage = `El ticket fue movido a la columna "${payload[1]}".`;
                }
                break;
            case 'TICKET_PRICE':
                if (actualizarPresupuesto && payload.length >= 2) {
                    const ticketId = secureTicketId(payload[0]);
                    actualizarPresupuesto(ticketId, payload[1]);
                    responseMessage = `Presupuesto de ${config?.moneda || '$'} ${payload[1]} guardado correctamente en el ticket.`;
                } else {
                    responseMessage = `Actualización de presupuesto fallida, no encontré el ID en tu sistema.`;
                }
                break;
            case 'TICKET_NOTE':
                if (editarTicket && payload.length >= 2) {
                    const ticketId = secureTicketId(payload[0]);
                    // Escribe directo en el TicketContext (añadiendo el campo "nota")
                    editarTicket(ticketId, { nota_interna: payload[1] });
                    responseMessage = `Nota técnica secreta añadida al ticket con éxito.`;
                }
                break;
            case 'TICKET_WARRANTY':
                if (editarTicket && payload.length >= 2) {
                    const ticketId = secureTicketId(payload[0]);
                    editarTicket(ticketId, { tiempoGarantia: payload[1] });
                    responseMessage = `Garantía de ${payload[1]} vinculada al ticket correctamente.`;
                }
                break;
            case 'TICKET_EXPORT_PDF':
                responseMessage = `Generando vista preliminar en PDF del ticket ID:${payload[0]}... (Llamando al módulo generador)`;
                break;

            // ==========================================
            // 📞 CRM Y COMUNICACIÓN (CLIENTES)
            // ==========================================
            case 'CLIENT_WA':
                const num = payload[0].replace(/\D/g, '');
                const text = encodeURIComponent(payload[1] || 'Hola, nos comunicamos de Wepairr.');
                window.open(`https://wa.me/${num}?text=${text}`, '_blank');
                responseMessage = `Abriendo WhatsApp Web para contactar al número ${payload[0]}.`;
                break;
            case 'CLIENT_CALL':
                window.open(`tel:${payload[0]}`, '_self');
                responseMessage = `Iniciando llamada al ${payload[0]}...`;
                break;

            // ==========================================
            // 📦 CONTROL DE INVENTARIO Y STOCK
            // ==========================================
            case 'INV_ADD':
                responseMessage = `[En Desarrollo] Registré ${payload[1]} unidades de "${payload[0]}" en el inventario. Costo: ${payload[2]}, Venta: ${payload[3]}.`;
                break;
            case 'INV_DECREASE':
                responseMessage = `[En Desarrollo] Desconté ${payload[1]} unidades de "${payload[0]}" del almacén.`;
                break;
            case 'INV_MARK_RMA':
                responseMessage = `[En Desarrollo] El repuesto "${payload[0]}" fue marcado como defectuoso (RMA). Motivo: ${payload[1]}.`;
                break;
            case 'INV_LOW_STOCK':
                responseMessage = `Analizando la base de datos para generar tu lista de compras a proveedores...`;
                break;

            // ==========================================
            // 💰 FINANZAS Y CAJA DIARIA
            // ==========================================
            case 'FINANCE_EXPENSE':
                responseMessage = `[Gastos] Gasto reportado: -${config?.moneda || '$'}${payload[0]} por concepto de "${payload[1]}". (BD Gastos pendiente)`;
                break;
            case 'FINANCE_INCOME':
                responseMessage = `[Ingresos] Ingreso extra reportado de +${config?.moneda || '$'}${payload[0]} en caja manual. (${payload[1]})`;
                break;
            case 'FINANCE_DAILY_CLOSE':
                responseMessage = `Generando el cierre de caja del día actual...`;
                break;

            // ==========================================
            // ⚙️ HERRAMIENTAS (TOOLS VIEW)
            // ==========================================
            case 'TOOL_OHM':
                if (navigate) navigate('/tools'); // Te lleva a herramientas si lo pedís
                responseMessage = `Calculando la Ley de Ohm para ${payload[0]} y ${payload[1]}...`;
                break;
            case 'TOOL_TIMER_START':
                if (navigate) navigate('/tools'); // Te lleva a herramientas si lo pedís
                responseMessage = `¡Cronómetro de reparación iniciado! El tiempo es oro.`;
                break;

            // ==========================================
            // DEFAULT (Para evitar cuelgues)
            // ==========================================
            default:
                console.log(`Comando [${actionType}] recibido, pero la conexión no está lista. Payload:`, payload);
                responseMessage = `He recibido la orden de [${actionType}], pero la estructura de base de datos aún se está construyendo.`;
        }
    } catch (err) {
        console.error(`Error crítico ejecutando acción IA (${actionType}):`, err);
        responseMessage = `Hubo un cortocircuito interno al procesar tu solicitud. Verifica la consola.`;
        isSuccess = false;
    }

    return { message: responseMessage, success: isSuccess };
};