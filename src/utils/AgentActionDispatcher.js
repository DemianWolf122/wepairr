// src/utils/AgentActionDispatcher.js

export const executeAgentAction = async (actionType, payload, appContext) => {
    const {
        theme, toggleTheme, config, setConfig,
        tickets, agregarTicketManual, actualizarEstadoTicket,
        // Aquí inyectaremos después: inventario, agregarGasto, etc.
    } = appContext;

    let responseMessage = "";
    let isSuccess = true;

    try {
        switch (actionType) {
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
                    actualizarEstadoTicket(payload[0], payload[1]);
                    responseMessage = `El ticket ID:${payload[0]} fue movido a la columna "${payload[1]}".`;
                }
                break;
            case 'TICKET_PRICE':
                if (actualizarPresupuesto && payload.length >= 2) {
                    actualizarPresupuesto(payload[0], payload[1]);
                    responseMessage = `Presupuesto de ${config?.moneda || '$'} ${payload[1]} guardado en el ticket ID:${payload[0]}.`;
                } else {
                    responseMessage = `Actualización de presupuesto solicitada, pero no encontré el contexto necesario (Ticket ID: ${payload[0]}).`;
                }
                break;
            case 'TICKET_NOTE':
                responseMessage = `[Acción Emulada] Nota técnica ("${payload[1]}") añadida al ticket ID:${payload[0]}. (La plataforma de notas está en desarrollo)`;
                break;
            case 'TICKET_WARRANTY':
                responseMessage = `[Acción Emulada] Garantía de ${payload[1]} aplicada al ticket ID:${payload[0]}. (Gestor de garantías en desarrollo)`;
                break;
            case 'TICKET_EXPORT_PDF':
                responseMessage = `Generando vista preliminar en PDF del ticket ID:${payload[0]}... (Generador remoto en mantenimiento)`;
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
                responseMessage = `[Emulado] Registré ${payload[1]} unidades de "${payload[0]}" en el inventario. Costo: ${payload[2]}, Venta: ${payload[3]}. (Conexión a BD en proceso)`;
                break;
            case 'INV_DECREASE':
                responseMessage = `[Emulado] Desconté ${payload[1]} unidades de "${payload[0]}" del almacén.`;
                break;
            case 'INV_MARK_RMA':
                responseMessage = `[Emulado] El repuesto "${payload[0]}" fue marcado como defectuoso (RMA). Motivo: ${payload[1]}.`;
                break;
            case 'INV_LOW_STOCK':
                responseMessage = `Analizando la base de datos para generar tu lista de compras a proveedores...`;
                break;

            // ==========================================
            // 💰 FINANZAS Y CAJA DIARIA
            // ==========================================
            case 'FINANCE_EXPENSE':
                responseMessage = `[Emulado Diario] Gasto reportado: -${config?.moneda || '$'}${payload[0]} por concepto de "${payload[1]}". (BD Gastos pendiente)`;
                break;
            case 'FINANCE_INCOME':
                responseMessage = `[Emulado Diario] Ingreso extra reportado de +${config?.moneda || '$'}${payload[0]} en caja manual. (${payload[1]})`;
                break;
            case 'FINANCE_DAILY_CLOSE':
                responseMessage = `Generando el cierre de caja del día actual...`;
                break;

            // ==========================================
            // ⚙️ HERRAMIENTAS (TOOLS VIEW)
            // ==========================================
            case 'TOOL_OHM':
                responseMessage = `Abriendo la calculadora de Ley de Ohm para tus parámetros.`;
                break;
            case 'TOOL_TIMER_START':
                responseMessage = `¡Cronómetro de reparación iniciado! El tiempo es oro.`;
                break;

            // ==========================================
            // DEFAULT (Para el resto de comandos)
            // ==========================================
            default:
                console.log(`Comando [${actionType}] recibido, pero el módulo backend está en desarrollo. Payload:`, payload);
                responseMessage = `He recibido la orden [${actionType}]. (Esta función se activará en tu próxima actualización de software).`;
        }
    } catch (err) {
        console.error(`Error crítico ejecutando acción IA (${actionType}):`, err);
        responseMessage = `Hubo un cortocircuito interno al procesar tu solicitud.`;
        isSuccess = false;
    }

    return { message: responseMessage, success: isSuccess };
};