const BASE_URL = "https://0f20-2800-484-1285-3415-75d5-989-c293-8341.ngrok-free.app";

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