import React, { useState } from 'react';
import './InventoryView.css';

// SVGs
const SvgBox = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const SvgPlus = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const SvgSearch = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const SvgSort = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>;


const INVENTARIO_INICIAL = [
    { id: 1, nombre: "Módulo iPhone X - Calidad OLED", cantidad: 5, precioCompra: 45000, precioVenta: 85000, categoria: "Pantallas", tags: ["Apple", "OLED"] },
    { id: 2, nombre: "Batería Samsung S20 FE", cantidad: 12, precioCompra: 15000, precioVenta: 35000, categoria: "Baterías", tags: ["Samsung", "Original"] },
    { id: 3, nombre: "Pin de Carga Motorola G52", cantidad: 2, precioCompra: 2500, precioVenta: 12000, categoria: "Flex de Carga", tags: ["Motorola", "Crítico"] },
    { id: 4, nombre: "Vidrio Templado Universal 6.5\"", cantidad: 50, precioCompra: 800, precioVenta: 4000, categoria: "Accesorios", tags: ["Genérico"] }
];

function InventoryView() {
    const [inventario] = useState(INVENTARIO_INICIAL);
    const [busqueda, setBusqueda] = useState('');
    const [orden, setOrden] = useState('nombre');
    const [ordenarPorStockCritico, setOrdenarPorStockCritico] = useState(false);

    // LÓGICA DE FILTRADO Y ORDENAMIENTO
    const inventarioFiltrado = inventario
        .filter(item => {
            const termino = busqueda.toLowerCase();
            return item.nombre.toLowerCase().includes(termino) || item.tags.some(tag => tag.toLowerCase().includes(termino));
        })
        .sort((a, b) => {
            // Prioridad 1: Ordenar por stock crítico si el toggle está activo
            if (ordenarPorStockCritico) {
                return a.cantidad - b.cantidad;
            }
            // Prioridad 2: Ordenar por el selector
            if (orden === 'nombre') return a.nombre.localeCompare(b.nombre);
            if (orden === 'categoria') return a.categoria.localeCompare(b.categoria);
            if (orden === 'mayorPrecio') return b.precioVenta - a.precioVenta;
            return 0;
        });

    const calcularValorTotal = () => {
        return inventario.reduce((total, item) => total + (item.cantidad * item.precioCompra), 0);
    };

    return (
        <div className="inventory-wrapper animate-fade-in">
            <header className="inventory-header">
                <div className="header-title">
                    <SvgBox />
                    <h2>Control de Stock</h2>
                </div>
                <button className="btn-add-item">
                    <SvgPlus /> Nuevo Artículo
                </button>
            </header>

            <div className="inventory-summary glass-effect">
                <div className="summary-card">
                    <h3>Artículos Totales</h3>
                    <p className="summary-value">{inventario.reduce((acc, item) => acc + item.cantidad, 0)}</p>
                </div>
                <div className="summary-card">
                    <h3>Valor del Inventario (Costo)</h3>
                    <p className="summary-value">${calcularValorTotal().toLocaleString()}</p>
                </div>
                <div className="summary-card warning">
                    <h3>Stock Crítico (Bajo)</h3>
                    <p className="summary-value">{inventario.filter(i => i.cantidad <= 3).length}</p>
                </div>
            </div>

            {/* BARRA DE HERRAMIENTAS DE INVENTARIO */}
            <div className="inventory-tools-bar glass-effect">
                <div className="search-box-inventory">
                    <SvgSearch />
                    <input type="text" placeholder="Buscar por nombre o etiqueta..." value={busqueda} onChange={e => setBusqueda(e.target.value)} />
                </div>

                <div className="tools-actions">
                    <div className="sort-box-inventory">
                        <span>Ordenar por:</span>
                        <select value={orden} onChange={e => setOrden(e.target.value)} className="sort-select-inventory" disabled={ordenarPorStockCritico}>
                            <option value="nombre">Nombre (A-Z)</option>
                            <option value="categoria">Categoría</option>
                            <option value="mayorPrecio">Mayor Precio Venta</option>
                        </select>
                    </div>

                    <button className={`btn-toggle-stock ${ordenarPorStockCritico ? 'active' : ''}`} onClick={() => setOrdenarPorStockCritico(!ordenarPorStockCritico)}>
                        <SvgSort /> Priorizar Stock Bajo
                    </button>
                </div>
            </div>

            <div className="inventory-grid">
                {inventarioFiltrado.map(item => (
                    <div key={item.id} className="inventory-card glass-effect">
                        <div className={`stock-indicator ${item.cantidad <= 3 ? 'critical' : (item.cantidad <= 10 ? 'low' : 'good')}`}></div>
                        <div className="card-header">
                            <span className="item-category">{item.categoria}</span>
                            <span className="item-qty">Stock: {item.cantidad}</span>
                        </div>
                        <h3 className="item-name">{item.nombre}</h3>
                        <div className="item-tags">
                            {item.tags.map((tag, i) => <span key={i} className="tag">{tag}</span>)}
                        </div>
                        <div className="item-pricing">
                            <div>
                                <span className="price-label">Costo:</span>
                                <span className="price-value cost">${item.precioCompra.toLocaleString()}</span>
                            </div>
                            <div>
                                <span className="price-label">Venta:</span>
                                <span className="price-value sale">${item.precioVenta.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default InventoryView;