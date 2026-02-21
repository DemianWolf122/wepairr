import { jsPDF } from 'jspdf';

export const generarReciboPDF = (ticket) => {
    // Recuperamos la configuración del taller para personalizar el PDF
    const configLocal = JSON.parse(localStorage.getItem('wepairr_config')) || {};
    const nombreTaller = configLocal.titulo || 'Wepairr Taller';

    // Inicializamos el documento en formato A4
    const doc = new jsPDF();

    // --- CABECERA ---
    doc.setFillColor(15, 15, 15);
    doc.rect(0, 0, 210, 40, 'F'); // Rectángulo oscuro superior

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text(nombreTaller, 15, 25);

    // --- DATOS DEL COMPROBANTE ---
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text('Orden de Servicio Técnico', 15, 60);

    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text(`Nº de Ticket: #${ticket.id}`, 15, 75);

    // Utilizamos el ID (Date.now()) para formatear la fecha de ingreso
    const fechaIngreso = new Date(ticket.id).toLocaleDateString('es-AR', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    doc.text(`Fecha de ingreso: ${fechaIngreso}`, 15, 82);

    doc.setDrawColor(200, 200, 200);
    doc.line(15, 90, 195, 90); // Línea divisoria

    // --- DETALLES DEL EQUIPO ---
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text('Detalles del Dispositivo', 15, 105);

    doc.setFontSize(12);
    doc.text(`Equipo:`, 15, 115);
    doc.setFont('helvetica', 'bold');
    doc.text(ticket.equipo, 35, 115);

    doc.setFont('helvetica', 'normal');
    doc.text(`Reporte:`, 15, 125);

    // Función para manejar textos largos sin que se salgan de la página
    const splitFalla = doc.splitTextToSize(ticket.falla, 160);
    doc.text(splitFalla, 35, 125);

    // --- PRESUPUESTO Y ESTADO ---
    const alturaPresupuesto = 125 + (splitFalla.length * 7) + 20;

    doc.setDrawColor(200, 200, 200);
    doc.line(15, alturaPresupuesto - 10, 195, alturaPresupuesto - 10);

    doc.setFontSize(12);
    doc.text('Estado actual:', 15, alturaPresupuesto);
    doc.setFont('helvetica', 'bold');
    doc.text(ticket.estado.toUpperCase(), 45, alturaPresupuesto);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(16);
    doc.text('Total Presupuestado:', 15, alturaPresupuesto + 15);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(34, 139, 34); // Color verde para el dinero
    doc.text(`$${ticket.presupuesto.toLocaleString('es-AR')}`, 65, alturaPresupuesto + 15);

    // --- PIE DE PÁGINA LEGAL ---
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Términos y Condiciones:', 15, 260);
    doc.text('1. Los presupuestos tienen una validez de 7 días hábiles.', 15, 265);
    doc.text('2. Pasados los 90 días sin retirar, el equipo se considerará abandonado.', 15, 270);
    doc.text('Generado automáticamente por la plataforma Wepairr.', 15, 285);

    // Dispara la descarga en el navegador
    doc.save(`Ticket_${ticket.id}_Wepairr.pdf`);
};