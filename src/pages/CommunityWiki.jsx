import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // INYECTADO
import './CommunityWiki.css';

// SVGs
const SvgSearch = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const SvgMessage = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;
const SvgHeart = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>;
const SvgShare = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>;
const SvgChevronDown = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><polyline points="6 9 12 15 18 9"></polyline></svg>;
const SvgPlus = () => <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;

function CommunityWiki() {
    const [busqueda, setBusqueda] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState('Todas');
    const [expandedPost, setExpandedPost] = useState(null);
    const [posts, setPosts] = useState([]);

    const [isComposing, setIsComposing] = useState(false);
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostContent, setNewPostContent] = useState('');
    const [userEmail, setUserEmail] = useState('Técnico Anónimo');

    // POSTS INICIALES DE RESPALDO (Si Supabase está vacío)
    const fallbackPosts = [
        {
            id: 1, title: 'Solución: iPhone 13 Pro Max no enciende (Corto en VDD_MAIN)', content: 'Me llegó un 13 Pro Max muerto. Consumo inicial de 1.2A. Aplicando rocina encontré que el capacitor C1234 estaba en corto cerca del PMIC. Lo retiré y el equipo encendió. Reemplazado por uno de 10uF. ¡Espero les sirva!', author: 'Demian (Admin)', category: 'Microelectrónica', date: 'Hace 2 horas', likes: 14, comments: 3
        },
        {
            id: 2, title: '¿Dónde compran repuestos de calidad para Samsung en Argentina?', content: 'He estado teniendo problemas con las pantallas OLED genéricas de los Samsung S21. Se despegan o vienen con fallas táctiles. ¿Algún proveedor recomendado en CABA o que envíe al interior?', author: 'Lucila_Fix', category: 'Proveedores', date: 'Hace 5 horas', likes: 5, comments: 12
        }
    ];

    useEffect(() => {
        // Obtenemos el usuario actual
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user?.email) {
                // Tomamos la parte antes del @ como nombre de usuario temporal
                setUserEmail(session.user.email.split('@')[0]);
            }
        });

        // Intentamos cargar de Supabase (Lógica de red real)
        const fetchPosts = async () => {
            try {
                // Si la tabla no existe aún, esto fallará y usaremos el Fallback local
                const { data, error } = await supabase.from('community_posts').select('*').order('created_at', { ascending: false });
                if (error) throw error;
                if (data && data.length > 0) setPosts(data);
                else setPosts(fallbackPosts);
            } catch (err) {
                console.warn("Usando base de datos comunitaria local (Fallback)");
                const localPosts = localStorage.getItem('wepairr_global_community');
                if (localPosts) setPosts(JSON.parse(localPosts));
                else setPosts(fallbackPosts);
            }
        };

        fetchPosts();
    }, []);

    const categorias = ['Todas', 'Microelectrónica', 'Software', 'Proveedores', 'Herramientas', 'Off-topic'];

    const postsFiltrados = posts.filter(post => {
        const coincideCategoria = filtroCategoria === 'Todas' || post.category === filtroCategoria;
        const coincideBusqueda = post.title.toLowerCase().includes(busqueda.toLowerCase()) || post.content.toLowerCase().includes(busqueda.toLowerCase());
        return coincideCategoria && coincideBusqueda;
    });

    const togglePost = (id) => {
        setExpandedPost(prev => prev === id ? null : id);
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!newPostTitle.trim() || !newPostContent.trim()) return;

        const newPost = {
            id: Date.now(),
            title: newPostTitle,
            content: newPostContent,
            author: userEmail,
            category: filtroCategoria !== 'Todas' ? filtroCategoria : 'Microelectrónica',
            date: 'Justo ahora',
            likes: 0,
            comments: 0
        };

        const updatedPosts = [newPost, ...posts];
        setPosts(updatedPosts);

        // Guardado local como respaldo (simulando servidor global)
        localStorage.setItem('wepairr_global_community', JSON.stringify(updatedPosts));

        // Intento de guardado en servidor real
        try {
            await supabase.from('community_posts').insert([{ ...newPost }]);
        } catch (e) { /* Ignorado en caso de no tener la tabla creada */ }

        setIsComposing(false);
        setNewPostTitle('');
        setNewPostContent('');
    };

    return (
        <div className="wiki-container animate-fade-in">
            <header className="wiki-header">
                <div>
                    <h2 className="wiki-title">Comunidad Global</h2>
                    <p className="wiki-subtitle">El foro donde los técnicos de Wepairr comparten fallas, soluciones y proveedores.</p>
                </div>
                <button className="btn-create-post" onClick={() => setIsComposing(!isComposing)}>
                    {isComposing ? <><SvgChevronDown /> Cancelar</> : <><SvgPlus /> Nueva Publicación</>}
                </button>
            </header>

            {isComposing && (
                <div className="compose-box glass-effect animate-slide-up">
                    <form onSubmit={handleCreatePost}>
                        <input
                            type="text"
                            placeholder="Título de tu publicación (Ej: Solución Corto iPhone 11)"
                            className="compose-input"
                            value={newPostTitle}
                            onChange={e => setNewPostTitle(e.target.value)}
                            required
                        />
                        <textarea
                            placeholder="Describe el problema, la solución o tu duda en detalle..."
                            className="compose-textarea"
                            rows="4"
                            value={newPostContent}
                            onChange={e => setNewPostContent(e.target.value)}
                            required
                        ></textarea>
                        <div className="compose-actions">
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Publicando como: <strong>{userEmail}</strong></span>
                            <button type="submit" className="btn-submit-post">Publicar en la Comunidad</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="wiki-controls">
                <div className="search-wiki glass-effect">
                    <SvgSearch />
                    <input type="text" placeholder="Buscar por modelo, falla o componente..." value={busqueda} onChange={e => setBusqueda(e.target.value)} />
                </div>
                <div className="wiki-categories">
                    {categorias.map(cat => (
                        <button key={cat} className={`cat-btn ${filtroCategoria === cat ? 'active' : ''}`} onClick={() => setFiltroCategoria(cat)}>
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="wiki-posts-list">
                {postsFiltrados.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px' }}>
                        No se encontraron publicaciones con estos criterios.
                    </div>
                )}
                {postsFiltrados.map(post => (
                    <article key={post.id} className="wiki-post-card glass-effect">

                        {/* HEADER DEL POST (Clickeable para expandir) */}
                        <div className="post-header-click" onClick={() => togglePost(post.id)}>
                            <div className="post-meta">
                                <span className="post-category">{post.category}</span>
                                <span className="post-author">👤 {post.author}</span>
                                <span className="post-date">{post.date}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 className="post-title">{post.title}</h3>
                                <SvgChevronDown className={`expand-icon ${expandedPost === post.id ? 'rotated' : ''}`} />
                            </div>
                        </div>

                        {/* CUERPO DEL POST (FIX: Antes no se veía, ahora se expande suavemente) */}
                        {expandedPost === post.id && (
                            <div className="post-body animate-fade-in">
                                <div className="post-content">
                                    <p>{post.content}</p>
                                </div>
                                <div className="post-actions">
                                    <button className="post-action-btn"><SvgHeart /> {post.likes} Me gusta</button>
                                    <button className="post-action-btn"><SvgMessage /> {post.comments} Respuestas</button>
                                    <button className="post-action-btn"><SvgShare /> Compartir</button>
                                </div>
                            </div>
                        )}
                    </article>
                ))}
            </div>
        </div>
    );
}

export default CommunityWiki;