import React, { useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform
} from "react-native";
import { preguntas as preguntasSociales } from "../data/preguntas";
import { preguntasIngles } from "../data/preguntasIngles";
import { LinearGradient } from "expo-linear-gradient";
import { AccessibilityContext } from "../context/AccessibilityContext";

export default function ResultScreen({ route, navigation }) {

  const respuestas = route?.params?.respuestas ?? [];
  const materia = route?.params?.materia ?? "sociales";

  // Elegir banco según materia
  const banco = materia === "ingles" ? preguntasIngles : preguntasSociales;
  const tituloMateria = materia === "ingles" ? "Inglés" : "Ciencias Sociales";
  const iconoMateria = materia === "ingles" ? "🌐" : "🌎";
  const colorHeader = materia === "ingles" ? ["#0EA5E9", "#38BDF8"] : ["#7B61FF", "#A78BFA"];
  const colorBarra = materia === "ingles" ? "#0EA5E9" : "#7B61FF";

  const context = useContext(AccessibilityContext) || {};
  const hablar = context.hablar || (() => {});
  const vozActiva = context.vozActiva || false;

  const correctas = respuestas.filter(r => {
    const p = banco.find(p => p.id === r.id);
    return p?.correcta === r.respuesta;
  });

  const incorrectas = respuestas.filter(r => {
    const p = banco.find(p => p.id === r.id);
    return p?.correcta !== r.respuesta;
  });

  const porcentaje = respuestas.length > 0
    ? Math.round((correctas.length / banco.length) * 100)
    : 0;

  const colorCirculo = porcentaje >= 70
    ? ["#4CAF50", "#81C784"]
    : porcentaje >= 40
    ? ["#FF9800", "#FFB74D"]
    : ["#F44336", "#E57373"];

  const nivelTexto = porcentaje >= 70
    ? "¡Excelente!"
    : porcentaje >= 40
    ? "Puedes mejorar"
    : "Sigue practicando";

  useEffect(() => {
    if (vozActiva) {
      hablar(
        `Pantalla de resultados. Materia: ${tituloMateria}. ` +
        `Tu puntaje es ${porcentaje} por ciento. ` +
        `Respondiste ${correctas.length} preguntas correctas y ${incorrectas.length} incorrectas de ${banco.length} en total. ` +
        `Nivel: ${nivelTexto}. ` +
        `Tienes tres opciones: ` +
        `Primera opción, parte superior: Ver preguntas incorrectas${incorrectas.length > 0 ? ", hay " + incorrectas.length + " preguntas fallidas" : ""}. ` +
        `Segunda opción, parte central: Ver recomendaciones según tu puntaje. ` +
        `Tercera opción, parte inferior: Volver al inicio.`
      );
    }
  }, []);

  return (
    <View style={styles.wrapper}>

      {/* HEADER con color según materia */}
      <LinearGradient colors={colorHeader} style={styles.headerBanner}>
        <Text style={styles.headerBannerTexto}>{iconoMateria} {tituloMateria}</Text>
        <Text style={styles.headerBannerSub}>Resultados del simulacro</Text>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={true}
      >

        {/* CÍRCULO DE PORCENTAJE */}
        <LinearGradient colors={colorCirculo} style={styles.circuloGrande}>
          <Text style={styles.porcentajeGrande}>{porcentaje}%</Text>
          <Text style={styles.nivelTexto}>{nivelTexto}</Text>
        </LinearGradient>

        {/* RESUMEN */}
        <Text style={styles.resumen}>
          {correctas.length} correctas · {incorrectas.length} incorrectas · {banco.length} total
        </Text>

        {/* TARJETA DE MATERIA */}
        <View style={styles.materiaCard}>
          <Text style={styles.materiaTitulo}>📊 Resultado por materia</Text>

          {/* Materia activa */}
          <View style={styles.materiaFila}>
            <Text style={styles.materiaIcono}>{iconoMateria}</Text>
            <View style={styles.materiaInfo}>
              <Text style={styles.materiaNombre}>{tituloMateria}</Text>
              <View style={styles.barraFondo}>
                <View style={[styles.barraRelleno, {
                  width: `${porcentaje}%`,
                  backgroundColor: colorBarra
                }]} />
              </View>
            </View>
            <Text style={[styles.materiaPorcentaje, { color: colorBarra }]}>
              {porcentaje}%
            </Text>
          </View>

          {/* Otras materias deshabilitadas */}
          {materia !== "sociales" && (
            <View style={[styles.materiaFila, styles.materiaDeshabilitada]}>
              <Text style={styles.materiaIcono}>🌎</Text>
              <View style={styles.materiaInfo}>
                <Text style={[styles.materiaNombre, { color: "#AAA" }]}>Ciencias Sociales</Text>
                <Text style={styles.proximamente}>Practica para ver tu resultado</Text>
              </View>
            </View>
          )}
          {materia !== "ingles" && (
            <View style={[styles.materiaFila, styles.materiaDeshabilitada]}>
              <Text style={styles.materiaIcono}>🌐</Text>
              <View style={styles.materiaInfo}>
                <Text style={[styles.materiaNombre, { color: "#AAA" }]}>Inglés</Text>
                <Text style={styles.proximamente}>Practica para ver tu resultado</Text>
              </View>
            </View>
          )}
          <View style={[styles.materiaFila, styles.materiaDeshabilitada]}>
            <Text style={styles.materiaIcono}>🔢</Text>
            <View style={styles.materiaInfo}>
              <Text style={[styles.materiaNombre, { color: "#AAA" }]}>Matemáticas</Text>
              <Text style={styles.proximamente}>Próximamente</Text>
            </View>
          </View>
          <View style={[styles.materiaFila, styles.materiaDeshabilitada]}>
            <Text style={styles.materiaIcono}>📖</Text>
            <View style={styles.materiaInfo}>
              <Text style={[styles.materiaNombre, { color: "#AAA" }]}>Lectura Crítica</Text>
              <Text style={styles.proximamente}>Próximamente</Text>
            </View>
          </View>
        </View>

        {/* BOTÓN VER PREGUNTAS INCORRECTAS */}
        {incorrectas.length > 0 && (
          <TouchableOpacity
            style={styles.btnIncorrectas}
            onPress={() => {
              if (vozActiva) hablar(
                `Primera opción, parte superior. Ver preguntas incorrectas. ` +
                `Fallaste ${incorrectas.length} pregunta${incorrectas.length > 1 ? "s" : ""}.`
              );
              navigation.navigate("PreguntasIncorrectas", {
                respuestas,
                incorrectas,
                materia
              });
            }}
            accessibilityLabel={`Primera opción, parte superior. Ver ${incorrectas.length} preguntas incorrectas`}
          >
            <Text style={styles.btnIncorrectasTexto}>
              ❌ Ver preguntas incorrectas ({incorrectas.length})
            </Text>
          </TouchableOpacity>
        )}

        {incorrectas.length === 0 && (
          <View style={styles.perfectoCard}>
            <Text style={styles.perfectoTexto}>🎉 ¡Respondiste todo correctamente!</Text>
          </View>
        )}

        {/* BOTÓN RECOMENDACIONES */}
        <TouchableOpacity
          style={[styles.btnRecomendaciones, { backgroundColor: colorBarra }]}
          onPress={() => {
            if (vozActiva) hablar("Segunda opción, parte central. Abriendo recomendaciones según tu puntaje.");
            navigation.navigate("Recomendaciones", { porcentaje, respuestas, materia });
          }}
          accessibilityLabel="Segunda opción, parte central. Ver recomendaciones"
        >
          <Text style={styles.btnTexto}>📋 Ver recomendaciones</Text>
        </TouchableOpacity>

        {/* BOTÓN VOLVER */}
        <TouchableOpacity
          style={styles.btnVolver}
          onPress={() => {
            if (vozActiva) hablar("Tercera opción, parte inferior. Volviendo al inicio.");
            navigation.navigate("Home");
          }}
          accessibilityLabel="Tercera opción, parte inferior. Volver al inicio"
        >
          <Text style={styles.btnTexto}>🏠 Volver al inicio</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#F5F6FA",
    ...(Platform.OS === "web" ? { height: "100vh", overflow: "hidden" } : {})
  },
  headerBanner: {
    paddingTop: 50,
    paddingBottom: 18,
    paddingHorizontal: 24,
    flexShrink: 0
  },
  headerBannerTexto: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold"
  },
  headerBannerSub: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    marginTop: 2
  },
  scroll: { flex: 1 },
  container: {
    alignItems: "center",
    padding: 20,
    paddingBottom: 40,
    flexGrow: 1
  },
  circuloGrande: {
    width: 180,
    height: 180,
    borderRadius: 90,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 14,
    elevation: 8
  },
  porcentajeGrande: { fontSize: 48, color: "#fff", fontWeight: "bold" },
  nivelTexto: { color: "#fff", fontSize: 15, fontWeight: "600" },
  resumen: { fontSize: 14, color: "#666", marginBottom: 20 },
  materiaCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    width: "100%",
    elevation: 4,
    marginBottom: 16
  },
  materiaTitulo: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 14 },
  materiaFila: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  materiaDeshabilitada: { opacity: 0.4 },
  materiaIcono: { fontSize: 22 },
  materiaInfo: { flex: 1 },
  materiaNombre: { fontSize: 14, fontWeight: "600", color: "#333" },
  barraFondo: {
    height: 8,
    backgroundColor: "#EEE",
    borderRadius: 4,
    marginTop: 5,
    overflow: "hidden"
  },
  barraRelleno: { height: 8, borderRadius: 4 },
  materiaPorcentaje: { fontSize: 14, fontWeight: "bold", width: 40, textAlign: "right" },
  proximamente: { fontSize: 11, color: "#AAA", marginTop: 2 },
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
  btnIncorrectasTexto: { color: "#F44336", fontWeight: "bold", fontSize: 15 },
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
  perfectoTexto: { color: "#4CAF50", fontWeight: "bold", fontSize: 15 },
  btnRecomendaciones: {
    padding: 15,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginBottom: 12
  },
  btnVolver: {
    backgroundColor: "#A78BFA",
    padding: 15,
    borderRadius: 12,
    width: "100%",
    alignItems: "center"
  },
  btnTexto: { color: "#fff", fontWeight: "bold", fontSize: 15 }
});