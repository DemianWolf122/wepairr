import React, { useState } from 'react';
import './AIChatAssistant.css';

const SvgBot = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="16" x2="8" y2="16"></line><line x1="16" y1="16" x2="16" y2="16"></line></svg>;
const SvgSend = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>;

function AIChatAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hola, soy Wepairr AI. ¿Necesitas un boardview, diagrama o ayuda con una falla?", sender: "bot" }
    ]);
    const [input, setInput] = useState('');

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        setMessages(prev => [...prev, { text: input, sender: "user" }]);
        setInput('');

        // Simulación de respuesta AI
        setTimeout(() => {
            setMessages(prev => [...prev, { text: "Buscando esquemático en la base de datos global... (Función en desarrollo)", sender: "bot" }]);
        }, 1000);
    };

    return (
        <div className="ai-chat-container">
            {isOpen && (
                <div className="ai-chat-window glass-effect animate-scale-in">
                    <div className="ai-chat-header">
                        <SvgBot />
                        <span>Wepairr Copilot</span>
                        <button onClick={() => setIsOpen(false)} className="btn-close-chat">×</button>
                    </div>
                    <div className="ai-chat-body">
                        {messages.map((msg, i) => (
                            <div key={i} className={`chat-bubble ${msg.sender}`}>
                                {msg.text}
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleSend} className="ai-chat-input-area">
                        <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Ej. Diagrama iPhone 12 Pro..." />
                        <button type="submit"><SvgSend /></button>
                    </form>
                </div>
            )}

            <button className={`ai-chat-trigger ${isOpen ? 'hidden' : ''}`} onClick={() => setIsOpen(true)}>
                <SvgBot />
            </button>
        </div>
    );
}

export default AIChatAssistant;