
import React, { useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AccessibilityContext } from "../context/AccessibilityContext";
import { Ionicons } from "@expo/vector-icons";

export default function SimulacroScreen({ navigation }) {
  const { vozActiva, hablar } = useContext(AccessibilityContext);

  useEffect(() => {
    if (vozActiva) {
      hablar(
        "Simulacro de examen. Tienes dos opciones en el centro de la pantalla. " +
        "Primera opción, parte superior: Practicar, para responder preguntas reales del ICFES. " +
        "Segunda opción, parte inferior: Estudiar, para revisar el material antes de practicar."
      );
    }
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#7B61FF", "#A78BFA"]}
        style={styles.header}
      >
        <Text style={styles.title}>Simulacro de Examen</Text>
        <Text style={styles.subtitle}>¿Qué deseas hacer?</Text>
      </LinearGradient>

      <View style={styles.content}>

        <TouchableOpacity
          style={styles.card}
          onPress={() => {
            if (vozActiva) hablar("Primera opción, parte superior. Abriendo modo práctica. Elige una materia.");
            navigation.navigate("SeleccionMateria", { modo: "practicar" });
          }}
          accessibilityLabel="Primera opción, parte superior. Practicar, responder preguntas del ICFES"
        >
          <View style={styles.iconWrapper}>
            <Ionicons name="pencil" size={40} color="#7B61FF" />
          </View>
          <Text style={styles.cardTitle}>📝 Practicar</Text>
          <Text style={styles.cardDesc}>
            Responde preguntas reales del examen ICFES Saber 11°
          </Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Selecciona una materia</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, styles.cardEstudiar]}
          onPress={() => {
            if (vozActiva) hablar("Segunda opción, parte inferior. Abriendo material de estudio. Elige una materia.");
            navigation.navigate("SeleccionMateria", { modo: "estudiar" });
          }}
          accessibilityLabel="Segunda opción, parte inferior. Estudiar, ver material de estudio"
        >
          <View style={[styles.iconWrapper, styles.iconEstudiar]}>
            <Ionicons name="book" size={40} color="#FF6B6B" />
          </View>
          <Text style={[styles.cardTitle, styles.cardTitleEstudiar]}>📚 Estudiar</Text>
          <Text style={styles.cardDesc}>
            Revisa el material de estudio antes de practicar
          </Text>
          <View style={[styles.badge, styles.badgeEstudiar]}>
            <Text style={styles.badgeText}>Selecciona una materia</Text>
          </View>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F6FA" },
  header: {
    padding: 30,
    paddingTop: 50,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30
  },
  title: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  subtitle: { color: "#ddd", fontSize: 16, marginTop: 5 },
  content: { flex: 1, padding: 20, justifyContent: "center", gap: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    elevation: 6,
    alignItems: "center",
    borderLeftWidth: 5,
    borderLeftColor: "#7B61FF"
  },
  cardEstudiar: { borderLeftColor: "#FF6B6B" },
  iconWrapper: {
    backgroundColor: "#F0EDFF",
    borderRadius: 50,
    padding: 15,
    marginBottom: 15
  },
  iconEstudiar: { backgroundColor: "#FFE8E8" },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#7B61FF",
    marginBottom: 8
  },
  cardTitleEstudiar: { color: "#FF6B6B" },
  cardDesc: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20
  },
  badge: {
    marginTop: 15,
    backgroundColor: "#7B61FF",
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20
  },
  badgeEstudiar: { backgroundColor: "#FF6B6B" },
  badgeText: { color: "#fff", fontWeight: "bold", fontSize: 13 }
});