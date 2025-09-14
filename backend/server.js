// backend/server.js
import express from "express";
import fetch from "node-fetch";
import { db } from "./firebase.js";
import { ref, onValue, get } from "firebase/database";

const app = express();
app.use(express.json()); 

const PORT = process.env.PORT || 3000;

const TELEGRAM_TOKEN = "8331662552:AAFCtkTjZJyBDGFqcwXJ4Nl6gpNG65MOOUs";
const CHAT_ID = "6588607200"; 

// =================================FUNCIONES AUXILIARES=================================
async function sendTelegramMessage(chatId, text) {
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: text
      })
    });

    const data = await res.json();
    console.log("✅ Respuesta Telegram:", data);
  } catch (error) {
    console.error("❌ Error enviando a Telegram:", error);
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

    const estadoTexto = data.bomba ? "🚰 Bomba ENCENDIDA" : "✅ Bomba APAGADA";

    const mensaje = `${estadoTexto}\n\n🌡️ Temp: ${data.temperatura}°C\n💧 Humedad Suelo: ${data.humedadSuelo}%\n🌫️ Humedad Ambiental: ${data.humedadAmbiental}%`;

    console.log("📨 Enviando mensaje automático:", mensaje);
    sendTelegramMessage(CHAT_ID, mensaje);
  }
});

// =================================DATOS REALES POR COMANDO XD=================================
app.post(`/webhook/${TELEGRAM_TOKEN}`, async (req, res) => {
  const message = req.body.message;
  if (!message) return res.sendStatus(200);

  const chatId = message.chat.id;
  const text = message.text?.trim().toUpperCase();

  console.log("📥 Mensaje recibido de Telegram:", text);

  if (text === "DATOS REALES") {
    try {
      const snapshot = await get(sensoresRef);
      const data = snapshot.val();

      if (data) {
        const estadoTexto = data.bomba ? "🚰 Bomba ENCENDIDA" : "✅ Bomba APAGADA";

        const respuesta = `📊 Datos actuales:\n\n🌡️ Temp: ${data.temperatura}°C\n💧 Humedad Suelo: ${data.humedadSuelo}%\n🌫️ Humedad Ambiental: ${data.humedadAmbiental}%\n${estadoTexto}`;

        await sendTelegramMessage(chatId, respuesta);
      } else {
        await sendTelegramMessage(chatId, "⚠️ No hay datos disponibles en este momento.");
      }
    } catch (err) {
      console.error("❌ Error obteniendo datos:", err);
      await sendTelegramMessage(chatId, "⚠️ Error al obtener datos.");
    }
  }

  res.sendStatus(200); 
});

app.get("/", (req, res) => {
  res.send("🚀 Servidor de notificaciones corriendo con Telegram Webhook");
});

app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en puerto ${PORT}`);
});
