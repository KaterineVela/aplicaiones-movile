import React, { useContext } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AccessibilityContext } from "../context/AccessibilityContext";

export default function BottomNav({ navigation }) {
  const { hablar, vozActiva } = useContext(AccessibilityContext);

  const ir = (pantalla, texto) => {
    if (vozActiva) hablar(texto);
    navigation.navigate(pantalla);
  };

  return (
    <View style={styles.container}>

      <TouchableOpacity
        style={styles.item}
        onPress={() => ir("Home", "Botón Inicio. Parte inferior izquierda. Yendo al inicio.")}
        accessibilityLabel="Inicio, botón inferior izquierdo"
      >
        <Ionicons name="home" size={26} color="#7B61FF" />
        <Text style={styles.text}>Inicio</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={() => ir("Resultados", "Botón Resultados. Parte inferior central. Yendo a resultados.")}
        accessibilityLabel="Resultados, botón inferior central"
      >
        <Ionicons name="bar-chart" size={26} color="#7B61FF" />
        <Text style={styles.text}>Resultados</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={() => ir("Ajustes", "Botón Ajustes. Parte inferior derecha. Yendo a ajustes.")}
        accessibilityLabel="Ajustes, botón inferior derecho"
      >
        <Ionicons name="settings" size={26} color="#7B61FF" />
        <Text style={styles.text}>Ajustes</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#eee"
  },
  item: {
    alignItems: "center"
  },
  text: {
    fontSize: 12,
    textAlign: "center",
    color: "#7B61FF"
  }
});