import React, { useState, useEffect, useRef } from "react";
import "../styles/ChatbotFloat.css";

const ChatbotFloat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState([
        { type: "incoming", text: "¡Hola! ¿En qué puedo ayudarte?" },
    ]);
    const [userMessage, setUserMessage] = useState("");
    const [sessionId, setSessionId] = useState("");
    const [pulse, setPulse] = useState(false);
    const chatboxRef = useRef(null);
    const inputRef = useRef(null);
    const API_URL = "http://localhost:5678/webhook/chatbot";

    // Generar o recuperar session_id
    useEffect(() => {
        let storedSession = localStorage.getItem("chat_session_id");
        if (!storedSession) {
            storedSession = "session_" + Math.random().toString(36).substr(2, 9);
            localStorage.setItem("chat_session_id", storedSession);
        }
        setSessionId(storedSession);
    }, []);

    // Efecto para el pulso del botón
    useEffect(() => {
        if (!isOpen) {
            const pulseInterval = setInterval(() => {
                setPulse(prev => !prev);
            }, 3000);

            return () => clearInterval(pulseInterval);
        }
    }, [isOpen]);

    // Auto-scroll cuando hay nuevos mensajes
    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const scrollToBottom = () => {
        if (chatboxRef.current) {
            setTimeout(() => {
                chatboxRef.current.scrollTo({
                    top: chatboxRef.current.scrollHeight,
                    behavior: 'smooth'
                });
            }, 100);
        }
    };

    const handleSend = async () => {
        if (!userMessage.trim()) return;

        const outgoingMsg = { type: "outgoing", text: userMessage };
        setMessages((prev) => [...prev, outgoingMsg]);
        setUserMessage("");
        setIsTyping(true);

        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage, session_id: sessionId }),
            });

            const data = await res.json();
            const responseText = data.response || data;

            // Simular tiempo de escritura para hacerlo más natural
            setTimeout(() => {
                setIsTyping(false);
                setMessages((prev) => [
                    ...prev,
                    { type: "incoming", text: responseText },
                ]);
            }, 800 + Math.random() * 800);

        } catch (err) {
            setIsTyping(false);
            setMessages((prev) => [
                ...prev,
                { type: "incoming", text: "¡Ups! Algo salió mal.", error: true },
            ]);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            // Enfocar el input cuando se abre el chat
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            }, 300);
        }
    };

    const suggestedQuestions = [
        "¿Qué servicios ofrecen?",
        "¿Cómo puedo contactarlos?",
        "¿Como puedo sembrar?"
    ];

    const handleSuggestionClick = (question) => {
        setUserMessage(question);
        // Enfocar el input después de seleccionar una sugerencia
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 100);
    };

    // Auto-ajustar altura del textarea
    const adjustTextareaHeight = () => {
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
            inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + 'px';
        }
    };

    useEffect(() => {
        adjustTextareaHeight();
    }, [userMessage]);

    return (
        <>
            {/* BOTÓN FLOTANTE MEJORADO */}
            <button
                className={`chatbot-toggle ${pulse ? 'pulse' : ''} ${isOpen ? 'active' : ''}`}
                onClick={toggleChat}
            >
                <div className="chatbot-icon">
                    <i className="bi bi-chat-dots-fill chat-icon"></i>
                    <span className="notification-dot"></span>
                </div>

            </button>

            {/* CAJA DEL CHAT MEJORADA - MÁS COMPACTA */}
            {isOpen && (
                <div className="chatbot-container">
                    <header className="chatbot-header">
                        <div className="chatbot-avatar">
                            <span>🤖</span>
                        </div>
                        <div className="chatbot-info">
                            <h2>Asistente Virtual</h2>
                            <p className="status">
                                <span className="status-dot"></span>
                                En línea
                            </p>
                        </div>
                        <button className="close-btn" onClick={() => setIsOpen(false)}>
                            ✖
                        </button>
                    </header>

                    <div className="chat-content">
                        <ul className="chatbox" ref={chatboxRef}>
                            {messages.map((msg, i) => (
                                <li key={i} className={`chat ${msg.type} ${msg.error ? 'error' : ''}`}>
                                    {msg.type === "incoming" && (
                                        <div className="avatar">
                                            <span>🤖</span>
                                        </div>
                                    )}
                                    <div className="message-content">
                                        <p>{msg.text}</p>
                                        <span className="timestamp">
                                            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </li>
                            ))}
                            {isTyping && (
                                <li className="chat incoming typing">
                                    <div className="avatar">
                                        <span>🤖</span>
                                    </div>
                                    <div className="message-content">
                                        <div className="typing-indicator">
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                    </div>
                                </li>
                            )}
                        </ul>

                        {messages.length <= 1 && (
                            <div className="suggestions">
                                <p>Preguntas frecuentes:</p>
                                <div className="suggestion-chips">
                                    {suggestedQuestions.map((question, index) => (
                                        <button
                                            key={index}
                                            className="suggestion-chip"
                                            onClick={() => handleSuggestionClick(question)}
                                        >
                                            {question}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="chat-input">
                        <div className="input-wrapper">
                            <textarea
                                ref={inputRef}
                                placeholder="Escribe un mensaje..."
                                value={userMessage}
                                onChange={(e) => setUserMessage(e.target.value)}
                                onKeyDown={handleKeyPress}
                                rows="1"
                            ></textarea>
                            <button
                                onClick={handleSend}
                                disabled={!userMessage.trim()}
                                className="send-btn"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatbotFloat;