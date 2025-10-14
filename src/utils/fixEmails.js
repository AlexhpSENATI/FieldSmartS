import { db } from "../firebase";
import { get, ref, update } from "firebase/database";

export async function fixCorruptedEmails() {
  const snapshot = await get(ref(db, "users"));
  if (snapshot.exists()) {
    const users = snapshot.val();
    for (const uid in users) {
      const user = users[uid];
      if (typeof user.email === "object" && user.email.email) {
        console.log(`Corrigiendo ${uid}...`);
        await update(ref(db, `users/${uid}`), {
          email: user.email.email,
        });
      }
    }
    console.log("✅ Correos corregidos exitosamente.");
  } else {
    console.log("⚠️ No hay usuarios en la base de datos.");
  }
}
