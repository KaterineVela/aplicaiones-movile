// Importación de React y hook useEffect
import React, { useEffect } from "react";

// Importación de componentes de React Native
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing
} from "react-native";

// ---------------------------------------------------
// COMPONENTE: PuntoParpadeante
// Crea un punto animado que cambia de opacidad
// ---------------------------------------------------
function PuntoParpadeante({ delay }) {

  // Valor animado de la opacidad
  const opacidad = new Animated.Value(0.3);

  // useEffect que ejecuta la animación al montar el componente
  useEffect(() => {

    // Animación en bucle infinito
    const anim = Animated.loop(

      // Secuencia de animaciones
      Animated.sequence([

        // Espera antes de iniciar la animación
        Animated.delay(delay),

        // Animación para aumentar opacidad
        Animated.timing(opacidad, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true
        }),

        // Animación para disminuir opacidad
        Animated.timing(opacidad, {
          toValue: 0.3,
          duration: 400,
          useNativeDriver: true
        })
      ])
    );

    // Inicia la animación
    anim.start();

    // Limpieza al desmontar componente
    return () => anim.stop();

  }, []);

  // Retorna un punto animado
  return (
    <Animated.View
      style={[
        styles.punto,
        { opacity: opacidad }
      ]}
    />
  );
}

// ---------------------------------------------------
// COMPONENTE PRINCIPAL
// Pantalla de inicio de la aplicación
// ---------------------------------------------------
export default function PantallaInicio({ navigation }) {

  // Animación de opacidad del logo
  const opacidadLogo = new Animated.Value(0);

  // Animación de escala del logo
  const escalaLogo = new Animated.Value(0.7);

  // Animación de opacidad del texto
  const opacidadTexto = new Animated.Value(0);

  // useEffect que se ejecuta al cargar la pantalla
  useEffect(() => {

    // Ejecuta varias animaciones al mismo tiempo
    Animated.parallel([

      // Animación de aparición del logo
      Animated.timing(opacidadLogo, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true
      }),

      // Animación de escala tipo rebote
      Animated.spring(escalaLogo, {
        toValue: 1,
        tension: 60,
        friction: 7,
        useNativeDriver: true
      })

    ]).start(() => {

      // Cuando termina la animación principal,
      // aparece el texto
      Animated.timing(opacidadTexto, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true
      }).start();
    });

    // Temporizador para cambiar automáticamente a Login
    const timer = setTimeout(() => {
      navigation.replace("Login");
    }, 2500);

    // Limpieza del temporizador
    return () => clearTimeout(timer);

  }, []);

  // Renderizado principal
  return (
    <View style={styles.container}>

      {/* -------------------------
          CÍRCULOS DECORATIVOS
      ------------------------- */}

      <View style={styles.circuloTopLeft} />
      <View style={styles.circuloTopRight} />
      <View style={styles.circuloBottomRight} />
      <View style={styles.circuloBottomLeft} />

      {/* -------------------------
          CONTENIDO CENTRAL
      ------------------------- */}
      <View style={styles.centro}>

        {/* Caja animada del logo */}
        <Animated.View
          style={[
            styles.iconBox,
            {
              opacity: opacidadLogo,
              transform: [{ scale: escalaLogo }]
            }
          ]}
        >

          {/* Emoji principal */}
          <Text style={styles.iconEmoji}>
            📚
          </Text>
        </Animated.View>

        {/* Texto animado */}
        <Animated.View
          style={{
            opacity: opacidadTexto,
            alignItems: "center"
          }}
        >

          {/* Nombre de la aplicación */}
          <Text style={styles.appNombre}>
            Simuacro
          </Text>

          {/* Slogan */}
          <Text style={styles.appSlogan}>
            Prepárate para el ICFES
          </Text>
        </Animated.View>

      </View>

      {/* -------------------------
          INDICADOR DE CARGA
      ------------------------- */}
      <Animated.View
        style={[
          styles.footer,
          { opacity: opacidadTexto }
        ]}
      >

        {/* Contenedor de puntos */}
        <View style={styles.puntosRow}>

          {/* Puntos animados */}
          <PuntoParpadeante delay={0} />
          <PuntoParpadeante delay={200} />
          <PuntoParpadeante delay={400} />
        </View>
      </Animated.View>

    </View>
  );
}

// ---------------------------------------------------
// ESTILOS DE LA PANTALLA
// ---------------------------------------------------
const styles = StyleSheet.create({

  // Contenedor principal
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },

  // Círculo decorativo superior izquierdo
  circuloTopLeft: {
    position: "absolute",
    top: -80,
    left: -80,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "#A78BFA"
  },

  // Círculo decorativo superior derecho
  circuloTopRight: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "#5B21B6"
  },

  // Círculo decorativo inferior derecho
  circuloBottomRight: {
    position: "absolute",
    bottom: -80,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#A78BFA"
  },

  // Círculo decorativo inferior izquierdo
  circuloBottomLeft: {
    position: "absolute",
    bottom: -50,
    left: -50,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#7B61FF"
  },

  // Contenedor central
  centro: {
    alignItems: "center",
    gap: 24
  },

  // Caja del icono principal
  iconBox: {
    width: 130,
    height: 130,
    borderRadius: 28,
    backgroundColor: "#F3F0FF",
    alignItems: "center",
    justifyContent: "center"
  },

  // Emoji principal
  iconEmoji: {
    fontSize: 64
  },

  // Nombre de la aplicación
  appNombre: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#7B61FF",
    letterSpacing: 1,
    marginTop: 8
  },

  // Slogan de la aplicación
  appSlogan: {
    fontSize: 15,
    color: "#9CA3AF",
    marginTop: 6
  },

  // Contenedor inferior
  footer: {
    position: "absolute",
    bottom: 60,
    alignItems: "center"
  },

  // Contenedor horizontal de puntos
  puntosRow: {
    flexDirection: "row",
    gap: 10
  },

  // Estilo de cada punto
  punto: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#7B61FF"
  }
});