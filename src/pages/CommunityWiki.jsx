import React, { useState, useEffect } from 'react';
import './CommunityWiki.css';

// Base de datos de prueba para inicializar
const POSTS_INICIALES = [
    {
        id: 1,
        titulo: "Falla de carga iPhone 12 Pro",
        autor: "TecnoMar",
        contenido: "Si el equipo consume 0.01A, revisen el IC de carga U2 antes de abrir la placa. El cliente reportó que dejó de cargar tras usar un cargador de auto genérico. Reemplazando el IC se solucionó el problema por completo sin tener que tocar memoria.",
        imagen: "https://images.unsplash.com/photo-1597740985671-2a8a3b80502e?q=80&w=600&auto=format&fit=crop",
        likes: 24,
        categoria: "Microelectrónica",
        likedByMe: false
    },
    {
        id: 2,
        titulo: "Cómo despegar tapas de Samsung S23",
        autor: "ElectroFix",
        contenido: "Usar plancha a 80 grados por 5 minutos exactos para no dañar el flex de antena. Es vital usar alcohol isopropílico en los bordes con una espátula de plástico muy fina. Si usan de metal corren riesgo de cortar la antena NFC que pasa muy cerca del borde inferior.",
        imagen: "",
        likes: 15,
        categoria: "Hardware",
        likedByMe: false
    }
];

