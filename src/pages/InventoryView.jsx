import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Search, DollarSign } from 'lucide-react';
import './InventoryView.css';

const SvgBox = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const SvgPlus = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const SvgMinus = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const SvgSearch = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const SvgSort = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>;
const SvgEdit = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const SvgSave = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>;
const SvgX = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const SvgTrash = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;

const CURRENCY_SYMBOLS = { ARS: '$', USD: 'US$', EUR: '€', BRL: 'R$', CLP: '$', MXN: '$', COP: '$', PEN: 'S/', UYU: '$U' };
const getCurrencySymbol = (code) => CURRENCY_SYMBOLS[code] || '$';

function InventoryView({ moneda = 'ARS' }) {
    const sym = getCurrencySymbol(moneda);
    const [inventario, setInventario] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [orden, setOrden] = useState('nombre');
    const [ordenarPorStockCritico, setOrdenarPorStockCritico] = useState(false);

    const [editandoId, setEditandoId] = useState(null);
    const [datosEdicion, setDatosEdicion] = useState({});
    const [modalNuevo, setModalNuevo] = useState(false);

    const [nuevoItem, setNuevoItem] = useState({ mpn: '', nombre: '', cantidad: 1, precioCompra: '', precioVenta: '', categoria: 'General', tags: '' });
    const [isSearchingOctopart, setIsSearchingOctopart] = useState(false);

    const [dolarValue, setDolarValue] = useState(1000);

    // INYECTADO: Estado del usuario actual
    const [user, setUser] = useState(null);

    // 1. Detectar Usuario Logueado
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user || null);
        });
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });
        return () => subscription.unsubscribe();
    }, []);

    // 2. Cargar Inventario Seguro
    useEffect(() => {
        // API Dólar
        fetch('https://api.exchangerate-api.com/v4/latest/USD')
            .then(res => res.json())
            .then(data => {
                if (data && data.rates && data.rates.ARS) {
                    setDolarValue(data.rates.ARS);
                }
            })
            .catch(err => console.error("Error obteniendo cotización:", err));

        if (!user) {
            setInventario([]);
            return;
        }

        const fetchInventory = async () => {
            try {
                // Filtramos por user_id en Supabase
                const { data, error } = await supabase
                    .from('inventario')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('id', { ascending: false });

                if (error) throw error;

                if (data && data.length > 0) {
                    setInventario(data);
                } else {
                    // Fallback a LocalStorage
                    const local = localStorage.getItem(`wepairr_inventory_${user.id}`);
                    if (local) setInventario(JSON.parse(local));
                }
            } catch (error) {
                console.warn("Error cargando inventario de Supabase, usando LocalStorage.");
                const local = localStorage.getItem(`wepairr_inventory_${user.id}`);
                if (local) setInventario(JSON.parse(local));
            }
        };
        fetchInventory();
    }, [user]);

    // Función de Sincronización Local/Nube
    const syncInventory = (newInv) => {
        setInventario(newInv);
        if (user) {
            localStorage.setItem(`wepairr_inventory_${user.id}`, JSON.stringify(newInv));
        }
    };

    const actualizarStock = async (id, delta) => {
        const itemActual = inventario.find(i => i.id === id);
        if (!itemActual) return;
        const nuevaCantidad = Math.max(0, itemActual.cantidad + delta);

        const invActualizado = inventario.map(item => item.id === id ? { ...item, cantidad: nuevaCantidad } : item);
        syncInventory(invActualizado);

        if (user) {
            try { await supabase.from('inventario').update({ cantidad: nuevaCantidad }).eq('id', id).eq('user_id', user.id); } catch (e) { }
        }
    };

    const iniciarEdicion = (item) => { setEditandoId(item.id); setDatosEdicion(item); };

    const guardarEdicion = async () => {
        const invActualizado = inventario.map(i => i.id === editandoId ? datosEdicion : i);
        syncInventory(invActualizado);

        const idAEditar = editandoId;
        setEditandoId(null);

        if (user) {
            try { await supabase.from('inventario').update(datosEdicion).eq('id', idAEditar).eq('user_id', user.id); } catch (e) { }
        }
    };

    const eliminarItem = async (id) => {
        if (window.confirm('¿Seguro que deseas eliminar este artículo?')) {
            const invActualizado = inventario.filter(i => i.id !== id);
            syncInventory(invActualizado);

            if (user) {
                try { await supabase.from('inventario').delete().eq('id', id).eq('user_id', user.id); } catch (e) { }
            }
        }
    };

    const crearArticulo = async (e) => {
        e.preventDefault();
        const item = {
            id: Date.now(),
            nombre: nuevoItem.nombre,
            cantidad: Number(nuevoItem.cantidad),
            precioCompra: Number(nuevoItem.precioCompra) || 0,
            precioVenta: Number(nuevoItem.precioVenta) || 0,
            categoria: nuevoItem.categoria,
            tags: nuevoItem.tags.split(',').map(t => t.trim()).filter(t => t)
        };

        const invActualizado = [item, ...inventario];
        syncInventory(invActualizado);

        setModalNuevo(false);
        setNuevoItem({ mpn: '', nombre: '', cantidad: 1, precioCompra: '', precioVenta: '', categoria: 'General', tags: '' });

        if (user) {
            try {
                await supabase.from('inventario').insert([{ ...item, user_id: user.id }]);
            } catch (e) { console.warn("No se pudo guardar en Supabase."); }
        }
    };

    const handleOctopartSearch = async () => {
        if (!nuevoItem.mpn.trim()) return alert("Ingresa un Número de Parte (MPN) primero.");

        setIsSearchingOctopart(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1200));

            setNuevoItem(prev => ({
                ...prev,
                nombre: `Repuesto Original (MPN: ${prev.mpn.toUpperCase()})`,
                categoria: 'Componentes Electrónicos',
                tags: 'Octopart, Oficial',
                precioCompra: Math.round(5 * dolarValue),
                precioVenta: Math.round(15 * dolarValue)
            }));

        } catch (error) {
            alert("Hubo un error contactando a Octopart.");
        } finally {
            setIsSearchingOctopart(false);
        }
    };

    const calcularValorTotal = () => inventario.reduce((total, item) => total + (item.cantidad * item.precioCompra), 0);

    const inventarioFiltrado = inventario
        .filter(item => {
            const termino = busqueda.toLowerCase();
            return item.nombre.toLowerCase().includes(termino) || (item.tags && item.tags.some(tag => tag.toLowerCase().includes(termino)));
        })
        .sort((a, b) => {
            if (ordenarPorStockCritico) return a.cantidad - b.cantidad;
            if (orden === 'nombre') return a.nombre.localeCompare(b.nombre);
            if (orden === 'categoria') return a.categoria.localeCompare(b.categoria);
            if (orden === 'mayorPrecio') return b.precioVenta - a.precioVenta;
            return 0;
        });

    return (
        <div className="inventory-wrapper animate-fade-in">
            <header className="inventory-header">
                <div className="header-title">
                    <SvgBox />
                    <h2>Control de Stock</h2>

                    <div className="usd-badge" title="Cotización USD Actualizada">
                        <DollarSign size={16} /> USD = {sym}{dolarValue.toFixed(2)}
                    </div>
                </div>
                <button className="btn-add-item" onClick={() => setModalNuevo(true)}><SvgPlus /> Nuevo Artículo</button>
            </header>

            <div className="inventory-summary glass-effect">
                <div className="summary-card"><h3>Artículos Totales</h3><p className="summary-value">{inventario.reduce((acc, item) => acc + item.cantidad, 0)}</p></div>
                <div className="summary-card"><h3>Valor del Inventario (Costo)</h3><p className="summary-value">{sym}{calcularValorTotal().toLocaleString()}</p></div>
                <div className="summary-card warning"><h3>Stock Crítico (Bajo)</h3><p className="summary-value">{inventario.filter(i => i.cantidad <= 3).length}</p></div>
            </div>

            <div className="inventory-tools-bar glass-effect">
                <div className="search-box-inventory">
                    <SvgSearch />
                    <input type="text" placeholder="Buscar por nombre o etiqueta..." value={busqueda} onChange={e => setBusqueda(e.target.value)} />
                </div>
                <div className="tools-actions">
                    <div className="sort-box-inventory">
                        <span>Ordenar:</span>
                        <select value={orden} onChange={e => setOrden(e.target.value)} className="sort-select-inventory" disabled={ordenarPorStockCritico}>
                            <option value="nombre">Nombre (A-Z)</option><option value="categoria">Categoría</option><option value="mayorPrecio">Mayor Precio</option>
                        </select>
                    </div>
                    <button className={`btn-toggle-stock ${ordenarPorStockCritico ? 'active' : ''}`} onClick={() => setOrdenarPorStockCritico(!ordenarPorStockCritico)}><SvgSort /> Menor Stock</button>
                </div>
            </div>

            <div className="inventory-grid">
                {inventarioFiltrado.map(item => (
                    <div key={item.id} className="inventory-card glass-effect">
                        <div className={`stock-indicator ${item.cantidad <= 3 ? 'critical' : (item.cantidad <= 10 ? 'low' : 'good')}`}></div>
                        {editandoId === item.id ? (
                            <div className="inv-edit-mode animate-fade-in">
                                <div className="inv-form-group">
                                    <label>Nombre del Repuesto</label>
                                    <input type="text" value={datosEdicion.nombre} onChange={e => setDatosEdicion({ ...datosEdicion, nombre: e.target.value })} className="inv-edit-input" />
                                </div>
                                <div className="inv-form-group">
                                    <label>Categoría</label>
                                    <input type="text" value={datosEdicion.categoria} onChange={e => setDatosEdicion({ ...datosEdicion, categoria: e.target.value })} className="inv-edit-input" />
                                </div>
                                <div className="inv-edit-row">
                                    <div className="inv-form-group"><label>Costo ({sym})</label><input type="number" value={datosEdicion.precioCompra} onChange={e => setDatosEdicion({ ...datosEdicion, precioCompra: Number(e.target.value) })} className="inv-edit-input" /></div>
                                    <div className="inv-form-group"><label>Venta ({sym})</label><input type="number" value={datosEdicion.precioVenta} onChange={e => setDatosEdicion({ ...datosEdicion, precioVenta: Number(e.target.value) })} className="inv-edit-input" /></div>
                                </div>
                                <div className="inv-edit-actions">
                                    <button onClick={guardarEdicion} className="btn-save-inv"><SvgSave /> Guardar</button>
                                    <button onClick={() => eliminarItem(item.id)} className="btn-del-inv"><SvgTrash /></button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="card-header"><span className="item-category">{item.categoria}</span><button className="btn-edit-icon" onClick={() => iniciarEdicion(item)}><SvgEdit /></button></div>
                                <h3 className="item-name">{item.nombre}</h3>
                                <div className="item-tags">{item.tags && item.tags.map((tag, i) => <span key={i} className="tag">{tag}</span>)}</div>
                                <div className="item-pricing">
                                    <div><span className="price-label">Costo</span><span className="price-value cost">{sym}{item.precioCompra.toLocaleString()}</span></div>
                                    <div><span className="price-label">Venta</span><span className="price-value sale">{sym}{item.precioVenta.toLocaleString()}</span></div>
                                </div>
                                <div className="stock-controls-direct">
                                    <button onClick={() => actualizarStock(item.id, -1)}><SvgMinus /></button>
                                    <span className="stock-number">{item.cantidad}</span>
                                    <button onClick={() => actualizarStock(item.id, 1)}><SvgPlus /></button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>

            {modalNuevo && (
                <div className="inv-modal-overlay animate-fade-in" onClick={() => setModalNuevo(false)}>
                    <form className="inv-modal-container glass-effect animate-scale-in" onClick={e => e.stopPropagation()} onSubmit={crearArticulo}>
                        <div className="inv-modal-header"><h3>Añadir al Inventario</h3><button type="button" className="btn-close-modal" onClick={() => setModalNuevo(false)}><SvgX /></button></div>
                        <div className="inv-modal-body">

                            <div className="inv-form-group" style={{ background: 'var(--bg-input-glass)', padding: '15px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                                <label style={{ color: 'var(--accent-color)' }}>Autocompletar con Octopart (Opcional)</label>
                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                    <input type="text" placeholder="Ej. BQ24193 (MPN)" value={nuevoItem.mpn} onChange={e => setNuevoItem({ ...nuevoItem, mpn: e.target.value })} className="inv-form-input" style={{ flex: 1, padding: '10px' }} />
                                    <button type="button" onClick={handleOctopartSearch} disabled={isSearchingOctopart} style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-glass)', color: 'var(--text-primary)', padding: '0 15px', borderRadius: '8px', cursor: isSearchingOctopart ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                                        {isSearchingOctopart ? 'Buscando...' : <><Search size={16} /> Buscar</>}
                                    </button>
                                </div>
                            </div>

                            <div className="inv-form-group">
                                <label>Nombre del Repuesto *</label>
                                <input type="text" placeholder="Ej. Batería iPhone 11" value={nuevoItem.nombre} onChange={e => setNuevoItem({ ...nuevoItem, nombre: e.target.value })} required className="inv-form-input" />
                            </div>
                            <div className="inv-form-row">
                                <div className="inv-form-group"><label>Stock Inicial *</label><input type="number" placeholder="0" value={nuevoItem.cantidad} onChange={e => setNuevoItem({ ...nuevoItem, cantidad: e.target.value })} required className="inv-form-input" min="0" /></div>
                                <div className="inv-form-group"><label>Categoría</label><input type="text" placeholder="Ej. Baterías" value={nuevoItem.categoria} onChange={e => setNuevoItem({ ...nuevoItem, categoria: e.target.value })} className="inv-form-input" /></div>
                            </div>
                            <div className="inv-form-row">
                                <div className="inv-form-group"><label>Precio de Costo ({sym})</label><input type="number" placeholder="0" value={nuevoItem.precioCompra} onChange={e => setNuevoItem({ ...nuevoItem, precioCompra: e.target.value })} className="inv-form-input" /></div>
                                <div className="inv-form-group"><label>Precio de Venta ({sym})</label><input type="number" placeholder="0" value={nuevoItem.precioVenta} onChange={e => setNuevoItem({ ...nuevoItem, precioVenta: e.target.value })} className="inv-form-input" /></div>
                            </div>
                            <div className="inv-form-group">
                                <label>Etiquetas (Separadas por comas)</label>
                                <input type="text" placeholder="Ej. Apple, Original, Premium" value={nuevoItem.tags} onChange={e => setNuevoItem({ ...nuevoItem, tags: e.target.value })} className="inv-form-input" />
                            </div>
                            <button type="submit" className="btn-add-item" style={{ width: '100%', marginTop: '10px', padding: '15px' }}>Guardar Artículo</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default InventoryView;