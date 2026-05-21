const BASE_URL = "https://3ade-186-102-47-6.ngrok-free.app";

const cache = {};

export const obtenerPreguntas = async (area) => {
  if (cache[area]) return cache[area];

  try {
    const response = await fetch(`${BASE_URL}/preguntas/${area}`);
    const json = await response.json();

    if (json.success && json.data) {
      cache[area] = json.data;
      return json.data;
    }
    return [];
  } catch (error) {
    console.log("Error obteniendo preguntas:", error);
    return [];
  }
};