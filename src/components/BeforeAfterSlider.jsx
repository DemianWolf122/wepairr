import React, { useState } from 'react';

function BeforeAfterSlider({ imageBefore, imageAfter }) {
    const [sliderPosition, setSliderPosition] = useState(50);

    return (
        <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '600px',
            height: '300px',
            overflow: 'hidden',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            margin: '0 auto'
        }}>
            {/* Imagen 2: El Después (Fondo permanente) */}
            <img
                src={imageAfter}
                alt="Equipo Reparado"
                style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
            />

            {/* Imagen 1: El Antes (Superpuesta y recortada por el estado del slider) */}
            <img
                src={imageBefore}
                alt="Equipo Dañado"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`
                }}
            />

            {/* Input de rango invisible para capturar la interacción del usuario */}
            <input
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={(e) => setSliderPosition(e.target.value)}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'ew-resize',
                    zIndex: 10
                }}
            />

            {/* Línea blanca divisoria visible */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: `${sliderPosition}%`,
                width: '3px',
                height: '100%',
                backgroundColor: '#ffffff',
                transform: 'translateX(-50%)',
                pointerEvents: 'none',
                zIndex: 5
            }}>
                {/* Círculo central con flechas */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '30px',
                    height: '30px',
                    backgroundColor: '#ffffff',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#000000',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                }}>
                    ↔
                </div>
            </div>
        </div>
    );
}

export default BeforeAfterSlider;