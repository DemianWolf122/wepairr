import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import './CommunityWiki.css';

// --- SVGs ---
const SvgSearch = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const SvgMessage = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;
const SvgHeart = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>;
const SvgShare = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>;
const SvgPlus = () => <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const SvgImage = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>;
const SvgTrash = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const SvgX = () => <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

// FUNCION DE COMPRESIÓN EXTREMA EN NAVEGADOR
const compressImage = (file) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 800;
                const MAX_HEIGHT = 800;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
                } else {
                    if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                const dataUrl = canvas.toDataURL('image/jpeg', 0.5);
                resolve(dataUrl);
            };
        };
    });
};

function CommunityWiki() {
    const [busqueda, setBusqueda] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState('Todas');
    const [posts, setPosts] = useState([]);

    // NUEVO ESTADO PARA EL MODAL DEL POST
    const [selectedPost, setSelectedPost] = useState(null);

    const [isComposing, setIsComposing] = useState(false);
    const [isCompressing, setIsCompressing] = useState(false);
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostContent, setNewPostContent] = useState('');
    const [postImages, setPostImages] = useState([]);
    const [userEmail, setUserEmail] = useState('Técnico Anónimo');

    const fileInputRef = useRef(null);

    const fallbackPosts = [
        {
            id: 1,
            title: 'Solución: iPhone 13 Pro Max no enciende (Corto en VDD_MAIN)',
            content: 'Me llegó un 13 Pro Max muerto. Consumo inicial de 1.2A. Aplicando rocina encontré que el capacitor C1234 estaba en corto cerca del PMIC. Lo retiré y el equipo encendió perfectamente. Reemplazado por uno de 10uF. ¡Espero les sirva!',
            author: 'Demian (Admin)',
            category: 'Microelectrónica',
            date: 'Hace 2 horas',
            likes: 14,
            comments: 3,
            image_url: JSON.stringify(['https://images.unsplash.com/photo-1597740985671-2a8a3b80502e?w=800&q=80'])
        }
    ];

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user?.email) {
                setUserEmail(session.user.email.split('@')[0]);
            }
        });

        const fetchPosts = async () => {
            try {
                const { data, error } = await supabase
                    .from('community_posts')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                if (data && data.length > 0) {
                    setPosts(data);
                } else {
                    setPosts(fallbackPosts);
                }
            } catch (err) {
                console.warn("Fallo conexión Supabase en Comunidad. Usando caché local.");
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

    const handleMultipleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        if (postImages.length + files.length > 4) {
            alert("Puedes adjuntar un máximo de 4 imágenes por publicación.");
            return;
        }

        setIsCompressing(true);
        const compressedArray = [];

        for (let file of files) {
            if (file.type.startsWith('image/')) {
                const compressedDataUrl = await compressImage(file);
                compressedArray.push(compressedDataUrl);
            }
        }

        setPostImages(prev => [...prev, ...compressedArray]);
        setIsCompressing(false);

        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeImage = (indexToRemove) => {
        setPostImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!newPostTitle.trim() || !newPostContent.trim()) return;

        const imagesToSave = postImages.length > 0 ? JSON.stringify(postImages) : null;

        const newPost = {
            id: Date.now(),
            title: newPostTitle,
            content: newPostContent,
            author: userEmail,
            category: filtroCategoria !== 'Todas' ? filtroCategoria : 'Microelectrónica',
            date: 'Justo ahora',
            likes: 0,
            comments: 0,
            image_url: imagesToSave
        };

        const updatedPosts = [newPost, ...posts];
        setPosts(updatedPosts);
        localStorage.setItem('wepairr_global_community', JSON.stringify(updatedPosts));

        try {
            await supabase.from('community_posts').insert([{
                title: newPost.title,
                content: newPost.content,
                author: newPost.author,
                category: newPost.category,
                date: newPost.date,
                image_url: newPost.image_url
            }]);
        } catch (e) { console.warn("No se pudo guardar post en Supabase."); }

        setIsComposing(false);
        setNewPostTitle('');
        setNewPostContent('');
        setPostImages([]);
    };

    const getParsedImages = (imageUrlString) => {
        if (!imageUrlString) return [];
        try {
            if (imageUrlString.startsWith('[')) {
                return JSON.parse(imageUrlString);
            }
            return [imageUrlString];
        } catch (e) {
            return [];
        }
    };

    // FUNCIONES DEL MODAL
    const openPostModal = (post) => {
        setSelectedPost(post);
        document.body.style.overflow = 'hidden'; // Evita scrollear el fondo
    };

    const closePostModal = () => {
        setSelectedPost(null);
        document.body.style.overflow = 'auto'; // Restaura el scroll
    };

    return (
        <div className="wiki-container animate-fade-in">
            <header className="wiki-header">
                <div>
                    <h2 className="wiki-title">Comunidad Global</h2>
                    <p className="wiki-subtitle">El foro donde los técnicos de Wepairr comparten fallas, soluciones y proveedores.</p>
                </div>
                <button className="btn-create-post" onClick={() => setIsComposing(!isComposing)}>
                    {isComposing ? <><SvgX /> Cancelar</> : <><SvgPlus /> Nueva Publicación</>}
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

                        {postImages.length > 0 && (
                            <div className="compose-images-grid">
                                {postImages.map((imgSrc, idx) => (
                                    <div key={idx} className="compose-image-item">
                                        <img src={imgSrc} alt={`Preview ${idx}`} />
                                        {idx === 0 && <span className="badge-principal">Principal</span>}
                                        <button type="button" className="btn-remove-image" onClick={() => removeImage(idx)}>
                                            <SvgTrash />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="compose-actions">
                            <div className="compose-tools">
                                <span className="compose-author">Publicando como: <strong>{userEmail}</strong></span>

                                <label className={`btn-attach-image ${postImages.length >= 4 ? 'disabled' : ''}`}>
                                    <SvgImage /> {isCompressing ? 'Comprimiendo...' : 'Adjuntar Fotos (Máx 4)'}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleMultipleImageUpload}
                                        ref={fileInputRef}
                                        disabled={postImages.length >= 4 || isCompressing}
                                        hidden
                                    />
                                </label>
                            </div>
                            <button type="submit" className="btn-submit-post" disabled={isCompressing}>
                                Publicar en la Comunidad
                            </button>
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
                    <div className="wiki-empty-state">
                        No se encontraron publicaciones con estos criterios.
                    </div>
                )}
                {postsFiltrados.map(post => {
                    const postImagesArray = getParsedImages(post.image_url);
                    const hasImages = postImagesArray.length > 0;

                    return (
                        <article key={post.id} className="wiki-post-card glass-effect" onClick={() => openPostModal(post)}>
                            <div className="post-header-click">
                                <div className="post-meta">
                                    <span className="post-category">{post.category}</span>
                                    <span className="post-author">👤 {post.author}</span>
                                    <span className="post-date">{post.date}</span>
                                </div>
                                <div className="post-title-row">
                                    <div className="title-and-thumb">
                                        {hasImages && (
                                            <div className="post-thumbnail-mini">
                                                <img src={postImagesArray[0]} alt="Miniatura" />
                                                {postImagesArray.length > 1 && (
                                                    <div className="thumbnail-count">+{postImagesArray.length - 1}</div>
                                                )}
                                            </div>
                                        )}
                                        <h3 className="post-title">{post.title}</h3>
                                    </div>
                                </div>
                                {/* Pequeño preview de texto en la lista */}
                                <p className="post-preview-text">
                                    {post.content.length > 120 ? post.content.substring(0, 120) + '...' : post.content}
                                </p>
                            </div>
                        </article>
                    );
                })}
            </div>

            {/* --- EL MODAL DE VISTA PREVIA (BLURREADO) --- */}
            {selectedPost && (
                <div className="post-modal-overlay animate-fade-in" onClick={closePostModal}>
                    <div className="post-modal-container glass-effect animate-scale-in" onClick={e => e.stopPropagation()}>

                        <button className="btn-close-modal" onClick={closePostModal}>
                            <SvgX />
                        </button>

                        <div className="post-modal-header">
                            <div className="post-meta" style={{ marginBottom: 0 }}>
                                <span className="post-category">{selectedPost.category}</span>
                                <span className="post-author">👤 {selectedPost.author}</span>
                                <span className="post-date">{selectedPost.date}</span>
                            </div>
                            <h2 className="post-modal-title">{selectedPost.title}</h2>
                        </div>

                        <div className="post-modal-body">
                            <p className="post-modal-content">{selectedPost.content}</p>

                            {/* Mostrar las imágenes en grande DENTRO del modal */}
                            {getParsedImages(selectedPost.image_url).length > 0 && (
                                <div className="post-modal-images-grid">
                                    {getParsedImages(selectedPost.image_url).map((imgSrc, idx) => (
                                        <img key={idx} src={imgSrc} alt={`Adjunto ${idx + 1}`} className="post-modal-full-img" />
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="post-modal-footer">
                            <div className="post-actions">
                                <button className="post-action-btn"><SvgHeart /> {selectedPost.likes || 0} Me gusta</button>
                                <button className="post-action-btn"><SvgMessage /> {selectedPost.comments || 0} Respuestas</button>
                                <button className="post-action-btn"><SvgShare /> Compartir</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CommunityWiki;