import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform, ActivityIndicator
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AccessibilityContext } from "../context/AccessibilityContext";
import { obtenerPreguntas } from "../services/preguntasService";
import BottomNav from "../components/BottomNav";

// Descripciones posicionales por materia para que la voz oriente al usuario
// sin depender de la vista. Inglés usa inglés, el resto en español.
const posicionesSociales = [
  "primera opción, parte superior izquierda",
  "segunda opción, parte superior derecha",
  "tercera opción, parte inferior izquierda",
  "cuarta opción, parte inferior derecha"
];

const positionsEnglish = [
  "first option, top left",
  "second option, top right",
  "third option, bottom left",
  "fourth option, bottom right"
];

const posicionesCastellano = [
  "primera opción",
  "segunda opción",
  "tercera opción",
  "cuarta opción"
];

// Configuración visual y de voz por materia.
// Centralizar aquí evita condicionales dispersos en el JSX.
const CONFIG = {
  sociales:     { titulo: "Ciencias Sociales", color: ["#7B61FF", "#A78BFA"], posiciones: posicionesSociales },
  ingles:       { titulo: "English",           color: ["#0EA5E9", "#38BDF8"], posiciones: positionsEnglish  },
  matematicas:  { titulo: "Matemáticas",       color: ["#F59E0B", "#FCD34D"], posiciones: posicionesCastellano },
  lectura:      { titulo: "Lectura Crítica",   color: ["#10B981", "#6EE7B7"], posiciones: posicionesCastellano },
};

