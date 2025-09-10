// src/notificaciones.js
import { db } from "./firebase";
import { ref, onChildAdded } from "firebase/database";

const TELEGRAM_TOKEN = "8107271422:AAHnnAGEYp_6CUG5bvaoT8cJebYuzAL6FAI";
const CHAT_ID = "6588607200";

function enviarTelegram(mensaje) {
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: CHAT_ID,
            text: mensaje,
        }),
    })
       
}

function mostrarNotificacion(mensaje) {
    if (Notification.permission === "granted") {
        new Notification("Notificación de Riego", {
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

let ultimoEstado = null;

export function iniciarMonitoreo() {
    const refDatos = ref(db, "datos");

    onChildAdded(refDatos, (snapshot) => {
        const registro = snapshot.val();
        if (!registro) return;

        console.log("Nuevo registro desde Firebase:", registro);

        // Solo actuar si cambió el estado de la bomba
        if (registro.bomba !== ultimoEstado) {

            if (registro.bomba === true) {
                const mensaje = `🚰 La bomba se ha ENCENDIDO
🌡️ Temp: ${registro.temperatura}°C
💧 Humedad: ${registro.humedad}%`;
                mostrarNotificacion(mensaje);
                enviarTelegram(mensaje);
            } else {
                const mensaje = `💧 La bomba se ha APAGADO
🌡️ Temp: ${registro.temperatura}°C
💧 Humedad: ${registro.humedad}%`;
                mostrarNotificacion(mensaje);
                enviarTelegram(mensaje);
            }
        }
    });
}
