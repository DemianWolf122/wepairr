import React, { useState } from 'react';
import './CommunityWiki.css';

const POSTS_INICIALES = [
    { id: 1, titulo: "Falla de carga iPhone 12 Pro", autor: "TecnoMar", contenido: "Si el equipo consume 0.01A, revisen el IC de carga U2 antes de abrir la placa...", likes: 24, categoria: "Microelectrónica" },
    { id: 2, titulo: "Cómo despegar tapas de Samsung S23", autor: "ElectroFix", contenido: "Usar plancha a 80 grados por 5 minutos exactos para no dañar el flex de antena...", likes: 15, categoria: "Hardware" }
];

function CommunityWiki() {
    const [posts] = useState(POSTS_INICIALES);

    return (
        <div className="wiki-wrapper">
            <header className="wiki-header">
                <h2>Comunidad Wepairr</h2>
                <button className="btn-new-post">Compartir Solución</button>
            </header>
            <div className="wiki-grid">
                {posts.map(post => (
                    <div key={post.id} className="wiki-card">
                        <span className="wiki-tag">{post.categoria}</span>
                        <h3>{post.titulo}</h3>
                        <p>{post.contenido}</p>
                        <div className="wiki-footer">
                            <span>Por: {post.autor}</span>
                            <button className="btn-like">👍 {post.likes}</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CommunityWiki;