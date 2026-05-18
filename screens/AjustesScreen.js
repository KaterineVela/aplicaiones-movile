import React, { useContext, useEffect, useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, Image, Switch, ScrollView, Platform
} from "react-native";
import { AccessibilityContext } from "../context/AccessibilityContext";
import BottomNav from "../components/BottomNav";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function AjustesScreen({ navigation }) {
  const { vozActiva, toggleVoz, hablar } = useContext(AccessibilityContext);
  const { usuario, logout } = useContext(AuthContext);
  const [notificaciones, setNotificaciones] = useState(true);
  const [modoOscuro, setModoOscuro] = useState(false);
  const [racha, setRacha] = useState(0);

  useEffect(() => {
    const cargarPerfil = async () => {
      if (!usuario) return;
      try {
        const perfilSnap = await getDoc(doc(db, "usuarios", usuario.uid, "perfil", "datos"));
        if (perfilSnap.exists()) {
          setRacha(perfilSnap.data().racha || 0);
        }
      } catch (e) {
        console.log("Error cargando perfil:", e);
      }
    };
    cargarPerfil();
  }, []);

  useEffect(() => {
    if (vozActiva) {
      hablar(
        "Pantalla de ajustes. Parte superior: tu perfil con nombre y correo. " +
        "Parte central: opciones de configuración. " +
        "Parte inferior: botón rojo para cerrar sesión."
      );
    }
  }, []);

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={true}>

        {/* PERFIL */}
        <View style={styles.profile}>
          <Image
            source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7iCHs-4Bpi2tfkr9AkgDkZNvBuOMak7IfmQ&s" }}
            style={styles.avatar}
          />
          <TouchableOpacity onPress={() => hablar("Cambiar foto de perfil")}>
            <Text style={styles.changePhoto}>Cambiar foto</Text>
          </TouchableOpacity>
          <Text style={styles.name}>{usuario?.displayName || "Sin nombre"}</Text>
          <Text style={styles.email}>{usuario?.email || ""}</Text>

          {/* RACHA */}
          {racha > 0 && (
            <View style={styles.rachaBadge}>
              <Text style={styles.rachaIcono}>🔥</Text>
              <Text style={styles.rachaTexto}>{racha} día{racha !== 1 ? "s" : ""} de racha</Text>
            </View>
          )}
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
                  if (!vozActiva) hablar("Voz activada.");
                }, 200);
              }}
            />
          </View>

          <View style={styles.option}>
            <Ionicons name="notifications" size={22} color="#7B61FF" />
            <Text style={styles.optionText}>Notificaciones</Text>
            <Switch
              value={notificaciones}
              onValueChange={() => {
                setNotificaciones(!notificaciones);
                hablar("Notificaciones " + (!notificaciones ? "activadas" : "desactivadas"));
              }}
            />
          </View>

          <View style={styles.option}>
            <Ionicons name="moon" size={22} color="#7B61FF" />
            <Text style={styles.optionText}>Modo oscuro</Text>
            <Switch
              value={modoOscuro}
              onValueChange={() => {
                setModoOscuro(!modoOscuro);
                hablar(!modoOscuro ? "Modo oscuro activado" : "Modo claro activado");
              }}
            />
          </View>
        </View>

        {/* CERRAR SESIÓN */}
        <TouchableOpacity
          style={styles.logout}
          onPress={async () => {
            hablar("Cerrando sesión.");
            await logout();
          }}
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
  wrapper: { flex: 1, backgroundColor: "#F5F6FA", ...(Platform.OS === "web" ? { height: "100vh", overflow: "hidden" } : {}) },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 20, flexGrow: 1 },
  profile: { alignItems: "center", marginTop: 40, marginBottom: 10 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  changePhoto: { color: "#7B61FF", marginTop: 5 },
  name: { fontSize: 18, fontWeight: "bold", marginTop: 10 },
  email: { color: "#666" },
  rachaBadge: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#FFF3E0", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginTop: 12, borderWidth: 1, borderColor: "#FFB74D" },
  rachaIcono: { fontSize: 18 },
  rachaTexto: { color: "#E65100", fontWeight: "bold", fontSize: 14 },
  section: { marginHorizontal: 20, marginTop: 20 },
  option: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#fff", padding: 15, borderRadius: 15, marginBottom: 10 },
  optionText: { flex: 1, marginLeft: 10 },
  logout: { flexDirection: "row", backgroundColor: "#FF4D4D", margin: 20, padding: 15, borderRadius: 15, justifyContent: "center", alignItems: "center" },
  logoutText: { color: "#fff", marginLeft: 10, fontWeight: "bold" }
});