export default function QuizScreen({ route, navigation }) {
  const materia = route?.params?.materia ?? "sociales";
  const esIngles = materia === "ingles";
  const config = CONFIG[materia] || CONFIG.sociales;

  const [banco, setBanco] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [index, setIndex] = useState(0);
  const [respuestas, setRespuestas] = useState([]);

  // Ref para medir el tiempo total del simulacro sin depender del estado
  const tiempoInicio = useRef(Date.now());
  const { hablar, vozActiva, toggleVoz } = useContext(AccessibilityContext);

  // Carga las preguntas desde Firebase y resetea el cronómetro.
  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      const preguntas = await obtenerPreguntas(materia);
      setBanco(preguntas);
      setCargando(false);
      tiempoInicio.current = Date.now();
    };
    cargar();
  }, [materia]);

  const preguntaActual = banco[index];
  const numeroActual = index + 1;
  const totalPreguntas = banco.length;

  // Lee la pregunta completa con opciones cada vez que cambia el índice
  // o cuando se activa la voz. El contexto se antepone si existe.
  useEffect(() => {
    if (!cargando && vozActiva && preguntaActual) {
      const contexto = preguntaActual.contexto
        ? `${esIngles ? "Context" : "Contexto"}: ${preguntaActual.contexto}. `
        : "";
      const opcionesVoz = preguntaActual.opciones
        .map((op, i) => `${config.posiciones[i]}: ${op}`)
        .join(". ");

      if (esIngles) {
        hablar(`Question ${numeroActual} of ${totalPreguntas}. ${contexto}${preguntaActual.pregunta}. The options are: ${opcionesVoz}`);
      } else {
        hablar(`Pregunta ${numeroActual} de ${totalPreguntas}. ${contexto}${preguntaActual.pregunta}. Las opciones son: ${opcionesVoz}`);
      }
    }
  }, [index, cargando, vozActiva]);

  // Registra la respuesta y avanza. En la última pregunta calcula el tiempo
  // total y navega a Resultados pasando todo el estado necesario.
  const seleccionarRespuesta = (opcion) => {
    const letra = opcion.charAt(0);
    if (vozActiva) {
      hablar(esIngles ? `You selected option ${letra}` : `Seleccionaste la opción ${letra}`);
    }

    const nuevas = [...respuestas, { id: preguntaActual.id, respuesta: letra }];
    setRespuestas(nuevas);

    if (index < banco.length - 1) {
      setIndex(prev => prev + 1);
    } else {
      const tiempoSegundos = Math.round((Date.now() - tiempoInicio.current) / 1000);
      navigation.navigate("Resultados", { respuestas: nuevas, materia, tiempoSegundos, banco });
    }
  };

  // Repite la pregunta actual en voz alta sin cambiar el índice.
  const leerPreguntaDeNuevo = () => {
    if (!preguntaActual) return;
    const contexto = preguntaActual.contexto
      ? `${esIngles ? "Context" : "Contexto"}: ${preguntaActual.contexto}. `
      : "";
    const opcionesVoz = preguntaActual.opciones
      .map((op, i) => `${config.posiciones[i]}: ${op}`)
      .join(". ");
    if (esIngles) {
      hablar(`Question ${numeroActual} of ${totalPreguntas}. ${contexto}${preguntaActual.pregunta}. The options are: ${opcionesVoz}`);
    } else {
      hablar(`Pregunta ${numeroActual} de ${totalPreguntas}. ${contexto}${preguntaActual.pregunta}. Las opciones son: ${opcionesVoz}`);
    }
  };

  // Lee solo el contexto, útil para preguntas largas donde el usuario
  // quiere repasar el texto sin escuchar toda la pregunta de nuevo.
  const leerContexto = () => {
    if (preguntaActual?.contexto) {
      hablar(esIngles ? `Context: ${preguntaActual.contexto}` : `Contexto: ${preguntaActual.contexto}`);
    } else {
      hablar(esIngles ? "This question has no additional context." : "Esta pregunta no tiene contexto adicional.");
    }
  };

  const porcentajeProgreso = totalPreguntas > 0 ? (numeroActual / totalPreguntas) * 100 : 0;

  if (cargando) {
    return (
      <View style={styles.cargandoContainer}>
        <LinearGradient colors={config.color} style={styles.cargandoHeader}>
          <Text style={styles.cargandoTitulo}>{config.titulo}</Text>
          <Text style={styles.cargandoSub}>Cargando preguntas...</Text>
        </LinearGradient>
        <ActivityIndicator size="large" color={config.color[0]} style={{ marginTop: 40 }} />
      </View>
    );
  }

  if (banco.length === 0) {
    return (
      <View style={styles.cargandoContainer}>
        <LinearGradient colors={config.color} style={styles.cargandoHeader}>
          <Text style={styles.cargandoTitulo}>{config.titulo}</Text>
        </LinearGradient>
        <View style={{ alignItems: "center", marginTop: 40 }}>
          <Text style={{ fontSize: 40 }}>😕</Text>
          <Text style={{ fontSize: 16, color: "#555", marginTop: 12 }}>No se encontraron preguntas</Text>
          <TouchableOpacity
            style={{ backgroundColor: config.color[0], padding: 14, borderRadius: 12, marginTop: 20 }}
            onPress={() => navigation.goBack()}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Volver</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <LinearGradient colors={config.color} style={styles.header}>
        <TouchableOpacity style={styles.audioGlobal} onPress={toggleVoz}>
          <Text style={styles.audioGlobalText}>{vozActiva ? "🔊" : "🔇"}</Text>
        </TouchableOpacity>

        <Text style={styles.materiaLabel}>{config.titulo}</Text>
        <Text style={styles.headerText}>
          {esIngles
            ? `Question ${numeroActual} of ${totalPreguntas}`
            : `Pregunta ${numeroActual} de ${totalPreguntas}`}
        </Text>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${porcentajeProgreso}%` }]} />
        </View>
        <Text style={styles.progressLabel}>
          {Math.round(porcentajeProgreso)}% {esIngles ? "completed" : "completado"}
        </Text>
      </LinearGradient>

      {/* key={index} fuerza remount del ScrollView al cambiar pregunta,
          reseteando el scroll al tope automáticamente */}
      <ScrollView key={index} style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={true}>
        <View style={styles.card}>

          <View style={styles.botonesAudio}>
            <TouchableOpacity style={[styles.audioBtn, { backgroundColor: config.color[0] }]} onPress={leerPreguntaDeNuevo}>
              <Text style={styles.audioBtnText}>🔊 {esIngles ? "Listen" : "Escuchar"}</Text>
            </TouchableOpacity>
            {preguntaActual.contexto ? (
              <TouchableOpacity style={[styles.audioBtn, { backgroundColor: config.color[1] }]} onPress={leerContexto}>
                <Text style={styles.audioBtnText}>📖 {esIngles ? "Context" : "Contexto"}</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {preguntaActual.contexto ? (
            <View style={[styles.contextoBox, { borderLeftColor: config.color[0] }]}>
              <Text style={[styles.contextoLabel, { color: config.color[0] }]}>
                {esIngles ? "📌 Context" : "📌 Contexto"}
              </Text>
              <Text style={styles.contextoTexto}>{preguntaActual.contexto}</Text>
            </View>
          ) : null}

          <Text style={styles.pregunta}>{preguntaActual.pregunta}</Text>

          <View style={styles.opcionesGrid}>
            {preguntaActual.opciones.map((op, i) => (
              <TouchableOpacity
                key={`${index}-${i}`}
                style={[styles.opcion, { borderColor: config.color[0] + "44", backgroundColor: config.color[0] + "11" }]}
                onPress={() => seleccionarRespuesta(op)}
                activeOpacity={0.7}
              >
                <View style={[styles.letraBadge, { backgroundColor: config.color[0] }]}>
                  <Text style={styles.letraTexto}>{op.charAt(0)}</Text>
                </View>
                {/* op tiene formato "A. texto", se salta la letra y el punto */}
                <Text style={styles.opcionText}>{op.substring(3)}</Text>
              </TouchableOpacity>
            ))}
          </View>

        </View>
        <View style={{ height: 20 }} />
      </ScrollView>

      <BottomNav navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#F5F6FA", ...(Platform.OS === "web" ? { height: "100vh", overflow: "hidden" } : {}) },
  cargandoContainer: { flex: 1, backgroundColor: "#F5F6FA" },
  cargandoHeader: { paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20 },
  cargandoTitulo: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  cargandoSub: { color: "rgba(255,255,255,0.8)", fontSize: 14, marginTop: 4 },
  header: { paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, flexShrink: 0 },
  audioGlobal: { alignSelf: "flex-end", backgroundColor: "rgba(0,0,0,0.2)", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: 6 },
  audioGlobalText: { fontSize: 18 },
  materiaLabel: { color: "rgba(255,255,255,0.8)", fontSize: 13, marginBottom: 4 },
  headerText: { color: "#fff", fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  progressBar: { height: 8, backgroundColor: "rgba(255,255,255,0.3)", borderRadius: 4, overflow: "hidden" },
  progressFill: { height: 8, backgroundColor: "#fff", borderRadius: 4 },
  progressLabel: { color: "rgba(255,255,255,0.8)", fontSize: 12, marginTop: 6, textAlign: "right" },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, flexGrow: 1 },
  card: { backgroundColor: "#fff", borderRadius: 20, padding: 20, elevation: 5 },
  botonesAudio: { flexDirection: "row", gap: 10, marginBottom: 15, flexWrap: "wrap" },
  audioBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  audioBtnText: { color: "#fff", fontWeight: "600", fontSize: 13 },
  contextoBox: { backgroundColor: "#F8F8FF", borderRadius: 12, padding: 14, marginBottom: 16, borderLeftWidth: 4 },
  contextoLabel: { fontSize: 12, fontWeight: "bold", marginBottom: 6 },
  contextoTexto: { fontSize: 13, color: "#334155", lineHeight: 20 },
  pregunta: { fontSize: 17, fontWeight: "bold", marginBottom: 20, color: "#222", lineHeight: 26 },
  opcionesGrid: { gap: 12 },
  opcion: { padding: 14, borderRadius: 14, flexDirection: "row", alignItems: "flex-start", borderWidth: 1, gap: 10 },
  letraBadge: { borderRadius: 20, width: 32, height: 32, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  letraTexto: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  opcionText: { fontSize: 15, color: "#333", flex: 1, lineHeight: 22 }
});