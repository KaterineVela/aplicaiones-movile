import React, { useContext, useEffect, useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Platform, ActivityIndicator
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AccessibilityContext } from "../context/AccessibilityContext";
import { obtenerMaterial } from "../services/materialService";

// Builds the full voice text from all sections and bullet points.
// Loops through each section and each bullet to build a single string.
function buildVoiceText(item) {
  let text = `${item.titulo}. `;
  item.secciones.forEach(seccion => {
    text += `${seccion.subtitulo}. `;
    seccion.viñetas.forEach(viñeta => {
      text += `${viñeta}. `;
    });
  });
  return text;
}

export default function MaterialInglesScreen({ navigation }) {
  const { vozActiva, hablar, toggleVoz } = useContext(AccessibilityContext);
  const [expandido, setExpandido] = useState(null);

  // State to store the material coming from the backend
  const [contenidos, setContenidos] = useState([]);
  const [glossary, setGlossary] = useState([]);
  const [cargando, setCargando] = useState(true);

  // When the screen mounts, we request the material from the Kotlin backend.
  // The service makes GET /material/ingles and returns the topics in order.
  useEffect(() => {
    const cargar = async () => {
      const temas = await obtenerMaterial("ingles");
      setContenidos(temas);

      // Collect all glossary entries from all topics into a single array
      const todasEntradas = temas.flatMap(t => t.glosario || []);
      setGlossary(todasEntradas);

      setCargando(false);
    };
    cargar();
  }, []);

  useEffect(() => {
    if (vozActiva && !cargando) {
      hablar(
        "English study material. You have four topics available. " +
        "First option, top of the screen: Vocabulary, clothes and transport. " +
        "Second option: Grammar, comparatives and verb tenses. " +
        "Third option: Reading comprehension, strategies for the ICFES. " +
        "Fourth option, bottom of the screen: Conversations, how to choose the best reply. " +
        "Tap any topic to expand it and listen to the full content. " +
        "At the bottom there is a glossary of key terms."
      );
    }
  }, [cargando]);

  const positionLabel = (index) => {
    const labels = [
      "First option, top of the screen",
      "Second option",
      "Third option",
      "Fourth option, bottom of the screen"
    ];
    return labels[index] || `Option ${index + 1}`;
  };

  const toggleTema = (item, index) => {
    if (expandido === item.id) {
      setExpandido(null);
      if (vozActiva) hablar(`Closing ${item.titulo}`);
    } else {
      setExpandido(item.id);
      // When a topic expands, the voice reads all its content at once
      if (vozActiva) hablar(buildVoiceText(item));
    }
  };

  const readGlossary = () => {
    if (!vozActiva) return;
    let text = "Glossary of key terms. ";
    glossary.forEach(g => {
      text += `${g.term}: ${g.definition}. `;
    });
    hablar(text);
  };

  // Show a loading indicator while fetching from the backend
  if (cargando) {
    return (
      <View style={styles.wrapper}>
        <LinearGradient colors={["#0EA5E9", "#38BDF8"]} style={styles.header}>
          <Text style={styles.headerTitle}>🌐 English</Text>
          <Text style={styles.headerSub}>Loading material...</Text>
        </LinearGradient>
        <ActivityIndicator size="large" color="#0EA5E9" style={{ marginTop: 40 }} />
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>

      <TouchableOpacity
        style={styles.audioGlobal}
        onPress={toggleVoz}
        accessibilityLabel={vozActiva ? "Turn off voice" : "Turn on voice"}
      >
        <Text style={{ color: "#fff" }}>
          {vozActiva ? "🔊 Voice on" : "🔇 Voice off"}
        </Text>
      </TouchableOpacity>

      <LinearGradient colors={["#0EA5E9", "#38BDF8"]} style={styles.header}>
        <Text style={styles.headerTitle}>🌐 English</Text>
        <Text style={styles.headerSub}>Tap a topic to expand and listen to the full content</Text>
      </LinearGradient>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={true}>
        <View style={styles.tip}>
          <Text style={styles.tipText}>
            🎧 Turn on voice to listen to the complete content of each topic
          </Text>
        </View>

        {contenidos.map((item, index) => (
          <View key={item.id} style={styles.temaCard}>

            <TouchableOpacity
              style={[styles.temaHeader, { borderLeftColor: item.color }]}
              onPress={() => toggleTema(item, index)}
              accessibilityLabel={`${positionLabel(index)}. ${item.titulo}. ${item.resumen}. Tap to ${expandido === item.id ? "close" : "expand and listen to everything"}`}
            >
              <Text style={styles.temaIcono}>{item.icono}</Text>
              <View style={styles.temaInfoHeader}>
                <Text style={[styles.temaTitulo, { color: item.color }]}>{item.titulo}</Text>
                <Text style={styles.temaResumen}>{item.resumen}</Text>
              </View>
              <Text style={styles.chevron}>{expandido === item.id ? "▲" : "▼"}</Text>
            </TouchableOpacity>

            {expandido === item.id && (
              <View style={styles.temaContenido}>

                {/* Button to re-read all content of this topic */}
                <TouchableOpacity
                  style={[styles.btnReleer, { backgroundColor: item.color }]}
                  onPress={() => hablar(buildVoiceText(item))}
                  accessibilityLabel="Listen to all the content of this topic again"
                >
                  <Text style={styles.btnReleerTexto}>🔊 Listen to everything again</Text>
                </TouchableOpacity>

                {item.secciones.map((seccion, si) => (
                  <View key={si} style={styles.seccion}>

                    {/* Each subtitle is tappable to read just that section */}
                    <TouchableOpacity
                      onPress={() => {
                        if (vozActiva) {
                          let text = `${seccion.subtitulo}. `;
                          seccion.viñetas.forEach(v => { text += `${v}. `; });
                          hablar(text);
                        }
                      }}
                      accessibilityLabel={`Tap to listen to section: ${seccion.subtitulo}`}
                    >
                      <Text style={[styles.seccionTitulo, { color: item.color }]}>
                        {seccion.subtitulo} 🔊
                      </Text>
                    </TouchableOpacity>

                    {seccion.viñetas.map((v, vi) => (
                      <View key={vi} style={styles.viñetaFila}>
                        <View style={[styles.viñetaDot, { backgroundColor: item.color }]} />
                        <Text style={styles.viñetaTexto}>{v}</Text>
                      </View>
                    ))}
                  </View>
                ))}

                <TouchableOpacity
                  style={[styles.btnPracticar, { backgroundColor: item.color }]}
                  onPress={() => {
                    if (vozActiva) hablar("Opening English practice quiz");
                    navigation.navigate("Quiz", { materia: "ingles" });
                  }}
                  accessibilityLabel="Practice English questions"
                >
                  <Text style={styles.btnPracticarTexto}>📝 Practice questions</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        {/* GLOSSARY — only shown if there are entries available */}
        {glossary.length > 0 && (
          <View style={styles.glosarioCard}>
            <TouchableOpacity
              onPress={readGlossary}
              accessibilityLabel="Glossary of key terms, tap to listen to all definitions"
            >
              <Text style={styles.glosarioTitulo}>🎧 Glossary of key terms</Text>
              <Text style={styles.glosarioSub}>Tap to listen to all definitions</Text>
            </TouchableOpacity>

            {glossary.map((g, gi) => (
              <TouchableOpacity
                key={gi}
                style={styles.glosarioItem}
                onPress={() => { if (vozActiva) hablar(`${g.term}: ${g.definition}`); }}
                accessibilityLabel={`${g.term}: ${g.definition}. Tap to listen`}
              >
                <View style={styles.glosarioTerminoFila}>
                  <View style={styles.glosarioDot} />
                  <Text style={styles.glosarioTermino}>{g.term}</Text>
                </View>
                <Text style={styles.glosarioDefinicion}>{g.definition}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#F5F6FA", ...(Platform.OS === "web" ? { height: "100vh", overflow: "hidden" } : {}) },
  audioGlobal: { position: "absolute", top: 50, right: 20, backgroundColor: "#333", padding: 10, borderRadius: 10, zIndex: 10 },
  header: { padding: 25, paddingTop: 50, borderBottomLeftRadius: 25, borderBottomRightRadius: 25, flexShrink: 0 },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  headerSub: { color: "#ddd", fontSize: 13, marginTop: 5 },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40, flexGrow: 1 },
  tip: { backgroundColor: "#E0F2FE", borderRadius: 12, padding: 14, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: "#0EA5E9" },
  tipText: { color: "#0369A1", fontSize: 13, lineHeight: 20 },
  temaCard: { backgroundColor: "#fff", borderRadius: 16, marginBottom: 14, elevation: 3, overflow: "hidden" },
  temaHeader: { flexDirection: "row", alignItems: "center", padding: 16, borderLeftWidth: 5, gap: 12 },
  temaIcono: { fontSize: 28 },
  temaInfoHeader: { flex: 1 },
  temaTitulo: { fontSize: 15, fontWeight: "bold" },
  temaResumen: { fontSize: 12, color: "#888", marginTop: 3 },
  chevron: { fontSize: 14, color: "#AAA" },
  temaContenido: { padding: 16, borderTopWidth: 1, borderTopColor: "#F0F0F0" },
  btnReleer: { padding: 10, borderRadius: 10, alignSelf: "flex-start", marginBottom: 16 },
  btnReleerTexto: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  seccion: { marginBottom: 16 },
  seccionTitulo: { fontSize: 14, fontWeight: "bold", marginBottom: 8 },
  viñetaFila: { flexDirection: "row", alignItems: "flex-start", marginBottom: 6, gap: 8 },
  viñetaDot: { width: 8, height: 8, borderRadius: 4, marginTop: 6, flexShrink: 0 },
  viñetaTexto: { fontSize: 14, color: "#444", lineHeight: 21, flex: 1 },
  btnPracticar: { marginTop: 8, padding: 14, borderRadius: 12, alignItems: "center" },
  btnPracticarTexto: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  glosarioCard: { backgroundColor: "#fff", borderRadius: 16, padding: 18, marginTop: 4, elevation: 3, borderLeftWidth: 5, borderLeftColor: "#0EA5E9" },
  glosarioTitulo: { fontSize: 16, fontWeight: "bold", color: "#0EA5E9" },
  glosarioSub: { fontSize: 12, color: "#888", marginTop: 4, marginBottom: 14 },
  glosarioItem: { marginBottom: 12 },
  glosarioTerminoFila: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 3 },
  glosarioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#0EA5E9", flexShrink: 0 },
  glosarioTermino: { fontWeight: "bold", color: "#0EA5E9", fontSize: 14 },
  glosarioDefinicion: { fontSize: 13, color: "#555", lineHeight: 19, paddingLeft: 16 }
});