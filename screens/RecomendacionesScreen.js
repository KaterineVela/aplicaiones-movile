import React, { useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AccessibilityContext } from "../context/AccessibilityContext";
import BottomNav from "../components/BottomNav";
import { preguntas as preguntasSociales } from "../data/preguntas";
import { preguntasIngles } from "../data/preguntasIngles";

export default function RecomendacionesScreen({ route, navigation }) {

  const porcentaje = route?.params?.porcentaje ?? 0;
  const respuestas = route?.params?.respuestas ?? [];
  const materia = route?.params?.materia ?? "sociales";

  const banco = materia === "ingles" ? preguntasIngles : preguntasSociales;
  const tituloMateria = materia === "ingles" ? "Inglés" : "Ciencias Sociales";
  const colorAccent = materia === "ingles" ? "#0EA5E9" : "#7B61FF";

  const context = useContext(AccessibilityContext) || {};
  const hablar = context.hablar || (() => {});
  const vozActiva = context.vozActiva || false;
  const toggleVoz = context.toggleVoz || (() => {});

  let nivel = "", intentos = "", mensaje = "", colorNivel = colorAccent;

  if (porcentaje <= 40) {
    nivel = "Nivel bajo";
    intentos = "3 a 5 intentos recomendados";
    mensaje = "Debes reforzar los temas básicos antes de volver a practicar";
    colorNivel = "#F44336";
  } else if (porcentaje <= 70) {
    nivel = "Nivel medio";
    intentos = "2 a 3 intentos recomendados";
    mensaje = "Vas bien, pero puedes mejorar repasando algunos temas";
    colorNivel = "#FF9800";
  } else {
    nivel = "Nivel alto";
    intentos = "1 a 2 intentos recomendados";
    mensaje = "Excelente desempeño. Sigue practicando para mantener el nivel";
    colorNivel = "#4CAF50";
  }

  const incorrectas = respuestas.filter(r => {
    const p = banco.find(p => p.id === r.id);
    return p?.correcta !== r.respuesta;
  });

  useEffect(() => {
    if (vozActiva) {
      hablar(
        `Pantalla de recomendaciones. Materia: ${tituloMateria}. ` +
        `Tu nivel es ${nivel}. ${mensaje}. ${intentos}. ` +
        `Tienes ${incorrectas.length > 0 ? "cuatro" : "tres"} opciones: ` +
        (incorrectas.length > 0
          ? `Primera opción, parte superior: Ver preguntas incorrectas, hay ${incorrectas.length} pregunta${incorrectas.length > 1 ? "s" : ""} fallidas. `
          : "") +
        `${incorrectas.length > 0 ? "Segunda" : "Primera"} opción: Estudiar material de ${tituloMateria}. ` +
        `${incorrectas.length > 0 ? "Tercera" : "Segunda"} opción: Volver a practicar. ` +
        `${incorrectas.length > 0 ? "Cuarta" : "Tercera"} opción, parte inferior: Volver al inicio.`
      );
    }
  }, []);

  const irAEstudiar = () => {
    const pos = incorrectas.length > 0 ? "Segunda opción" : "Primera opción";
    if (vozActiva) hablar(`${pos}. Abriendo material de estudio de ${tituloMateria}.`);
    if (materia === "ingles") {
      navigation.navigate("MaterialIngles");
    } else {
      navigation.navigate("MaterialSociales");
    }
  };

  return (
    <View style={styles.wrapper}>

      <TouchableOpacity
        style={styles.audioGlobal}
        onPress={toggleVoz}
        accessibilityLabel={vozActiva ? "Desactivar voz" : "Activar voz"}
      >
        <Text style={{ color: "#fff" }}>
          {vozActiva ? "🔊 Voz activada" : "🔇 Activar voz"}
        </Text>
      </TouchableOpacity>

      <LinearGradient
        colors={materia === "ingles" ? ["#0EA5E9", "#38BDF8"] : ["#7B61FF", "#A78BFA"]}
        style={styles.header}
      >
        <Text style={styles.title}>📋 Recomendaciones</Text>
        <Text style={styles.headerSub}>
          {tituloMateria} · {porcentaje}% de puntaje
        </Text>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >

        {/* CARD NIVEL */}
        <View style={[styles.nivelCard, { borderLeftColor: colorNivel }]}>
          <Text style={styles.subtitle}>Tu nivel:</Text>
          <Text style={[styles.nivelTexto, { color: colorNivel }]}>{nivel}</Text>
          <Text style={styles.subtitle}>Evaluación:</Text>
          <Text style={styles.texto}>{mensaje}</Text>
          <Text style={styles.subtitle}>Intentos sugeridos:</Text>
          <Text style={styles.texto}>{intentos}</Text>
        </View>

        {/* BOTÓN VER PREGUNTAS INCORRECTAS */}
        {incorrectas.length > 0 && (
          <TouchableOpacity
            style={styles.btnIncorrectas}
            onPress={() => {
              if (vozActiva) hablar(`Primera opción, parte superior. Ver preguntas incorrectas. Fallaste ${incorrectas.length} pregunta${incorrectas.length > 1 ? "s" : ""}.`);
              navigation.navigate("PreguntasIncorrectas", { respuestas, incorrectas, materia });
            }}
            accessibilityLabel={`Primera opción, parte superior. Ver ${incorrectas.length} preguntas incorrectas`}
          >
            <Text style={styles.btnIncorrectasTexto}>
              ❌ Ver preguntas incorrectas ({incorrectas.length})
            </Text>
          </TouchableOpacity>
        )}

        {/* BOTÓN ESTUDIAR */}
        <TouchableOpacity
          style={[styles.btnEstudiar, { backgroundColor: colorAccent }]}
          onPress={irAEstudiar}
          accessibilityLabel={`${incorrectas.length > 0 ? "Segunda" : "Primera"} opción. Estudiar material de ${tituloMateria}`}
        >
          <Text style={styles.btnTexto}>📚 Estudiar material de {tituloMateria}</Text>
        </TouchableOpacity>

        {/* BOTÓN VOLVER A PRACTICAR */}
        <TouchableOpacity
          style={styles.btnPracticar}
          onPress={() => {
            const pos = incorrectas.length > 0 ? "Tercera opción" : "Segunda opción";
            if (vozActiva) hablar(`${pos}. Volver a practicar ${tituloMateria}.`);
            navigation.navigate("Quiz", { materia });
          }}
          accessibilityLabel={`${incorrectas.length > 0 ? "Tercera" : "Segunda"} opción. Volver a practicar`}
        >
          <Text style={styles.btnTexto}>🔄 Volver a practicar</Text>
        </TouchableOpacity>

        {/* BOTÓN INICIO */}
        <TouchableOpacity
          style={[styles.btnInicio, { borderColor: colorAccent }]}
          onPress={() => {
            const pos = incorrectas.length > 0 ? "Cuarta opción, parte inferior" : "Tercera opción, parte inferior";
            if (vozActiva) hablar(`${pos}. Volviendo al inicio.`);
            navigation.navigate("Home");
          }}
          accessibilityLabel={`${incorrectas.length > 0 ? "Cuarta" : "Tercera"} opción, parte inferior. Volver al inicio`}
        >
          <Text style={[styles.btnTexto, { color: colorAccent }]}>🏠 Volver al inicio</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>

      <BottomNav navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#F5F6FA",
    ...(Platform.OS === "web" ? { height: "100vh", overflow: "hidden" } : {})
  },
  audioGlobal: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 10,
    zIndex: 10
  },
  header: {
    padding: 25,
    paddingTop: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexShrink: 0
  },
  title: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  headerSub: { color: "rgba(255,255,255,0.85)", fontSize: 13, marginTop: 4 },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 16, flexGrow: 1 },
  nivelCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 14,
    elevation: 4,
    borderLeftWidth: 5
  },
  subtitle: { fontSize: 14, fontWeight: "bold", color: "#555", marginTop: 10 },
  nivelTexto: { fontSize: 20, fontWeight: "bold", marginTop: 4 },
  texto: { fontSize: 15, color: "#444", marginTop: 4, lineHeight: 21 },
  btnIncorrectas: {
    backgroundColor: "#FFF0F0",
    borderWidth: 2,
    borderColor: "#F44336",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12
  },
  btnIncorrectasTexto: { color: "#F44336", fontWeight: "bold", fontSize: 15 },
  btnEstudiar: {
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12
  },
  btnPracticar: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12
  },
  btnInicio: {
    backgroundColor: "#fff",
    borderWidth: 2,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12
  },
  btnTexto: { color: "#fff", fontWeight: "bold", fontSize: 15 }
});