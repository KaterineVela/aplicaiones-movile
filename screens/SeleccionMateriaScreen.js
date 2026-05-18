import React, { useContext, useEffect } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AccessibilityContext } from "../context/AccessibilityContext";

const materias = [
  {
    id: "sociales",
    nombre: "Ciencias Sociales",
    icono: "🌎",
    descripcion: "Historia, Geografía, Economía y Ciudadanía",
    disponible: true,
    color: "#7B61FF"
  },
  {
    id: "ingles",
    nombre: "Inglés",
    icono: "🌐",
    descripcion: "Comprensión de lectura y uso del idioma",
    disponible: true,
    color: "#0EA5E9"
  },
  {
    id: "matematicas",
    nombre: "Matemáticas",
    icono: "🔢",
    descripcion: "Álgebra, Geometría y Estadística",
    disponible: true,
    color: "#F59E0B"
  },
  {
    id: "lectura",
    nombre: "Lectura Crítica",
    icono: "📖",
    descripcion: "Comprensión lectora y análisis de textos",
    disponible: true,
    color: "#10B981"
  },
  {
    id: "ciencias",
    nombre: "Ciencias Naturales",
    icono: "🔬",
    descripcion: "Biología, Química y Física",
    disponible: false,
    color: "#A0A0A0"
  }
];

const posiciones = [
  "primera opción, parte superior",
  "segunda opción",
  "tercera opción",
  "cuarta opción",
  "quinta opción, parte inferior"
];

export default function SeleccionMateriaScreen({ route, navigation }) {
  const { modo } = route.params;
  const { vozActiva, hablar } = useContext(AccessibilityContext);
  const esPracticar = modo === "practicar";

  useEffect(() => {
    if (vozActiva) {
      hablar(
        `Selecciona una materia para ${esPracticar ? "practicar" : "estudiar"}. ` +
        "Tienes cinco materias en la pantalla. " +
        "Primera opción: Ciencias Sociales, disponible. " +
        "Segunda opción: Inglés, disponible. " +
        "Tercera opción: Matemáticas, disponible. " +
        "Cuarta opción: Lectura Crítica, disponible. " +
        "Quinta opción: Ciencias Naturales, próximamente."
      );
    }
  }, []);

  const seleccionarMateria = (materia, index) => {
    if (!materia.disponible) {
      hablar(`${posiciones[index]}. ${materia.nombre} estará disponible próximamente`);
      return;
    }

    if (esPracticar) {
      hablar(`${posiciones[index]}. Abriendo práctica de ${materia.nombre}`);
      navigation.navigate("Quiz", { materia: materia.id });
    } else {
      hablar(`${posiciones[index]}. Abriendo material de estudio de ${materia.nombre}`);
      if (materia.id === "sociales") {
        navigation.navigate("MaterialSociales");
      } else if (materia.id === "ingles") {
        navigation.navigate("MaterialIngles");
      } else {
        hablar(`Material de ${materia.nombre} próximamente disponible`);
      }
    }
  };

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={esPracticar ? ["#7B61FF", "#A78BFA"] : ["#FF6B6B", "#FF9999"]}
        style={styles.header}
      >
        <Text style={styles.title}>
          {esPracticar ? "📝 Practicar" : "📚 Estudiar"}
        </Text>
        <Text style={styles.subtitle}>Elige una materia</Text>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
      >
        {materias.map((materia, index) => (
          <TouchableOpacity
            key={materia.id}
            style={[styles.card, !materia.disponible && styles.cardDeshabilitada]}
            onPress={() => seleccionarMateria(materia, index)}
            accessibilityLabel={
              materia.disponible
                ? `${posiciones[index]}. ${materia.nombre}, disponible`
                : `${posiciones[index]}. ${materia.nombre}, próximamente disponible`
            }
          >
            <Text style={styles.icono}>{materia.icono}</Text>
            <View style={styles.info}>
              <Text style={[styles.nombre, !materia.disponible && styles.textoDeshabilitado]}>
                {materia.nombre}
              </Text>
              <Text style={styles.descripcion}>{materia.descripcion}</Text>
            </View>
            {materia.disponible ? (
              <View style={[styles.chip, { backgroundColor: materia.color }]}>
                <Text style={styles.chipTexto}>Disponible</Text>
              </View>
            ) : (
              <View style={[styles.chip, styles.chipProximo]}>
                <Text style={[styles.chipTexto, { color: "#999" }]}>Próximo</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
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
  header: {
    padding: 25, paddingTop: 50,
    borderBottomLeftRadius: 25, borderBottomRightRadius: 25, flexShrink: 0
  },
  title: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  subtitle: { color: "#ddd", fontSize: 15, marginTop: 4 },
  scroll: { flex: 1 },
  lista: { padding: 20, gap: 14 },
  card: {
    backgroundColor: "#fff", borderRadius: 16, padding: 18,
    flexDirection: "row", alignItems: "center", elevation: 4, gap: 14
  },
  cardDeshabilitada: { backgroundColor: "#F0F0F0", elevation: 1 },
  icono: { fontSize: 32 },
  info: { flex: 1 },
  nombre: { fontSize: 16, fontWeight: "bold", color: "#333" },
  textoDeshabilitado: { color: "#AAA" },
  descripcion: { fontSize: 12, color: "#888", marginTop: 3 },
  chip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  chipProximo: { backgroundColor: "#E8E8E8" },
  chipTexto: { color: "#fff", fontSize: 11, fontWeight: "bold" }
});