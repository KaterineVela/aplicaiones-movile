import React, { useEffect, useState, useContext } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Platform
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { AuthContext } from "../context/AuthContext";

const formatearTiempo = (segundos) => {
  if (!segundos || segundos === 0) return null;
  const m = Math.floor(segundos / 60);
  const s = segundos % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
};

export default function HistorialScreen({ navigation }) {
  const { usuario } = useContext(AuthContext);
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [seleccionado, setSeleccionado] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      if (!usuario) return;
      try {
        const ref = collection(db, "usuarios", usuario.uid, "resultados");
        const q = query(ref, orderBy("fecha", "desc"));
        const snap = await getDocs(q);
        const datos = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setHistorial(datos);
      } catch (e) {
        console.log("Error cargando historial:", e);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  const formatearFecha = (timestamp) => {
    if (!timestamp) return "Sin fecha";
    const fecha = timestamp.toDate();
    return fecha.toLocaleDateString("es-CO", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  };

  const colorPorcentaje = (p) => p >= 70 ? "#4CAF50" : p >= 40 ? "#FF9800" : "#F44336";
  const iconoMateria = (m) => m === "ingles" ? "🌐" : "🌎";
  const nombreMateria = (m) => m === "ingles" ? "Inglés" : "Ciencias Sociales";

  return (
    <View style={styles.wrapper}>
      <LinearGradient colors={["#7B61FF", "#A78BFA"]} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.btnBack}>
          <Text style={styles.btnBackTexto}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>📊 Historial de Resultados</Text>
        <Text style={styles.sub}>{historial.length} simulacro{historial.length !== 1 ? "s" : ""} realizados</Text>
      </LinearGradient>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {cargando && <ActivityIndicator size="large" color="#7B61FF" style={{ marginTop: 40 }} />}

        {!cargando && historial.length === 0 && (
          <View style={styles.vacio}>
            <Text style={styles.vacioIcono}>📭</Text>
            <Text style={styles.vacioTexto}>Aún no has hecho ningún simulacro</Text>
            <TouchableOpacity style={styles.btnEmpezar} onPress={() => navigation.navigate("Simulacro")}>
              <Text style={styles.btnEmpezarTexto}>¡Empieza ahora!</Text>
            </TouchableOpacity>
          </View>
        )}

        {!cargando && historial.map((item) => (
          <View key={item.id}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => setSeleccionado(seleccionado === item.id ? null : item.id)}
            >
              <View style={styles.cardTop}>
                <View style={styles.cardIzq}>
                  <Text style={styles.cardIcono}>{iconoMateria(item.materia)}</Text>
                  <View>
                    <Text style={styles.cardMateria}>{nombreMateria(item.materia)}</Text>
                    <Text style={styles.cardFecha}>{formatearFecha(item.fecha)}</Text>
                  </View>
                </View>
                <View style={[styles.badge, { backgroundColor: colorPorcentaje(item.porcentaje) }]}>
                  <Text style={styles.badgeTexto}>{item.porcentaje}%</Text>
                </View>
              </View>

              <View style={styles.resumenFila}>
                <Text style={styles.resumenTexto}>✅ {item.correctas} correctas</Text>
                <Text style={styles.resumenTexto}>❌ {item.incorrectas} incorrectas</Text>
                {formatearTiempo(item.tiempoSegundos) && (
                  <Text style={styles.resumenTexto}>⏱️ {formatearTiempo(item.tiempoSegundos)}</Text>
                )}
              </View>

              <View style={styles.barraFondo}>
                <View style={[styles.barraRelleno, {
                  width: `${item.porcentaje}%`,
                  backgroundColor: colorPorcentaje(item.porcentaje)
                }]} />
              </View>

              <Text style={styles.verDetalle}>
                {seleccionado === item.id ? "▲ Ocultar preguntas fallidas" : "▼ Ver preguntas fallidas"}
              </Text>
            </TouchableOpacity>

            {seleccionado === item.id && (
              <View style={styles.detalleContainer}>
                {(!item.incorrectasDetalle || item.incorrectasDetalle.length === 0) ? (
                  <Text style={styles.perfectoTexto}>🎉 ¡Respondiste todo correctamente!</Text>
                ) : (
                  item.incorrectasDetalle.map((p, i) => (
                    <View key={i} style={styles.preguntaCard}>
                      <Text style={styles.preguntaNumero}>Pregunta {i + 1}</Text>
                      <Text style={styles.preguntaTexto}>{p.pregunta}</Text>
                      <View style={styles.respuestaFila}>
                        <Text style={styles.tuRespuesta}>❌ Tu respuesta: {p.tuRespuesta}</Text>
                        <Text style={styles.correctaResp}>✅ Correcta: {p.correcta}</Text>
                      </View>
                    </View>
                  ))
                )}
              </View>
            )}
          </View>
        ))}

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#F5F6FA", ...(Platform.OS === "web" ? { height: "100vh", overflow: "hidden" } : {}) },
  header: { paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20 },
  btnBack: { marginBottom: 8 },
  btnBackTexto: { color: "rgba(255,255,255,0.85)", fontSize: 14 },
  titulo: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  sub: { color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 2 },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  vacio: { alignItems: "center", marginTop: 60 },
  vacioIcono: { fontSize: 50, marginBottom: 12 },
  vacioTexto: { fontSize: 16, color: "#888", marginBottom: 20 },
  btnEmpezar: { backgroundColor: "#7B61FF", padding: 14, borderRadius: 12 },
  btnEmpezarTexto: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 10, elevation: 3 },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  cardIzq: { flexDirection: "row", alignItems: "center", gap: 10 },
  cardIcono: { fontSize: 28 },
  cardMateria: { fontSize: 15, fontWeight: "bold", color: "#333" },
  cardFecha: { fontSize: 11, color: "#999", marginTop: 2 },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  badgeTexto: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  resumenFila: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8, flexWrap: "wrap", gap: 4 },
  resumenTexto: { fontSize: 12, color: "#666" },
  barraFondo: { height: 8, backgroundColor: "#EEE", borderRadius: 4, overflow: "hidden", marginBottom: 8 },
  barraRelleno: { height: 8, borderRadius: 4 },
  verDetalle: { fontSize: 12, color: "#7B61FF", textAlign: "center", marginTop: 4 },
  detalleContainer: { backgroundColor: "#F8F5FF", borderRadius: 12, padding: 12, marginBottom: 10 },
  perfectoTexto: { color: "#4CAF50", fontWeight: "bold", textAlign: "center", padding: 10 },
  preguntaCard: { backgroundColor: "#fff", borderRadius: 10, padding: 12, marginBottom: 8, borderLeftWidth: 3, borderLeftColor: "#F44336" },
  preguntaNumero: { fontSize: 11, fontWeight: "bold", color: "#F44336", marginBottom: 4 },
  preguntaTexto: { fontSize: 13, color: "#333", marginBottom: 8, lineHeight: 18 },
  respuestaFila: { gap: 4 },
  tuRespuesta: { fontSize: 12, color: "#F44336" },
  correctaResp: { fontSize: 12, color: "#4CAF50" }
});