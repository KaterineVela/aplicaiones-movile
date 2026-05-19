import React, { useContext } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AccessibilityContext } from "../context/AccessibilityContext";

// Barra de navegación inferior con soporte de accesibilidad por voz.
// Recibe `navigation` de React Navigation para moverse entre pantallas.
export default function BottomNav({ navigation }) {
  const { hablar, vozActiva } = useContext(AccessibilityContext);

  // Navega a la pantalla indicada y, si el modo de voz está activo,
  // lee en voz alta el texto antes de hacer la transición.
  const ir = (pantalla, texto) => {
    if (vozActiva) hablar(texto);
    navigation.navigate(pantalla);
  };

  return (
    <View style={styles.container}>

      <TouchableOpacity
        style={styles.item}
        onPress={() => ir("Home", "Botón Inicio. Yendo al inicio.")}
        accessibilityLabel="Inicio, botón inferior izquierdo"
      >
        <Ionicons name="home" size={26} color="#7B61FF" />
        <Text style={styles.text}>Inicio</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={() => ir("Progreso", "Botón Progreso. Yendo a tu progreso por materia.")}
        accessibilityLabel="Progreso, botón inferior central"
      >
        <Ionicons name="trending-up" size={26} color="#7B61FF" />
        <Text style={styles.text}>Progreso</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={() => ir("Ajustes", "Botón Ajustes. Yendo a ajustes.")}
        accessibilityLabel="Ajustes, botón inferior derecho"
      >
        <Ionicons name="settings" size={26} color="#7B61FF" />
        <Text style={styles.text}>Ajustes</Text>
      </TouchableOpacity>

    </View>
  );
}

// Estilos del nav: fila horizontal con separación uniforme y borde superior sutil.
const styles = StyleSheet.create({
  container: {
    flexDirection: "row", justifyContent: "space-around",
    padding: 15, backgroundColor: "#fff",
    borderTopWidth: 1, borderColor: "#eee"
  },
  item: { alignItems: "center" },
  text: { fontSize: 12, textAlign: "center", color: "#7B61FF" }
});