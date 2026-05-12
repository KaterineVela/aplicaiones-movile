import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing
} from "react-native";

function PuntoParpadeante({ delay }) {
  const opacidad = new Animated.Value(0.3);

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(opacidad, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true
        }),
        Animated.timing(opacidad, {
          toValue: 0.3,
          duration: 400,
          useNativeDriver: true
        })
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return <Animated.View style={[styles.punto, { opacity: opacidad }]} />;
}

export default function PantallaInicio({ navigation }) {
  const opacidadLogo = new Animated.Value(0);
  const escalaLogo = new Animated.Value(0.7);
  const opacidadTexto = new Animated.Value(0);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacidadLogo, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true
      }),
      Animated.spring(escalaLogo, {
        toValue: 1,
        tension: 60,
        friction: 7,
        useNativeDriver: true
      })
    ]).start(() => {
      Animated.timing(opacidadTexto, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true
      }).start();
    });

    const timer = setTimeout(() => {
      navigation.replace("Login");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>

      {/* Círculos decorativos morados */}
      <View style={styles.circuloTopLeft} />
      <View style={styles.circuloTopRight} />
      <View style={styles.circuloBottomRight} />
      <View style={styles.circuloBottomLeft} />

      {/* Contenido central */}
      <View style={styles.centro}>

        <Animated.View style={[
          styles.iconBox,
          { opacity: opacidadLogo, transform: [{ scale: escalaLogo }] }
        ]}>
          <Text style={styles.iconEmoji}>📚</Text>
        </Animated.View>

        <Animated.View style={{ opacity: opacidadTexto, alignItems: "center" }}>
          <Text style={styles.appNombre}>Simuacro</Text>
          <Text style={styles.appSlogan}>Prepárate para el ICFES</Text>
        </Animated.View>

      </View>

      {/* Puntos de carga */}
      <Animated.View style={[styles.footer, { opacity: opacidadTexto }]}>
        <View style={styles.puntosRow}>
          <PuntoParpadeante delay={0} />
          <PuntoParpadeante delay={200} />
          <PuntoParpadeante delay={400} />
        </View>
      </Animated.View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  circuloTopLeft: {
    position: "absolute",
    top: -80,
    left: -80,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "#A78BFA"
  },
  circuloTopRight: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "#5B21B6"
  },
  circuloBottomRight: {
    position: "absolute",
    bottom: -80,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#A78BFA"
  },
  circuloBottomLeft: {
    position: "absolute",
    bottom: -50,
    left: -50,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#7B61FF"
  },
  centro: {
    alignItems: "center",
    gap: 24
  },
  iconBox: {
    width: 130,
    height: 130,
    borderRadius: 28,
    backgroundColor: "#F3F0FF",
    alignItems: "center",
    justifyContent: "center"
  },
  iconEmoji: {
    fontSize: 64
  },
  appNombre: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#7B61FF",
    letterSpacing: 1,
    marginTop: 8
  },
  appSlogan: {
    fontSize: 15,
    color: "#9CA3AF",
    marginTop: 6
  },
  footer: {
    position: "absolute",
    bottom: 60,
    alignItems: "center"
  },
  puntosRow: {
    flexDirection: "row",
    gap: 10
  },
  punto: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#7B61FF"
  }
});