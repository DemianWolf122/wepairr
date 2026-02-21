import React, { useState, useEffect } from 'react';
import './CommunityWiki.css';

const POSTS_INICIALES = [
    { id: 1, titulo: "Falla de carga iPhone 12 Pro", autor: "TecnoMar", contenido: "Si el equipo consume 0.01A, revisen el IC de carga U2 antes de abrir la placa. El cliente reportó que dejó de cargar tras usar un cargador de auto genérico. Reemplazando el IC se solucionó el problema.", imagen: "https://images.unsplash.com/photo-1597740985671-2a8a3b80502e?q=80&w=600", likes: 24, categoria: "Microelectrónica", likedByMe: false },
    { id: 2, titulo: "Cómo despegar tapas de Samsung S23", autor: "ElectroFix", contenido: "Usar plancha a 80 grados por 5 minutos exactos para no dañar el flex de antena. Es vital usar alcohol isopropílico en los bordes con una espátula de plástico muy fina.", imagen: "", likes: 15, categoria: "Hardware", likedByMe: false }
];

function CommunityWiki() {
    const [posts, setPosts] = useState(() => {
        const guardados = localStorage.getItem('wepairr_wiki_posts');
        return guardados ? JSON.parse(guardados) : POSTS_INICIALES;
    });

    const [postSeleccionado, setPostSeleccionado] = useState(null);
    const [mostrandoFormulario, setMostrandoFormulario] = useState(false);
    const [nuevoPost, setNuevoPost] = useState({ titulo: '', categoria: '', contenido: '', imagen: '' });

    useEffect(() => { localStorage.setItem('wepairr_wiki_posts', JSON.stringify(posts)); }, [posts]);

    const manejarLike = (e, id) => {
        e.stopPropagation();
        setPosts(prev => prev.map(post => {
            if (post.id === id) return { ...post, likes: post.likedByMe ? post.likes - 1 : post.likes + 1, likedByMe: !post.likedByMe };
            return post;
        }));
    };

    const manejarCrearPost = (e) => {
        e.preventDefault();
        if (!nuevoPost.titulo.trim() || !nuevoPost.contenido.trim()) return;
        const post = { id: Date.now(), titulo: nuevoPost.titulo, autor: "Mi Taller", contenido: nuevoPost.contenido, imagen: nuevoPost.imagen, likes: 0, categoria: nuevoPost.categoria || 'General', likedByMe: false };
        setPosts(prev => [post, ...prev]);
        setNuevoPost({ titulo: '', categoria: '', contenido: '', imagen: '' });
        setMostrandoFormulario(false);
    };

    return (
        <div className="wiki-wrapper">
            <header className="wiki-header">
                <div>
                    <h2>Comunidad Wepairr</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Encontrá soluciones y compartí conocimiento con otros técnicos.</p>
                </div>
                <button className="btn-new-post" onClick={() => setMostrandoFormulario(true)}>+ Compartir Solución</button>
            </header>

            <div className="wiki-grid">
                {posts.map(post => (
                    <div key={post.id} className="wiki-card" onClick={() => setPostSeleccionado(post)}>
                        <span className="wiki-tag">{post.categoria}</span>
                        <h3>{post.titulo}</h3>
                        <p>{post.contenido.length > 80 ? post.contenido.substring(0, 80) + '...' : post.contenido}</p>
                        <div className="wiki-footer">
                            <span>Por: {post.autor}</span>
                            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                <span className="read-more">Ver más →</span>
                                <button className={`btn-like ${post.likedByMe ? 'liked' : ''}`} onClick={(e) => manejarLike(e, post.id)}>👍 {post.likes}</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL ARREGLADO: Separación de cabecera y cuerpo scrollable */}
            {postSeleccionado && (
                <div className="wiki-modal-overlay" onClick={() => setPostSeleccionado(null)}>
                    <div className="wiki-modal-container" onClick={e => e.stopPropagation()}>

                        {/* Cabecera pegajosa */}
                        <div className="wiki-modal-header-fixed">
                            <span className="wiki-tag">{postSeleccionado.categoria}</span>
                            <button className="btn-close-modal" onClick={() => setPostSeleccionado(null)}>×</button>
                        </div>

                        {/* Contenido scrolleable libre */}
                        <div className="wiki-modal-body-scroll">
                            <h2 className="modal-title">{postSeleccionado.titulo}</h2>
                            <span className="modal-author">Aportado por: {postSeleccionado.autor}</span>

                            {postSeleccionado.imagen && (
                                <div className="wiki-modal-image">
                                    <img src={postSeleccionado.imagen} alt="Reparación" />
                                </div>
                            )}

                            <div className="wiki-modal-text">
                                {postSeleccionado.contenido.split('\n').map((parrafo, i) => <p key={i}>{parrafo}</p>)}
                            </div>

                            <div className="wiki-modal-actions">
                                <button className={`btn-like-large ${postSeleccionado.likedByMe ? 'liked' : ''}`} onClick={(e) => {
                                    manejarLike(e, postSeleccionado.id);
                                    setPostSeleccionado(prev => ({ ...prev, likes: prev.likedByMe ? prev.likes - 1 : prev.likes + 1, likedByMe: !prev.likedByMe }));
                                }}>
                                    👍 {postSeleccionado.likes} Me sirvió
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CommunityWiki;