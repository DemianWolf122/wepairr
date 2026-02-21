import React, { useState, useEffect } from 'react';
import './InventoryView.css';

function InventoryView() {
    // Inicializamos el inventario desde localStorage para persistencia
    const [inventario, setInventario] = useState(() => {
        const guardado = localStorage.getItem('wepairr_inventario');
        return guardado ? JSON.parse(guardado) : [
            { id: 1, nombre: 'Módulo Pantalla iPhone 11', categoria: 'Pantallas', cantidad: 3, costo: 35000 },
            { id: 2, nombre: 'Batería Samsung S23 Ultra', categoria: 'Baterías', cantidad: 1, costo: 25000 },
            { id: 3, nombre: 'Pin de Carga Tipo C genérico', categoria: 'Conectores', cantidad: 0, costo: 1500 }
        ];
    });

    const [nuevoArticulo, setNuevoArticulo] = useState({ nombre: '', categoria: '', cantidad: '', costo: '' });

    // Guardado automático
    useEffect(() => {
        localStorage.setItem('wepairr_inventario', JSON.stringify(inventario));
    }, [inventario]);

    const agregarArticulo = (e) => {
        e.preventDefault();
        if (!nuevoArticulo.nombre.trim() || !nuevoArticulo.cantidad) return;

        const articulo = {
            id: Date.now(),
            nombre: nuevoArticulo.nombre,
            categoria: nuevoArticulo.categoria || 'General',
            cantidad: parseInt(nuevoArticulo.cantidad, 10),
            costo: parseFloat(nuevoArticulo.costo) || 0
        };

        setInventario(prev => [...prev, articulo]);
        setNuevoArticulo({ nombre: '', categoria: '', cantidad: '', costo: '' });
    };

    const actualizarCantidad = (id, delta) => {
        setInventario(prev => prev.map(art => {
            if (art.id === id) {
                const nuevaCant = Math.max(0, art.cantidad + delta);
                return { ...art, cantidad: nuevaCant };
            }
            return art;
        }));
    };

    const eliminarArticulo = (id) => {
        if (window.confirm('¿Eliminar este repuesto del inventario?')) {
            setInventario(prev => prev.filter(art => art.id !== id));
        }
    };

    // Cálculos de valorización de stock
    const valorTotalStock = inventario.reduce((acc, curr) => acc + (curr.cantidad * curr.costo), 0);
    const repuestosAgotados = inventario.filter(art => art.cantidad === 0).length;

    return (
        <div className="inventory-wrapper">
            <header className="inventory-header">
                <h2>Control de Stock y Repuestos</h2>
                <div className="inventory-stats">
                    <div className="stat-box">
                        <span className="stat-label">Capital Invertido</span>
                        <span className="stat-value text-green">${valorTotalStock.toLocaleString('es-AR')}</span>
                    </div>
                    <div className="stat-box border-red">
                        <span className="stat-label">Repuestos Agotados</span>
                        <span className="stat-value text-red">{repuestosAgotados}</span>
                    </div>
                </div>
            </header>

            <section className="inventory-add-section">
                <h3>Ingresar Nuevo Repuesto</h3>
                <form onSubmit={agregarArticulo} className="inventory-form">
                    <input type="text" placeholder="Nombre del repuesto..." value={nuevoArticulo.nombre} onChange={e => setNuevoArticulo({ ...nuevoArticulo, nombre: e.target.value })} required className="inv-input flex-2" />
                    <input type="text" placeholder="Categoría (Ej. Pantallas)" value={nuevoArticulo.categoria} onChange={e => setNuevoArticulo({ ...nuevoArticulo, categoria: e.target.value })} className="inv-input flex-1" />
                    <input type="number" placeholder="Cant." value={nuevoArticulo.cantidad} onChange={e => setNuevoArticulo({ ...nuevoArticulo, cantidad: e.target.value })} required className="inv-input flex-small" />
                    <input type="number" placeholder="Costo Unitario $" value={nuevoArticulo.costo} onChange={e => setNuevoArticulo({ ...nuevoArticulo, costo: e.target.value })} className="inv-input flex-1" />
                    <button type="submit" className="inv-btn-add">Agregar al Stock</button>
                </form>
            </section>

            <section className="inventory-list-section">
                <table className="inventory-table">
                    <thead>
                        <tr>
                            <th>Repuesto</th>
                            <th>Categoría</th>
                            <th>Costo Unit.</th>
                            <th>Stock Disponible</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventario.length === 0 && (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>No hay repuestos en el inventario.</td></tr>
                        )}
                        {inventario.map(art => (
                            <tr key={art.id} className={art.cantidad === 0 ? 'row-empty' : ''}>
                                <td style={{ fontWeight: '500' }}>{art.nombre}</td>
                                <td><span className="inv-badge">{art.categoria}</span></td>
                                <td>${art.costo.toLocaleString('es-AR')}</td>
                                <td>
                                    <div className="stock-controls">
                                        <button onClick={() => actualizarCantidad(art.id, -1)} className="btn-qty">-</button>
                                        <span className={`stock-number ${art.cantidad <= 1 ? 'text-red' : ''}`}>{art.cantidad}</span>
                                        <button onClick={() => actualizarCantidad(art.id, 1)} className="btn-qty">+</button>
                                    </div>
                                </td>
                                <td>
                                    <button onClick={() => eliminarArticulo(art.id)} className="btn-inv-delete">🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
}

export default InventoryView;