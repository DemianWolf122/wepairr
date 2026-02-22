/**
 * Utilidad nativa para generar comprobantes en PDF sin depender de librerías externas.
 * Crea una ventana temporal de impresión con formato premium y lanza el diálogo de impresión.
 */

const generarPDF = (ticket) => {
    const isDarkMode = document.documentElement.classList.contains('dark');

    // Obtenemos la configuración del negocio si existe
    let config = { nombreNegocio: 'Servicio Técnico', whatsapp: '' };
    try {
        const savedConfig = localStorage.getItem('wepairr_config');
        if (savedConfig) config = JSON.parse(savedConfig);
    } catch (e) { }

    // Formatear Fecha
    const fecha = ticket.fechaIngreso || ticket.fecha || new Date().toISOString();
    const dateObj = new Date(fecha);
    const fechaFormateada = dateObj.toLocaleDateString('es-AR') + ' ' + dateObj.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

    // Construcción del HTML de impresión
    const printWindow = window.open('', '', 'height=800,width=800');

    const htmlContent = `
        <html>
            <head>
                <title>Comprobante - Orden #${ticket.id}</title>
                <style>
                    body { 
                        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
                        padding: 40px; 
                        color: #1a1a1a;
                        background: #ffffff;
                    }
                    .ticket-container {
                        max-width: 600px;
                        margin: 0 auto;
                        border: 2px solid #e5e7eb;
                        border-radius: 16px;
                        padding: 40px;
                    }
                    .header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        border-bottom: 2px solid #e5e7eb;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .brand { font-size: 24px; font-weight: 900; color: #2563eb; margin: 0; }
                    .order-id { font-size: 18px; color: #6b7280; font-weight: bold; }
                    .section-title { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af; margin-bottom: 5px; }
                    .data-row { margin-bottom: 20px; }
                    .data-text { font-size: 18px; font-weight: 700; margin: 0; }
                    .problem-box {
                        background: #f3f4f6;
                        padding: 20px;
                        border-radius: 12px;
                        margin-top: 30px;
                    }
                    .problem-text { font-style: italic; color: #4b5563; line-height: 1.5; margin: 0; }
                    .footer {
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 2px dashed #e5e7eb;
                        text-align: center;
                        font-size: 14px;
                        color: #6b7280;
                    }
                    .status-badge {
                        display: inline-block;
                        padding: 8px 16px;
                        background: #f3f4f6;
                        border-radius: 99px;
                        font-weight: bold;
                        font-size: 14px;
                        margin-top: 10px;
                    }
                </style>
            </head>
            <body>
                <div class="ticket-container">
                    <div class="header">
                        <h1 class="brand">${config.nombreNegocio}</h1>
                        <span class="order-id">ORDEN DE SERVICIO #${ticket.id}</span>
                    </div>

                    <div style="display: flex; justify-content: space-between;">
                        <div class="data-row">
                            <div class="section-title">Datos del Cliente</div>
                            <p class="data-text">${ticket.cliente?.nombre || 'Consumidor Final'}</p>
                            <span style="color: #6b7280;">Tel: ${ticket.cliente?.telefono || '-'}</span>
                        </div>
                        <div class="data-row" style="text-align: right;">
                            <div class="section-title">Fecha de Ingreso</div>
                            <p class="data-text" style="font-size: 16px;">${fechaFormateada}</p>
                        </div>
                    </div>

                    <div class="data-row" style="margin-top: 10px;">
                        <div class="section-title">Equipo a reparar</div>
                        <p class="data-text" style="font-size: 22px;">${ticket.dispositivo}</p>
                    </div>

                    <div class="problem-box">
                        <div class="section-title">Falla Reportada / Trabajo a realizar</div>
                        <p class="problem-text">"${ticket.problema}"</p>
                    </div>

                    <div style="display: flex; justify-content: space-between; margin-top: 30px; align-items: center;">
                        <div>
                            <div class="section-title">Estado Actual</div>
                            <div class="status-badge">${ticket.estado}</div>
                        </div>
                        <div style="text-align: right;">
                            <div class="section-title">Presupuesto Estimado</div>
                            <p class="data-text" style="font-size: 24px; color: #059669;">
                                ${ticket.presupuesto ? `$${ticket.presupuesto}` : 'A Confirmar'}
                            </p>
                        </div>
                    </div>

                    <div class="footer">
                        <p>Conserve este comprobante para retirar su equipo.</p>
                        ${config.whatsapp ? `<p>Contacto: ${config.whatsapp}</p>` : ''}
                    </div>
                </div>
            </body>
        </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Esperamos a que el navegador renderice para lanzar la ventana de impresión
    setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        // Opcional: printWindow.close() después de imprimir;
    }, 250);
};

export default generarPDF;