function CommunityWiki() {
    // ESTADO GLOBAL DEL FORO (Simula la Base de Datos)
    const [posts, setPosts] = useState(() => {
        const guardados = localStorage.getItem('wepairr_wiki_posts');
        return guardados ? JSON.parse(guardados) : POSTS_INICIALES;
    });

    // ESTADOS PARA LOS MODALES (Ventanas flotantes)
    const [postSeleccionado, setPostSeleccionado] = useState(null);
    const [mostrandoFormulario, setMostrandoFormulario] = useState(false);
    const [nuevoPost, setNuevoPost] = useState({ titulo: '', categoria: '', contenido: '', imagen: '' });

    // EFECTO DE GUARDADO (El día de mañana, esto se cambia por una llamada a tu servidor)
    useEffect(() => {
        localStorage.setItem('wepairr_wiki_posts', JSON.stringify(posts));
    }, [posts]);

    // Lógica para dar/quitar Likes
    const manejarLike = (e, id) => {
        e.stopPropagation(); // Evita que se abra el modal si solo querés dar like

        setPosts(prevPosts => prevPosts.map(post => {
            if (post.id === id) {
                const isLiked = post.likedByMe;
                return {
                    ...post,
                    likes: isLiked ? post.likes - 1 : post.likes + 1,
                    likedByMe: !isLiked
                };
            }
            return post;
        }));
    };

    // Lógica para Crear un Post Nuevo
    const manejarCrearPost = (e) => {
        e.preventDefault();
        if (!nuevoPost.titulo.trim() || !nuevoPost.contenido.trim()) return;

        // Estructura de datos preparada para ser enviada a un Backend futuro
        const post = {
            id: Date.now(),
            titulo: nuevoPost.titulo,
            autor: "Mi Taller", // En el futuro se tomará del sistema de Auth
            contenido: nuevoPost.contenido,
            imagen: nuevoPost.imagen,
            likes: 0,
            categoria: nuevoPost.categoria || 'General',
            likedByMe: false
        };

        setPosts(prev => [post, ...prev]); // Agrega el post al principio de la lista
        setNuevoPost({ titulo: '', categoria: '', contenido: '', imagen: '' }); // Limpia formulario
        setMostrandoFormulario(false); // Cierra modal
    };

    return (
        <div className="wiki-wrapper">
            {/* CABECERA */}
            <header className="wiki-header">
                <div>
                    <h2>Comunidad Wepairr</h2>
                    <p style={{ color: '#888', marginTop: '5px' }}>Encontrá soluciones, compartí conocimiento y crecé junto a otros técnicos.</p>
                </div>
                <button className="btn-new-post" onClick={() => setMostrandoFormulario(true)}>
                    + Compartir Solución
                </button>
            </header>

            {/* GRILLA DE POSTS */}
            <div className="wiki-grid">
                {posts.map(post => (
                    <div key={post.id} className="wiki-card" onClick={() => setPostSeleccionado(post)}>
                        <span className="wiki-tag">{post.categoria}</span>
                        <h3>{post.titulo}</h3>

                        {/* Mostramos solo las primeras 80 letras como vista previa */}
                        <p>{post.contenido.length > 80 ? post.contenido.substring(0, 80) + '...' : post.contenido}</p>

                        <div className="wiki-footer">
                            <span>Por: {post.autor}</span>
                            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                <span className="read-more">Ver más →</span>
                                <button
                                    className={`btn-like ${post.likedByMe ? 'liked' : ''}`}
                                    onClick={(e) => manejarLike(e, post.id)}
                                >
                                    👍 {post.likes}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL: VER POST COMPLETO */}
            {postSeleccionado && (
                <div className="wiki-modal-overlay" onClick={() => setPostSeleccionado(null)}>
                    <div className="wiki-modal-content" onClick={e => e.stopPropagation()}>
                        <button className="btn-close-modal" onClick={() => setPostSeleccionado(null)}>×</button>

                        <span className="wiki-tag">{postSeleccionado.categoria}</span>
                        <h2 className="modal-title">{postSeleccionado.titulo}</h2>
                        <span className="modal-author">Aportado por: {postSeleccionado.autor}</span>

                        {postSeleccionado.imagen && (
                            <div className="wiki-modal-image">
                                <img src={postSeleccionado.imagen} alt="Foto de la reparación" />
                            </div>
                        )}

                        <div className="wiki-modal-text">
                            {postSeleccionado.contenido.split('\n').map((parrafo, i) => (
                                <p key={i}>{parrafo}</p>
                            ))}
                        </div>

                        <div className="wiki-modal-actions">
                            <button
                                className={`btn-like-large ${postSeleccionado.likedByMe ? 'liked' : ''}`}
                                onClick={(e) => {
                                    manejarLike(e, postSeleccionado.id);
                                    // Sincronizamos el estado del modal al instante
                                    setPostSeleccionado(prev => ({
                                        ...prev,
                                        likes: prev.likedByMe ? prev.likes - 1 : prev.likes + 1,
                                        likedByMe: !prev.likedByMe
                                    }));
                                }}
                            >
                                👍 {postSeleccionado.likes} Me sirvió
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: FORMULARIO PARA CREAR POST */}
            {mostrandoFormulario && (
                <div className="wiki-modal-overlay" onClick={() => setMostrandoFormulario(false)}>
                    <div className="wiki-modal-content form-modal" onClick={e => e.stopPropagation()}>
                        <button className="btn-close-modal" onClick={() => setMostrandoFormulario(false)}>×</button>
                        <h2 style={{ color: '#fff', marginBottom: '10px' }}>Aportar a la Comunidad</h2>
                        <p style={{ color: '#888', marginBottom: '25px', lineHeight: '1.4' }}>
                            Un ecosistema colaborativo nos hace crecer a todos. Detallá bien el problema y cómo lo resolviste.
                        </p>

                        <form onSubmit={manejarCrearPost} className="wiki-form">
                            <input
                                type="text"
                                placeholder="Título de la falla / solución..."
                                value={nuevoPost.titulo}
                                onChange={e => setNuevoPost({ ...nuevoPost, titulo: e.target.value })}
                                required
                                className="wiki-input"
                            />
                            <input
                                type="text"
                                placeholder="Categoría (Ej. Software, Apple, Pantallas)"
                                value={nuevoPost.categoria}
                                onChange={e => setNuevoPost({ ...nuevoPost, categoria: e.target.value })}
                                required
                                className="wiki-input"
                            />
                            <input
                                type="url"
                                placeholder="URL de imagen demostrativa (Opcional)"
                                value={nuevoPost.imagen}
                                onChange={e => setNuevoPost({ ...nuevoPost, imagen: e.target.value })}
                                className="wiki-input"
                            />
                            <textarea
                                placeholder="Describí la falla original y cómo lograste solucionarla paso a paso..."
                                value={nuevoPost.contenido}
                                onChange={e => setNuevoPost({ ...nuevoPost, contenido: e.target.value })}
                                required
                                className="wiki-input wiki-textarea"
                            ></textarea>
                            <button type="submit" className="btn-submit-post">Publicar Conocimiento</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CommunityWiki;