// server.js
import express from "express";
import fetch from "node-fetch";
import { db } from "./firebase.js";
import { ref, onValue, get } from "firebase/database";

const app = express();
const PORT = process.env.PORT || 3000;

const TELEGRAM_TOKEN = "TU_TOKEN_AQUI";
const CHAT_ID = "6588607200"; 

// =================================FUNCIONES AUXILIARES=================================
async function sendTelegramMessage(text) {
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: text,
      }),
    });

    const data = await res.json();
    console.log("Respuesta Telegram:", data);
  } catch (error) {
    console.error("Error enviando a Telegram:", error);
  }
}
 
// =================================NOTIFICACIONES AUTOMÁTICAS CON RENDER=================================
const sensoresRef = ref(db, "sensores");
let ultimoEstadoBomba = null;

onValue(sensoresRef, (snapshot) => {
  const data = snapshot.val();
  if (!data) return;

  console.log("📡 Datos recibidos:", data);

  if (data.bomba !== ultimoEstadoBomba) {
    ultimoEstadoBomba = data.bomba;

    const estadoTexto = data.bomba
      ? "🚰 Bomba ENCENDIDA"
      : "✅ Bomba APAGADA";

    const mensaje = `${estadoTexto}\n\n🌡️ Temp: ${data.temperatura}°C\n💧 Humedad Suelo: ${data.humedadSuelo}%\n🌫️ Humedad Ambiental: ${data.humedadAmbiental}%`;

    console.log("📨 Enviando mensaje:", mensaje);
    sendTelegramMessage(mensaje);
  }
});

// =================================DATOS REALES POR COMANDO XD=================================
app.post(`/webhook/${TELEGRAM_TOKEN}`, express.json(), async (req, res) => {
  const message = req.body.message;

  if (!message || !message.text) {
    return res.sendStatus(200);
  }

  const chatId = message.chat.id;
  const text = message.text.trim();

  console.log("💬 Mensaje entrante:", text);

  if (text.toUpperCase() === "DATOS REALES") {
    try {
      const snapshot = await get(sensoresRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const estadoBomba = data.bomba ? "🚰 ENCENDIDA" : "✅ APAGADA";

        const respuesta =
          `📡 Datos en tiempo real:\n` +
          `Bomba: ${estadoBomba}\n` +
          `🌡️ Temp: ${data.temperatura}°C\n` +
          `💧 Suelo: ${data.humedadSuelo}%\n` +
          `🌫️ Ambiental: ${data.humedadAmbiental}%\n` +
          `⏱️ Uso: ${data.tiempoUso} seg\n` +
          `🕒 Último riego: ${data.ultimoRiego}`;

        // OJO: aquí envío la respuesta al mismo chat que escribió
        const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
        await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text: respuesta }),
        });
      } else {
        sendTelegramMessage("⚠️ No hay datos en Firebase ahora mismo.");
      }
    } catch (err) {
      console.error("Error obteniendo datos de Firebase:", err);
    }
  }

  res.sendStatus(200); 
});

// ========================= EDDPOINT PARA EVITAR QUE SE APAGUE =========================
app.get("/", (req, res) => {
  res.send("Servidor de notificaciones corriendo 🚀");
});

app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en puerto ${PORT}`);
});
