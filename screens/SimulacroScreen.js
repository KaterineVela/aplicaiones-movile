// Importación de React y hooks necesarios
import React, { useContext, useEffect } from "react";

// Importación de componentes de React Native
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from "react-native";

// Importación del componente de gradiente
import { LinearGradient } from "expo-linear-gradient";

// Importación del contexto de accesibilidad
import { AccessibilityContext } from "../context/AccessibilityContext";

// Importación de iconos de Expo
import { Ionicons } from "@expo/vector-icons";

// Componente principal de la pantalla Simulacro
export default function SimulacroScreen({ navigation }) {

  // Obtiene valores del contexto de accesibilidad
  const { vozActiva, hablar } = useContext(AccessibilityContext);

  // useEffect que se ejecuta al cargar la pantalla
  useEffect(() => {

    // Si la voz está activa, reproduce guía de navegación
    if (vozActiva) {
      hablar(
        "Simulacro de examen. Tienes dos opciones en el centro de la pantalla. " +
        "Primera opción, parte superior: Practicar, para responder preguntas reales del ICFES. " +
        "Segunda opción, parte inferior: Estudiar, para revisar el material antes de practicar."
      );
    }
  }, []);

  // Renderizado principal de la pantalla
  return (
    <View style={styles.container}>

      {/* Encabezado superior con gradiente */}
      <LinearGradient
        colors={["#7B61FF", "#A78BFA"]}
        style={styles.header}
      >

        {/* Título principal */}
        <Text style={styles.title}>
          Simulacro de Examen
        </Text>

        {/* Subtítulo */}
        <Text style={styles.subtitle}>
          ¿Qué deseas hacer?
        </Text>
      </LinearGradient>

      {/* Contenedor principal de opciones */}
      <View style={styles.content}>

        {/* -------------------------
            TARJETA PRACTICAR
        ------------------------- */}
        <TouchableOpacity
          style={styles.card}

          // Acción al presionar
          onPress={() => {

            // Mensaje por voz
            if (vozActiva)
              hablar("Primera opción, parte superior. Abriendo modo práctica. Elige una materia.");

            // Navega a selección de materia en modo práctica
            navigation.navigate("SeleccionMateria", { modo: "practicar" });
          }}

          // Texto de accesibilidad
          accessibilityLabel="Primera opción, parte superior. Practicar, responder preguntas del ICFES"
        >

          {/* Contenedor del icono */}
          <View style={styles.iconWrapper}>

            {/* Icono lápiz */}
            <Ionicons
              name="pencil"
              size={40}
              color="#7B61FF"
            />
          </View>

          {/* Título de la tarjeta */}
          <Text style={styles.cardTitle}>
            📝 Practicar
          </Text>

          {/* Descripción */}
          <Text style={styles.cardDesc}>
            Responde preguntas reales del examen ICFES Saber 11°
          </Text>

          {/* Etiqueta inferior */}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              Selecciona una materia
            </Text>
          </View>
        </TouchableOpacity>

        {/* -------------------------
            TARJETA ESTUDIAR
        ------------------------- */}
        <TouchableOpacity
          style={[styles.card, styles.cardEstudiar]}

          // Acción al presionar
          onPress={() => {

            // Mensaje por voz
            if (vozActiva)
              hablar("Segunda opción, parte inferior. Abriendo material de estudio. Elige una materia.");

            // Navega a selección de materia en modo estudiar
            navigation.navigate("SeleccionMateria", { modo: "estudiar" });
          }}

          // Texto de accesibilidad
          accessibilityLabel="Segunda opción, parte inferior. Estudiar, ver material de estudio"
        >

          {/* Contenedor del icono */}
          <View style={[styles.iconWrapper, styles.iconEstudiar]}>

            {/* Icono libro */}
            <Ionicons
              name="book"
              size={40}
              color="#FF6B6B"
            />
          </View>

          {/* Título de la tarjeta */}
          <Text style={[styles.cardTitle, styles.cardTitleEstudiar]}>
            📚 Estudiar
          </Text>

          {/* Descripción */}
          <Text style={styles.cardDesc}>
            Revisa el material de estudio antes de practicar
          </Text>

          {/* Etiqueta inferior */}
          <View style={[styles.badge, styles.badgeEstudiar]}>
            <Text style={styles.badgeText}>
              Selecciona una materia
            </Text>
          </View>
        </TouchableOpacity>

      </View>
    </View>
  );
}

// Estilos de la pantalla
const styles = StyleSheet.create({

  // Contenedor principal
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA"
  },

  // Encabezado superior
  header: {
    padding: 30,
    paddingTop: 50,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30
  },

  // Título principal
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold"
  },

  // Subtítulo
  subtitle: {
    color: "#ddd",
    fontSize: 16,
    marginTop: 5
  },

  // Contenedor de las tarjetas
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    gap: 20
  },

  // Tarjeta general
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    elevation: 6,
    alignItems: "center",

    // Línea lateral decorativa
    borderLeftWidth: 5,
    borderLeftColor: "#7B61FF"
  },

  // Estilo especial para tarjeta estudiar
  cardEstudiar: {
    borderLeftColor: "#FF6B6B"
  },

  // Contenedor circular del icono
  iconWrapper: {
    backgroundColor: "#F0EDFF",
    borderRadius: 50,
    padding: 15,
    marginBottom: 15
  },

  // Fondo especial del icono estudiar
  iconEstudiar: {
    backgroundColor: "#FFE8E8"
  },

  // Título de la tarjeta
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#7B61FF",
    marginBottom: 8
  },

  // Color especial para estudiar
  cardTitleEstudiar: {
    color: "#FF6B6B"
  },

  // Descripción de la tarjeta
  cardDesc: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20
  },

  // Etiqueta inferior
  badge: {
    marginTop: 15,
    backgroundColor: "#7B61FF",
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20
  },

  // Color especial para badge estudiar
  badgeEstudiar: {
    backgroundColor: "#FF6B6B"
  },

  // Texto del badge
  badgeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13
  }
});