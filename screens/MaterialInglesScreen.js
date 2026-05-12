import React, { useContext, useEffect, useState } from "react";
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

const contenidos = [
  {
    id: "vocabulary",
    icono: "🔤",
    titulo: "Vocabulary",
    resumen: "Clothes, accessories, transport and everyday words.",
    color: "#0EA5E9",
    secciones: [
      {
        subtitulo: "Clothes and accessories",
        viñetas: [
          "glasses — you wear them on your face to see better.",
          "handbag — a bag you carry in your hand to keep your things.",
          "hat — you wear it on your head.",
          "pajamas — you wear them when you go to bed.",
          "scarf — you wrap it around your neck to keep warm.",
          "skirt — a piece of clothing worn around the waist.",
          "socks — you wear them on your feet, inside your shoes.",
          "watch — you wear it on your wrist to know the time."
        ]
      },
      {
        subtitulo: "Transportation",
        viñetas: [
          "bike or bicycle — you pedal it. Most people learn to ride as a child.",
          "bus — public road transport. You pay a fare.",
          "plane — air transport for long journeys.",
          "train — transport that runs on rails.",
          "boat — transport on water.",
          "motorbike — a two-wheeled vehicle with a motor.",
          "ambulance — takes sick or injured people to hospital.",
          "truck — carries heavy loads on the road."
        ]
      }
    ]
  },
  {
    id: "grammar",
    icono: "📐",
    titulo: "Grammar",
    resumen: "Comparatives, superlatives, modals and verb tenses.",
    color: "#8B5CF6",
    secciones: [
      {
        subtitulo: "Comparatives and superlatives",
        viñetas: [
          "much, more, most: used with uncountable nouns.",
          "Example: Its most important component is caffeine. This is a superlative.",
          "good, better, best.",
          "bad, worse, worst.",
          "large, larger, largest.",
          "Tip: use superlatives when comparing one thing against all others in a group."
        ]
      },
      {
        subtitulo: "Time prepositions",
        viñetas: [
          "since: from a specific point in time. Example: since 1990, since the 14th century.",
          "during: throughout a period. Example: during the war, during the sixties.",
          "until: up to a point in time. Example: until midnight.",
          "for: a length of time. Example: for two years, for a long time.",
          "Tip: use since with a specific moment. Use for with a duration."
        ]
      },
      {
        subtitulo: "Modal verbs",
        viñetas: [
          "mustn't: strong prohibition. Example: You mustn't believe this.",
          "couldn't: inability in the past. Example: I couldn't buy oil paints.",
          "wouldn't: conditional refusal. Example: My parents wouldn't buy them for me.",
          "shouldn't: negative advice. Example: You shouldn't eat too much sugar.",
          "shall: used to offer help. Example: Shall I hold those bags for you?"
        ]
      },
      {
        subtitulo: "Key verb tenses",
        viñetas: [
          "Simple past: for finished actions. Example: Caffeine was described in the 1800s.",
          "Present perfect: actions from the past that continue. Example: Coffee has been well-known since the 14th century.",
          "Gerund, that is the ing form: after verbs like say, enjoy, stop. Example: Some people say drinking coffee isn't good.",
          "Passive voice: focus on the action, not who does it. Example: Caffeine was first described by Ferdinand Runge."
        ]
      },
      {
        subtitulo: "Connectors and relative pronouns",
        viñetas: [
          "when: time connector. Example: When Sufi Yemenis started using coffee.",
          "which: for things. Example: It is an animal which is called the Simien Jackal.",
          "who: for people. Example: A doctor who found out some effects of coffee.",
          "while: contrast. Example: While many people believe coffee is bad, studies show it is good.",
          "among: within a group. Example: It became popular among Europeans."
        ]
      }
    ]
  },
  {
    id: "reading",
    icono: "📖",
    titulo: "Reading comprehension",
    resumen: "Strategies for ICFES English reading questions.",
    color: "#10B981",
    secciones: [
      {
        subtitulo: "Types of reading questions in the ICFES",
        viñetas: [
          "Explicit information: the answer is directly stated in the text.",
          "Inference: you must deduce something not directly written.",
          "Vocabulary in context: choose the right word for a blank space.",
          "Author's purpose: what is the writer trying to do with this text?"
        ]
      },
      {
        subtitulo: "Strategies to answer well",
        viñetas: [
          "Read the questions first, then the text. Know what to look for.",
          "Find key words from the question inside the text.",
          "For fill-in-the-blank, read the full sentence before and after the gap.",
          "Eliminate clearly wrong options before choosing.",
          "If you don't know a word, use the surrounding context to guess its meaning."
        ]
      },
      {
        subtitulo: "Text types in the exam",
        viñetas: [
          "Signs and notices: short instructions. Question: Where can you see this sign?",
          "Informational articles: texts about people, places or topics.",
          "Fill-in-the-blank texts: a passage with gaps to complete.",
          "Conversations: short dialogues. Choose the most logical reply.",
          "Letters or reviews: personal texts expressing opinion or experience."
        ]
      }
    ]
  },
  {
    id: "conversations",
    icono: "💬",
    titulo: "Conversations",
    resumen: "How to choose the most logical reply in a dialogue.",
    color: "#F59E0B",
    secciones: [
      {
        subtitulo: "Common responses",
        viñetas: [
          "Shall I help you? The correct answer is: That's fine, or Sure. This is an offer of help followed by acceptance.",
          "How much is it? The correct answer is the price, for example: 50 dollars.",
          "I think I am getting sick. The correct answer is: I am sorry. This shows empathy.",
          "I am going on vacation! The correct answer is: That's great! This is a positive reaction to good news.",
          "I can't eat this. It is horrible! The correct answer is: I agree. This shows agreement with a complaint."
        ]
      },
      {
        subtitulo: "Common mistakes to avoid",
        viñetas: [
          "Do not choose an answer just because it repeats words from the question. That is a trap.",
          "The reply must make logical sense in the context of the conversation.",
          "Ask yourself: what would a real person say in this situation?",
          "Example: Shall I hold those bags? The answer is That's fine, not I'm not afraid.",
          "Example: How much is the umbrella? The answer is 50 dollars, not Cash only, because that is a rule, not a price."
        ]
      }
    ]
  }
];

