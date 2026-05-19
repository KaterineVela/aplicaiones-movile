// Importación de React y hooks necesarios
import React, { useContext, useEffect } from "react";

// Importación de componentes básicos de React Native
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform
} from "react-native";

// Importación del componente de gradiente
import { LinearGradient } from "expo-linear-gradient";

// Importación del contexto de accesibilidad
import { AccessibilityContext } from "../context/AccessibilityContext";

// Importación de la barra de navegación inferior
import BottomNav from "../components/BottomNav";

// Importación de preguntas de Ciencias Sociales
import { preguntas as preguntasSociales } from "../data/preguntas";

// Importación de preguntas de Inglés
import { preguntasIngles } from "../data/preguntasIngles";

// Componente principal de la pantalla de recomendaciones
export default function RecomendacionesScreen({ route, navigation }) {

  // Obtiene el porcentaje recibido desde la navegación
  const porcentaje = route?.params?.porcentaje ?? 0;

  // Obtiene las respuestas del usuario
  const respuestas = route?.params?.respuestas ?? [];

  // Obtiene la materia seleccionada
  const materia = route?.params?.materia ?? "sociales";

  // Selecciona el banco de preguntas dependiendo de la materia
  const banco = materia === "ingles" ? preguntasIngles : preguntasSociales;

  // Define el nombre visible de la materia
  const tituloMateria = materia === "ingles" ? "Inglés" : "Ciencias Sociales";

  // Define el color principal según la materia
  const colorAccent = materia === "ingles" ? "#0EA5E9" : "#7B61FF";

  // Obtiene funciones y estados del contexto de accesibilidad
  const context = useContext(AccessibilityContext) || {};

  // Función para reproducir voz
  const hablar = context.hablar || (() => {});

  // Estado que indica si la voz está activa
  const vozActiva = context.vozActiva || false;

  // Función para activar/desactivar voz
  const toggleVoz = context.toggleVoz || (() => {});

  // Variables para almacenar información del nivel del usuario
  let nivel = "", intentos = "", mensaje = "", colorNivel = colorAccent;

  // Evaluación del nivel según el porcentaje obtenido
  if (porcentaje <= 40) {

    // Nivel bajo
    nivel = "Nivel bajo";
    intentos = "3 a 5 intentos recomendados";
    mensaje = "Debes reforzar los temas básicos antes de volver a practicar";
    colorNivel = "#F44336";

  } else if (porcentaje <= 70) {

    // Nivel medio
    nivel = "Nivel medio";
    intentos = "2 a 3 intentos recomendados";
    mensaje = "Vas bien, pero puedes mejorar repasando algunos temas";
    colorNivel = "#FF9800";

  } else {

    // Nivel alto
    nivel = "Nivel alto";
    intentos = "1 a 2 intentos recomendados";
    mensaje = "Excelente desempeño. Sigue practicando para mantener el nivel";
    colorNivel = "#4CAF50";
  }

  // Filtra las preguntas incorrectas del usuario
  const incorrectas = respuestas.filter(r => {

    // Busca la pregunta correspondiente por ID
    const p = banco.find(p => p.id === r.id);

    // Retorna las respuestas incorrectas
    return p?.correcta !== r.respuesta;
  });

  // useEffect que se ejecuta al cargar la pantalla
  useEffect(() => {

    // Si la voz está activa, se reproduce una explicación de la pantalla
    if (vozActiva) {
      hablar(
        `Pantalla de recomendaciones. Materia: ${tituloMateria}. ` +
        `Tu nivel es ${nivel}. ${mensaje}. ${intentos}. ` +
        `Tienes ${incorrectas.length > 0 ? "cuatro" : "tres"} opciones: ` +
        (incorrectas.length > 0
          ? `Primera opción, parte superior: Ver preguntas incorrectas, hay ${incorrectas.length} pregunta${incorrectas.length > 1 ? "s" : ""} fallidas. `
          : "") +
        `${incorrectas.length > 0 ? "Segunda" : "Primera"} opción: Estudiar material de ${tituloMateria}. ` +
        `${incorrectas.length > 0 ? "Tercera" : "Segunda"} opción: Volver a practicar. ` +
        `${incorrectas.length > 0 ? "Cuarta" : "Tercera"} opción, parte inferior: Volver al inicio.`
      );
    }
  }, []);

  // Función para navegar a la pantalla de estudio
  const irAEstudiar = () => {

    // Define la posición del botón según existan errores o no
    const pos = incorrectas.length > 0 ? "Segunda opción" : "Primera opción";

    // Reproduce mensaje de voz
    if (vozActiva) hablar(`${pos}. Abriendo material de estudio de ${tituloMateria}.`);

    // Navega según la materia seleccionada
    if (materia === "ingles") {
      navigation.navigate("MaterialIngles");
    } else {
      navigation.navigate("MaterialSociales");
    }
  };

  // Renderizado principal del componente
  return (
    <View style={styles.wrapper}>

      {/* Botón para activar/desactivar voz */}
      <TouchableOpacity
        style={styles.audioGlobal}
        onPress={toggleVoz}
        accessibilityLabel={vozActiva ? "Desactivar voz" : "Activar voz"}
      >
        <Text style={{ color: "#fff" }}>
          {vozActiva ? "🔊 Voz activada" : "🔇 Activar voz"}
        </Text>
      </TouchableOpacity>

      {/* Encabezado con gradiente */}
      <LinearGradient
        colors={materia === "ingles" ? ["#0EA5E9", "#38BDF8"] : ["#7B61FF", "#A78BFA"]}
        style={styles.header}
      >
        {/* Título principal */}
        <Text style={styles.title}>📋 Recomendaciones</Text>

        {/* Subtítulo con materia y porcentaje */}
        <Text style={styles.headerSub}>
          {tituloMateria} · {porcentaje}% de puntaje
        </Text>
      </LinearGradient>

      {/* Contenedor con scroll */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >

        {/* Tarjeta de información del nivel */}
        <View style={[styles.nivelCard, { borderLeftColor: colorNivel }]}>
          
          <Text style={styles.subtitle}>Tu nivel:</Text>
          <Text style={[styles.nivelTexto, { color: colorNivel }]}>{nivel}</Text>

          <Text style={styles.subtitle}>Evaluación:</Text>
          <Text style={styles.texto}>{mensaje}</Text>

          <Text style={styles.subtitle}>Intentos sugeridos:</Text>
          <Text style={styles.texto}>{intentos}</Text>
        </View>

        {/* Botón para ver preguntas incorrectas */}
        {incorrectas.length > 0 && (
          <TouchableOpacity
            style={styles.btnIncorrectas}
            onPress={() => {

              // Mensaje de voz al presionar el botón
              if (vozActiva) hablar(`Primera opción, parte superior. Ver preguntas incorrectas. Fallaste ${incorrectas.length} pregunta${incorrectas.length > 1 ? "s" : ""}.`);

              // Navega a la pantalla de preguntas incorrectas
              navigation.navigate("PreguntasIncorrectas", { respuestas, incorrectas, materia });
            }}
            accessibilityLabel={`Primera opción, parte superior. Ver ${incorrectas.length} preguntas incorrectas`}
          >
            <Text style={styles.btnIncorrectasTexto}>
              ❌ Ver preguntas incorrectas ({incorrectas.length})
            </Text>
          </TouchableOpacity>
        )}

        {/* Botón para estudiar material */}
        <TouchableOpacity
          style={[styles.btnEstudiar, { backgroundColor: colorAccent }]}
          onPress={irAEstudiar}
          accessibilityLabel={`${incorrectas.length > 0 ? "Segunda" : "Primera"} opción. Estudiar material de ${tituloMateria}`}
        >
          <Text style={styles.btnTexto}>📚 Estudiar material de {tituloMateria}</Text>
        </TouchableOpacity>

        {/* Botón para volver a practicar */}
        <TouchableOpacity
          style={styles.btnPracticar}
          onPress={() => {

            // Posición dinámica del botón
            const pos = incorrectas.length > 0 ? "Tercera opción" : "Segunda opción";

            // Reproduce mensaje de voz
            if (vozActiva) hablar(`${pos}. Volver a practicar ${tituloMateria}.`);

            // Navega nuevamente al quiz
            navigation.navigate("Quiz", { materia });
          }}
          accessibilityLabel={`${incorrectas.length > 0 ? "Tercera" : "Segunda"} opción. Volver a practicar`}
        >
          <Text style={styles.btnTexto}>🔄 Volver a practicar</Text>
        </TouchableOpacity>

        {/* Botón para volver al inicio */}
        <TouchableOpacity
          style={[styles.btnInicio, { borderColor: colorAccent }]}
          onPress={() => {

            // Posición dinámica del botón
            const pos = incorrectas.length > 0 ? "Cuarta opción, parte inferior" : "Tercera opción, parte inferior";

            // Reproduce mensaje de voz
            if (vozActiva) hablar(`${pos}. Volviendo al inicio.`);

            // Navega a Home
            navigation.navigate("Home");
          }}
          accessibilityLabel={`${incorrectas.length > 0 ? "Cuarta" : "Tercera"} opción, parte inferior. Volver al inicio`}
        >
          <Text style={[styles.btnTexto, { color: colorAccent }]}>🏠 Volver al inicio</Text>
        </TouchableOpacity>

        {/* Espacio inferior */}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Barra de navegación inferior */}
      <BottomNav navigation={navigation} />
    </View>
  );
}

