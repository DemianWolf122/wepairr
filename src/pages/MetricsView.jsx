import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './MetricsView.css';

// Colores del tema Wepairr para el gráfico circular según el estado
const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#6b7280'];
// Orden: Ingresado (Amarillo), En Proceso (Azul), Finalizado (Verde), Entregado (Gris)

function MetricsView({ tickets }) {
    // --- PROCESAMIENTO DE DATOS EN TIEMPO REAL ---

    // 1. Datos para el PieChart (Mapeamos el array real de tickets)
    const estadosData = [
        { name: 'Ingresados', value: tickets.filter(t => t.estado === 'Ingresado').length },
        { name: 'En Proceso', value: tickets.filter(t => t.estado === 'En Proceso').length },
        { name: 'Finalizados', value: tickets.filter(t => t.estado === 'Finalizado').length },
        { name: 'Entregados', value: tickets.filter(t => t.estado === 'Entregado').length },
    ];

    // Filtramos los que tienen 0 para que el gráfico circular no muestre porciones vacías o solapadas
    const estadosDataClean = estadosData.filter(d => d.value > 0);

    // 2. Mock de datos para el BarChart (Evolución de Ingresos)
    // En una fase posterior esto se conectará al historial de cobros de Supabase
    const ingresosData = [
        { name: 'Sem 1', ingresos: 125000 },
        { name: 'Sem 2', ingresos: 180000 },
        { name: 'Sem 3', ingresos: 150000 },
        { name: 'Sem 4', ingresos: 210000 },
    ];

    // 3. Cálculo del presupuesto total estimado de los tickets activos
    const presupuestoTotal = tickets.reduce((acc, ticket) => acc + (Number(ticket.presupuesto) || 0), 0);

    return (
        <div className="metrics-wrapper animate-fade-in">
            <header className="metrics-header">
                <h2 className="metrics-main-title">Business Intelligence</h2>
                <p className="metrics-subtitle">Análisis de rendimiento y tendencias del taller.</p>
            </header>

            {/* KPI CARDS (Tarjetas de indicadores clave) */}
            <div className="metrics-kpi-grid">
                <div className="kpi-card glass-effect">
                    <h3 className="kpi-title">Tickets Totales</h3>
                    <div className="kpi-value text-blue">{tickets.length}</div>
                    <div className="kpi-trend">En tu base de datos</div>
                </div>
                <div className="kpi-card glass-effect">
                    <h3 className="kpi-title">Presupuesto Estimado</h3>
                    <div className="kpi-value text-green">${presupuestoTotal.toLocaleString()}</div>
                    <div className="kpi-trend up">▲ Suma de tickets cotizados</div>
                </div>
                <div className="kpi-card glass-effect">
                    <h3 className="kpi-title">Tasa de Finalización</h3>
                    <div className="kpi-value text-purple">
                        {tickets.length > 0 ? Math.round((tickets.filter(t => t.estado === 'Entregado' || t.estado === 'Finalizado').length / tickets.length) * 100) : 0}%
                    </div>
                    <div className="kpi-trend up">▲ Excelente ritmo de trabajo</div>
                </div>
            </div>

            {/* GRÁFICOS RECHARTS */}
            <div className="charts-grid">
                {/* Gráfico 1: Evolución de Ingresos */}
                <div className="chart-container glass-effect">
                    <h3 className="chart-title">Evolución de Ingresos (ARS)</h3>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ingresosData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-glass)" vertical={false} />
                                <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis stroke="var(--text-secondary)" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val / 1000}k`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--bg-panel)', borderRadius: '12px', border: '1px solid var(--border-glass)', color: 'var(--text-primary)' }}
                                    itemStyle={{ color: 'var(--accent-color)', fontWeight: 'bold' }}
                                    formatter={(value) => [`$${value.toLocaleString()}`, 'Ingresos']}
                                />
                                <Bar dataKey="ingresos" fill="var(--accent-color)" radius={[6, 6, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Gráfico 2: Distribución de Estados (Dinámico) */}
                <div className="chart-container glass-effect">
                    <h3 className="chart-title">Distribución de Estados</h3>
                    <div className="chart-wrapper">
                        {estadosDataClean.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={estadosDataClean}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {estadosDataClean.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[estadosData.findIndex(e => e.name === entry.name)]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--bg-panel)', borderRadius: '12px', border: '1px solid var(--border-glass)', color: 'var(--text-primary)', fontWeight: 'bold', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
                                        itemStyle={{ color: 'var(--text-primary)' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-secondary)' }}>
                                No hay tickets cargados para mostrar.
                            </div>
                        )}
                    </div>
                    {/* Leyenda personalizada para el PieChart */}
                    <div className="chart-legend">
                        {estadosDataClean.map((entry, index) => (
                            <div key={index} className="legend-item">
                                <span className="legend-dot" style={{ backgroundColor: COLORS[estadosData.findIndex(e => e.name === entry.name)] }}></span>
                                {entry.name} <span className="legend-value">({entry.value})</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MetricsView;