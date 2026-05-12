import React, { useContext, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import BottomNav from "../components/BottomNav";
import { AccessibilityContext } from "../context/AccessibilityContext";

export default function HomeScreen({ navigation }) {
  const { vozActiva, hablar } = useContext(AccessibilityContext);

  useEffect(() => {
    if (vozActiva) {
      hablar(
        "Pantalla de inicio. Tienes tres opciones en el centro de la pantalla. " +
        "Primera opción, parte superior: Simulacro de Examen, para practicar o estudiar para el ICFES. " +
        "Segunda opción, parte central: Material de Estudio, para revisar contenidos por materia. " +
        "Tercera opción, parte inferior: Resultados, para ver tu progreso. " +
        "En la parte inferior de la pantalla hay tres botones de navegación: Inicio a la izquierda, Resultados en el centro, y Ajustes a la derecha."
      );
    }
  }, []);

  return (
    <View style={styles.container}>

      <LinearGradient
        colors={["#7B61FF", "#A78BFA"]}
        style={styles.header}
      >
        <Text style={styles.name}>Bienvenido 👋</Text>
        <Text style={styles.sub}>Continúa tu progreso</Text>
      </LinearGradient>

      {/* OPCIÓN 1: SIMULACRO */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          if (vozActiva) hablar("Primera opción, parte superior. Abriendo Simulacro de Examen.");
          navigation.navigate("Simulacro");
        }}
        accessibilityLabel="Primera opción, parte superior. Simulacro de examen"
      >
        <Text style={styles.cardIcon}>📝</Text>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>Simulacro de Examen</Text>
          <Text style={styles.cardSub}>Practica o estudia para el ICFES</Text>
        </View>
      </TouchableOpacity>

      {/* OPCIÓN 2: MATERIAL */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          if (vozActiva) hablar("Segunda opción, parte central. Abriendo Material de Estudio. Elige una materia para estudiar.");
          navigation.navigate("SeleccionMateria", { modo: "estudiar" });
        }}
        accessibilityLabel="Segunda opción, parte central. Material de estudio"
      >
        <Text style={styles.cardIcon}>📚</Text>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>Material de Estudio</Text>
          <Text style={styles.cardSub}>Recursos por materia para prepararte</Text>
        </View>
      </TouchableOpacity>

      {/* OPCIÓN 3: RESULTADOS */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          if (vozActiva) hablar("Tercera opción, parte inferior. Abriendo Resultados.");
          navigation.navigate("Resultados");
        }}
        accessibilityLabel="Tercera opción, parte inferior. Ver resultados"
      >
        <Text style={styles.cardIcon}>📊</Text>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>Resultados</Text>
          <Text style={styles.cardSub}>Revisa tu progreso por materia</Text>
        </View>
      </TouchableOpacity>

      <BottomNav navigation={navigation} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
    padding: 20
  },
  header: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 20
  },
  name: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  sub: { color: "#ddd" },
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 15
  },
  cardIcon: { fontSize: 28 },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#333" },
  cardSub: { fontSize: 12, color: "#999", marginTop: 2 }
});