const functions = require("firebase-functions");
const fetch = require("node-fetch");

const TELEGRAM_TOKEN = "8331662552:AAFCtkTjZJyBDGFqcwXJ4Nl6gpNG65MOOUs";
const CHAT_ID = "6588607200";

// Se dispara cuando cambia el valor de "bomba"
exports.notificarTelegram = functions.database
  .ref("/sensores/bomba")
  .onWrite(async (change, context) => {
    const bomba = change.after.val();
    const estado = bomba ? "🚰 Bomba ENCENDIDA" : "✅ Bomba APAGADA";

    // También puedes leer otros valores del nodo sensores
    const snapshot = await change.after.ref.parent.once("value");
    const data = snapshot.val();

    const mensaje = `${estado}\n\n🌡️ Temp: ${data.temperatura}°C\n💧 Humedad Suelo: ${data.humedadSuelo}%\n🌫️ Humedad Ambiental: ${data.humedadAmbiental}%`;

    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text: mensaje })
    });
  });
