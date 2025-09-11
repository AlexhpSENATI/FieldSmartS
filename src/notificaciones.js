import { db } from "./firebase";
import { ref, onChildAdded, get, child } from "firebase/database";

const TELEGRAM_TOKEN = "8107271422:AAHnnAGEYp_6CUG5bvaoT8cJebYuzAL6FAI";
const CHAT_ID = "6588607200";

let ultimaVez = 0;
let ultimoEstado = null;
// ======================== ENVIAR MENSAJE A TELEGRAM ========================
function enviarTelegram(mensaje, chatId = CHAT_ID) {
    const ahora = Date.now();
    if (ahora - ultimaVez < 1000) return; // Evitar spam (1 seg mínimo)
    ultimaVez = ahora;

    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: chatId,
            text: mensaje,
        }),
    })
        .then((res) => res.json())
        .then((data) => console.log("Mensaje enviado a Telegram:", data))
        .catch((err) => console.error("Error enviando a Telegram:", err));
}
// ======================== MOSTRAR NOTIFICACIÓN EN EL NAVEGADOR ========================
function mostrarNotificacion(mensaje) {
    if (Notification.permission === "granted") {
        new Notification("Notificación de Riego", {
            body: mensaje,
            icon: "/icons/water.png",
        });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permiso) => {
            if (permiso === "granted") {
                new Notification("Notificación de Riego", {
                    body: mensaje,
                    icon: "/icons/water.png",
                });
            }
        });
    }
}
// ======================== OBTENER DATOS ACTUALES ========================
async function obtenerDatosActuales() {
    try {
        const snapshot = await get(child(ref(db), "datos"));
        if (snapshot.exists()) {
            const datos = snapshot.val();
            const ultimaClave = Object.keys(datos).pop();
            const registro = datos[ultimaClave];

            return `📊 DATOS ACTUALES: 📊
🚨 TEMPERATURA: ${registro.temperatura}°C
💧 HUMEDAD DE SUELO: ${registro.humedad}%
🌦️ HUMEDAD AMBIENTAL: ${registro.humedadAmbiental}%
🤖 ESTADO DE BOMBA: ${registro.bomba ? "ENCENDIDA" : "APAGADA"}`;
        } else {
            return "⚠️ No hay datos disponibles en Firebase.";
        }
    } catch (err) {
        console.error("Error obteniendo datos:", err);
        return "⚠️ Error al consultar Firebase.";
    }
}

// ======================== ESCUCHAR MENSAJES DE TELEGRAM ========================
let ultimoUpdateId = 0;
async function escucharMensajes() {
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/getUpdates?offset=${ultimoUpdateId + 1}&timeout=30`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.result && data.result.length > 0) {
            for (const update of data.result) {
                ultimoUpdateId = update.update_id;
                const mensajeTexto = update.message?.text?.toUpperCase();
                const chatId = update.message?.chat.id;

                if (mensajeTexto === "DATOS") {
                    const respuesta = await obtenerDatosActuales();
                    enviarTelegram(respuesta, chatId);
                }
            }
        }
    } catch (err) {
        console.error("Error escuchando mensajes:", err);
    }

    // Llamar otra vez (loop infinito)
    escucharMensajes();
}

// async function escucharMensajes() {
//     const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/getUpdates?offset=${ultimoUpdateId + 1}`;

//     try {
//         const res = await fetch(url);
//         const data = await res.json();

//         if (!data.result || data.result.length === 0) return;

//         for (const update of data.result) {
//             ultimoUpdateId = update.update_id;
//             const mensajeTexto = update.message?.text?.toUpperCase();
//             const chatId = update.message?.chat.id;

//             console.log("Mensaje recibido en Telegram:", mensajeTexto);

//             if (mensajeTexto === "MUESTRAME LOS DATOS ACTUAL") {
//                 const respuesta = await obtenerDatosActuales();
//                 enviarTelegram(respuesta, chatId);
//             }
//         }
//     } catch (err) {
//         console.error("Error escuchando mensajes:", err);
//     }
// }

// ========================
//  MONITOREO PRINCIPAL
// ========================

//======================== INICIAR MONITOREO ========================
export function iniciarMonitoreo() {
    const refDatos = ref(db, "datos");

    onChildAdded(refDatos, (snapshot) => {
        const registro = snapshot.val();
        if (!registro) return;

        console.log("Nuevo registro desde Firebase:", registro);

        if (registro.bomba !== ultimoEstado) {
            ultimoEstado = registro.bomba;

            const mensaje = registro.bomba
                ? `🟢⚪🟢 La bomba se ha ✅ ENCENDIDO ✅
🚨 TEMPERATURA: ${registro.temperatura}°C
💧 HUMEDAD DE SUELO: ${registro.humedad}%
🌦️ Humedad Ambiental: ${registro.humedadAmbiental}%`
                : `🔴🟡🔴 La bomba se ha ‼️ APAGADO ‼️
🚨 TEMPERATURA: ${registro.temperatura}°C
💧 HUMEDAD DE SUELO: ${registro.humedad}%
🌦️ HUMEDAD AMBIENTAL: ${registro.humedadAmbiental}%`;;

            mostrarNotificacion(mensaje);
            enviarTelegram(mensaje);
        }
    });

    setInterval(escucharMensajes, 5000);
}
