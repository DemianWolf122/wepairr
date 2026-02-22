import React, { useState, useEffect } from 'react';
import './InventoryView.css';

const SvgPlus = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const SvgMinus = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><line x1="5" y1="12" x2="19" y2="12"></line></svg>;

function InventoryView() {
    const [inventario, setInventario] = useState(() => {
        const saved = localStorage.getItem('wepairr_inv');
        return saved ? JSON.parse(saved) : [
            { id: 1, nombre: "Módulo iPhone X OLED", cantidad: 5, precioVenta: 85000, categoria: "Pantallas", tags: ["Apple"] },
            { id: 2, nombre: "Batería Samsung S20", cantidad: 12, precioVenta: 35000, categoria: "Baterías", tags: ["Samsung"] }
        ];
    });

    const [busqueda, setBusqueda] = useState('');
    const [ordenarCritico, setOrdenarCritico] = useState(false);
    const [mostrandoModal, setMostrandoModal] = useState(false);
    const [newItem, setNewItem] = useState({ nombre: '', cantidad: 1, precioVenta: '', categoria: 'General' });

    useEffect(() => { localStorage.setItem('wepairr_inv', JSON.stringify(inventario)); }, [inventario]);

    const handleStock = (id, delta) => {
        setInventario(prev => prev.map(i => i.id === id ? { ...i, cantidad: Math.max(0, i.cantidad + delta) } : i));
    };

    const handleAdd = (e) => {
        e.preventDefault();
        setInventario([{ ...newItem, id: Date.now(), tags: [] }, ...inventario]);
        setMostrandoModal(false);
    };

    const filtrados = inventario
        .filter(i => i.nombre.toLowerCase().includes(busqueda.toLowerCase()))
        .sort((a, b) => ordenarCritico ? a.cantidad - b.cantidad : 0);

    return (
        <div className="inventory-wrapper animate-fade-in">
            <header className="inventory-header">
                <h2>Control de Stock</h2>
                <button className="btn-add-item" onClick={() => setMostrandoModal(true)}>+ Nuevo Artículo</button>
            </header>

            <div className="inventory-tools-bar glass-effect">
                <input type="text" placeholder="Buscar repuesto..." value={busqueda} onChange={e => setBusqueda(e.target.value)} className="search-box-inventory" />
                <button className={`btn-toggle-stock ${ordenarCritico ? 'active' : ''}`} onClick={() => setOrdenarCritico(!ordenarCritico)}>Priorizar Stock Bajo</button>
            </div>

            <div className="inventory-grid">
                {filtrados.map(item => (
                    <div key={item.id} className="inventory-card glass-effect">
                        <div className={`stock-indicator ${item.cantidad <= 3 ? 'critical' : 'good'}`}></div>
                        <span className="item-category">{item.categoria}</span>
                        <h3 className="item-name">{item.nombre}</h3>
                        <p className="item-price">Precio: ${item.precioVenta.toLocaleString()}</p>
                        <div className="stock-controls-direct">
                            <button onClick={() => handleStock(item.id, -1)}><SvgMinus /></button>
                            <span className="stock-number">{item.cantidad}</span>
                            <button onClick={() => handleStock(item.id, 1)}><SvgPlus /></button>
                        </div>
                    </div>
                ))}
            </div>

            {mostrandoModal && (
                <div className="inv-modal-overlay" onClick={() => setMostrandoModal(false)}>
                    <form className="inv-modal-container glass-effect" onClick={e => e.stopPropagation()} onSubmit={handleAdd}>
                        <h3>Nuevo Repuesto</h3>
                        <input type="text" placeholder="Nombre" required onChange={e => setNewItem({ ...newItem, nombre: e.target.value })} />
                        <input type="number" placeholder="Cantidad" required onChange={e => setNewItem({ ...newItem, cantidad: e.target.value })} />
                        <input type="number" placeholder="Precio Venta" required onChange={e => setNewItem({ ...newItem, precioVenta: e.target.value })} />
                        <button type="submit" className="btn-add-item">Guardar</button>
                    </form>
                </div>
            )}
        </div>
    );
}
export default InventoryView;