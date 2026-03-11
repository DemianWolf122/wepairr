import React, { useState, useRef, useEffect, useContext } from 'react';
import { TicketContext } from '../context/TicketContext';
import { supabase } from '../supabaseClient';
import './AIChatAssistant.css';

const SvgSparkles = () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>;
const SvgSend = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>;
const SvgX = () => <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const SvgBot = () => <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="16" x2="8" y2="16"></line><line x1="16" y1="16" x2="16" y2="16"></line></svg>;
const SvgAction = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>;

function AIChatAssistant({ config, setConfig, theme, toggleTheme }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "¡Hola! Soy Wepairr Copilot (Senior Tech). Pregúntame sobre esquemáticos, fallas de placas, o pídeme que modifique ajustes del taller.", sender: 'ai' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const { tickets, agregarTicketManual } = useContext(TicketContext);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    useEffect(() => { if (isOpen) scrollToBottom(); }, [messages, isOpen]);

    // LLAMADA A LA API REAL DE GEMINI
    const fetchGeminiResponse = async (userText, history) => {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) return "⚠️ Error: Falta configurar la variable de entorno `VITE_GEMINI_API_KEY` en tu archivo .env. Obtén tu clave gratuita en Google AI Studio.";

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const systemPrompt = "Eres Wepairr Copilot, un Ingeniero Electrónico Senior especializado en reparación de hardware (celulares, PCs, GPUs). Conoces de esquemáticos, boardviews (ZXW, XinZhiZao), líneas de voltaje y soldadura SMD/BGA. Responde de forma altamente técnica pero concisa a los técnicos. Si te preguntan algo fuera de reparación, responde normalmente pero enfocado a tecnología.";

        // Formatear historial para Gemini
        const formattedHistory = history.filter(m => m.sender === 'user' || m.sender === 'ai').map(m => ({
            role: m.sender === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }]
        }));

        // Agregamos el mensaje actual
        formattedHistory.push({ role: 'user', parts: [{ text: userText }] });

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    system_instruction: { parts: { text: systemPrompt } },
                    contents: formattedHistory
                })
            });
            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error("Error Gemini API:", error);
            return "Lo siento, mis servidores neuronales están caídos. Revisa la consola para más detalles.";
        }
    };

    const processAgenticAction = async (input, currentHistory) => {
        const text = input.toLowerCase();

        // 1. INTENTOS LOCALES (Acciones Agénticas)
        if (text.includes('cambiar tema') || text.includes('modo oscuro') || text.includes('modo claro')) {
            if (toggleTheme) { toggleTheme(); return { text: "¡Hecho! He cambiado el tema visual de tu taller.", actionExecuted: true }; }
        }
        if (text.includes('resumen') || text.includes('estado del taller')) {
            const activos = tickets.filter(t => t.estado !== 'Entregado' && !t.borrado).length;
            return { text: `Actualmente tienes **${activos} equipos activos** en el taller.`, actionExecuted: true };
        }
        if (text.includes('crear ticket para')) {
            const match = text.match(/crear ticket para (.*?) con (.*?) que (.*)/);
            if (match && match[1] && match[2] && match[3]) {
                if (agregarTicketManual) {
                    agregarTicketManual({ cliente: { nombre: match[1], telefono: 'Ingresado por IA' }, dispositivo: match[2], problema: match[3], presupuestoInicial: '0' });
                    return { text: `Ticket creado para ${match[1]} (${match[2]}). Búscalo en Activos.`, actionExecuted: true };
                }
            }
        }

        // 2. SI NO ES UNA ACCIÓN LOCAL, SE LO PASAMOS A LA IA DE GOOGLE
        const aiResponseText = await fetchGeminiResponse(input, currentHistory);
        return { text: aiResponseText, actionExecuted: false };
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMsg = { text: inputValue, sender: 'user' };
        const currentHistory = [...messages]; // Guardamos historial
        setMessages(prev => [...prev, userMsg]);
        const currentInput = inputValue;
        setInputValue('');
        setIsTyping(true);

        const aiResponseObj = await processAgenticAction(currentInput, currentHistory);

        setMessages(prev => [...prev, { text: aiResponseObj.text, sender: 'ai', isAction: aiResponseObj.actionExecuted }]);
        setIsTyping(false);
    };

    // Renderiza saltos de línea y negritas Markdown
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
                                <span style={{ fontSize: '0.65rem', color: 'var(--accent-color)', fontWeight: 'bold' }}>LLM ACTIVO</span>
                            </div>
                        </div>
                        <button className="ai-close-btn" onClick={() => setIsOpen(false)}><SvgX /></button>
                    </div>

                    <div className="ai-chat-body">
                        {messages.map((msg, index) => (
                            <div key={index} className={`ai-message-wrapper ${msg.sender}`}>
                                <div className={`ai-message ${msg.sender} ${msg.isAction ? 'message-action' : ''}`}>
                                    {msg.isAction && <div className="action-indicator"><SvgAction /> ACCIÓN EJECUTADA</div>}
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
                            <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Pregunta algo técnico..." />
                            <button type="submit" className="ai-submit-btn" disabled={!inputValue.trim() || isTyping}><SvgSend /></button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}

export default AIChatAssistant;