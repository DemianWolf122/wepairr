import React, { useState, useRef, useEffect, useContext } from 'react';
import { TicketContext } from '../context/TicketContext';
import { supabase } from '../supabaseClient';
import './AIChatAssistant.css';

// --- SVGs Premium ---
const SvgSparkles = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>;
const SvgSend = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>;
const SvgX = () => <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const SvgBot = () => <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="16" x2="8" y2="16"></line><line x1="16" y1="16" x2="16" y2="16"></line></svg>;
const SvgAction = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>;
const SvgMic = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>;

function AIChatAssistant({ config, setConfig, theme, toggleTheme }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "¡Hola! Soy tu asistente personal Wepairr. Puedes escribirme o usar el **micrófono** para dictarme órdenes. ¿Qué automatizamos hoy?", sender: 'ai' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);

    // CONTEXTO GLOBAL DE LA APP
    const { tickets, agregarTicketManual, actualizarEstadoTicket } = useContext(TicketContext);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    useEffect(() => { if (isOpen) scrollToBottom(); }, [messages, isOpen]);

    // ==========================================
    // RECONOCIMIENTO DE VOZ NATIVO (Web Speech API)
    // ==========================================
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = SpeechRecognition ? new SpeechRecognition() : null;

    if (recognition) {
        recognition.continuous = false;
        recognition.lang = 'es-ES'; // Detecta el español
        recognition.interimResults = false;

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInputValue(prev => prev ? `${prev} ${transcript}` : transcript);
            setIsListening(false);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
    }

    const toggleListening = () => {
        if (!recognition) return alert("Tu navegador no soporta entrada de voz.");
        if (isListening) {
            recognition.stop();
            setIsListening(false);
        } else {
            recognition.start();
            setIsListening(true);
        }
    };

    // ==========================================
    // API GEMINI (CON INYECCIÓN DE CONTEXTO REAL)
    // ==========================================
    const fetchGeminiResponse = async (userText, history) => {
        const rawKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!rawKey) return "⚠️ Error: Falta configurar la variable `VITE_GEMINI_API_KEY` en tu .env.";
        const apiKey = rawKey.trim().replace(/['"]/g, '');
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        // Le pasamos a la IA un resumen de la realidad del taller
        const ticketsResumen = tickets.map(t => `ID:${t.id} | Cliente:${t.cliente.nombre} | Falla:${t.problema} | Estado:${t.estado}`).join('\n');

        const systemPrompt = `Eres Wepairr Copilot, un Sistema Operativo IA para Técnicos.
        DATOS ACTUALES DEL TALLER:
        - Moneda actual: ${config?.moneda || 'No definida'}
        - Nombre Taller: ${config?.nombreNegocio || 'No definido'}
        - Tickets Activos:
        ${ticketsResumen || 'No hay tickets'}

        TIENES PERMISOS DE ADMINISTRADOR. Si el técnico te pide una acción, DEBES responder amablemente y añadir EXACTAMENTE al final de tu mensaje el comando oculto correspondiente:
        - Cambiar tema a oscuro/claro: [ACTION_UI_THEME: dark] o [ACTION_UI_THEME: light]
        - Cambiar moneda global (Ej USD, EUR, ARS): [ACTION_CONFIG_CURRENCY: USD]
        - Cambiar nombre del negocio: [ACTION_CONFIG_NAME: "Nuevo Nombre"]
        - Crear un ticket nuevo: [ACTION_TICKET_CREATE: Nombre | Teléfono | Equipo | Falla]
        - Mover un ticket (Ej. a Entregado): [ACTION_TICKET_MOVE: ID_TICKET | NuevoEstado]
        
        Si te preguntan por electrónica (esquemas, cortos, microsoldadura), responde como Ingeniero Senior sin usar comandos.`;

        let transcript = `[SISTEMA]:\n${systemPrompt}\n\n[CHAT]:\n`;
        history.forEach(m => { transcript += `${m.sender === 'user' ? 'Técnico' : 'Copilot'}: ${m.text}\n`; });
        transcript += `Técnico: ${userText}\nCopilot:`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: transcript }] }] })
            });
            const data = await response.json();
            if (!response.ok) return `⚠️ Error de API: ${data.error?.message}`;
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            return "Lo siento, falló la conexión satelital.";
        }
    };

    // ==========================================
    // ACTION DISPATCHER (EL CEREBRO EJECUTOR)
    // ==========================================
    const processAgenticAction = async (input, currentHistory) => {
        let aiResponseText = await fetchGeminiResponse(input, currentHistory);
        let actionExecuted = false;

        // BUSCADOR DE MÚLTIPLES COMANDOS (Regex Global)
        const actionRegex = /\[ACTION_([A-Z_]+)(?:\s*:\s*(.*?))?\]/g;
        let match;

        while ((match = actionRegex.exec(aiResponseText)) !== null) {
            const actionType = match[1];
            const payload = match[2] ? match[2].split('|').map(s => s.trim().replace(/^"|"$/g, '')) : []; // Quita comillas

            actionExecuted = true;

            try {
                switch (actionType) {
                    case 'UI_THEME':
                        if (payload[0] === 'dark' && theme !== 'dark') toggleTheme();
                        else if (payload[0] === 'light' && theme !== 'light') toggleTheme();
                        break;
                    case 'CONFIG_CURRENCY':
                        // Modifica la moneda global EXACTAMENTE como lo pide App.jsx
                        if (setConfig) setConfig(p => ({ ...p, moneda: payload[0] }));
                        break;
                    case 'CONFIG_NAME':
                        if (setConfig) setConfig(p => ({ ...p, nombreNegocio: payload[0] }));
                        break;
                    case 'TICKET_CREATE':
                        if (agregarTicketManual && payload.length >= 4) {
                            agregarTicketManual({ cliente: { nombre: payload[0], telefono: payload[1], email: '' }, dispositivo: payload[2], problema: payload[3], presupuestoInicial: '0' });
                        }
                        break;
                    case 'TICKET_MOVE':
                        // Ejemplo: [ACTION_TICKET_MOVE: 102 | Terminado]
                        if (actualizarEstadoTicket && payload.length >= 2) {
                            actualizarEstadoTicket(payload[0], payload[1]);
                        }
                        break;
                    default:
                        console.log("Comando reconocido pero aún no implementado en Frontend:", actionType, payload);
                }
            } catch (err) {
                console.error("Error ejecutando acción de IA:", err);
            }
        }

        // Limpiamos los comandos feos del texto final que verá el usuario
        const cleanText = aiResponseText.replace(/\[ACTION_[A-Z_]+(?:.*?)\]/g, '').trim();

        // Si el modelo solo devolvió el comando y se quedó sin texto, le damos una respuesta por defecto.
        const finalOutput = cleanText === "" ? "¡Orden ejecutada correctamente en el sistema!" : cleanText;

        return { text: finalOutput, actionExecuted };
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMsg = { text: inputValue, sender: 'user' };
        const currentHistory = [...messages];
        setMessages(prev => [...prev, userMsg]);
        const currentInput = inputValue;
        setInputValue('');
        setIsTyping(true);

        const aiResponseObj = await processAgenticAction(currentInput, currentHistory);

        setMessages(prev => [...prev, { text: aiResponseObj.text, sender: 'ai', isAction: aiResponseObj.actionExecuted }]);
        setIsTyping(false);
    };

    const renderText = (txt) => {
        return { __html: txt.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') };
    };

    return (
        <>
            <button className={`ai-fab ${isOpen ? 'ai-fab-hidden' : ''}`} onClick={() => setIsOpen(true)}>
                <SvgSparkles />
            </button>

            {isOpen && (
                <div className="ai-chat-window animate-pop-up glass-effect">
                    <div className="ai-chat-header">
                        <div className="ai-header-info">
                            <div className="ai-status-dot"></div>
                            <SvgBot />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <span>Wepairr Copilot</span>
                                <span style={{ fontSize: '0.65rem', color: 'var(--accent-color)', fontWeight: 'bold' }}>MODO DIOS ACTIVO</span>
                            </div>
                        </div>
                        <button className="ai-close-btn" onClick={() => setIsOpen(false)}><SvgX /></button>
                    </div>

                    <div className="ai-chat-body">
                        {messages.map((msg, index) => (
                            <div key={index} className={`ai-message-wrapper ${msg.sender}`}>
                                <div className={`ai-message ${msg.sender} ${msg.isAction ? 'message-action' : ''}`}>
                                    {msg.isAction && <div className="action-indicator"><SvgAction /> ACCIÓN EJECUTADA EN EL SISTEMA</div>}
                                    <div dangerouslySetInnerHTML={renderText(msg.text)} />
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="ai-message-wrapper ai">
                                <div className="ai-message ai typing-indicator"><span></span><span></span><span></span></div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className="ai-chat-footer" onSubmit={handleSend}>
                        <div className="ai-input-pill">
                            <button
                                type="button"
                                className={`ai-mic-btn ${isListening ? 'listening' : ''}`}
                                onClick={toggleListening}
                                title="Dictar por Voz"
                            >
                                <SvgMic />
                            </button>
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={isListening ? "Escuchando..." : "Ej: Cambia mi moneda a EUR"}
                            />
                            <button type="submit" className="ai-submit-btn" disabled={!inputValue.trim() || isTyping}>
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