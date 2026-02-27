import React, { useState, useEffect, useRef } from 'react';
import { Search, Wrench, ChevronRight, FileText, Upload, ExternalLink } from 'lucide-react'; // AÑADIDO: ExternalLink
import './CommunityWiki.css';

// --- SVGs Originales Intactos ---
const SvgPlus = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const SvgArrow = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>;
const SvgLike = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>;
const SvgX = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const SvgImage = () => <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>;
const SvgSearch = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;

const POSTS_INICIALES = [
    { id: 1, titulo: "Falla de carga iPhone 12 Pro", autor: "TecnoMar", contenido: "Si el equipo consume 0.01A, revisen el IC de carga U2. Reemplazando el IC se solucionó el problema.", imagenPrincipal: null, imagenesSecundarias: [], likes: 24, categoria: "Microelectrónica", likedByMe: false, fecha: Date.now() - 100000 },
    { id: 2, titulo: "Cómo despegar tapas de Samsung S23", autor: "ElectroFix", contenido: "Usar plancha a 80 grados por 5 minutos exactos para no dañar el flex de antena.", imagenPrincipal: null, imagenesSecundarias: [], likes: 15, categoria: "Hardware", likedByMe: false, fecha: Date.now() }
];

function CommunityWiki() {
    const [activeTab, setActiveTab] = useState('local');

    // Estados Comunidad Local
    const [posts, setPosts] = useState(() => {
        const guardados = localStorage.getItem('wepairr_wiki_posts');
        return guardados ? JSON.parse(guardados) : POSTS_INICIALES;
    });
    const [postSeleccionado, setPostSeleccionado] = useState(null);
    const [mostrandoFormulario, setMostrandoFormulario] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [orden, setOrdenarPor] = useState('recientes');
    const [nuevoPost, setNuevoPost] = useState({ titulo: '', categoria: 'General', contenido: '', imagenPrincipal: null, imagenesSecundarias: [] });
    const [imagenLightbox, setImagenLightbox] = useState(null);
    const fileInputPrincipalRef = useRef(null);

    // Estados iFixit
    const [ifixitQuery, setIfixitQuery] = useState('');
    const [ifixitGuides, setIfixitGuides] = useState([]);
    const [loadingIfixit, setLoadingIfixit] = useState(false);
    const [errorIfixit, setErrorIfixit] = useState(null);

    // Estados Visor PDF y Búsqueda de Esquemas
    const [pdfUrl, setPdfUrl] = useState(null);
    const [schematicQuery, setSchematicQuery] = useState('');

    useEffect(() => { localStorage.setItem('wepairr_wiki_posts', JSON.stringify(posts)); }, [posts]);

    const manejarLike = (e, id) => {
        e.stopPropagation();
        setPosts(prev => prev.map(post => post.id === id ? { ...post, likes: post.likedByMe ? post.likes - 1 : post.likes + 1, likedByMe: !post.likedByMe } : post));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => { setNuevoPost(prev => ({ ...prev, imagenPrincipal: reader.result })); };
            reader.readAsDataURL(file);
        }
    };

    const crearPost = (e) => {
        e.preventDefault();
        if (!nuevoPost.titulo.trim() || !nuevoPost.contenido.trim()) return;
        const post = { id: Date.now(), autor: "Mi Taller", likes: 0, likedByMe: false, fecha: Date.now(), ...nuevoPost };
        setPosts(prev => [post, ...prev]);
        setNuevoPost({ titulo: '', categoria: 'General', contenido: '', imagenPrincipal: null, imagenesSecundarias: [] });
        setMostrandoFormulario(false);
    };

    const postsFiltrados = posts
        .filter(p => p.titulo.toLowerCase().includes(busqueda.toLowerCase()) || p.contenido.toLowerCase().includes(busqueda.toLowerCase()))
        .sort((a, b) => orden === 'likes' ? b.likes - a.likes : b.fecha - a.fecha);

    const handleIfixitSearch = async (e) => {
        e.preventDefault();
        if (!ifixitQuery.trim()) return;

        setLoadingIfixit(true);
        setErrorIfixit(null);
        setIfixitGuides([]);

        try {
            const response = await fetch(`https://www.ifixit.com/api/2.0/search/${encodeURIComponent(ifixitQuery)}?type=guide`);
            if (!response.ok) throw new Error("Error en la respuesta del servidor");

            const data = await response.json();
            const guiasValidas = (data.results || []).filter(
                guide => guide.difficulty && guide.difficulty !== 'N/A'
            );

            setIfixitGuides(guiasValidas);
        } catch (err) {
            setErrorIfixit("No se pudieron cargar los manuales. Intenta de nuevo.");
            console.error(err);
        } finally {
            setLoadingIfixit(false);
        }
    };

    const handlePdfUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            const url = URL.createObjectURL(file);
            setPdfUrl(url);
        } else if (file) {
            alert("Por favor, sube un archivo con formato .pdf");
        }
    };

    // FIX: Búsqueda Inteligente de Esquemas (Google Dorks)
    const searchSchematicOnline = (site) => {
        if (!schematicQuery.trim()) return alert("Ingresa un modelo para buscar.");
        let queryUrl = '';

        switch (site) {
            case 'google':
                // Busca específicamente archivos PDF con las palabras clave schematic o boardview
                queryUrl = `https://www.google.com/search?q=filetype:pdf+${encodeURIComponent(schematicQuery)}+schematic+OR+boardview`;
                break;
            case 'manualslib':
                queryUrl = `https://www.manualslib.com/c/${encodeURIComponent(schematicQuery)}.html`;
                break;
            default:
                return;
        }
        window.open(queryUrl, '_blank');
    };

    return (
        <div className="wiki-wrapper animate-fade-in" style={{ padding: '30px', boxSizing: 'border-box', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
            <header className="wiki-header" style={{ marginBottom: '20px' }}>
                <div className="wiki-header-text">
                    <h2>Base de Conocimiento</h2>
                    <p>Fallas locales, manuales de iFixit y visor de esquemáticos.</p>
                </div>
                {activeTab === 'local' && (
                    <button className="btn-new-post" onClick={() => setMostrandoFormulario(true)}><SvgPlus /> Nuevo Aporte</button>
                )}
            </header>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '15px', flexWrap: 'wrap' }}>
                <button
                    onClick={() => setActiveTab('local')}
                    style={{ background: 'transparent', border: 'none', color: activeTab === 'local' ? 'var(--accent-color)' : 'var(--text-secondary)', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', paddingBottom: '5px', borderBottom: activeTab === 'local' ? '2px solid var(--accent-color)' : '2px solid transparent', transition: 'all 0.2s' }}
                >
                    Comunidad Wepairr
                </button>
                <button
                    onClick={() => setActiveTab('ifixit')}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: activeTab === 'ifixit' ? 'var(--accent-color)' : 'var(--text-secondary)', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', paddingBottom: '5px', borderBottom: activeTab === 'ifixit' ? '2px solid var(--accent-color)' : '2px solid transparent', transition: 'all 0.2s' }}
                >
                    <Wrench size={18} /> Guías iFixit
                </button>
                <button
                    onClick={() => setActiveTab('pdf')}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: activeTab === 'pdf' ? 'var(--accent-color)' : 'var(--text-secondary)', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', paddingBottom: '5px', borderBottom: activeTab === 'pdf' ? '2px solid var(--accent-color)' : '2px solid transparent', transition: 'all 0.2s' }}
                >
                    <FileText size={18} /> Planos (PDF)
                </button>
            </div>

            {/* VISTA 1: COMUNIDAD LOCAL */}
            {activeTab === 'local' && (
                <>
                    <div className="wiki-tools-bar glass-effect">
                        <div className="search-box" style={{ background: 'var(--bg-input-glass)', border: '1px solid var(--border-glass)', borderRadius: '12px', padding: '10px 15px', display: 'flex', alignItems: 'center', gap: '10px', flex: 1, maxWidth: '400px' }}>
                            <SvgSearch />
                            <input type="text" placeholder="Buscar falla o componente..." value={busqueda} onChange={e => setBusqueda(e.target.value)} style={{ border: 'none', background: 'transparent', color: 'var(--text-primary)', outline: 'none', width: '100%', fontSize: '0.95rem' }} />
                        </div>
                        <div className="sort-box" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Ordenar por:</span>
                            <select value={orden} onChange={e => setOrdenarPor(e.target.value)} className="sort-select" style={{ background: 'var(--bg-input-glass)', border: '1px solid var(--border-glass)', color: 'var(--text-primary)', padding: '10px', borderRadius: '10px', outline: 'none', fontWeight: 'bold' }}>
                                <option value="recientes">Más Recientes</option>
                                <option value="likes">Mejor Valorados</option>
                            </select>
                        </div>
                    </div>

                    <div className="wiki-grid">
                        {postsFiltrados.length === 0 && <p style={{ color: 'var(--text-secondary)', gridColumn: '1/-1', textAlign: 'center', marginTop: '40px' }}>No se encontraron resultados en la comunidad local.</p>}

                        {postsFiltrados.map(post => (
                            <div key={post.id} className="wiki-card glass-effect" onClick={() => setPostSeleccionado(post)}>
                                {post.imagenPrincipal && <div className="wiki-thumbnail" style={{ backgroundImage: `url(${post.imagenPrincipal})` }}></div>}
                                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    <span className="wiki-tag">{post.categoria}</span>
                                    <h3 style={{ margin: '10px 0', fontSize: '1.2rem', color: 'var(--text-primary)' }}>{post.titulo}</h3>
                                    <p className="wiki-card-desc" style={{ color: 'var(--text-secondary)', lineHeight: '1.5', flex: 1 }}>{post.contenido.length > 80 ? post.contenido.substring(0, 80) + '...' : post.contenido}</p>
                                    <div className="wiki-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid var(--border-glass)' }}>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Por: {post.autor}</span>
                                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                            <span className="read-more" style={{ color: 'var(--accent-color)', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>Ver más <SvgArrow /></span>
                                            <button className={`btn-like ${post.likedByMe ? 'liked' : ''}`} onClick={(e) => manejarLike(e, post.id)} style={{ background: post.likedByMe ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-input-glass)', border: '1px solid', borderColor: post.likedByMe ? 'rgba(239, 68, 68, 0.3)' : 'var(--border-glass)', color: post.likedByMe ? '#ef4444' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 'bold' }}>
                                                <SvgLike /> {post.likes}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* VISTA 2: INTEGRACIÓN API iFIXIT */}
            {activeTab === 'ifixit' && (
                <div className="animate-fade-in">
                    <form onSubmit={handleIfixitSearch} style={{ display: 'flex', gap: '15px', maxWidth: '600px', margin: '0 auto 40px auto', flexWrap: 'wrap' }}>
                        <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
                            <Search style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={20} />
                            <input
                                type="text"
                                placeholder="Ej. iPhone 13 battery, PS5 teardown..."
                                value={ifixitQuery}
                                onChange={(e) => setIfixitQuery(e.target.value)}
                                style={{ width: '100%', padding: '15px 15px 15px 45px', borderRadius: '12px', border: '1px solid var(--border-glass)', background: 'var(--bg-input-glass)', color: 'var(--text-primary)', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
                            />
                        </div>
                        <button type="submit" disabled={loadingIfixit} style={{ padding: '0 25px', background: 'var(--accent-color)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: loadingIfixit ? 'not-allowed' : 'pointer', fontSize: '1rem', height: '50px' }}>
                            {loadingIfixit ? 'Buscando...' : 'Buscar'}
                        </button>
                    </form>

                    {errorIfixit && <div style={{ textAlign: 'center', color: '#ef4444', padding: '20px' }}>{errorIfixit}</div>}

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
                        {ifixitGuides.length === 0 && !loadingIfixit && !errorIfixit && ifixitQuery && (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-secondary)', marginTop: '40px' }}>No se encontraron guías oficiales válidas para "{ifixitQuery}".</div>
                        )}

                        {ifixitGuides.map(guide => (
                            <div key={guide.guideid} className="glass-effect" style={{ borderRadius: '16px', border: '1px solid var(--border-glass)', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s ease', cursor: 'pointer' }} onClick={() => window.open(`https://www.ifixit.com/Guide/${guide.url.split('/Guide/')[1]}`, '_blank')}>
                                {guide.image && (
                                    <div style={{ width: '100%', height: '180px', backgroundImage: `url(${guide.image.standard})`, backgroundSize: 'cover', backgroundPosition: 'center', borderBottom: '1px solid var(--border-glass)' }}></div>
                                )}
                                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: 'var(--text-primary)', lineHeight: '1.4' }}>{guide.title}</h3>

                                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-glass)', paddingTop: '15px' }}>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}>
                                            <Wrench size={14} /> Dificultad: {guide.difficulty}
                                        </span>
                                        <span style={{ color: 'var(--accent-color)', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}>
                                            Ver Guía <ChevronRight size={16} />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* VISTA 3: VISOR DE ESQUEMÁTICOS PDF + BUSCADOR INTELIGENTE */}
            {activeTab === 'pdf' && (
                <div className="animate-fade-in glass-effect" style={{ padding: '30px', borderRadius: '20px', minHeight: '600px', display: 'flex', flexDirection: 'column', border: '1px solid var(--border-glass)' }}>

                    {/* Buscador de Planos Web (Google Dorks) */}
                    <div style={{ background: 'var(--bg-input-glass)', borderRadius: '16px', padding: '20px', marginBottom: '25px', border: '1px solid var(--border-glass)' }}>
                        <h4 style={{ margin: '0 0 15px 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}><Search size={18} /> Buscar Esquema en Web</h4>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <input
                                type="text"
                                placeholder="Modelo (Ej. MacBook Pro A1278)"
                                value={schematicQuery}
                                onChange={(e) => setSchematicQuery(e.target.value)}
                                style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid var(--border-glass)', background: 'var(--bg-panel)', color: 'var(--text-primary)', minWidth: '200px' }}
                            />
                            <button onClick={() => searchSchematicOnline('google')} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '0 20px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <ExternalLink size={16} /> PDF en Google
                            </button>
                            <button onClick={() => searchSchematicOnline('manualslib')} style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '0 20px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <ExternalLink size={16} /> ManualsLib
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px', borderTop: '1px solid var(--border-glass)', paddingTop: '20px' }}>
                        <div>
                            <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.5rem' }}>Visor Local</h3>
                            <p style={{ color: 'var(--text-secondary)', margin: '5px 0 0 0' }}>Carga el PDF que descargaste para verlo aquí.</p>
                        </div>

                        <input type="file" id="pdf-upload" accept="application/pdf" onChange={handlePdfUpload} hidden />
                        <label htmlFor="pdf-upload" style={{ cursor: 'pointer', background: 'var(--accent-color)', color: 'white', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', transition: 'transform 0.2s', boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)' }}>
                            <Upload size={18} /> Cargar Archivo
                        </label>
                    </div>

                    {pdfUrl ? (
                        <div style={{ flex: 1, borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-glass)', background: '#fff', minHeight: '60vh' }}>
                            <iframe
                                src={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1&zoom=100`}
                                width="100%"
                                height="100%"
                                style={{ border: 'none', display: 'block' }}
                                title="Visor de Esquemáticos"
                            ></iframe>
                        </div>
                    ) : (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border-glass)', borderRadius: '16px', color: 'var(--text-secondary)', minHeight: '40vh', background: 'var(--bg-input-glass)' }}>
                            <FileText size={64} style={{ marginBottom: '15px', opacity: 0.5, color: 'var(--accent-color)' }} />
                            <h3 style={{ margin: '0 0 10px 0', color: 'var(--text-primary)' }}>Visualizador Vacío</h3>
                            <p style={{ fontSize: '0.95rem', opacity: 0.8, margin: 0 }}>Usa el buscador de arriba para hallar el plano y cárgalo aquí.</p>
                        </div>
                    )}
                </div>
            )}

            {/* MODALES LOCALES */}
            {postSeleccionado && (
                <div className="wiki-modal-overlay" onClick={() => setPostSeleccionado(null)}>
                    <div className="wiki-modal-container animate-scale-in" onClick={e => e.stopPropagation()}>
                        <div className="wiki-modal-header-fixed">
                            <span className="wiki-tag">{postSeleccionado.categoria}</span>
                            <button className="btn-close-modal" onClick={() => setPostSeleccionado(null)}><SvgX /></button>
                        </div>
                        <div className="wiki-modal-body-scroll">
                            <h2 className="modal-title">{postSeleccionado.titulo}</h2>
                            <span className="modal-author">Aportado por: {postSeleccionado.autor}</span>

                            {postSeleccionado.imagenPrincipal && (
                                <div className="wiki-modal-image-container main-image" onClick={() => setImagenLightbox(postSeleccionado.imagenPrincipal)}>
                                    <img src={postSeleccionado.imagenPrincipal} alt="Principal" />
                                    <div className="image-hover-overlay"><SvgSearch /> Ampliar</div>
                                </div>
                            )}

                            <div className="wiki-modal-text">
                                {(postSeleccionado.contenido || '').split('\n').map((parrafo, i) => <p key={i}>{parrafo}</p>)}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {imagenLightbox && (
                <div className="lightbox-overlay animate-fade-in" onClick={() => setImagenLightbox(null)}>
                    <button className="btn-close-lightbox"><SvgX /></button>
                    <img src={imagenLightbox} alt="Full screen" className="lightbox-image animate-scale-in" onClick={e => e.stopPropagation()} />
                </div>
            )}

            {mostrandoFormulario && (
                <div className="wiki-modal-overlay" onClick={() => setMostrandoFormulario(false)}>
                    <div className="wiki-modal-container new-post-form animate-scale-in" onClick={e => e.stopPropagation()}>
                        <div className="wiki-modal-header-fixed">
                            <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Nueva Solución</h3>
                            <button className="btn-close-modal" onClick={() => setMostrandoFormulario(false)}><SvgX /></button>
                        </div>
                        <form onSubmit={crearPost} className="wiki-modal-body-scroll form-body">
                            <div className="form-group">
                                <label>Título del Aporte *</label>
                                <input type="text" value={nuevoPost.titulo} onChange={e => setNuevoPost({ ...nuevoPost, titulo: e.target.value })} placeholder="Ej. Solución IC..." required className="wiki-input" maxLength={80} />
                            </div>
                            <div className="form-group">
                                <label>Categoría</label>
                                <select value={nuevoPost.categoria} onChange={e => setNuevoPost({ ...nuevoPost, categoria: e.target.value })} className="wiki-input sort-select">
                                    <option>General</option><option>Microelectrónica</option><option>Software</option><option>Hardware</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Descripción Detallada *</label>
                                <textarea value={nuevoPost.contenido} onChange={e => setNuevoPost({ ...nuevoPost, contenido: e.target.value })} placeholder="Explica los pasos..." required className="wiki-input" rows={6} />
                            </div>
                            <div className="form-group upload-section">
                                <label>Imagen Adjunta (Opcional)</label>
                                <div className="upload-box" onClick={() => fileInputPrincipalRef.current.click()}>
                                    {nuevoPost.imagenPrincipal ? <img src={nuevoPost.imagenPrincipal} alt="Preview" className="upload-preview" /> : <><SvgImage /> <span>Subir foto</span></>}
                                </div>
                                <input type="file" ref={fileInputPrincipalRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
                            </div>
                            <button type="submit" className="btn-new-post" style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1.1rem' }}>Publicar Aporte</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CommunityWiki;