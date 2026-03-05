import React, { useState, useEffect, useMemo } from 'react';
import './MetricsView.css';

// --- SVGs ---
const SvgTrendingUp = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>;
const SvgActivity = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>;
const SvgCheckCircle = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const SvgDollarSign = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
const SvgDownload = () => <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>;
const SvgGlobe = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>;

function MetricsView({ tickets }) {
    const [usdRate, setUsdRate] = useState(null);
    const [isLoadingRate, setIsLoadingRate] = useState(true);

    // API INTEGRADA: Obtiene cotizaciones globales para cruzar con ingresos
    useEffect(() => {
        const fetchRates = async () => {
            try {
                const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
                const data = await response.json();
                if (data && data.rates && data.rates.ARS) {
                    setUsdRate(data.rates.ARS);
                }
            } catch (error) {
                console.error("Error al obtener cotización API:", error);
            } finally {
                setIsLoadingRate(false);
            }
        };
        fetchRates();
    }, []);

    // CÁLCULOS ANALÍTICOS AVANZADOS
    const metricas = useMemo(() => {
        const activos = tickets.filter(t => !t.borrado && t.tipo === 'ticket');

        let ingresosTotales = 0;
        let ingresosEstimados = 0;
        let entregados = 0;
        let enProceso = 0;
        let ingresados = 0;

        const dispositivosMap = {};

        activos.forEach(t => {
            const pres = parseFloat(t.presupuesto) || 0;

            // Ingresos reales (Ya en caja)
            if (t.estado === 'Entregado') {
                ingresosTotales += pres;
                entregados++;
            }
            // Dinero flotante (Aprobado o en taller)
            else if (t.estado === 'Finalizado' || t.estado === 'En Proceso') {
                ingresosEstimados += pres;
                if (t.estado === 'En Proceso') enProceso++;
            } else {
                ingresados++;
            }

            // Mapeo de dispositivos para el gráfico
            const tipo = t.dispositivo.split(' ')[0].toLowerCase(); // Toma la primera palabra (ej: iPhone, Samsung, PC)
            dispositivosMap[tipo] = (dispositivosMap[tipo] || 0) + 1;
        });

        const totalReparaciones = entregados + enProceso + ingresados + activos.filter(t => t.estado === 'Finalizado').length;
        const tasaExito = totalReparaciones > 0 ? Math.round(((entregados + activos.filter(t => t.estado === 'Finalizado').length) / totalReparaciones) * 100) : 0;
        const ticketPromedio = entregados > 0 ? (ingresosTotales / entregados) : 0;

        // Top 3 dispositivos
        const topDispositivos = Object.entries(dispositivosMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);

        return {
            ingresosTotales, ingresosEstimados, entregados, enProceso,
            ingresados, tasaExito, ticketPromedio, topDispositivos, totalReparaciones
        };
    }, [tickets]);

    // FUNCIÓN DE EXPORTACIÓN A EXCEL (CSV)
    const exportarAExcel = () => {
        const activos = tickets.filter(t => !t.borrado);
        if (activos.length === 0) return alert("No hay datos para exportar.");

        // 1. Definir las cabeceras del Excel
        const cabeceras = ['ID_Ticket', 'Fecha_Ingreso', 'Cliente_Nombre', 'Cliente_Telefono', 'Equipo', 'Falla', 'Estado', 'Prioridad', 'Presupuesto_Cobrado'];

        // 2. Mapear los datos de React a las filas del Excel
        const filas = activos.map(t => {
            const fechaFormateada = t.fecha ? new Date(t.fecha).toLocaleDateString('es-AR') : 'Sin Fecha';
            const presupuestoLimpio = t.presupuesto ? t.presupuesto.toString().replace(/\./g, '') : '0'; // Evita errores de separador de miles en Excel

            // Limpiar textos de comas para no romper el CSV
            const limpiarTexto = (txt) => txt ? `"${txt.replace(/"/g, '""')}"` : '""';

            return [
                t.id,
                fechaFormateada,
                limpiarTexto(t.cliente?.nombre),
                limpiarTexto(t.cliente?.telefono),
                limpiarTexto(t.dispositivo),
                limpiarTexto(t.problema),
                t.estado,
                t.prioridad,
                presupuestoLimpio
            ];
        });

        // 3. Crear el archivo CSV y forzar descarga
        const csvContent = [cabeceras.join(","), ...filas.map(e => e.join(","))].join("\n");
        const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' }); // \uFEFF asegura que Excel lea las tildes (UTF-8 BOM)

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `wepairr_metricas_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="metrics-wrapper animate-fade-in">
            <header className="metrics-header-container">
                <div>
                    <h2 style={{ fontSize: '2rem', margin: '0 0 5px 0', color: 'var(--text-primary)' }}>Inteligencia de Negocio</h2>
                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Analiza el rendimiento financiero y operativo de tu taller.</p>
                </div>
                <button className="btn-export-excel" onClick={exportarAExcel}>
                    <SvgDownload /> Exportar Reporte a Excel
                </button>
            </header>

            {/* KPI PRINCIPALES (FINANCIEROS) */}
            <div className="metrics-kpi-grid">
                <div className="metric-card glass-effect kpi-revenue">
                    <div className="metric-icon"><SvgDollarSign /></div>
                    <div className="metric-data">
                        <span className="metric-label">Ingresos Reales (Caja)</span>
                        <h3 className="metric-value">${metricas.ingresosTotales.toLocaleString()}</h3>
                        {usdRate && (
                            <p className="metric-api-sub">
                                <SvgGlobe /> Eqv: U$D {(metricas.ingresosTotales / usdRate).toFixed(2)}
                            </p>
                        )}
                    </div>
                </div>

                <div className="metric-card glass-effect kpi-floating">
                    <div className="metric-icon"><SvgTrendingUp /></div>
                    <div className="metric-data">
                        <span className="metric-label">Dinero Flotante (Por cobrar)</span>
                        <h3 className="metric-value">${metricas.ingresosEstimados.toLocaleString()}</h3>
                        <p className="metric-sub">Trabajos finalizados y en proceso</p>
                    </div>
                </div>

                <div className="metric-card glass-effect kpi-avg">
                    <div className="metric-icon"><SvgActivity /></div>
                    <div className="metric-data">
                        <span className="metric-label">Ticket Promedio</span>
                        <h3 className="metric-value">${Math.round(metricas.ticketPromedio).toLocaleString()}</h3>
                        <p className="metric-sub">Lo que gasta cada cliente</p>
                    </div>
                </div>

                <div className="metric-card glass-effect kpi-success">
                    <div className="metric-icon"><SvgCheckCircle /></div>
                    <div className="metric-data">
                        <span className="metric-label">Tasa de Éxito / Reparación</span>
                        <h3 className="metric-value">{metricas.tasaExito}%</h3>
                        <div className="progress-bar-bg">
                            <div className="progress-bar-fill" style={{ width: `${metricas.tasaExito}%`, background: metricas.tasaExito > 70 ? 'var(--success)' : 'var(--warning)' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ANALÍTICA SECUNDARIA (OPERATIVA) */}
            <div className="metrics-secondary-grid">

                <div className="metrics-panel glass-effect">
                    <h3 className="panel-title">Estado del Flujo de Trabajo</h3>
                    <div className="funnel-container">
                        <div className="funnel-step">
                            <span className="funnel-number bg-gray">{metricas.ingresados}</span>
                            <span className="funnel-label">En Espera</span>
                        </div>
                        <div className="funnel-line"></div>
                        <div className="funnel-step">
                            <span className="funnel-number bg-blue">{metricas.enProceso}</span>
                            <span className="funnel-label">En Mesa</span>
                        </div>
                        <div className="funnel-line"></div>
                        <div className="funnel-step">
                            <span className="funnel-number bg-green">{metricas.totalReparaciones - metricas.ingresados - metricas.enProceso}</span>
                            <span className="funnel-label">Completados</span>
                        </div>
                    </div>
                </div>

                <div className="metrics-panel glass-effect">
                    <h3 className="panel-title">Top Marcas / Equipos</h3>
                    {metricas.topDispositivos.length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '20px' }}>No hay datos suficientes.</p>
                    ) : (
                        <div className="ranking-list">
                            {metricas.topDispositivos.map((item, idx) => (
                                <div key={idx} className="ranking-item">
                                    <div className="rank-position">#{idx + 1}</div>
                                    <div className="rank-name" style={{ textTransform: 'capitalize' }}>{item[0]}</div>
                                    <div className="rank-count">{item[1]} equipos</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* WIDGET API FINANCIERO */}
            <div className="api-widget-container glass-effect">
                <div className="api-widget-header">
                    <h4>Datos Financieros Globales (API)</h4>
                    <span className="api-live-badge">En vivo</span>
                </div>
                <div className="api-widget-body">
                    {isLoadingRate ? (
                        <p>Sincronizando con el servidor de divisas...</p>
                    ) : (
                        <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                            Cotización actual utilizada para tus métricas: <strong>1 USD = ${usdRate} ARS</strong>.
                            <br />Mantener el ojo en el tipo de cambio te ayuda a ajustar tus presupuestos de repuestos importados a tiempo para no perder márgenes.
                        </p>
                    )}
                </div>
            </div>

        </div>
    );
}

export default MetricsView;