import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";

// Cache en memoria para no consultar Firebase en cada pregunta
const cache = {};

export const obtenerPreguntas = async (area) => {
  // Si ya están en cache, retornarlas directamente
  if (cache[area]) return cache[area];

  try {
    const q = query(
      collection(db, "preguntas"),
      where("area", "==", area)
    );
    const snap = await getDocs(q);
console.log(`Preguntas encontradas para [${area}]:`, snap.docs.length);
const preguntas = snap.docs.map(doc => ({ docId: doc.id, ...doc.data() }));

    // Ordenar por id
    preguntas.sort((a, b) => a.id - b.id);

    // Guardar en cache
    cache[area] = preguntas;

    return preguntas;
  } catch (error) {
    console.log("Error obteniendo preguntas:", error);
    return [];
  }
};