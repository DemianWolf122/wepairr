import React, { useState, useEffect, useRef } from 'react';
import './CommunityWiki.css';

// SVGs
const SvgPlus = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const SvgArrow = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>;
const SvgLike = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>;
const SvgX = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const SvgImage = () => <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>;


const POSTS_INICIALES = [
    { id: 1, titulo: "Falla de carga iPhone 12 Pro", autor: "TecnoMar", contenido: "Si el equipo consume 0.01A, revisen el IC de carga...", imagenPrincipal: null, imagenesSecundarias: [], likes: 24, categoria: "Microelectrónica", likedByMe: false }
];

function CommunityWiki() {
    const [posts, setPosts] = useState(() => {
        const guardados = localStorage.getItem('wepairr_wiki_posts');
        return guardados ? JSON.parse(guardados) : POSTS_INICIALES;
    });

    const [postSeleccionado, setPostSeleccionado] = useState(null);
    const [mostrandoFormulario, setMostrandoFormulario] = useState(false);

    // Estado del nuevo formulario
    const [nuevoPost, setNuevoPost] = useState({ titulo: '', categoria: 'General', contenido: '', imagenPrincipal: null, imagenesSecundarias: [] });
    const fileInputPrincipalRef = useRef(null);
    const fileInputSecundarioRef = useRef(null);


    useEffect(() => { localStorage.setItem('wepairr_wiki_posts', JSON.stringify(posts)); }, [posts]);

    const manejarLike = (e, id) => {
        e.stopPropagation();
        setPosts(prev => prev.map(post => {
            if (post.id === id) return { ...post, likes: post.likedByMe ? post.likes - 1 : post.likes + 1, likedByMe: !post.likedByMe };
            return post;
        }));
    };

    // Manejo de archivos para el nuevo post
    const handleFileChange = (e, tipo) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (tipo === 'principal') {
                        setNuevoPost(prev => ({ ...prev, imagenPrincipal: reader.result }));
                    } else {
                        setNuevoPost(prev => ({ ...prev, imagenesSecundarias: [...prev.imagenesSecundarias, reader.result] }));
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    };

    const crearPost = (e) => {
        e.preventDefault();
        if (!nuevoPost.titulo.trim() || !nuevoPost.contenido.trim()) {
            alert("Título y contenido son obligatorios.");
            return;
        }
        const post = {
            id: Date.now(),
            autor: "Mi Taller", // Podría venir del config
            likes: 0,
            likedByMe: false,
            ...nuevoPost
        };
        setPosts(prev => [post, ...prev]);
        setNuevoPost({ titulo: '', categoria: 'General', contenido: '', imagenPrincipal: null, imagenesSecundarias: [] });
        setMostrandoFormulario(false);
    };


    return (
        <div className="wiki-wrapper">
            <header className="wiki-header">
                <div>
                    <h2>Comunidad Wepairr</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Encontrá soluciones y compartí conocimiento con otros técnicos.</p>
                </div>
                <button className="btn-new-post" onClick={() => setMostrandoFormulario(true)}>
                    <SvgPlus /> Compartir Solución
                </button>
            </header>

            <div className="wiki-grid">
                {posts.map(post => (
                    <div key={post.id} className="wiki-card" onClick={() => setPostSeleccionado(post)}>
                        {/* Thumbnail si existe imagen principal */}
                        {post.imagenPrincipal && (
                            <div className="wiki-thumbnail" style={{ backgroundImage: `url(${post.imagenPrincipal})` }}></div>
                        )}
                        <span className="wiki-tag">{post.categoria}</span>
                        <h3>{post.titulo}</h3>
                        <p>{post.contenido.length > 80 ? post.contenido.substring(0, 80) + '...' : post.contenido}</p>
                        <div className="wiki-footer">
                            <span>Por: {post.autor}</span>
                            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                <span className="read-more">Ver más <SvgArrow /></span>
                                <button className={`btn-like ${post.likedByMe ? 'liked' : ''}`} onClick={(e) => manejarLike(e, post.id)}>
                                    <SvgLike /> {post.likes}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL DETALLE DEL POST */}
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

                            {/* Imagen Principal Arreglada */}
                            {postSeleccionado.imagenPrincipal && (
                                <div className="wiki-modal-image-container main-image">
                                    <img src={postSeleccionado.imagenPrincipal} alt="Principal" />
                                </div>
                            )}

                            <div className="wiki-modal-text">
                                {postSeleccionado.contenido.split('\n').map((parrafo, i) => <p key={i}>{parrafo}</p>)}
                            </div>

                            {/* Imágenes Secundarias */}
                            {postSeleccionado.imagenesSecundarias.length > 0 && (
                                <div className="secondary-images-grid">
                                    {postSeleccionado.imagenesSecundarias.map((img, idx) => (
                                        <div key={idx} className="wiki-modal-image-container secondary-image">
                                            <img src={img} alt={`Secundaria ${idx}`} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL NUEVO POST (FORMULARIO) */}
            {mostrandoFormulario && (
                <div className="wiki-modal-overlay" onClick={() => setMostrandoFormulario(false)}>
                    <div className="wiki-modal-container new-post-form animate-scale-in" onClick={e => e.stopPropagation()}>
                        <div className="wiki-modal-header-fixed">
                            <h3>Nueva Solución</h3>
                            <button className="btn-close-modal" onClick={() => setMostrandoFormulario(false)}><SvgX /></button>
                        </div>
                        <form onSubmit={crearPost} className="wiki-modal-body-scroll form-body">
                            <div className="form-group">
                                <label>Título del Aporte *</label>
                                <input type="text" value={nuevoPost.titulo} onChange={e => setNuevoPost({ ...nuevoPost, titulo: e.target.value })} placeholder="Ej. Solución IC de carga iPhone X" required className="settings-input" />
                            </div>

                            <div className="form-row">
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Categoría</label>
                                    <select value={nuevoPost.categoria} onChange={e => setNuevoPost({ ...nuevoPost, categoria: e.target.value })} className="settings-input select-input">
                                        <option>General</option>
                                        <option>Microelectrónica</option>
                                        <option>Software</option>
                                        <option>Hardware</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Descripción Detallada *</label>
                                <textarea value={nuevoPost.contenido} onChange={e => setNuevoPost({ ...nuevoPost, contenido: e.target.value })} placeholder="Explica los pasos de la solución..." required className="settings-input settings-textarea" rows={6} />
                            </div>

                            {/* Carga de Imágenes */}
                            <div className="form-group upload-section">
                                <label>Imagen Principal (Thumbnail)</label>
                                <div className="upload-box" onClick={() => fileInputPrincipalRef.current.click()}>
                                    {nuevoPost.imagenPrincipal ? <img src={nuevoPost.imagenPrincipal} alt="Preview" className="upload-preview" /> : <><SvgImage /> <span>Click para subir imagen principal</span></>}
                                </div>
                                <input type="file" ref={fileInputPrincipalRef} onChange={e => handleFileChange(e, 'principal')} accept="image/*" style={{ display: 'none' }} />
                            </div>

                            <div className="form-group upload-section">
                                <label>Imágenes Adicionales (Opcional)</label>
                                <div className="upload-box secondary-upload" onClick={() => fileInputSecundarioRef.current.click()}>
                                    <SvgImage /> <span>Agregar más imágenes...</span>
                                </div>
                                <input type="file" ref={fileInputSecundarioRef} onChange={e => handleFileChange(e, 'secundaria')} accept="image/*" multiple style={{ display: 'none' }} />

                                <div className="secondary-previews">
                                    {nuevoPost.imagenesSecundarias.map((img, idx) => (
                                        <img key={idx} src={img} alt="Preview secondary" className="mini-preview" />
                                    ))}
                                </div>
                            </div>

                            <button type="submit" className="btn-save-ticket" style={{ marginTop: '20px' }}>Publicar Solución</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CommunityWiki;