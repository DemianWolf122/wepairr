import React, { useState } from 'react';

function ChatBox({ onProcesarMensaje }) {
    // Estado para el texto que el técnico está escribiendo
    const [inputTexto, setInputTexto] = useState('');

    // Estado para guardar la charla en pantalla
    const [historial, setHistorial] = useState([
        { actor: 'ia', texto: '¡Hola! Soy Wepairr. ¿Qué equipo ingresó hoy al taller?' }
    ]);

    // Función que se ejecuta al apretar "Enviar"
    const manejarEnvio = (e) => {
        e.preventDefault(); // Evita que la página se recargue

        if (inputTexto.trim() === '') return; // No envía mensajes vacíos

        // 1. Agregamos lo que escribió el técnico al historial del chat
        const nuevoMensaje = { actor: 'tecnico', texto: inputTexto };
        setHistorial(prev => [...prev, nuevoMensaje]);

        // 2. Le mandamos el texto al componente padre (App.jsx) para que vea si hay que crear un ticket
        onProcesarMensaje(inputTexto);

        // 3. Limpiamos la caja de texto
        setInputTexto('');
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            backgroundColor: '#1a1a1a',
            borderRadius: '8px',
            border: '1px solid #333',
            overflow: 'hidden'
        }}>
            {/* Zona de mensajes (Historial) */}
            <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {historial.map((msg, index) => (
                    <div key={index} style={{
                        alignSelf: msg.actor === 'tecnico' ? 'flex-end' : 'flex-start',
                        backgroundColor: msg.actor === 'tecnico' ? '#42a5f5' : '#333',
                        color: 'white',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        maxWidth: '80%'
                    }}>
                        <strong style={{ fontSize: '0.8em', display: 'block', marginBottom: '4px', opacity: 0.8 }}>
                            {msg.actor === 'tecnico' ? 'Vos' : 'Wepairr IA'}
                        </strong>
                        {msg.texto}
                    </div>
                ))}
            </div>

            {/* Zona del Input (Donde escribe el técnico) */}
            <form onSubmit={manejarEnvio} style={{ display: 'flex', padding: '10px', borderTop: '1px solid #333', backgroundColor: '#0f0f0f' }}>
                <input
                    type="text"
                    value={inputTexto}
                    onChange={(e) => setInputTexto(e.target.value)}
                    placeholder="Ej: Ingresó un Moto G20 con pantalla rota..."
                    style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '4px',
                        border: '1px solid #444',
                        backgroundColor: '#222',
                        color: 'white'
                    }}
                />
                <button type="submit" style={{
                    marginLeft: '10px',
                    padding: '10px 20px',
                    backgroundColor: '#66bb6a',
                    color: 'black',
                    fontWeight: 'bold',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}>
                    Enviar
                </button>
            </form>
        </div>
    );
}

export default ChatBox;