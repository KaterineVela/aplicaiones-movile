import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../context/AuthContext";
import { AccessibilityContext } from "../context/AccessibilityContext";

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const { vozActiva, toggleVoz, hablar } = useContext(AccessibilityContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);


  useEffect(() => {
    if (vozActiva) {
      hablar("Pantalla de inicio de sesión. Ingresa tu correo y contraseña");
    }
  }, []);

  const handleLogin = async () => {
   if (!email.trim() || !password) {
    hablar("Error. Debes completar todos los campos");
    return;
  }

  try {
    await login(email, password);
    hablar("Inicio de sesión exitoso");
    setModalVisible(true);
  } catch (error) {
      let mensaje = "Error al iniciar sesión";
      if (error.code === "auth/user-not-found") mensaje = "No existe una cuenta con ese correo";
     if (error.code === "auth/wrong-password") mensaje = "Contraseña incorrecta";
     if (error.code === "auth/invalid-email") mensaje = "El correo no es válido";
     if (error.code === "auth/invalid-credential") mensaje = "Correo o contraseña incorrectos";
      hablar(mensaje);
      Alert.alert("Error", mensaje);
    }
  };
  return (
    <View style={{ flex: 1 }}>

      {/* 🔊 BOTÓN GLOBAL VOZ */}
      <TouchableOpacity style={styles.audioGlobal} onPress={toggleVoz}>
        <Text style={{ color: "#fff" }}>
          {vozActiva ? "🔊 Voz activada" : "🔇 Activar voz"}
        </Text>
      </TouchableOpacity>

      {/* Fondo */}
      <LinearGradient
        colors={["#7B61FF", "#A78BFA"]}
        style={styles.top}
      />

      {/* Card */}
      <View style={styles.card}>
        <Text style={styles.title}>Sign in</Text>

        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={(text) => setEmail(text)}
          onFocus={() => hablar("Campo correo electrónico")}
          accessibilityLabel="Correo electrónico"
        />

        <TextInput
          placeholder="Password"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
          onFocus={() => hablar("Campo contraseña")}
          accessibilityLabel="Contraseña"
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}
          accessibilityLabel="Botón iniciar sesión"
        >
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            hablar("Ir a registro");
            navigation.navigate("Register");
          }}
          accessibilityLabel="¿No tienes cuenta? Regístrate"
        >
          <Text style={styles.link}>
            Don't have account? Sign up
          </Text>
        </TouchableOpacity>
      </View>

      {/* MODAL */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>

            <Text style={styles.check}>✅</Text>

            <Text style={styles.modalTitle}>
              Inicio de sesión exitoso
            </Text>

            <Text style={styles.modalText}>
              Has ingresado correctamente
            </Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                login(email);
                navigation.navigate("Home");
              }}
              accessibilityLabel="Continuar al inicio"
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                Continuar
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  audioGlobal: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 10,
    zIndex: 10
  },
  top: {
    height: 250,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40
  },
  card: {
    position: "absolute",
    top: 180,
    alignSelf: "center",
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    elevation: 8
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#7B61FF",
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15
  },
  button: {
    backgroundColor: "#7B61FF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold"
  },
  link: {
    marginTop: 15,
    textAlign: "center",
    color: "#888"
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center"
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    alignItems: "center"
  },
  check: {
    fontSize: 40,
    marginBottom: 10
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10
  },
  modalText: {
    textAlign: "center",
    color: "#666",
    marginBottom: 20
  },
  modalButton: {
    backgroundColor: "#7B61FF",
    padding: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center"
  }
});