import React, { useContext, useEffect, useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Platform, ActivityIndicator
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AccessibilityContext } from "../context/AccessibilityContext";
import { obtenerMaterial } from "../services/materialService";

// Construye el texto completo de un tema para que la voz lo lea todo de una vez.
// Recorre cada sección y cada viñeta concatenando el texto.
function construirTextoVoz(item) {
  let texto = `${item.titulo}. `;
  item.secciones.forEach(seccion => {
    texto += `${seccion.subtitulo}. `;
    seccion.viñetas.forEach(viñeta => {
      texto += `${viñeta}. `;
    });
  });
  return texto;
}

export default function MaterialSocialesScreen({ navigation }) {
  const { vozActiva, hablar, toggleVoz } = useContext(AccessibilityContext);
  const [expandido, setExpandido] = useState(null);

  // Estado para almacenar el material que viene del backend
  const [contenidos, setContenidos] = useState([]);
  const [glosario, setGlosario] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Al montar la pantalla, pedimos el material al backend Kotlin.
  // El servicio hace GET /material/sociales y retorna los temas ordenados.
  useEffect(() => {
    const cargar = async () => {
      const temas = await obtenerMaterial("sociales");
      setContenidos(temas);

      // El glosario está distribuido en los temas. Tomamos el del primero
      // que tenga entradas para mostrarlo al final de la pantalla.
      const temaConGlosario = temas.find(t => t.glosario && t.glosario.length > 0);
      if (temaConGlosario) setGlosario(temaConGlosario.glosario);

      setCargando(false);
    };
    cargar();
  }, []);

  useEffect(() => {
    if (vozActiva && !cargando) {
      hablar(
        "Material de estudio de Ciencias Sociales. Tienes cuatro temas disponibles. " +
        "Primera opción, parte superior: Historia de Colombia y del mundo. " +
        "Segunda opción: Geografía. " +
        "Tercera opción: Economía. " +
        "Cuarta opción, parte inferior: Política y Ciudadanía. " +
        "Toca cualquier tema para expandirlo y escuchar todo su contenido. " +
        "Al final de la pantalla hay un glosario de términos clave."
      );
    }
  }, [cargando]);

  const posicionTema = (index) => {
    const pos = [
      "Primera opción, parte superior",
      "Segunda opción",
      "Tercera opción",
      "Cuarta opción, parte inferior"
    ];
    return pos[index] || `Opción ${index + 1}`;
  };

  const toggleTema = (item, index) => {
    if (expandido === item.id) {
      setExpandido(null);
      if (vozActiva) hablar(`Cerrando ${item.titulo}`);
    } else {
      setExpandido(item.id);
      // Cuando se expande un tema, la voz lee todo su contenido completo
      if (vozActiva) hablar(construirTextoVoz(item));
    }
  };

  const leerGlosario = () => {
    if (!vozActiva) return;
    let texto = "Glosario de términos clave. ";
    glosario.forEach(g => {
      texto += `${g.termino}: ${g.definicion}. `;
    });
    hablar(texto);
  };

  // Mientras carga el material desde el backend mostramos un indicador
  if (cargando) {
    return (
      <View style={styles.wrapper}>
        <LinearGradient colors={["#7B61FF", "#A78BFA"]} style={styles.header}>
          <Text style={styles.headerTitle}>🌎 Ciencias Sociales</Text>
          <Text style={styles.headerSub}>Cargando material...</Text>
        </LinearGradient>
        <ActivityIndicator size="large" color="#7B61FF" style={{ marginTop: 40 }} />
      </View>
    );
  }

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

      <LinearGradient colors={["#7B61FF", "#A78BFA"]} style={styles.header}>
        <Text style={styles.headerTitle}>🌎 Ciencias Sociales</Text>
        <Text style={styles.headerSub}>Toca un tema para expandirlo y escucharlo completo</Text>
      </LinearGradient>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={true}>
        <View style={styles.tip}>
          <Text style={styles.tipText}>
            🎧 Activa la voz para escuchar el contenido completo de cada tema
          </Text>
        </View>

        {contenidos.map((item, index) => (
          <View key={item.id} style={styles.temaCard}>

            <TouchableOpacity
              style={[styles.temaHeader, { borderLeftColor: item.color }]}
              onPress={() => toggleTema(item, index)}
              accessibilityLabel={`${posicionTema(index)}. ${item.titulo}. ${item.resumen}. Toca para ${expandido === item.id ? "cerrar" : "expandir y escuchar todo"}`}
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

                {/* Botón para releer todo el contenido del tema */}
                <TouchableOpacity
                  style={[styles.btnReleer, { backgroundColor: item.color }]}
                  onPress={() => hablar(construirTextoVoz(item))}
                  accessibilityLabel="Escuchar todo el contenido de este tema de nuevo"
                >
                  <Text style={styles.btnReleerTexto}>🔊 Escuchar todo de nuevo</Text>
                </TouchableOpacity>

                {item.secciones.map((seccion, si) => (
                  <View key={si} style={styles.seccion}>

                    {/* Cada subtítulo es tocable para leer solo esa sección */}
                    <TouchableOpacity
                      onPress={() => {
                        if (vozActiva) {
                          let texto = `${seccion.subtitulo}. `;
                          seccion.viñetas.forEach(v => { texto += `${v}. `; });
                          hablar(texto);
                        }
                      }}
                      accessibilityLabel={`Toca para escuchar la sección ${seccion.subtitulo}`}
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
                  style={styles.btnPracticar}
                  onPress={() => {
                    if (vozActiva) hablar("Abriendo práctica de Ciencias Sociales");
                    navigation.navigate("Quiz", { materia: "sociales" });
                  }}
                  accessibilityLabel="Practicar preguntas de este tema"
                >
                  <Text style={styles.btnPracticarTexto}>📝 Practicar preguntas</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        {/* GLOSARIO — se muestra solo si hay entradas disponibles */}
        {glosario.length > 0 && (
          <View style={styles.glosarioCard}>
            <TouchableOpacity
              onPress={leerGlosario}
              accessibilityLabel="Glosario de términos clave, toca para escuchar todas las definiciones"
            >
              <Text style={styles.glosarioTitulo}>🎧 Glosario de términos clave</Text>
              <Text style={styles.glosarioSub}>Toca para escuchar todas las definiciones</Text>
            </TouchableOpacity>

            {glosario.map((g, gi) => (
              <TouchableOpacity
                key={gi}
                style={styles.glosarioItem}
                onPress={() => { if (vozActiva) hablar(`${g.termino}: ${g.definicion}`); }}
                accessibilityLabel={`${g.termino}: ${g.definicion}. Toca para escuchar`}
              >
                <View style={styles.glosarioTerminoFila}>
                  <View style={styles.glosarioDot} />
                  <Text style={styles.glosarioTermino}>{g.termino}</Text>
                </View>
                <Text style={styles.glosarioDefinicion}>{g.definicion}</Text>
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
  tip: { backgroundColor: "#EEF0FF", borderRadius: 12, padding: 14, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: "#7B61FF" },
  tipText: { color: "#555", fontSize: 13, lineHeight: 20 },
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
  btnPracticar: { marginTop: 8, backgroundColor: "#7B61FF", padding: 14, borderRadius: 12, alignItems: "center" },
  btnPracticarTexto: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  glosarioCard: { backgroundColor: "#fff", borderRadius: 16, padding: 18, marginTop: 4, elevation: 3, borderLeftWidth: 5, borderLeftColor: "#FF9800" },
  glosarioTitulo: { fontSize: 16, fontWeight: "bold", color: "#FF9800" },
  glosarioSub: { fontSize: 12, color: "#888", marginTop: 4, marginBottom: 14 },
  glosarioItem: { marginBottom: 12 },
  glosarioTerminoFila: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 3 },
  glosarioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#FF9800", flexShrink: 0 },
  glosarioTermino: { fontWeight: "bold", color: "#FF9800", fontSize: 14 },
  glosarioDefinicion: { fontSize: 13, color: "#555", lineHeight: 19, paddingLeft: 16 }
});