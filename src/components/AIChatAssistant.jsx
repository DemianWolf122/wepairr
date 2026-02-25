import React, { useState, useRef, useEffect } from 'react';
import './AIChatAssistant.css';

// --- SVGs Premium ---
const SvgSparkles = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>;
const SvgSend = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>;
const SvgX = () => <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const SvgBot = () => <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="16" x2="8" y2="16"></line><line x1="16" y1="16" x2="16" y2="16"></line></svg>;

function AIChatAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "¡Hola! Soy la IA de Wepairr. ¿En qué puedo ayudarte hoy?", sender: 'ai' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMsg = { text: inputValue, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        // Simulador de respuesta IA
        setTimeout(() => {
            const aiMsg = {
                text: "Estoy analizando tu consulta. En esta fase de desarrollo, mi conexión al modelo real está siendo configurada.",
                sender: 'ai'
            };
            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <>
            {/* BOTÓN FLOTANTE (FAB) */}
            <button
                className={`ai-fab ${isOpen ? 'ai-fab-hidden' : ''}`}
                onClick={() => setIsOpen(true)}
                title="Asistente IA"
            >
                <SvgSparkles />
            </button>

            {/* VENTANA DEL CHAT */}
            {isOpen && (
                <div className="ai-chat-window animate-pop-up">
                    <div className="ai-chat-header">
                        <div className="ai-header-info">
                            <SvgBot />
                            <span>Wepairr Copilot</span>
                        </div>
                        <button className="ai-close-btn" onClick={() => setIsOpen(false)}>
                            <SvgX />
                        </button>
                    </div>

                    <div className="ai-chat-body">
                        {messages.map((msg, index) => (
                            <div key={index} className={`ai-message-wrapper ${msg.sender}`}>
                                <div className={`ai-message ${msg.sender}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="ai-message-wrapper ai">
                                <div className="ai-message ai typing-indicator">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className="ai-chat-footer" onSubmit={handleSend}>
                        <div className="ai-input-pill">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Escribe un mensaje..."
                            />
                            <button
                                type="submit"
                                className="ai-submit-btn"
                                disabled={!inputValue.trim() || isTyping}
                            >
                                <SvgSend />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}

export default AIChatAssistant;