import React, { useState, useEffect } from 'react';
import './CommunityWiki.css';

// SVGs
const SvgPlus = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const SvgArrow = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>;
const SvgLike = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>;
const SvgX = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

const POSTS_INICIALES = [
    { id: 1, titulo: "Falla de carga iPhone 12 Pro", autor: "TecnoMar", contenido: "Si el equipo consume 0.01A, revisen el IC de carga...", imagen: "", likes: 24, categoria: "Microelectrónica", likedByMe: false }
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

            {postSeleccionado && (
                <div className="wiki-modal-overlay" onClick={() => setPostSeleccionado(null)}>
                    <div className="wiki-modal-container" onClick={e => e.stopPropagation()}>
                        <div className="wiki-modal-header-fixed">
                            <span className="wiki-tag">{postSeleccionado.categoria}</span>
                            <button className="btn-close-modal" onClick={() => setPostSeleccionado(null)}><SvgX /></button>
                        </div>
                        <div className="wiki-modal-body-scroll">
                            <h2 className="modal-title">{postSeleccionado.titulo}</h2>
                            <span className="modal-author">Aportado por: {postSeleccionado.autor}</span>
                            <div className="wiki-modal-text">
                                {postSeleccionado.contenido.split('\n').map((parrafo, i) => <p key={i}>{parrafo}</p>)}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CommunityWiki;