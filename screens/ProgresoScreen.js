import React, { useEffect, useState, useContext, useRef } from "react";
import {
  View, Text, StyleSheet, ScrollView, ActivityIndicator,
  Platform, TouchableOpacity, Animated, Dimensions
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { AuthContext } from "../context/AuthContext";
import { AccessibilityContext } from "../context/AccessibilityContext";
import BottomNav from "../components/BottomNav";

const { width } = Dimensions.get("window");

// Las dos primeras materias están activas; las dos últimas se muestran
// pero deshabilitadas con la etiqueta "Próximamente".
const MATERIAS = [
  { key: "sociales",     nombre: "Ciencias Sociales", icono: "🌎", color: "#7B61FF", gradiente: ["#7B61FF", "#A78BFA"] },
  { key: "ingles",       nombre: "Inglés",             icono: "🌐", color: "#0EA5E9", gradiente: ["#0EA5E9", "#38BDF8"] },
  { key: "matematicas",  nombre: "Matemáticas",        icono: "🔢", color: "#F59E0B", gradiente: ["#F59E0B", "#FCD34D"], proximamente: true },
  { key: "lectura",      nombre: "Lectura Crítica",    icono: "📖", color: "#10B981", gradiente: ["#10B981", "#6EE7B7"], proximamente: true },
];

// Igual que en HistorialScreen: retorna null si el tiempo es 0 para no mostrar el campo.
const formatearTiempo = (s) => {
  if (!s || s === 0) return null;
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m === 0 ? `${sec}s` : `${m}m ${sec}s`;
};

// Barra de progreso que anima desde 0% hasta el porcentaje dado.
// El delay permite escalonar la animación si hay varias barras en pantalla.
function BarraAnimada({ porcentaje, color, delay = 0 }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: porcentaje,
      duration: 900,
      delay,
      useNativeDriver: false,
    }).start();
  }, [porcentaje]);

  const barraWidth = anim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
    extrapolate: "clamp",
  });

  return (
    <View style={barStyles.fondo}>
      <Animated.View style={[barStyles.relleno, { width: barraWidth, backgroundColor: color }]} />
      <Text style={[barStyles.label, { color }]}>{porcentaje}%</Text>
    </View>
  );
}

const barStyles = StyleSheet.create({
  fondo: { height: 14, backgroundColor: "#EEE", borderRadius: 7, overflow: "visible", marginVertical: 8, position: "relative" },
  relleno: { height: 14, borderRadius: 7, position: "absolute", left: 0, top: 0 },
  label: { position: "absolute", right: 0, top: -18, fontSize: 12, fontWeight: "bold" },
});

