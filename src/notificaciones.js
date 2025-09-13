import { db } from "./firebase.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

const TELEGRAM_TOKEN = "TU_TOKEN_AQUI";
const CHAT_ID = "TU_CHAT_ID_AQUI";

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

let ultimoEstadoBomba = null;

function iniciarMonitoreo() {
  const sensoresRef = ref(db, "sensores");

  onValue(sensoresRef, (snapshot) => {
    const data = snapshot.val();
    console.log("Datos recibidos:", data);

    if (!data) return;

    if (data.bomba !== ultimoEstadoBomba) {
      ultimoEstadoBomba = data.bomba;

      let estadoTexto = data.bomba ? "🚰 Bomba ENCENDIDA" : "✅ Bomba APAGADA";
      const mensaje = `${estadoTexto}\n\n🌡️ Temp: ${data.temperatura}°C\n💧 Humedad Suelo: ${data.humedadSuelo}%\n🌫️ Humedad Ambiental: ${data.humedadAmbiental}%`;

      console.log("Enviando mensaje:", mensaje);
      sendTelegramMessage(mensaje);
    }
  });
}

// 👇 Aquí exportas la función para poder usarla en App.jsx
export { iniciarMonitoreo };
