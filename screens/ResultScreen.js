import React, { useEffect, useContext } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AccessibilityContext } from "../context/AccessibilityContext";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp, doc, getDoc, setDoc } from "firebase/firestore";

const formatearTiempo = (segundos) => {
  if (!segundos) return null;
  const m = Math.floor(segundos / 60);
  const s = segundos % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
};

const CONFIG = {
  sociales:    { titulo: "Ciencias Sociales", icono: "🌎", color: ["#7B61FF", "#A78BFA"], barra: "#7B61FF" },
  ingles:      { titulo: "Inglés",            icono: "🌐", color: ["#0EA5E9", "#38BDF8"], barra: "#0EA5E9" },
  matematicas: { titulo: "Matemáticas",       icono: "🔢", color: ["#F59E0B", "#FCD34D"], barra: "#F59E0B" },
  lectura:     { titulo: "Lectura Crítica",   icono: "📖", color: ["#10B981", "#6EE7B7"], barra: "#10B981" },
};

export default function ResultScreen({ route, navigation }) {
  const respuestas = route?.params?.respuestas ?? [];
  const materia = route?.params?.materia ?? "sociales";
  const tiempoSegundos = route?.params?.tiempoSegundos ?? null;
  const banco = route?.params?.banco ?? [];

  const config = CONFIG[materia] || CONFIG.sociales;

  const context = useContext(AccessibilityContext) || {};
  const hablar = context.hablar || (() => {});
  const vozActiva = context.vozActiva || false;
  const { usuario } = useContext(AuthContext);

  const correctas = respuestas.filter(r => {
    const p = banco.find(p => p.id === r.id);
    return p?.correcta === r.respuesta;
  });

  const incorrectas = respuestas.filter(r => {
    const p = banco.find(p => p.id === r.id);
    return p?.correcta !== r.respuesta;
  });

  const porcentaje = banco.length > 0
    ? Math.round((correctas.length / banco.length) * 100)
    : 0;

  const colorCirculo = porcentaje >= 70
    ? ["#4CAF50", "#81C784"]
    : porcentaje >= 40
    ? ["#FF9800", "#FFB74D"]
    : ["#F44336", "#E57373"];

  const nivelTexto = porcentaje >= 70 ? "¡Excelente!"
    : porcentaje >= 40 ? "Puedes mejorar"
    : "Sigue practicando";

  useEffect(() => {
    const guardarResultado = async () => {
      if (!usuario) return;
      try {
        const incorrectasDetalle = incorrectas.map(r => {
          const p = banco.find(p => p.id === r.id);
          return {
            id: r.id,
            pregunta: p?.pregunta || "",
            tuRespuesta: r.respuesta,
            correcta: p?.correcta || "",
            opciones: p?.opciones || []
          };
        });

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

        // Actualizar racha
        const perfilRef = doc(db, "usuarios", usuario.uid, "perfil", "datos");
        const perfilSnap = await getDoc(perfilRef);
        const hoy = new Date().toISOString().split("T")[0];
        const ayer = new Date(Date.now() - 86400000).toISOString().split("T")[0];

        let nuevaRacha = 1;
        if (perfilSnap.exists()) {
          const perfil = perfilSnap.data();
          if (perfil.ultimoDia === hoy) {
            nuevaRacha = perfil.racha;
          } else if (perfil.ultimoDia === ayer) {
            nuevaRacha = (perfil.racha || 0) + 1;
          }
          await setDoc(perfilRef, { ...perfil, racha: nuevaRacha, ultimoDia: hoy }, { merge: true });
        } else {
          await setDoc(perfilRef, {
            nombre: usuario.displayName || "",
            email: usuario.email || "",
            racha: 1, ultimoDia: hoy,
            fechaRegistro: new Date().toISOString()
          });
        }
      } catch (error) {
        console.log("Error guardando resultado:", error);
      }
    };
    guardarResultado();
  }, []);

  useEffect(() => {
    if (vozActiva) {
      hablar(
        `Resultados de ${config.titulo}. Tu puntaje es ${porcentaje} por ciento. ` +
        `${correctas.length} correctas y ${incorrectas.length} incorrectas de ${banco.length}. ` +
        `Nivel: ${nivelTexto}.`
      );
    }
  }, []);

  const OTRAS = Object.entries(CONFIG).filter(([key]) => key !== materia);

  return (
    <View style={styles.wrapper}>
      <LinearGradient colors={config.color} style={styles.headerBanner}>
        <Text style={styles.headerTexto}>{config.icono} {config.titulo}</Text>
        <Text style={styles.headerSub}>Resultados del simulacro</Text>
      </LinearGradient>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>

        <LinearGradient colors={colorCirculo} style={styles.circulo}>
          <Text style={styles.porcentajeGrande}>{porcentaje}%</Text>
          <Text style={styles.nivelTexto}>{nivelTexto}</Text>
        </LinearGradient>

        <Text style={styles.resumen}>
          {correctas.length} correctas · {incorrectas.length} incorrectas · {banco.length} total
        </Text>

        {tiempoSegundos > 0 && (
          <View style={styles.tiempoCard}>
            <Text style={styles.tiempoIcono}>⏱️</Text>
            <Text style={styles.tiempoTexto}>Tiempo: {formatearTiempo(tiempoSegundos)}</Text>
          </View>
        )}

        <View style={styles.materiaCard}>
          <Text style={styles.materiaTitulo}>📊 Resultado por materia</Text>

          <View style={styles.materiaFila}>
            <Text style={styles.materiaIcono}>{config.icono}</Text>
            <View style={styles.materiaInfo}>
              <Text style={styles.materiaNombre}>{config.titulo}</Text>
              <View style={styles.barraFondo}>
                <View style={[styles.barraRelleno, { width: `${porcentaje}%`, backgroundColor: config.barra }]} />
              </View>
            </View>
            <Text style={[styles.materiaPorcentaje, { color: config.barra }]}>{porcentaje}%</Text>
          </View>

          {OTRAS.map(([key, cfg]) => (
            <View key={key} style={[styles.materiaFila, styles.materiaDeshabilitada]}>
              <Text style={styles.materiaIcono}>{cfg.icono}</Text>
              <View style={styles.materiaInfo}>
                <Text style={[styles.materiaNombre, { color: "#AAA" }]}>{cfg.titulo}</Text>
                <Text style={styles.proximamente}>Practica para ver tu resultado</Text>
              </View>
            </View>
          ))}
        </View>

        {incorrectas.length > 0 && (
          <TouchableOpacity
            style={styles.btnIncorrectas}
            onPress={() => navigation.navigate("PreguntasIncorrectas", { respuestas, incorrectas, materia, banco })}
          >
            <Text style={styles.btnIncorrectasTexto}>❌ Ver preguntas incorrectas ({incorrectas.length})</Text>
          </TouchableOpacity>
        )}

        {incorrectas.length === 0 && (
          <View style={styles.perfectoCard}>
            <Text style={styles.perfectoTexto}>🎉 ¡Respondiste todo correctamente!</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.btnRecomendaciones, { backgroundColor: config.barra }]}
          onPress={() => navigation.navigate("Recomendaciones", { porcentaje, respuestas, materia })}
        >
          <Text style={styles.btnTexto}>📋 Ver recomendaciones</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnVolver}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.btnTexto}>🏠 Volver al inicio</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#F5F6FA", ...(Platform.OS === "web" ? { height: "100vh", overflow: "hidden" } : {}) },
  headerBanner: { paddingTop: 50, paddingBottom: 18, paddingHorizontal: 24 },
  headerTexto: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  headerSub: { color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 2 },
  scroll: { flex: 1 },
  container: { alignItems: "center", padding: 20, paddingBottom: 40 },
  circulo: { width: 180, height: 180, borderRadius: 90, alignItems: "center", justifyContent: "center", marginTop: 20, marginBottom: 14, elevation: 8 },
  porcentajeGrande: { fontSize: 48, color: "#fff", fontWeight: "bold" },
  nivelTexto: { color: "#fff", fontSize: 15, fontWeight: "600" },
  resumen: { fontSize: 14, color: "#666", marginBottom: 10 },
  tiempoCard: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#fff", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginBottom: 16, elevation: 2 },
  tiempoIcono: { fontSize: 18 },
  tiempoTexto: { fontSize: 14, color: "#555", fontWeight: "600" },
  materiaCard: { backgroundColor: "#fff", borderRadius: 16, padding: 18, width: "100%", elevation: 4, marginBottom: 16 },
  materiaTitulo: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 14 },
  materiaFila: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  materiaDeshabilitada: { opacity: 0.4 },
  materiaIcono: { fontSize: 22 },
  materiaInfo: { flex: 1 },
  materiaNombre: { fontSize: 14, fontWeight: "600", color: "#333" },
  barraFondo: { height: 8, backgroundColor: "#EEE", borderRadius: 4, marginTop: 5, overflow: "hidden" },
  barraRelleno: { height: 8, borderRadius: 4 },
  materiaPorcentaje: { fontSize: 14, fontWeight: "bold", width: 40, textAlign: "right" },
  proximamente: { fontSize: 11, color: "#AAA", marginTop: 2 },
  btnIncorrectas: { backgroundColor: "#FFF0F0", borderWidth: 2, borderColor: "#F44336", padding: 15, borderRadius: 12, width: "100%", alignItems: "center", marginBottom: 12 },
  btnIncorrectasTexto: { color: "#F44336", fontWeight: "bold", fontSize: 15 },
  perfectoCard: { backgroundColor: "#F0FFF4", borderRadius: 12, padding: 15, width: "100%", alignItems: "center", marginBottom: 12, borderWidth: 2, borderColor: "#4CAF50" },
  perfectoTexto: { color: "#4CAF50", fontWeight: "bold", fontSize: 15 },
  btnRecomendaciones: { padding: 15, borderRadius: 12, width: "100%", alignItems: "center", marginBottom: 12 },
  btnVolver: { backgroundColor: "#A78BFA", padding: 15, borderRadius: 12, width: "100%", alignItems: "center" },
  btnTexto: { color: "#fff", fontWeight: "bold", fontSize: 15 }
});