// Tarjeta de materia con expansión animada. Cuando está activa muestra
// el detalle completo: barra animada, stats en círculos y mini historial.
function TarjetaMateria({ mat, datos, activa, onPress, hablar, vozActiva }) {
  const alturaAnim = useRef(new Animated.Value(activa ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(alturaAnim, {
      toValue: activa ? 1 : 0,
      duration: 350,
      useNativeDriver: false,
    }).start();
  }, [activa]);

  const tieneData = !!datos && !mat.proximamente;
  const porcentaje = tieneData ? datos.promedio : 0;
  const colorNivel = porcentaje >= 70 ? "#4CAF50" : porcentaje >= 40 ? "#FF9800" : "#F44336";
  const nivelTexto = porcentaje >= 70 ? "Excelente" : porcentaje >= 40 ? "En progreso" : "Por mejorar";

  // Lee el resumen de la materia al tocar, si la voz está activa.
  const handlePress = () => {
    if (vozActiva) {
      if (tieneData) {
        hablar(
          `${mat.nombre}. Promedio: ${porcentaje} por ciento. ` +
          `Mejor intento: ${datos.mejor} por ciento. ` +
          `${datos.intentos} intento${datos.intentos !== 1 ? "s" : ""} realizados. ` +
          `Nivel: ${nivelTexto}.`
        );
      } else if (!mat.proximamente) {
        hablar(`${mat.nombre}. Aún no tienes simulacros en esta materia.`);
      }
    }
    onPress();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.85}
      disabled={mat.proximamente}
    >
      <Animated.View style={[
        styles.tarjeta,
        activa && styles.tarjetaActiva,
        mat.proximamente && styles.tarjetaDisabled,
        { borderLeftColor: mat.color, borderLeftWidth: 4 }
      ]}>

        <View style={styles.tarjetaHeader}>
          <View style={styles.tarjetaIzq}>
            <Text style={styles.tarjetaIcono}>{mat.icono}</Text>
            <View>
              <Text style={[styles.tarjetaNombre, activa && { color: mat.color }]}>{mat.nombre}</Text>
              {mat.proximamente
                ? <Text style={styles.prox}>Próximamente</Text>
                : tieneData
                ? <Text style={styles.intentosTexto}>{datos.intentos} intento{datos.intentos !== 1 ? "s" : ""}</Text>
                : <Text style={styles.sinDatos}>Sin simulacros aún</Text>
              }
            </View>
          </View>

          {tieneData && (
            <View style={[styles.badgePeq, { backgroundColor: colorNivel }]}>
              <Text style={styles.badgePeqTexto}>{porcentaje}%</Text>
            </View>
          )}
          {tieneData && (
            <Text style={styles.flechita}>{activa ? "▲" : "▼"}</Text>
          )}
        </View>

        {/* Barra compacta visible cuando la tarjeta está cerrada */}
        {tieneData && !activa && (
          <View style={styles.barraMini}>
            <View style={[styles.barraMiniRelleno, { width: `${porcentaje}%`, backgroundColor: mat.color }]} />
          </View>
        )}

        {activa && tieneData && (
          <View style={styles.detalle}>
            <View style={{ marginTop: 20, marginBottom: 8 }}>
              <BarraAnimada porcentaje={porcentaje} color={mat.color} delay={100} />
            </View>

            <View style={[styles.nivelBadge, { backgroundColor: colorNivel + "20", borderColor: colorNivel }]}>
              <Text style={[styles.nivelTexto, { color: colorNivel }]}>{nivelTexto}</Text>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <LinearGradient colors={mat.gradiente} style={styles.statCirculo}>
                  <Text style={styles.statCirculoVal}>{datos.promedio}%</Text>
                </LinearGradient>
                <Text style={styles.statLabel}>Promedio</Text>
              </View>
              <View style={styles.statBox}>
                <LinearGradient colors={["#4CAF50", "#81C784"]} style={styles.statCirculo}>
                  <Text style={styles.statCirculoVal}>{datos.mejor}%</Text>
                </LinearGradient>
                <Text style={styles.statLabel}>Mejor</Text>
              </View>
              <View style={styles.statBox}>
                <LinearGradient colors={["#FF9800", "#FFB74D"]} style={styles.statCirculo}>
                  <Text style={styles.statCirculoVal}>{datos.intentos}</Text>
                </LinearGradient>
                <Text style={styles.statLabel}>Intentos</Text>
              </View>
              {datos.tiempoPromedio && (
                <View style={styles.statBox}>
                  <LinearGradient colors={["#64748B", "#94A3B8"]} style={styles.statCirculo}>
                    <Text style={[styles.statCirculoVal, { fontSize: 11 }]}>
                      {formatearTiempo(datos.tiempoPromedio)}
                    </Text>
                  </LinearGradient>
                  <Text style={styles.statLabel}>T. prom.</Text>
                </View>
              )}
            </View>

            {/* Mini historial: máximo 5 intentos, del más reciente al más antiguo */}
            {datos.historial && datos.historial.length > 1 && (
              <View style={styles.historialMini}>
                <Text style={styles.historialTitulo}>Últimos intentos</Text>
                {datos.historial.slice(0, 5).map((p, i) => (
                  <View key={i} style={styles.historialFila}>
                    <Text style={styles.historialNum}>#{datos.historial.length - i}</Text>
                    <View style={styles.historialBarraFondo}>
                      <View style={[styles.historialBarraRelleno, {
                        width: `${p}%`,
                        backgroundColor: p >= 70 ? "#4CAF50" : p >= 40 ? "#FF9800" : "#F44336"
                      }]} />
                    </View>
                    <Text style={styles.historialPct}>{p}%</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function ProgresoScreen({ navigation }) {
  const { usuario } = useContext(AuthContext);
  const { vozActiva, hablar } = useContext(AccessibilityContext);
  const [progreso, setProgreso] = useState({});
  const [racha, setRacha] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [activa, setActiva] = useState(null); // key de la tarjeta expandida

  // Carga la racha del perfil y calcula las stats por materia desde los resultados.
  // El historial se guarda en orden cronológico inverso (más reciente primero).
  useEffect(() => {
    const cargar = async () => {
      if (!usuario) return;
      try {
        const perfilSnap = await getDoc(doc(db, "usuarios", usuario.uid, "perfil", "datos"));
        if (perfilSnap.exists()) setRacha(perfilSnap.data().racha || 0);

        const ref = collection(db, "usuarios", usuario.uid, "resultados");
        const snap = await getDocs(ref);
        const datos = snap.docs.map(d => d.data());

        // Agrupa los resultados por materia antes de calcular stats
        const agrupado = {};
        datos.forEach(item => {
          if (!agrupado[item.materia]) agrupado[item.materia] = [];
          agrupado[item.materia].push(item);
        });

        const stats = {};
        Object.keys(agrupado).forEach(mat => {
          const lista = agrupado[mat];
          const pcts = lista.map(i => i.porcentaje);
          const tiempos = lista.map(i => i.tiempoSegundos).filter(t => t > 0);
          const historial = [...pcts].reverse();
          stats[mat] = {
            promedio: Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length),
            mejor: Math.max(...pcts),
            intentos: lista.length,
            tiempoPromedio: tiempos.length > 0
              ? Math.round(tiempos.reduce((a, b) => a + b, 0) / tiempos.length)
              : null,
            historial
          };
        });

        setProgreso(stats);
      } catch (e) {
        console.log("Error:", e);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  // Descripción por voz una vez que terminan de cargar los datos.
  // Cambia el mensaje según si el usuario ya tiene simulacros o no.
  useEffect(() => {
    if (!cargando && vozActiva) {
      const totalIntentos = Object.values(progreso).reduce((a, b) => a + b.intentos, 0);
      if (totalIntentos === 0) {
        hablar("Pantalla de progreso. Aún no tienes simulacros realizados. Completa uno para ver tu progreso aquí.");
      } else {
        hablar(
          "Pantalla de progreso. Aquí puedes ver tu avance por materia. " +
          "Tienes cuatro tarjetas: Ciencias Sociales, Inglés, Matemáticas y Lectura Crítica. " +
          "Toca cualquier tarjeta para escuchar tu progreso detallado en esa materia."
        );
      }
    }
  }, [cargando]);

  const totalIntentos = Object.values(progreso).reduce((a, b) => a + b.intentos, 0);
  const materiasPracticadas = Object.keys(progreso).length;
  const promedioGeneral = materiasPracticadas > 0
    ? Math.round(Object.values(progreso).reduce((a, b) => a + b.promedio, 0) / materiasPracticadas)
    : null;

  // Alterna la tarjeta expandida; tocar la activa la cierra.
  const handleTarjeta = (key) => {
    setActiva(prev => prev === key ? null : key);
  };

  return (
    <View style={styles.wrapper}>

      <LinearGradient colors={["#7B61FF", "#A78BFA"]} style={styles.header}>
        <Text style={styles.titulo}>📈 Mi Progreso</Text>

        <View style={styles.headerStats}>
          <View style={styles.circuloContainer}>
            <View style={styles.circulo}>
              <Text style={styles.circuloVal}>
                {promedioGeneral !== null ? `${promedioGeneral}%` : "—"}
              </Text>
              <Text style={styles.circuloLabel}>General</Text>
            </View>
          </View>

          <View style={styles.lateralStats}>
            <View style={styles.statLateral}>
              <Text style={styles.statLateralVal}>{totalIntentos}</Text>
              <Text style={styles.statLateralLabel}>Simulacros</Text>
            </View>
            <View style={styles.statLateral}>
              <Text style={styles.statLateralVal}>🔥 {racha}</Text>
              <Text style={styles.statLateralLabel}>Racha</Text>
            </View>
            <View style={styles.statLateral}>
              <Text style={styles.statLateralVal}>{materiasPracticadas}/4</Text>
              <Text style={styles.statLateralLabel}>Materias</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {cargando && <ActivityIndicator size="large" color="#7B61FF" style={{ marginTop: 40 }} />}

        {!cargando && totalIntentos === 0 && (
          <View style={styles.vacio}>
            <Text style={styles.vacioIcono}>🎯</Text>
            <Text style={styles.vacioTexto}>Aún no tienes resultados</Text>
            <Text style={styles.vacioSub}>Completa un simulacro para ver tu progreso</Text>
            <TouchableOpacity style={styles.btnEmpezar} onPress={() => navigation.navigate("Simulacro")}>
              <Text style={styles.btnEmpezarTexto}>¡Empieza ahora!</Text>
            </TouchableOpacity>
          </View>
        )}

        {!cargando && MATERIAS.map((mat) => (
          <TarjetaMateria
            key={mat.key}
            mat={mat}
            datos={progreso[mat.key] || null}
            activa={activa === mat.key}
            onPress={() => handleTarjeta(mat.key)}
            hablar={hablar}
            vozActiva={vozActiva}
          />
        ))}

        <View style={{ height: 20 }} />
      </ScrollView>

      <BottomNav navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#F0EDFF", ...(Platform.OS === "web" ? { height: "100vh", overflow: "hidden" } : {}) },
  header: { paddingTop: 50, paddingBottom: 24, paddingHorizontal: 20 },
  titulo: { color: "#fff", fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  headerStats: { flexDirection: "row", alignItems: "center", gap: 16 },
  circuloContainer: { alignItems: "center" },
  circulo: { width: 90, height: 90, borderRadius: 45, backgroundColor: "rgba(255,255,255,0.25)", borderWidth: 3, borderColor: "rgba(255,255,255,0.6)", alignItems: "center", justifyContent: "center" },
  circuloVal: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  circuloLabel: { color: "rgba(255,255,255,0.8)", fontSize: 11, marginTop: 2 },
  lateralStats: { flex: 1, gap: 10 },
  statLateral: { backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 10, padding: 10, alignItems: "center" },
  statLateralVal: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  statLateralLabel: { color: "rgba(255,255,255,0.8)", fontSize: 10, marginTop: 2 },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 20 },
  vacio: { alignItems: "center", marginTop: 60, gap: 8 },
  vacioIcono: { fontSize: 50 },
  vacioTexto: { fontSize: 16, color: "#555", fontWeight: "bold" },
  vacioSub: { fontSize: 13, color: "#999", textAlign: "center" },
  btnEmpezar: { backgroundColor: "#7B61FF", padding: 14, borderRadius: 12, marginTop: 12 },
  btnEmpezarTexto: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  tarjeta: { backgroundColor: "#fff", borderRadius: 18, padding: 16, marginBottom: 12, elevation: 3 },
  tarjetaActiva: { elevation: 8 },
  tarjetaDisabled: { opacity: 0.5 },
  tarjetaHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  tarjetaIzq: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  tarjetaIcono: { fontSize: 30 },
  tarjetaNombre: { fontSize: 15, fontWeight: "bold", color: "#333" },
  prox: { fontSize: 11, color: "#AAA", marginTop: 2 },
  intentosTexto: { fontSize: 11, color: "#888", marginTop: 2 },
  sinDatos: { fontSize: 11, color: "#BBB", marginTop: 2 },
  badgePeq: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16, marginRight: 8 },
  badgePeqTexto: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  flechita: { fontSize: 12, color: "#AAA" },
  barraMini: { height: 6, backgroundColor: "#EEE", borderRadius: 3, marginTop: 10, overflow: "hidden" },
  barraMiniRelleno: { height: 6, borderRadius: 3 },
  detalle: { marginTop: 8 },
  nivelBadge: { alignSelf: "center", paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, borderWidth: 1, marginBottom: 16 },
  nivelTexto: { fontWeight: "bold", fontSize: 13 },
  statsGrid: { flexDirection: "row", justifyContent: "space-around", marginBottom: 16, flexWrap: "wrap", gap: 8 },
  statBox: { alignItems: "center", gap: 6 },
  statCirculo: { width: 64, height: 64, borderRadius: 32, alignItems: "center", justifyContent: "center" },
  statCirculoVal: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  statLabel: { fontSize: 11, color: "#666", textAlign: "center" },
  historialMini: { backgroundColor: "#F8F5FF", borderRadius: 12, padding: 12, gap: 8 },
  historialTitulo: { fontSize: 12, fontWeight: "bold", color: "#555", marginBottom: 4 },
  historialFila: { flexDirection: "row", alignItems: "center", gap: 8 },
  historialNum: { fontSize: 11, color: "#999", width: 24 },
  historialBarraFondo: { flex: 1, height: 8, backgroundColor: "#EEE", borderRadius: 4, overflow: "hidden" },
  historialBarraRelleno: { height: 8, borderRadius: 4 },
  historialPct: { fontSize: 11, fontWeight: "bold", color: "#555", width: 30, textAlign: "right" },
});