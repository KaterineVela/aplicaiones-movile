// Importación de React y hooks necesarios
import React, { useEffect, useContext } from "react";

// Importación de componentes de React Native
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform
} from "react-native";

// Importación del componente de gradiente
import { LinearGradient } from "expo-linear-gradient";

// Importación del contexto de accesibilidad
import { AccessibilityContext } from "../context/AccessibilityContext";

// Importación del contexto de autenticación
import { AuthContext } from "../context/AuthContext";

// Importación de la base de datos Firebase
import { db } from "../firebaseConfig";

// Importación de funciones necesarias de Firestore
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  setDoc
} from "firebase/firestore";

// Función para convertir segundos en un formato legible
const formatearTiempo = (segundos) => {

  // Si no existe tiempo, retorna null
  if (!segundos) return null;

  // Calcula minutos completos
  const m = Math.floor(segundos / 60);

  // Calcula segundos restantes
  const s = segundos % 60;

  // Si el tiempo es menor a un minuto, muestra solo segundos
  if (m === 0) return `${s}s`;

  // Retorna el formato minutos y segundos
  return `${m}m ${s}s`;
};

// Configuración visual y temática de cada materia
const CONFIG = {

  // Configuración de Ciencias Sociales
  sociales: {
    titulo: "Ciencias Sociales",
    icono: "🌎",
    color: ["#7B61FF", "#A78BFA"],
    barra: "#7B61FF"
  },

  // Configuración de Inglés
  ingles: {
    titulo: "Inglés",
    icono: "🌐",
    color: ["#0EA5E9", "#38BDF8"],
    barra: "#0EA5E9"
  },

  // Configuración de Matemáticas
  matematicas: {
    titulo: "Matemáticas",
    icono: "🔢",
    color: ["#F59E0B", "#FCD34D"],
    barra: "#F59E0B"
  },

  // Configuración de Lectura Crítica
  lectura: {
    titulo: "Lectura Crítica",
    icono: "📖",
    color: ["#10B981", "#6EE7B7"],
    barra: "#10B981"
  },
};

