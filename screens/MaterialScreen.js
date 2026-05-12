import React, { useContext, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AccessibilityContext } from "../context/AccessibilityContext";
import BottomNav from "../components/BottomNav";


export default function MaterialScreen({ navigation }) {
  const context = useContext(AccessibilityContext) || {};
  const hablar = context.hablar || (() => {});
  const vozActiva = context.vozActiva || false;
  const toggleVoz = context.toggleVoz || (() => {});


  useEffect(() => {
    if (vozActiva) {
      hablar("Pantalla de material de estudio. Aquí encontrarás videos, ejercicios y documentos");
    }
  }, []);

  return (
    <View style={styles.container}>

      <TouchableOpacity
        style={styles.audioGlobal}
        onPress={toggleVoz}
        accessibilityLabel={vozActiva ? "Desactivar voz" : "Activar voz"}
      >
        <Text style={{ color: "#fff" }}>
          {vozActiva ? "🔊 Voz activada" : "🔇 Activar voz"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.title}>Material de estudio</Text>

      <Text style={styles.text}>
        Próximamente:{"\n"}• Videos{"\n"}• Ejercicios{"\n"}• PDFs
      </Text>

      <BottomNav navigation={navigation} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F6FA"
  },
  title: {
    fontSize: 24,
    fontWeight: "bold"
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
    color: "#555"
  },
  audioGlobal: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 10,
    zIndex: 10
  }
});