const glossary = [
  { term: "Vocabulary", definition: "All the words of a language or the words known by a person." },
  { term: "Grammar", definition: "The rules of a language that explain how words are combined to form sentences." },
  { term: "Inference", definition: "A conclusion you reach based on evidence in the text, not directly stated." },
  { term: "Modal verb", definition: "A verb like must, can, should or would that expresses ability, obligation or possibility." },
  { term: "Superlative", definition: "The form of an adjective that expresses the highest degree: best, most important." },
  { term: "Context", definition: "The words and sentences around a word that help you understand its meaning." },
  { term: "Conjunction", definition: "A word that connects two sentences or ideas: and, but, while, because." }
];

// Builds full voice text from all sections and bullet points
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

  useEffect(() => {
    if (vozActiva) {
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
  }, []);

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
      if (vozActiva) {
        // Reads ALL content: title, every subtitle, every bullet point
        hablar(buildVoiceText(item));
      }
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

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
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

                {/* Button reads ALL content of this topic */}
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

        {/* GLOSSARY */}
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
              onPress={() => {
                if (vozActiva) hablar(`${g.term}: ${g.definition}`);
              }}
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

        <View style={{ height: 40 }} />
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
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    flexShrink: 0
  },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  headerSub: { color: "#ddd", fontSize: 13, marginTop: 5 },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40, flexGrow: 1 },
  tip: {
    backgroundColor: "#E0F2FE",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#0EA5E9"
  },
  tipText: { color: "#0369A1", fontSize: 13, lineHeight: 20 },
  temaCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 14,
    elevation: 3,
    overflow: "hidden"
  },
  temaHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderLeftWidth: 5,
    gap: 12
  },
  temaIcono: { fontSize: 28 },
  temaInfoHeader: { flex: 1 },
  temaTitulo: { fontSize: 15, fontWeight: "bold" },
  temaResumen: { fontSize: 12, color: "#888", marginTop: 3 },
  chevron: { fontSize: 14, color: "#AAA" },
  temaContenido: { padding: 16, borderTopWidth: 1, borderTopColor: "#F0F0F0" },
  btnReleer: {
    padding: 10,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginBottom: 16
  },
  btnReleerTexto: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  seccion: { marginBottom: 16 },
  seccionTitulo: { fontSize: 14, fontWeight: "bold", marginBottom: 8 },
  viñetaFila: { flexDirection: "row", alignItems: "flex-start", marginBottom: 6, gap: 8 },
  viñetaDot: { width: 8, height: 8, borderRadius: 4, marginTop: 6, flexShrink: 0 },
  viñetaTexto: { fontSize: 14, color: "#444", lineHeight: 21, flex: 1 },
  btnPracticar: {
    marginTop: 8,
    padding: 14,
    borderRadius: 12,
    alignItems: "center"
  },
  btnPracticarTexto: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  glosarioCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginTop: 4,
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: "#0EA5E9"
  },
  glosarioTitulo: { fontSize: 16, fontWeight: "bold", color: "#0EA5E9" },
  glosarioSub: { fontSize: 12, color: "#888", marginTop: 4, marginBottom: 14 },
  glosarioItem: { marginBottom: 12 },
  glosarioTerminoFila: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 3 },
  glosarioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#0EA5E9", flexShrink: 0 },
  glosarioTermino: { fontWeight: "bold", color: "#0EA5E9", fontSize: 14 },
  glosarioDefinicion: { fontSize: 13, color: "#555", lineHeight: 19, paddingLeft: 16 }
});