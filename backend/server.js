import express from "express";
import fetch from "node-fetch";
import { db } from "./firebase.js";
import { ref, onValue } from "firebase/database";

const app = express();
const PORT = 3000;

const TELEGRAM_TOKEN = "8331662552:AAFCtkTjZJyBDGFqcwXJ4Nl6gpNG65MOOUs";
const CHAT_ID = "6588607200";

async function sendTelegramMessage(text) {
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: text
      })
    });

    const data = await res.json();
    console.log("Respuesta Telegram:", data);
  } catch (error) {
    console.error("Error enviando a Telegram:", error);
  }
}

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

    console.log("📨 Enviando mensaje:", mensaje);
    sendTelegramMessage(mensaje);
  }
});

app.get("/", (req, res) => {
  res.send("Servidor de notificaciones corriendo 🚀");
});

app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
});
