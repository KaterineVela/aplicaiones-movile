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
import { AccessibilityContext } from "../context/AccessibilityContext";

export default function PreguntasIncorrectasScreen({ route, navigation }) {
  // `incorrectas` llega como array de { id, respuesta } desde la pantalla de resultados
  const { incorrectas } = route?.params ?? { incorrectas: [] };
  const materia = route?.params?.materia ?? "sociales";

  // Configuración visual y de contenido según la materia
  const banco = materia === "ingles" ? preguntasIngles : preguntasSociales;
  const tituloMateria = materia === "ingles" ? "Inglés" : "Ciencias Sociales";
  const colorHeader = materia === "ingles" ? "#0EA5E9" : "#F44336";
  const colorAccent = materia === "ingles" ? "#0EA5E9" : "#7B61FF";

  // Fallbacks por si esta pantalla se abre sin el contexto de accesibilidad
  const context = useContext(AccessibilityContext) || {};
  const hablar = context.hablar || (() => {});
  const vozActiva = context.vozActiva || false;

  // Cruza los ids de respuestas incorrectas con el banco para obtener el detalle completo
  const detalle = incorrectas.map(r => {
    const p = banco.find(p => p.id === r.id);
    return { ...p, respuestaUsuario: r.respuesta };
  }).filter(Boolean);

  // Descripción inicial de la pantalla con conteo de errores y estructura de navegación
  useEffect(() => {
    if (vozActiva) {
      hablar(
        `Preguntas incorrectas de ${tituloMateria}. ` +
        `Fallaste ${detalle.length} pregunta${detalle.length > 1 ? "s" : ""}. ` +
        "Para cada pregunta sabrás cúal fue tu respuesta y cuál era la correcta. " +
        "Cada pregunta tiene un botón para escucharla. " +
        "Al final hay dos botones: primero ir a estudiar el material, segundo volver al inicio."
      );
    }
  }, []);

  // Lee la pregunta completa con contexto, la respuesta del usuario y la correcta.
  // Busca el texto completo de la opción para no leer solo la letra.
  const leerPregunta = (item, index) => {
    const opcionCorrecta = item.opciones.find(o => o.charAt(0) === item.correcta);
    const opcionUsuario = item.opciones.find(o => o.charAt(0) === item.respuestaUsuario);
    const contexto = item.contexto ? `Contexto: ${item.contexto}. ` : "";
    hablar(
      `Pregunta ${index + 1} de ${detalle.length}: ${contexto}${item.pregunta}. ` +
      `Tu respuesta fue: ${opcionUsuario || item.respuestaUsuario}. ` +
      `La respuesta correcta es: ${opcionCorrecta || item.correcta}.`
    );
  };

  const irAEstudiar = () => {
    if (vozActiva) hablar(`Primera opción, parte inferior. Abriendo material de estudio de ${tituloMateria}.`);
    if (materia === "ingles") {
      navigation.navigate("MaterialIngles");
    } else {
      navigation.navigate("MaterialSociales");
    }
  };

  return (
    <View style={styles.wrapper}>

      <View style={[styles.header, { backgroundColor: colorHeader }]}>
        <Text style={styles.headerTitle}>❌ Preguntas incorrectas</Text>
        <Text style={styles.headerSub}>
          {tituloMateria} · Fallaste {detalle.length} de {banco.length} preguntas
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {detalle.map((item, index) => (
          <View key={item.id} style={styles.card}>

            <View style={styles.cardTop}>
              <View style={[styles.numeroBadge, { backgroundColor: colorHeader }]}>
                <Text style={styles.numeroTexto}>P{item.id}</Text>
              </View>
              <TouchableOpacity
                style={[styles.btnEscuchar, { backgroundColor: colorAccent }]}
                onPress={() => leerPregunta(item, index)}
                accessibilityLabel={`Escuchar pregunta ${index + 1} de ${detalle.length}`}
              >
                <Text style={styles.btnEscucharTexto}>🔊 Escuchar</Text>
              </TouchableOpacity>
            </View>

            {/* Solo se muestra si la pregunta tiene contexto adicional (ej: textos de inglés) */}
            {item.contexto && (
              <View style={styles.contextoBox}>
                <Text style={styles.contextoLabel}>📌 Contexto</Text>
                <Text style={styles.contextoTexto}>{item.contexto}</Text>
              </View>
            )}

            <Text style={styles.preguntaTexto}>{item.pregunta}</Text>

            {item.opciones.map((op) => {
              const letra = op.charAt(0);
              const esCorrecta = letra === item.correcta;
              const esUsuario = letra === item.respuestaUsuario;

              return (
                <View
                  key={op}
                  style={[
                    styles.opcion,
                    esCorrecta && styles.opcionCorrecta,
                    esUsuario && !esCorrecta && styles.opcionIncorrecta
                  ]}
                >
                  <View style={styles.opcionFila}>
                    <View style={[
                      styles.letraBadge,
                      esCorrecta && styles.letraBadgeCorrecta,
                      esUsuario && !esCorrecta && styles.letraBadgeIncorrecta
                    ]}>
                      <Text style={styles.letraTexto}>{letra}</Text>
                    </View>
                    {/* op tiene formato "A. texto", se salta la letra y el punto */}
                    <Text style={[
                      styles.opcionTexto,
                      esCorrecta && styles.opcionTextoCorrecta,
                      esUsuario && !esCorrecta && styles.opcionTextoIncorrecta
                    ]}>
                      {op.substring(3)}
                    </Text>
                  </View>
                  {esCorrecta && (
                    <Text style={styles.etiquetaCorrecta}>✅ Respuesta correcta</Text>
                  )}
                  {esUsuario && !esCorrecta && (
                    <Text style={styles.etiquetaIncorrecta}>❌ Tu respuesta</Text>
                  )}
                </View>
              );
            })}
          </View>
        ))}

        <TouchableOpacity
          style={[styles.btnEstudiar, { backgroundColor: colorAccent }]}
          onPress={irAEstudiar}
          accessibilityLabel={`Primera opción, parte inferior. Ir a estudiar material de ${tituloMateria}`}
        >
          <Text style={styles.btnEstudiarTexto}>
            📚 Ir a estudiar {tituloMateria}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnVolver}
          onPress={() => {
            if (vozActiva) hablar("Segunda opción, parte inferior. Volviendo al inicio.");
            navigation.navigate("Home");
          }}
          accessibilityLabel="Segunda opción, parte inferior. Volver al inicio"
        >
          <Text style={styles.btnVolverTexto}>🏠 Volver al inicio</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
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
  header: { padding: 25, paddingTop: 50, flexShrink: 0 },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  headerSub: { color: "rgba(255,255,255,0.85)", fontSize: 14, marginTop: 4 },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40, flexGrow: 1 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12
  },
  numeroBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20
  },
  numeroTexto: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  btnEscuchar: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10
  },
  btnEscucharTexto: { color: "#fff", fontWeight: "bold", fontSize: 12 },
  contextoBox: {
    backgroundColor: "#F0F9FF",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#0EA5E9"
  },
  contextoLabel: { fontSize: 11, fontWeight: "bold", color: "#0369A1", marginBottom: 4 },
  contextoTexto: { fontSize: 12, color: "#334155", lineHeight: 18 },
  preguntaTexto: { fontSize: 14, color: "#333", lineHeight: 21, marginBottom: 14 },
  opcion: {
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "transparent"
  },
  opcionCorrecta: { backgroundColor: "#F0FFF4", borderColor: "#4CAF50" },
  opcionIncorrecta: { backgroundColor: "#FFF0F0", borderColor: "#F44336" },
  opcionFila: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  letraBadge: {
    backgroundColor: "#CCC",
    width: 26, height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0
  },
  letraBadgeCorrecta: { backgroundColor: "#4CAF50" },
  letraBadgeIncorrecta: { backgroundColor: "#F44336" },
  letraTexto: { color: "#fff", fontWeight: "bold", fontSize: 12 },
  opcionTexto: { fontSize: 13, color: "#444", flex: 1, lineHeight: 19 },
  opcionTextoCorrecta: { color: "#2E7D32", fontWeight: "600" },
  opcionTextoIncorrecta: { color: "#C62828" },
  etiquetaCorrecta: { fontSize: 11, color: "#4CAF50", fontWeight: "bold", marginTop: 6, paddingLeft: 36 },
  etiquetaIncorrecta: { fontSize: 11, color: "#F44336", fontWeight: "bold", marginTop: 6, paddingLeft: 36 },
  btnEstudiar: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12
  },
  btnEstudiarTexto: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  btnVolver: {
    backgroundColor: "#A78BFA",
    padding: 16,
    borderRadius: 12,
    alignItems: "center"
  },
  btnVolverTexto: { color: "#fff", fontWeight: "bold", fontSize: 15 }
});