// Estilos del componente
const styles = StyleSheet.create({

  // Contenedor principal
  wrapper: {
    flex: 1,
    backgroundColor: "#F5F6FA",

    // Ajustes especiales para versión web
    ...(Platform.OS === "web" ? { height: "100vh", overflow: "hidden" } : {})
  },

  // Botón global de voz
  audioGlobal: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 10,
    zIndex: 10
  },

  // Encabezado superior
  header: {
    padding: 25,
    paddingTop: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexShrink: 0
  },

  // Estilo del título principal
  title: { color: "#fff", fontSize: 22, fontWeight: "bold" },

  // Subtítulo del encabezado
  headerSub: { color: "rgba(255,255,255,0.85)", fontSize: 13, marginTop: 4 },

  // Estilo del ScrollView
  scroll: { flex: 1 },

  // Contenido interno del scroll
  scrollContent: { padding: 20, paddingBottom: 16, flexGrow: 1 },

  // Tarjeta del nivel del usuario
  nivelCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 14,
    elevation: 4,
    borderLeftWidth: 5
  },

  // Subtítulos internos
  subtitle: { fontSize: 14, fontWeight: "bold", color: "#555", marginTop: 10 },

  // Texto del nivel
  nivelTexto: { fontSize: 20, fontWeight: "bold", marginTop: 4 },

  // Texto descriptivo
  texto: { fontSize: 15, color: "#444", marginTop: 4, lineHeight: 21 },

  // Botón de preguntas incorrectas
  btnIncorrectas: {
    backgroundColor: "#FFF0F0",
    borderWidth: 2,
    borderColor: "#F44336",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12
  },

  // Texto del botón incorrectas
  btnIncorrectasTexto: { color: "#F44336", fontWeight: "bold", fontSize: 15 },

  // Botón estudiar
  btnEstudiar: {
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12
  },

  // Botón practicar
  btnPracticar: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12
  },

  // Botón inicio
  btnInicio: {
    backgroundColor: "#fff",
    borderWidth: 2,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12
  },

  // Texto general de botones
  btnTexto: { color: "#fff", fontWeight: "bold", fontSize: 15 }
});