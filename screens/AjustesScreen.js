import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Switch,
  ScrollView,
  Platform
} from "react-native";
import { AccessibilityContext } from "../context/AccessibilityContext";
import BottomNav from "../components/BottomNav";
import { Ionicons } from "@expo/vector-icons";

export default function AjustesScreen({ navigation }) {
  const { vozActiva, toggleVoz, hablar } = useContext(AccessibilityContext);
  const [notificaciones, setNotificaciones] = useState(true);
  const [modoOscuro, setModoOscuro] = useState(false);

  useEffect(() => {
    if (vozActiva) {
      hablar(
        "Pantalla de ajustes. Parte superior: tu perfil con foto, nombre y correo. " +
        "Parte central: tres opciones de configuración. " +
        "Primera opción: Accesibilidad por voz, actualmente " + (vozActiva ? "activada" : "desactivada") + ". " +
        "Segunda opción: Notificaciones, actualmente " + (notificaciones ? "activadas" : "desactivadas") + ". " +
        "Tercera opción: Modo oscuro, actualmente " + (modoOscuro ? "activado" : "desactivado") + ". " +
        "Parte inferior: botón rojo para cerrar sesión. " +
        "En la parte inferior de la pantalla están los botones de navegación: Inicio a la izquierda, Resultados en el centro y Ajustes a la derecha."
      );
    }
  }, []);

  return (
    <View style={styles.wrapper}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >

        {/* PERFIL */}
        <View style={styles.profile}>
          <Image
            source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7iCHs-4Bpi2tfkr9AkgDkZNvBuOMak7IfmQ&s" }}
            style={styles.avatar}
            accessibilityLabel="Foto de perfil, parte superior de la pantalla"
          />
          <TouchableOpacity
            onPress={() => hablar("Cambiar foto de perfil")}
            accessibilityLabel="Cambiar foto de perfil"
          >
            <Text style={styles.changePhoto}>Cambiar foto</Text>
          </TouchableOpacity>
          <Text style={styles.name}>Usuario Demo</Text>
          <Text style={styles.email}>usuario@email.com</Text>
        </View>

        {/* OPCIONES */}
        <View style={styles.section}>

          <View style={styles.option}>
            <Ionicons name="volume-high" size={22} color="#7B61FF" />
            <Text style={styles.optionText}>Accesibilidad por voz</Text>
            <Switch
              value={vozActiva}
              onValueChange={() => {
                toggleVoz();
                setTimeout(() => {
                  if (!vozActiva) hablar("Primera opción, parte central. Voz activada.");
                }, 200);
              }}
              accessibilityLabel="Primera opción, parte central. Activar o desactivar accesibilidad por voz"
            />
          </View>

          <View style={styles.option}>
            <Ionicons name="notifications" size={22} color="#7B61FF" />
            <Text style={styles.optionText}>Notificaciones</Text>
            <Switch
              value={notificaciones}
              onValueChange={() => {
                setNotificaciones(!notificaciones);
                hablar("Segunda opción, parte central. Notificaciones " + (!notificaciones ? "activadas" : "desactivadas"));
              }}
              accessibilityLabel="Segunda opción, parte central. Activar o desactivar notificaciones"
            />
          </View>

          <View style={styles.option}>
            <Ionicons name="moon" size={22} color="#7B61FF" />
            <Text style={styles.optionText}>Modo oscuro</Text>
            <Switch
              value={modoOscuro}
              onValueChange={() => {
                setModoOscuro(!modoOscuro);
                hablar("Tercera opción, parte central. " + (!modoOscuro ? "Modo oscuro activado" : "Modo claro activado"));
              }}
              accessibilityLabel="Tercera opción, parte central. Activar o desactivar modo oscuro"
            />
          </View>
        </View>

        {/* CERRAR SESIÓN */}
        <TouchableOpacity
          style={styles.logout}
          onPress={() => {
            hablar("Botón cerrar sesión, parte inferior. Cerrando sesión.");
            navigation.navigate("Login");
          }}
          accessibilityLabel="Botón cerrar sesión, parte inferior de la pantalla"
        >
          <Ionicons name="log-out" size={22} color="#fff" />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>

      <BottomNav navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#F5F6FA",
    ...(Platform.OS === "web" ? { height: "100vh", overflow: "hidden" } : {})
  },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 20, flexGrow: 1 },
  profile: { alignItems: "center", marginTop: 40, marginBottom: 10 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  changePhoto: { color: "#7B61FF", marginTop: 5 },
  name: { fontSize: 18, fontWeight: "bold", marginTop: 10 },
  email: { color: "#666" },
  section: { marginHorizontal: 20, marginTop: 20 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10
  },
  optionText: { flex: 1, marginLeft: 10 },
  logout: {
    flexDirection: "row",
    backgroundColor: "#FF4D4D",
    margin: 20,
    padding: 15,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center"
  },
  logoutText: { color: "#fff", marginLeft: 10, fontWeight: "bold" }
});