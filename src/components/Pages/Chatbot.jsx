import React, { useState, useEffect, useRef } from "react";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { type: "incoming", text: "¡Hola! ¿En qué puedo ayudarte?" },
  ]);
  const [userMessage, setUserMessage] = useState("");
  const [sessionId, setSessionId] = useState("");
  const chatboxRef = useRef(null);
  const API_URL = "http://localhost:5678/webhook/chatbotalex"; // URL del webhook de n8n

  // Generar o recuperar session_id
  useEffect(() => {
    let storedSession = localStorage.getItem("chat_session_id");
    if (!storedSession) {
      storedSession = "session_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("chat_session_id", storedSession);
    }
    setSessionId(storedSession);
  }, []);

  const scrollToBottom = () => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTo(0, chatboxRef.current.scrollHeight);
    }
  };

  const handleSend = async () => {
    if (!userMessage.trim()) return;

    const outgoingMsg = { type: "outgoing", text: userMessage };
    setMessages((prev) => [...prev, outgoingMsg]);
    setUserMessage("");
    scrollToBottom();

    const incomingPlaceholder = { type: "incoming", text: "Pensando..." };
    setMessages((prev) => [...prev, incomingPlaceholder]);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, session_id: sessionId }),
      });

      const data = await res.json();
      const responseText = data.response || data;

      setMessages((prev) => [
        ...prev.slice(0, -1),
        { type: "incoming", text: responseText },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { type: "incoming", text: "¡Ups! Algo salió mal.", error: true },
      ]);
    } finally {
      scrollToBottom();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const [isClosed, setIsClosed] = useState(false);

  if (isClosed) {
    return <p className="lastMessage">¡Gracias por usar el Chatbot!</p>;
  }

  return (
    <div className="chatbot">
      <header>
        <h2>ChatBot</h2>
        <span id="close-btn" onClick={() => setIsClosed(true)}>
          X
        </span>
      </header>
      <ul className="chatbox" ref={chatboxRef}>
        {messages.map((msg, i) => (
          <li key={i} className={`chat ${msg.type}`}>
            {msg.type === "incoming" && <span>🤖</span>}
            <p className={msg.error ? "error" : ""}>{msg.text}</p>
          </li>
        ))}
      </ul>
      <div className="chat-input">
        <textarea
          placeholder="Escribe un mensaje..."
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          onKeyDown={handleKeyPress}
        ></textarea>
        <button id="send-btn" onClick={handleSend}>
          Enviar
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
