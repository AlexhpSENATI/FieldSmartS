// backend/server.js
import express from "express";
import fetch from "node-fetch";
import { db } from "./firebase.js";
import { ref, onValue, get } from "firebase/database";

const app = express();
const PORT = process.env.PORT || 3000;

const TELEGRAM_TOKEN = "8331662552:AAFCtkTjZJyBDGFqcwXJ4Nl6gpNG65MOOUs";
const DEFAULT_CHAT_ID = "6588607200";

if (!TELEGRAM_TOKEN) {
  console.error(" TELEGRAM_TOKEN no definido. Pon tu token en el archivo o en variables de entorno.");
  process.exit(1);
}

app.use(express.json({ limit: "100kb" }));

// =========================== TELEGRAM ===========================
async function sendTelegramMessage(text, chatId = DEFAULT_CHAT_ID) {
  if (!chatId) {
    console.error("❌ sendTelegramMessage: chatId no definido.");
    return;
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
  const payload = {
    chat_id: chatId,
    text,
    parse_mode: "HTML"
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!data.ok) {
      console.error(" Telegram API error:", data);
    } else {
      console.log(`✅ Mensaje enviado a chat ${chatId}`);
    }
  } catch (err) {
    console.error("❌ Error enviando a Telegram:", err);
  }
}

// =========================== MONITOREO DE SENSORES ===========================
const sensoresRef = ref(db, "sensores");
let ultimoEstadoBomba = null;

onValue(sensoresRef, (snapshot) => {
  try {
    const data = snapshot.val();
    if (!data) return;

    console.log("📡 Datos Firebase recibidos:", data);

    if (data.bomba !== ultimoEstadoBomba) {
      ultimoEstadoBomba = data.bomba;

      const estadoTexto = data.bomba ? "✅ Bomba ENCENDIDA" : "❌ Bomba APAGADA";
      const mensaje =
        `${estadoTexto}\n\n` +
        `🌡️ Temp: ${data.temperatura ?? "N/A"}°C\n` +
        `💧 Humedad Suelo: ${data.humedadSuelo ?? "N/A"}%\n` +
        `🌫️ Humedad Ambiental: ${data.humedadAmbiental ?? "N/A"}%`;

      console.log("📨 Enviando notificación automática por cambio de bomba");
      sendTelegramMessage(mensaje);
    }
  } catch (err) {
    console.error("❌ Error en onValue (Firebase):", err);
  }
});

// =========================== WEBHOOK TELEGRAM ===========================
app.post("/webhook", async (req, res) => {
  try {
    console.log("📥 Webhook recibido:", JSON.stringify(req.body));
    const message = req.body.message || req.body.edited_message;

    if (!message || !message.text) {
      return res.sendStatus(200);
    }

    const chatId = message.chat && message.chat.id;
    const text = String(message.text || "").trim();

    console.log(`💬 Mensaje de ${chatId}: "${text}"`);

    if (text.toUpperCase().includes("DATOS REALES")) {
      console.log("🔎 Comando DATOS REALES detectado, consultando Firebase...");
      try {
        const snapshot = await get(sensoresRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const estadoBomba = data.bomba ? "✅ ENCENDIDA" : "❌ APAGADA";

          const respuesta =
            `📡 Datos en tiempo real:\n` +
            `Bomba: ${estadoBomba}\n` +
            `🌡️ Temp: ${data.temperatura ?? "N/A"}°C\n` +
            `💧 Suelo: ${data.humedadSuelo ?? "N/A"}%\n` +
            `🌫️ Ambiental: ${data.humedadAmbiental ?? "N/A"}%\n` +
            `⏱️ Uso: ${data.tiempoUso ?? "N/A"} seg\n` +
            `🕒 Último riego: ${data.ultimoRiego ?? "N/A"}`;

          await sendTelegramMessage(respuesta, chatId);
        } else {
          await sendTelegramMessage("⚠️ No hay datos disponibles en Firebase.", chatId);
        }
      } catch (err) {
        console.error("❌ Error leyendo Firebase en comando:", err);
        await sendTelegramMessage("⚠️ Error al leer datos de Firebase.", chatId);
      }
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error en /webhook:", err);
    res.sendStatus(500);
  }
});

// =========================== ENDPOINTS ÚTILES ===========================
app.get("/", (req, res) => {
  res.send("Servidor de notificaciones corriendo 🚀");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// =========================== MANEJO ERRORES  ===========================
process.on("uncaughtException", (err) => {
  console.error("uncaughtException:", err);
});
process.on("unhandledRejection", (reason) => {
  console.error("unhandledRejection:", reason);
});
// =========================== INICIO SERVIDOR  ===========================
const server = app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en puerto ${PORT}`);
  console.log(`🌐 Webhook endpoint: /webhook`);
});

const shutdown = () => {
  console.log("🔌 Cerrando servidor...");
  server.close(() => {
    console.log("🔌 Servidor cerrado.");
    process.exit(0);
  });
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
