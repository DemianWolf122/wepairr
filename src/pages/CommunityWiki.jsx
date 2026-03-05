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
const SvgX = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const SvgWrench = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>;
const SvgGlobe = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>;

// COMPRESIÓN DE IMÁGENES
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
    // ESTADOS PRINCIPALES
    const [activeTab, setActiveTab] = useState('foro'); // 'foro' o 'ifixit'
    const [busqueda, setBusqueda] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState('Todas');
    const [posts, setPosts] = useState([]);

    // ESTADOS MODAL FORO
    const [selectedPost, setSelectedPost] = useState(null);
    const [isComposing, setIsComposing] = useState(false);
    const [isCompressing, setIsCompressing] = useState(false);
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostContent, setNewPostContent] = useState('');
    const [postImages, setPostImages] = useState([]);
    const [userEmail, setUserEmail] = useState('Técnico Anónimo');

    // ESTADOS IFIXIT
    const [ifixitResults, setIfixitResults] = useState([]);
    const [isSearchingIfixit, setIsSearchingIfixit] = useState(false);
    const [selectedIfixitGuide, setSelectedIfixitGuide] = useState(null);
    const [isLoadingGuide, setIsLoadingGuide] = useState(false);

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
                if (data && data.length > 0) setPosts(data);
                else setPosts(fallbackPosts);
            } catch (err) {
                const localPosts = localStorage.getItem('wepairr_global_community');
                if (localPosts) setPosts(JSON.parse(localPosts));
                else setPosts(fallbackPosts);
            }
        };

        fetchPosts();
    }, []);

    // --- LÓGICA DEL FORO INTERNO ---
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

    const handleLike = async (postId, e) => {
        e.stopPropagation(); // Evita abrir el modal
        const updatedPosts = posts.map(p => {
            if (p.id === postId) return { ...p, likes: (p.likes || 0) + 1 };
            return p;
        });
        setPosts(updatedPosts);
        localStorage.setItem('wepairr_global_community', JSON.stringify(updatedPosts));

        try {
            const postToUpdate = updatedPosts.find(p => p.id === postId);
            await supabase.from('community_posts').update({ likes: postToUpdate.likes }).eq('id', postId);
        } catch (err) { }

        // Si el modal está abierto, actualizarlo también
        if (selectedPost && selectedPost.id === postId) {
            setSelectedPost(prev => ({ ...prev, likes: (prev.likes || 0) + 1 }));
        }
    };

    const getParsedImages = (imageUrlString) => {
        if (!imageUrlString) return [];
        try {
            if (imageUrlString.startsWith('[')) return JSON.parse(imageUrlString);
            return [imageUrlString];
        } catch (e) { return []; }
    };

    // --- LÓGICA DE IFIXIT API ---
    const searchIfixit = async (e) => {
        e.preventDefault();
        if (!busqueda.trim()) return;
        setIsSearchingIfixit(true);
        try {
            // Endpoint oficial de busqueda de iFixit (Filtramos para traer guías de reparación)
            const response = await fetch(`https://www.ifixit.com/api/2.0/search/${encodeURIComponent(busqueda)}?filter=guide`);
            const data = await response.json();
            setIfixitResults(data.results || []);
        } catch (error) {
            alert("Error al conectar con la base de datos de iFixit.");
        } finally {
            setIsSearchingIfixit(false);
        }
    };

    const openIfixitGuide = async (guideid) => {
        setIsLoadingGuide(true);
        try {
            const response = await fetch(`https://www.ifixit.com/api/2.0/guides/${guideid}`);
            const data = await response.json();
            setSelectedIfixitGuide(data);
            document.body.style.overflow = 'hidden';
        } catch (error) {
            alert("No se pudo cargar la guía en este momento.");
        } finally {
            setIsLoadingGuide(false);
        }
    };

    // FUNCIONES DEL MODAL GENERAL
    const openPostModal = (post) => {
        setSelectedPost(post);
        document.body.style.overflow = 'hidden';
    };

    const closeModals = () => {
        setSelectedPost(null);
        setSelectedIfixitGuide(null);
        document.body.style.overflow = 'auto';
    };

    return (
        <div className="wiki-container animate-fade-in">
            <header className="wiki-header">
                <div>
                    <h2 className="wiki-title">Comunidad Global</h2>
                    <p className="wiki-subtitle">Colabora con otros técnicos y busca manuales oficiales.</p>
                </div>
                {activeTab === 'foro' && (
                    <button className="btn-create-post" onClick={() => setIsComposing(!isComposing)}>
                        {isComposing ? <><SvgX /> Cancelar</> : <><SvgPlus /> Nueva Publicación</>}
                    </button>
                )}
            </header>

            {/* PESTAÑAS DUALES (FORO / IFIXIT) */}
            <div className="wiki-main-tabs">
                <button className={`main-tab-btn ${activeTab === 'foro' ? 'active' : ''}`} onClick={() => setActiveTab('foro')}>
                    <SvgMessage /> Foro Interno Wepairr
                </button>
                <button className={`main-tab-btn ${activeTab === 'ifixit' ? 'active' : ''}`} onClick={() => setActiveTab('ifixit')}>
                    <SvgWrench /> Manuales Oficiales (iFixit)
                </button>
            </div>

            {/* VISTA 1: FORO INTERNO */}
            {activeTab === 'foro' && (
                <>
                    {isComposing && (
                        <div className="compose-box glass-effect animate-slide-up">
                            <form onSubmit={handleCreatePost}>
                                <input type="text" placeholder="Título de tu publicación (Ej: Solución Corto iPhone 11)" className="compose-input" value={newPostTitle} onChange={e => setNewPostTitle(e.target.value)} required />
                                <textarea placeholder="Describe el problema, la solución o tu duda en detalle..." className="compose-textarea" rows="4" value={newPostContent} onChange={e => setNewPostContent(e.target.value)} required></textarea>
                                {postImages.length > 0 && (
                                    <div className="compose-images-grid">
                                        {postImages.map((imgSrc, idx) => (
                                            <div key={idx} className="compose-image-item">
                                                <img src={imgSrc} alt={`Preview ${idx}`} />
                                                {idx === 0 && <span className="badge-principal">Principal</span>}
                                                <button type="button" className="btn-remove-image" onClick={() => removeImage(idx)}><SvgTrash /></button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="compose-actions">
                                    <div className="compose-tools">
                                        <span className="compose-author">Publicando como: <strong>{userEmail}</strong></span>
                                        <label className={`btn-attach-image ${postImages.length >= 4 ? 'disabled' : ''}`}>
                                            <SvgImage /> {isCompressing ? 'Comprimiendo...' : 'Adjuntar Fotos (Máx 4)'}
                                            <input type="file" accept="image/*" multiple onChange={handleMultipleImageUpload} ref={fileInputRef} disabled={postImages.length >= 4 || isCompressing} hidden />
                                        </label>
                                    </div>
                                    <button type="submit" className="btn-submit-post" disabled={isCompressing}>Publicar en la Comunidad</button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="wiki-controls">
                        <div className="search-wiki glass-effect">
                            <SvgSearch />
                            <input type="text" placeholder="Buscar en el foro..." value={busqueda} onChange={e => setBusqueda(e.target.value)} />
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
                            <div className="wiki-empty-state">No se encontraron publicaciones.</div>
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
                                                        {postImagesArray.length > 1 && <div className="thumbnail-count">+{postImagesArray.length - 1}</div>}
                                                    </div>
                                                )}
                                                <h3 className="post-title">{post.title}</h3>
                                            </div>
                                        </div>
                                        <p className="post-preview-text">{post.content.length > 120 ? post.content.substring(0, 120) + '...' : post.content}</p>
                                        <div className="post-preview-actions">
                                            <button className="mini-action-btn" onClick={(e) => handleLike(post.id, e)}><SvgHeart /> {post.likes || 0}</button>
                                            <span className="mini-action-btn"><SvgMessage /> {post.comments || 0}</span>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </>
            )}

            {/* VISTA 2: MANUALES IFIXIT */}
            {activeTab === 'ifixit' && (
                <div className="ifixit-container animate-fade-in">
                    <form onSubmit={searchIfixit} className="search-wiki glass-effect ifixit-searchbar">
                        <SvgSearch />
                        <input type="text" placeholder="Ej: iPhone 13 Battery, Samsung S21 Screen..." value={busqueda} onChange={e => setBusqueda(e.target.value)} required />
                        <button type="submit" className="btn-search-ifixit" disabled={isSearchingIfixit}>
                            {isSearchingIfixit ? 'Buscando...' : 'Buscar Guías'}
                        </button>
                    </form>

                    <div className="ifixit-results-grid">
                        {ifixitResults.length === 0 && !isSearchingIfixit && (
                            <div className="wiki-empty-state" style={{ gridColumn: '1 / -1' }}>
                                Ingresa un modelo para buscar manuales oficiales de desmontaje en la base de datos de iFixit. (Se recomiendan búsquedas en inglés, ej: "iPhone X Screen").
                            </div>
                        )}
                        {ifixitResults.map((result) => (
                            <div key={result.url} className="ifixit-card glass-effect" onClick={() => openIfixitGuide(result.guideid)}>
                                {result.image && result.image.standard && (
                                    <div className="ifixit-card-img">
                                        <img src={result.image.standard} alt={result.title} />
                                    </div>
                                )}
                                <div className="ifixit-card-content">
                                    <h4 className="ifixit-card-title">{result.title}</h4>
                                    <p className="ifixit-card-desc">{result.summary || 'Guía de reparación detallada.'}</p>
                                    <span className="btn-read-guide">Leer Manual Completo →</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* MODAL 1: POST DEL FORO INTERNO */}
            {selectedPost && (
                <div className="post-modal-overlay animate-fade-in" onClick={closeModals}>
                    <div className="post-modal-container glass-effect animate-scale-in" onClick={e => e.stopPropagation()}>
                        <button className="btn-close-modal" onClick={closeModals}><SvgX /></button>
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
                                <button className="post-action-btn" onClick={(e) => handleLike(selectedPost.id, e)}><SvgHeart /> {selectedPost.likes || 0} Me gusta</button>
                                <button className="post-action-btn"><SvgMessage /> Responder</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL 2: VISOR DE GUÍA IFIXIT */}
            {isLoadingGuide && (
                <div className="post-modal-overlay">
                    <div style={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>Cargando manual de iFixit...</div>
                </div>
            )}

            {selectedIfixitGuide && (
                <div className="post-modal-overlay animate-fade-in" onClick={closeModals}>
                    <div className="ifixit-modal-container glass-effect animate-scale-in" onClick={e => e.stopPropagation()}>
                        <button className="btn-close-modal" onClick={closeModals}><SvgX /></button>

                        <div className="ifixit-modal-header">
                            <span className="ifixit-badge"><SvgWrench /> Guía Oficial iFixit</span>
                            <h2 className="post-modal-title">{selectedIfixitGuide.title}</h2>
                            <div className="ifixit-meta-row">
                                <span><strong>Dificultad:</strong> {selectedIfixitGuide.difficulty}</span>
                                <span><strong>Tiempo:</strong> {selectedIfixitGuide.time_required || 'No especificado'}</span>
                            </div>
                            <p className="post-modal-content" style={{ marginTop: '15px' }}>{selectedIfixitGuide.summary}</p>
                        </div>

                        <div className="ifixit-modal-body">
                            {selectedIfixitGuide.steps && selectedIfixitGuide.steps.map((step, idx) => (
                                <div key={step.stepid} className="ifixit-step-card">
                                    <h3 className="ifixit-step-title">Paso {idx + 1}: {step.title || 'Desmontaje'}</h3>

                                    {/* Muestra imagenes del paso */}
                                    {step.images && step.images.length > 0 && (
                                        <div className="ifixit-step-images">
                                            {step.images.map(img => (
                                                <img key={img.id} src={img.standard} alt="Paso de reparación" className="ifixit-step-img" />
                                            ))}
                                        </div>
                                    )}

                                    {/* Muestra las instrucciones */}
                                    <ul className="ifixit-step-lines">
                                        {step.lines && step.lines.map((line, lIdx) => (
                                            <li key={lIdx} dangerouslySetInnerHTML={{ __html: line.text_raw }}></li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default CommunityWiki;