import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform
} from "react-native";
import { preguntas as preguntasSociales } from "../data/preguntas";
import { preguntasIngles } from "../data/preguntasIngles";
import { LinearGradient } from "expo-linear-gradient";
import { AccessibilityContext } from "../context/AccessibilityContext";
import BottomNav from "../components/BottomNav";

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

export default function QuizScreen({ route, navigation }) {
  const materia = route?.params?.materia ?? "sociales";
  const esIngles = materia === "ingles";

  const banco = esIngles ? preguntasIngles : preguntasSociales;
  const tituloMateria = esIngles ? "English" : "Ciencias Sociales";
  const colorMateria = esIngles ? ["#0EA5E9", "#38BDF8"] : ["#7B61FF", "#A78BFA"];
  const posiciones = esIngles ? positionsEnglish : posicionesSociales;

  const [index, setIndex] = useState(0);
  const [respuestas, setRespuestas] = useState([]);

  // Timer: registra el momento en que empieza el quiz
  const tiempoInicio = useRef(Date.now());

  const { hablar, vozActiva, toggleVoz } = useContext(AccessibilityContext);

  const preguntaActual = banco[index];
  const numeroActual = index + 1;
  const totalPreguntas = banco.length;

  useEffect(() => {
    if (vozActiva && preguntaActual) {
      const contexto = preguntaActual.contexto
        ? (esIngles ? `Context: ${preguntaActual.contexto}. ` : `Contexto: ${preguntaActual.contexto}. `)
        : "";
      const opcionesVoz = preguntaActual.opciones
        .map((op, i) => `${posiciones[i]}: ${op}`)
        .join(". ");

      if (esIngles) {
        hablar(`Question ${numeroActual} of ${totalPreguntas}. ${contexto}${preguntaActual.pregunta}. The options are: ${opcionesVoz}`);
      } else {
        hablar(`Pregunta ${numeroActual} de ${totalPreguntas}. ${contexto}${preguntaActual.pregunta}. Las opciones son: ${opcionesVoz}`);
      }
    }
  }, [index, vozActiva]);

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
      // Calcular tiempo total en segundos
      const tiempoSegundos = Math.round((Date.now() - tiempoInicio.current) / 1000);
      navigation.navigate("Resultados", { respuestas: nuevas, materia, tiempoSegundos });
    }
  };

  const leerPreguntaDeNuevo = () => {
    const contexto = preguntaActual.contexto
      ? (esIngles ? `Context: ${preguntaActual.contexto}. ` : `Contexto: ${preguntaActual.contexto}. `)
      : "";
    const opcionesVoz = preguntaActual.opciones
      .map((op, i) => `${posiciones[i]}: ${op}`)
      .join(". ");

    if (esIngles) {
      hablar(`Question ${numeroActual} of ${totalPreguntas}. ${contexto}${preguntaActual.pregunta}. The options are: ${opcionesVoz}`);
    } else {
      hablar(`Pregunta ${numeroActual} de ${totalPreguntas}. ${contexto}${preguntaActual.pregunta}. Las opciones son: ${opcionesVoz}`);
    }
  };

  const leerContexto = () => {
    if (preguntaActual.contexto) {
      hablar(esIngles ? `Context: ${preguntaActual.contexto}` : `Contexto: ${preguntaActual.contexto}`);
    } else {
      hablar(esIngles ? "This question has no additional context." : "Esta pregunta no tiene contexto adicional.");
    }
  };

  const porcentajeProgreso = (numeroActual / totalPreguntas) * 100;

  return (
    <View style={styles.wrapper}>
      <LinearGradient colors={colorMateria} style={styles.header}>
        <TouchableOpacity style={styles.audioGlobal} onPress={toggleVoz}>
          <Text style={styles.audioGlobalText}>{vozActiva ? "🔊" : "🔇"}</Text>
        </TouchableOpacity>

        <Text style={styles.materiaLabel}>{tituloMateria}</Text>
        <Text style={styles.headerText}>
          {esIngles ? `Question ${numeroActual} of ${totalPreguntas}` : `Pregunta ${numeroActual} de ${totalPreguntas}`}
        </Text>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${porcentajeProgreso}%` }]} />
        </View>
        <Text style={styles.progressLabel}>
          {Math.round(porcentajeProgreso)}% {esIngles ? "completed" : "completado"}
        </Text>
      </LinearGradient>

      <ScrollView key={index} style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={true}>
        <View style={styles.card}>

          <View style={styles.botonesAudio}>
            <TouchableOpacity style={styles.audioBtn} onPress={leerPreguntaDeNuevo}>
              <Text style={styles.audioBtnText}>🔊 {esIngles ? "Listen" : "Escuchar"}</Text>
            </TouchableOpacity>
            {preguntaActual.contexto && (
              <TouchableOpacity style={[styles.audioBtn, styles.audioBtnContexto]} onPress={leerContexto}>
                <Text style={styles.audioBtnText}>📖 {esIngles ? "Context" : "Contexto"}</Text>
              </TouchableOpacity>
            )}
          </View>

          {preguntaActual.contexto && (
            <View style={[styles.contextoBox, esIngles && styles.contextoBoxIngles]}>
              <Text style={[styles.contextoLabel, esIngles && styles.contextoLabelIngles]}>
                {esIngles ? "📌 Context" : "📌 Contexto"}
              </Text>
              <Text style={styles.contextoTexto}>{preguntaActual.contexto}</Text>
            </View>
          )}

          <Text style={styles.pregunta}>{preguntaActual.pregunta}</Text>

          <View style={styles.opcionesGrid}>
            {preguntaActual.opciones.map((op, i) => (
              <TouchableOpacity
                key={`${index}-${i}`}
                style={[styles.opcion, esIngles && styles.opcionIngles]}
                onPress={() => seleccionarRespuesta(op)}
                accessibilityLabel={`${posiciones[i]}: ${op}`}
                activeOpacity={0.7}
              >
                <View style={[styles.letraBadge, esIngles && styles.letraBadgeIngles]}>
                  <Text style={styles.letraTexto}>{op.charAt(0)}</Text>
                </View>
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
  audioBtn: { backgroundColor: "#7B61FF", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  audioBtnContexto: { backgroundColor: "#0EA5E9" },
  audioBtnText: { color: "#fff", fontWeight: "600", fontSize: 13 },
  contextoBox: { backgroundColor: "#F3F0FF", borderRadius: 12, padding: 14, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: "#7B61FF" },
  contextoBoxIngles: { backgroundColor: "#F0F9FF", borderLeftColor: "#0EA5E9" },
  contextoLabel: { fontSize: 12, fontWeight: "bold", color: "#5B21B6", marginBottom: 6 },
  contextoLabelIngles: { color: "#0369A1" },
  contextoTexto: { fontSize: 13, color: "#334155", lineHeight: 20 },
  pregunta: { fontSize: 17, fontWeight: "bold", marginBottom: 20, color: "#222", lineHeight: 26 },
  opcionesGrid: { gap: 12 },
  opcion: { backgroundColor: "#F0EDFF", padding: 14, borderRadius: 14, flexDirection: "row", alignItems: "flex-start", borderWidth: 1, borderColor: "#DDD5FF", gap: 10 },
  opcionIngles: { backgroundColor: "#F0F9FF", borderColor: "#BAE6FD" },
  letraBadge: { backgroundColor: "#7B61FF", borderRadius: 20, width: 32, height: 32, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  letraBadgeIngles: { backgroundColor: "#0EA5E9" },
  letraTexto: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  opcionText: { fontSize: 15, color: "#333", flex: 1, lineHeight: 22 }
});