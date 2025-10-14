import React, { useState } from "react";

export default function ChatbotFieldSmart() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "¡Hola! Soy FieldSmart, tu asesor en riego automatizado 🌱. ¿En qué puedo ayudarte?" },
  ]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Mostrar mensaje del usuario
    const newMessages = [...messages, { from: "user", text: input }];
    setMessages(newMessages);

    try {
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "chatbotfieldsmart",
          prompt: input,
        }),
      });

      const reader = response.body.getReader();
      let botResponse = "";

      // Leer la respuesta por streaming
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = new TextDecoder().decode(value);
        try {
          const json = JSON.parse(chunk);
          if (json.response) botResponse += json.response;
        } catch {
          // Si llega texto parcial, se ignora
        }
      }

      setMessages((msgs) => [...msgs, { from: "bot", text: botResponse }]);
    } catch (error) {
      console.error(error);
      setMessages((msgs) => [
        ...msgs,
        { from: "bot", text: "⚠️ Error al conectar con el modelo local." },
      ]);
    }

    setInput("");
  };

  return (
    <div className="flex flex-col max-w-md mx-auto p-4 bg-white shadow-lg rounded-2xl">
      <div className="h-96 overflow-y-auto border rounded-md p-3 mb-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 p-2 rounded-md ${
              msg.from === "bot"
                ? "bg-green-100 text-gray-800 self-start"
                : "bg-blue-100 text-gray-900 self-end text-right"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded-l-md p-2"
          placeholder="Escribe tu pregunta..."
        />
        <button
          onClick={sendMessage}
          className="bg-green-600 text-white px-4 py-2 rounded-r-md hover:bg-green-700"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
