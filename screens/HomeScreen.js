import React, { useContext, useEffect } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import BottomNav from "../components/BottomNav";
import { AccessibilityContext } from "../context/AccessibilityContext";
import { AuthContext } from "../context/AuthContext";

export default function HomeScreen({ navigation }) {
  const { vozActiva, hablar } = useContext(AccessibilityContext);
  const { usuario } = useContext(AuthContext);

  // Fallback en cadena: nombre > email > "Usuario"
  const nombre = usuario?.displayName || usuario?.email || "Usuario";

  useEffect(() => {
    if (vozActiva) {
      hablar(
        `Pantalla de inicio. Bienvenido ${nombre}. Tienes tres opciones en el centro de la pantalla. ` +
        "Primera opción, parte superior: Simulacro de Examen, para practicar o estudiar para el ICFES. " +
        "Segunda opción, parte central: Material de Estudio, para revisar contenidos por materia. " +
        "Tercera opción, parte inferior: Resultados, para ver tu historial de simulacros. " +
        "En la parte inferior de la pantalla hay tres botones de navegación."
      );
    }
  }, []);

  return (
    // Wrapper principal ocupa toda la pantalla con flex: 1
    // La clave es NO poner padding aquí — el padding va solo en el contenido
    <View style={styles.wrapper}>

      {/* ScrollView para el contenido — ocupa todo el espacio disponible sobre el nav */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient colors={["#7B61FF", "#A78BFA"]} style={styles.header}>
          <Text style={styles.name}>Bienvenido, {nombre} 👋</Text>
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
            if (vozActiva) hablar("Segunda opción, parte central. Abriendo Material de Estudio.");
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

        {/* OPCIÓN 3: RESULTADOS / HISTORIAL */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => {
            if (vozActiva) hablar("Tercera opción, parte inferior. Abriendo historial de resultados.");
            navigation.navigate("Historial");
          }}
          accessibilityLabel="Tercera opción, parte inferior. Ver historial de resultados"
        >
          <Text style={styles.cardIcon}>📊</Text>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>Resultados</Text>
            <Text style={styles.cardSub}>Revisa tu historial de simulacros</Text>
          </View>
        </TouchableOpacity>

      </ScrollView>

      {/* BottomNav siempre pegado al fondo, fuera del ScrollView */}
      <BottomNav navigation={navigation} />

    </View>
  );
}

const styles = StyleSheet.create({
  // Wrapper ocupa toda la pantalla y organiza el contenido en columna
  wrapper: {
    flex: 1,
    backgroundColor: "#F5F6FA",
    ...(Platform.OS === "web" ? { height: "100vh", overflow: "hidden" } : {})
  },
  // ScrollView ocupa todo el espacio disponible dejando lugar al BottomNav
  scroll: {
    flex: 1
  },
  // El padding va aquí, en el contenido, no en el wrapper
  content: {
    padding: 20,
    paddingBottom: 10
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