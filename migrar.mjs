import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { operaciones } from "./operaciones_data.js";
import readline from "readline";

const FC = {
  apiKey: "AIzaSyDnsmUuwjiT2Gzq3y9NAvxaeFEmn3LTMw4",
  authDomain: "alquileres-eckerdt.firebaseapp.com",
  projectId: "alquileres-eckerdt",
  storageBucket: "alquileres-eckerdt.firebasestorage.app",
  messagingSenderId: "368148074641",
  appId: "1:368148074641:web:4369af59f3e7b2f3daef30",
  databaseURL: "https://alquileres-eckerdt-default-rtdb.firebaseio.com"
};

const COLECCION = "operacionesVenta";

function preguntar(texto) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(texto, ans => { rl.close(); resolve(ans); }));
}

async function main() {
  const email = await preguntar("Email (gaston@ie.com): ");
  const pass = await preguntar("Contraseña: ");

  const app = initializeApp(FC);
  const auth = getAuth(app);
  const db = getFirestore(app);

  console.log("Iniciando sesión...");
  await signInWithEmailAndPassword(auth, email.trim(), pass);
  console.log("Sesión OK. Subiendo", operaciones.length, "operaciones a Firestore...");

  let ok = 0;
  for (const op of operaciones) {
    try {
      await addDoc(collection(db, COLECCION), op);
      ok++;
      console.log(`[${ok}/${operaciones.length}] ${op.vendedor} -> ${op.comprador}`);
    } catch (e) {
      console.error("ERROR subiendo operación:", op.vendedor, op.comprador, e.message);
    }
  }

  console.log(`\nListo. ${ok} de ${operaciones.length} operaciones migradas correctamente.`);
  process.exit(0);
}

main().catch(e => { console.error("Error general:", e); process.exit(1); });
