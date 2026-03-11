import React, { useState, useRef, useEffect, useContext } from 'react';
import { TicketContext } from '../context/TicketContext';
import './AIChatAssistant.css';

const SvgSend = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>;
const SvgBot = () => <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="16" x2="8" y2="16"></line><line x1="16" y1="16" x2="16" y2="16"></line></svg>;

function ChatBox() {
    const [messages, setMessages] = useState([
        { text: "¡Hola! Soy el asistente virtual del taller. ¿Qué problema tiene tu equipo? Cuéntame y te abriremos una orden de revisión.", sender: 'ai' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [ticketCreated, setTicketCreated] = useState(false);

    const { agregarTicketManual } = useContext(TicketContext);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    useEffect(() => { scrollToBottom(); }, [messages]);

    const fetchGeminiReceptionist = async (userText, history) => {
        // FIX: Limpieza de la API key
        const rawKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!rawKey) return "El chat está en mantenimiento (Falta API Key). Por favor comunícate por WhatsApp.";
        const apiKey = rawKey.trim().replace(/['"]/g, '');

        // FIX: Sufijo -latest obligatorio
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

        const systemPrompt = `Eres la recepcionista amigable del taller de reparación Wepairr. 
        Tu objetivo es obtener 4 datos del cliente, paso a paso, sin ser un robot frío:
        1. Su Nombre.
        2. Su Teléfono de contacto.
        3. Qué Equipo tiene (ej: iPhone 13, PC).
        4. Cuál es la falla.
        Haz preguntas conversacionales. Si ya te dio un dato, no lo vuelvas a pedir.
        IMPORTANTE: Cuando ya tengas los 4 datos claros, tu ÚLTIMA palabra en el mensaje DEBE SER EXACTAMENTE ESTE FORMATO: 
        [TICKET_READY: NombreDelCliente | Telefono | Equipo | Falla]`;

        const formattedHistory = [];
        for (let i = 0; i < history.length; i++) {
            if (i === 0 && history[i].sender === 'ai') continue;
            formattedHistory.push({
                role: history[i].sender === 'user' ? 'user' : 'model',
                parts: [{ text: history[i].text }]
            });
        }

        formattedHistory.push({ role: 'user', parts: [{ text: userText }] });

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    // FIX: Formato guion bajo exacto
                    system_instruction: { parts: [{ text: systemPrompt }] },
                    contents: formattedHistory
                })
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Error de Google API:", data);
                return "Disculpa, tuvimos un micro-corte en nuestra línea de atención. ¿Me repites lo último?";
            }

            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error("Error de red en recepcionista:", error);
            return "Hubo un error de conexión, intenta nuevamente.";
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || ticketCreated) return;

        const userMsg = { text: inputValue, sender: 'user' };
        const currentHistory = [...messages];
        setMessages(prev => [...prev, userMsg]);
        const currentInput = inputValue;
        setInputValue('');
        setIsTyping(true);

        let aiResponseText = await fetchGeminiReceptionist(currentInput, currentHistory);

        const ticketMatch = aiResponseText.match(/\[TICKET_READY:\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(.*?)\]/);

        if (ticketMatch && !ticketCreated) {
            const [, nombre, telefono, equipo, falla] = ticketMatch;

            if (agregarTicketManual) {
                agregarTicketManual({
                    cliente: { nombre: nombre.trim(), telefono: telefono.trim(), email: '' },
                    dispositivo: equipo.trim(),
                    problema: falla.trim(),
                    presupuestoInicial: '0',
                    tipo: 'consulta'
                });
                setTicketCreated(true);
            }

            aiResponseText = aiResponseText.replace(/\[TICKET_READY:.*?\]/, "").trim();
            if (aiResponseText === "") {
                aiResponseText = "¡Perfecto! Acabo de enviar tu solicitud a los técnicos. Se comunicarán contigo al número que me dejaste en breve. ¡Gracias por confiar en Wepairr!";
            }
        }

        setMessages(prev => [...prev, { text: aiResponseText, sender: 'ai' }]);
        setIsTyping(false);
    };

    return (
        <div className="client-chat-container glass-effect" style={{ height: '500px', display: 'flex', flexDirection: 'column', borderRadius: '16px', overflow: 'hidden' }}>
            <div className="ai-chat-header" style={{ borderRadius: 0 }}>
                <div className="ai-header-info">
                    <div className="ai-status-dot"></div>
                    <SvgBot />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span>Atención al Cliente IA</span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--success)', fontWeight: 'bold' }}>EN LÍNEA</span>
                    </div>
                </div>
            </div>

            <div className="ai-chat-body" style={{ flex: 1, padding: '20px' }}>
                {messages.map((msg, index) => (
                    <div key={index} className={`ai-message-wrapper ${msg.sender}`}>
                        <div className={`ai-message ${msg.sender}`} dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
                    </div>
                ))}
                {isTyping && (
                    <div className="ai-message-wrapper ai">
                        <div className="ai-message ai typing-indicator"><span></span><span></span><span></span></div>
                    </div>
                )}
                {ticketCreated && (
                    <div style={{ textAlign: 'center', margin: '20px 0', color: 'var(--success)', fontWeight: 'bold', fontSize: '0.9rem', padding: '10px', background: 'var(--bg-panel)', borderRadius: '10px', border: '1px solid var(--success)' }}>
                        ✅ Ticket Enviado Exitosamente al Taller.
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form className="ai-chat-footer" onSubmit={handleSend} style={{ background: 'var(--bg-panel)' }}>
                <div className="ai-input-pill">
                    <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder={ticketCreated ? "Ticket finalizado" : "Escribe tu respuesta..."} disabled={ticketCreated || isTyping} />
                    <button type="submit" className="ai-submit-btn" disabled={!inputValue.trim() || isTyping || ticketCreated}><SvgSend /></button>
                </div>
            </form>
        </div>
    );
}

export default ChatBox;