const BASE_URL = "http://127.0.0.1:8080";

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