// Componente principal de la pantalla de resultados
export default function ResultScreen({ route, navigation }) {

  // Obtiene respuestas enviadas desde la navegación
  const respuestas = route?.params?.respuestas ?? [];

  // Obtiene la materia seleccionada
  const materia = route?.params?.materia ?? "sociales";

  // Obtiene el tiempo total en segundos
  const tiempoSegundos = route?.params?.tiempoSegundos ?? null;

  // Obtiene el banco de preguntas
  const banco = route?.params?.banco ?? [];

  // Obtiene configuración visual de la materia
  const config = CONFIG[materia] || CONFIG.sociales;

  // Obtiene información del contexto de accesibilidad
  const context = useContext(AccessibilityContext) || {};

  // Función para reproducir voz
  const hablar = context.hablar || (() => {});

  // Estado que indica si la voz está activa
  const vozActiva = context.vozActiva || false;

  // Obtiene el usuario autenticado
  const { usuario } = useContext(AuthContext);

  // Filtra respuestas correctas
  const correctas = respuestas.filter(r => {

    // Busca la pregunta correspondiente
    const p = banco.find(p => p.id === r.id);

    // Retorna true si la respuesta es correcta
    return p?.correcta === r.respuesta;
  });

  // Filtra respuestas incorrectas
  const incorrectas = respuestas.filter(r => {

    // Busca la pregunta correspondiente
    const p = banco.find(p => p.id === r.id);

    // Retorna true si la respuesta es incorrecta
    return p?.correcta !== r.respuesta;
  });

  // Calcula el porcentaje de aciertos
  const porcentaje = banco.length > 0
    ? Math.round((correctas.length / banco.length) * 100)
    : 0;

  // Define el color del círculo según el puntaje
  const colorCirculo = porcentaje >= 70
    ? ["#4CAF50", "#81C784"] // Excelente
    : porcentaje >= 40
    ? ["#FF9800", "#FFB74D"] // Intermedio
    : ["#F44336", "#E57373"]; // Bajo

  // Texto del nivel obtenido
  const nivelTexto = porcentaje >= 70
    ? "¡Excelente!"
    : porcentaje >= 40
    ? "Puedes mejorar"
    : "Sigue practicando";

  // useEffect para guardar resultados en Firebase
  useEffect(() => {

    // Función asíncrona para guardar datos
    const guardarResultado = async () => {

      // Si no hay usuario autenticado, termina
      if (!usuario) return;

      try {

        // Genera detalles de preguntas incorrectas
        const incorrectasDetalle = incorrectas.map(r => {

          // Busca pregunta correspondiente
          const p = banco.find(p => p.id === r.id);

          // Retorna información detallada
          return {
            id: r.id,
            pregunta: p?.pregunta || "",
            tuRespuesta: r.respuesta,
            correcta: p?.correcta || "",
            opciones: p?.opciones || []
          };
        });

        // Guarda resultado general en Firestore
        await addDoc(collection(db, "usuarios", usuario.uid, "resultados"), {
          materia,
          porcentaje,
          correctas: correctas.length,
          incorrectas: incorrectas.length,
          total: banco.length,
          tiempoSegundos: tiempoSegundos || 0,
          incorrectasDetalle,
          fecha: serverTimestamp()
        });

        // -------------------------
        // ACTUALIZACIÓN DE RACHA
        // -------------------------

        // Referencia al perfil del usuario
        const perfilRef = doc(db, "usuarios", usuario.uid, "perfil", "datos");

        // Obtiene datos actuales del perfil
        const perfilSnap = await getDoc(perfilRef);

        // Fecha actual
        const hoy = new Date().toISOString().split("T")[0];

        // Fecha del día anterior
        const ayer = new Date(Date.now() - 86400000).toISOString().split("T")[0];

        // Inicializa racha
        let nuevaRacha = 1;

        // Si el perfil ya existe
        if (perfilSnap.exists()) {

          // Obtiene datos del perfil
          const perfil = perfilSnap.data();

          // Si ya jugó hoy, mantiene la racha
          if (perfil.ultimoDia === hoy) {
            nuevaRacha = perfil.racha;

          // Si jugó ayer, aumenta la racha
          } else if (perfil.ultimoDia === ayer) {
            nuevaRacha = (perfil.racha || 0) + 1;
          }

          // Actualiza perfil
          await setDoc(
            perfilRef,
            {
              ...perfil,
              racha: nuevaRacha,
              ultimoDia: hoy
            },
            { merge: true }
          );

        } else {

          // Si no existe perfil, crea uno nuevo
          await setDoc(perfilRef, {
            nombre: usuario.displayName || "",
            email: usuario.email || "",
            racha: 1,
            ultimoDia: hoy,
            fechaRegistro: new Date().toISOString()
          });
        }

      } catch (error) {

        // Muestra error en consola
        console.log("Error guardando resultado:", error);
      }
    };

    // Ejecuta función
    guardarResultado();

  }, []);

  // useEffect para lectura automática por voz
  useEffect(() => {

    // Si la voz está activa
    if (vozActiva) {

      // Reproduce resumen de resultados
      hablar(
        `Resultados de ${config.titulo}. Tu puntaje es ${porcentaje} por ciento. ` +
        `${correctas.length} correctas y ${incorrectas.length} incorrectas de ${banco.length}. ` +
        `Nivel: ${nivelTexto}.`
      );
    }
  }, []);

  // Obtiene las demás materias diferentes a la actual
  const OTRAS = Object.entries(CONFIG).filter(([key]) => key !== materia);

  // Renderizado principal del componente
  return (
    <View style={styles.wrapper}>

      {/* Encabezado principal */}
      <LinearGradient colors={config.color} style={styles.headerBanner}>

        {/* Nombre de la materia */}
        <Text style={styles.headerTexto}>
          {config.icono} {config.titulo}
        </Text>

        {/* Subtítulo */}
        <Text style={styles.headerSub}>
          Resultados del simulacro
        </Text>
      </LinearGradient>

      {/* Contenedor con scroll */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
      >

        {/* Círculo principal del porcentaje */}
        <LinearGradient colors={colorCirculo} style={styles.circulo}>

          {/* Porcentaje grande */}
          <Text style={styles.porcentajeGrande}>
            {porcentaje}%
          </Text>

          {/* Nivel obtenido */}
          <Text style={styles.nivelTexto}>
            {nivelTexto}
          </Text>
        </LinearGradient>

        {/* Resumen general */}
        <Text style={styles.resumen}>
          {correctas.length} correctas · {incorrectas.length} incorrectas · {banco.length} total
        </Text>

        {/* Tarjeta de tiempo */}
        {tiempoSegundos > 0 && (
          <View style={styles.tiempoCard}>

            <Text style={styles.tiempoIcono}>⏱️</Text>

            <Text style={styles.tiempoTexto}>
              Tiempo: {formatearTiempo(tiempoSegundos)}
            </Text>
          </View>
        )}

        {/* Tarjeta de resultados por materia */}
        <View style={styles.materiaCard}>

          <Text style={styles.materiaTitulo}>
            📊 Resultado por materia
          </Text>

          {/* Materia actual */}
          <View style={styles.materiaFila}>

            <Text style={styles.materiaIcono}>
              {config.icono}
            </Text>

            <View style={styles.materiaInfo}>

              <Text style={styles.materiaNombre}>
                {config.titulo}
              </Text>

              {/* Barra de progreso */}
              <View style={styles.barraFondo}>

                <View
                  style={[
                    styles.barraRelleno,
                    {
                      width: `${porcentaje}%`,
                      backgroundColor: config.barra
                    }
                  ]}
                />
              </View>
            </View>

            {/* Porcentaje de la materia */}
            <Text
              style={[
                styles.materiaPorcentaje,
                { color: config.barra }
              ]}
            >
              {porcentaje}%
            </Text>
          </View>

          {/* Otras materias */}
          {OTRAS.map(([key, cfg]) => (
            <View
              key={key}
              style={[styles.materiaFila, styles.materiaDeshabilitada]}
            >

              <Text style={styles.materiaIcono}>
                {cfg.icono}
              </Text>

              <View style={styles.materiaInfo}>

                <Text
                  style={[
                    styles.materiaNombre,
                    { color: "#AAA" }
                  ]}
                >
                  {cfg.titulo}
                </Text>

                <Text style={styles.proximamente}>
                  Practica para ver tu resultado
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Botón para ver preguntas incorrectas */}
        {incorrectas.length > 0 && (
          <TouchableOpacity
            style={styles.btnIncorrectas}
            onPress={() =>
              navigation.navigate("PreguntasIncorrectas", {
                respuestas,
                incorrectas,
                materia,
                banco
              })
            }
          >
            <Text style={styles.btnIncorrectasTexto}>
              ❌ Ver preguntas incorrectas ({incorrectas.length})
            </Text>
          </TouchableOpacity>
        )}

        {/* Mensaje si todo fue correcto */}
        {incorrectas.length === 0 && (
          <View style={styles.perfectoCard}>
            <Text style={styles.perfectoTexto}>
              🎉 ¡Respondiste todo correctamente!
            </Text>
          </View>
        )}

        {/* Botón de recomendaciones */}
        <TouchableOpacity
          style={[
            styles.btnRecomendaciones,
            { backgroundColor: config.barra }
          ]}
          onPress={() =>
            navigation.navigate("Recomendaciones", {
              porcentaje,
              respuestas,
              materia
            })
          }
        >
          <Text style={styles.btnTexto}>
            📋 Ver recomendaciones
          </Text>
        </TouchableOpacity>

        {/* Botón volver al inicio */}
        <TouchableOpacity
          style={styles.btnVolver}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.btnTexto}>
            🏠 Volver al inicio
          </Text>
        </TouchableOpacity>

        {/* Espacio inferior */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

// Estilos de la pantalla
const styles = StyleSheet.create({

  // Contenedor principal
  wrapper: {
    flex: 1,
    backgroundColor: "#F5F6FA",

    // Ajustes para versión web
    ...(Platform.OS === "web"
      ? { height: "100vh", overflow: "hidden" }
      : {})
  },

  // Encabezado superior
  headerBanner: {
    paddingTop: 50,
    paddingBottom: 18,
    paddingHorizontal: 24
  },

  // Texto principal del encabezado
  headerTexto: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold"
  },

  // Subtítulo del encabezado
  headerSub: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    marginTop: 2
  },

  // Scroll principal
  scroll: { flex: 1 },

  // Contenedor interno
  container: {
    alignItems: "center",
    padding: 20,
    paddingBottom: 40
  },

  // Círculo del porcentaje
  circulo: {
    width: 180,
    height: 180,
    borderRadius: 90,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 14,
    elevation: 8
  },

  // Texto grande del porcentaje
  porcentajeGrande: {
    fontSize: 48,
    color: "#fff",
    fontWeight: "bold"
  },

  // Texto del nivel
  nivelTexto: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600"
  },

  // Texto resumen
  resumen: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10
  },

  // Tarjeta del tiempo
  tiempoCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
    elevation: 2
  },

  // Icono de tiempo
  tiempoIcono: {
    fontSize: 18
  },

  // Texto del tiempo
  tiempoTexto: {
    fontSize: 14,
    color: "#555",
    fontWeight: "600"
  },

  // Tarjeta de materias
  materiaCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    width: "100%",
    elevation: 4,
    marginBottom: 16
  },

  // Título de la tarjeta de materias
  materiaTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 14
  },

  // Fila de materia
  materiaFila: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12
  },

  // Estilo deshabilitado
  materiaDeshabilitada: {
    opacity: 0.4
  },

  // Icono de materia
  materiaIcono: {
    fontSize: 22
  },

  // Información de materia
  materiaInfo: {
    flex: 1
  },

  // Nombre de materia
  materiaNombre: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333"
  },

  // Fondo de barra
  barraFondo: {
    height: 8,
    backgroundColor: "#EEE",
    borderRadius: 4,
    marginTop: 5,
    overflow: "hidden"
  },

  // Barra rellena
  barraRelleno: {
    height: 8,
    borderRadius: 4
  },

  // Porcentaje de materia
  materiaPorcentaje: {
    fontSize: 14,
    fontWeight: "bold",
    width: 40,
    textAlign: "right"
  },

  // Texto próximamente
  proximamente: {
    fontSize: 11,
    color: "#AAA",
    marginTop: 2
  },

  // Botón preguntas incorrectas
  btnIncorrectas: {
    backgroundColor: "#FFF0F0",
    borderWidth: 2,
    borderColor: "#F44336",
    padding: 15,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginBottom: 12
  },

  // Texto del botón incorrectas
  btnIncorrectasTexto: {
    color: "#F44336",
    fontWeight: "bold",
    fontSize: 15
  },

  // Tarjeta de resultado perfecto
  perfectoCard: {
    backgroundColor: "#F0FFF4",
    borderRadius: 12,
    padding: 15,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#4CAF50"
  },

  // Texto de resultado perfecto
  perfectoTexto: {
    color: "#4CAF50",
    fontWeight: "bold",
    fontSize: 15
  },

  // Botón recomendaciones
  btnRecomendaciones: {
    padding: 15,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginBottom: 12
  },

  // Botón volver al inicio
  btnVolver: {
    backgroundColor: "#A78BFA",
    padding: 15,
    borderRadius: 12,
    width: "100%",
    alignItems: "center"
  },

  // Texto general de botones
  btnTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15
  }
});