// materialService.js
// Servicio encargado de obtener el material de estudio desde el backend Kotlin.
// Funciona igual que preguntasService.js: hace un fetch al endpoint REST
// y guarda el resultado en cache para no repetir la petición innecesariamente.

const BASE_URL = "http://127.0.0.1:8080";

// Cache en memoria: guarda el material por materia una vez que se descarga.
// Si el usuario vuelve a la pantalla de material, no hace otra petición al servidor.
const cache = {};

export const obtenerMaterial = async (materia) => {

  // Si ya tenemos el material de esta materia en cache, lo retornamos directamente
  if (cache[materia]) return cache[materia];

  try {
    // Llamamos al endpoint GET /material/{materia} del backend Kotlin
    const response = await fetch(`${BASE_URL}/material/${materia}`);
    const json = await response.json();

    // Si la respuesta es exitosa y trae datos, los guardamos en cache y retornamos
    if (json.success && json.data) {
      cache[materia] = json.data;
      return json.data;
    }

    // Si algo salió mal en el servidor pero no lanzó excepción, retornamos vacío
    return [];

  } catch (error) {
    // Error de red o de parseo: lo mostramos en consola para facilitar el diagnóstico
    console.log("Error obteniendo material:", error);
    return [];
  }
};