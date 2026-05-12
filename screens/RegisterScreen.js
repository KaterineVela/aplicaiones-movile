import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AccessibilityContext } from "../context/AccessibilityContext";

export default function RegisterScreen({ navigation }) {
  const { vozActiva, toggleVoz, hablar } = useContext(AccessibilityContext);

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  
  useEffect(() => {
    if (vozActiva) {
      hablar(
        "Pantalla de registro. Tienes cuatro campos para llenar: " +
        "Nombre completo en la parte superior del formulario. " +
        "Correo electrónico debajo del nombre. " +
        "Contraseña debajo del correo. " +
        "Confirmar contraseña al final. " +
        "Luego toca el botón Crear cuenta en la parte inferior del formulario."
      );
    }
  }, []);

  const handleRegister = () => {
    if (!nombre.trim() || !email.trim() || !password || !confirmar) {
      hablar("Error. Por favor llena todos los campos del formulario.");
      return;
    }
    if (password !== confirmar) {
      hablar("Error. Las contraseñas no coinciden. Revisa los campos de contraseña.");
      return;
    }
    hablar("Registro exitoso. Tu cuenta fue creada correctamente.");
    setModalVisible(true);
  };

  return (
    <View style={{ flex: 1 }}>

      {/* 🔊 BOTÓN VOZ */}
      <TouchableOpacity
        style={styles.audioGlobal}
        onPress={toggleVoz}
        accessibilityLabel={vozActiva ? "Desactivar voz" : "Activar voz"}
      >
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
        <Text style={styles.title}>Sign Up</Text>

        <TextInput
          placeholder="Nombre completo"
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
          onFocus={() => hablar("Campo nombre completo. Primer campo del formulario, parte superior.")}
          accessibilityLabel="Nombre completo"
        />

        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          onFocus={() => hablar("Campo correo electrónico. Segundo campo del formulario.")}
          accessibilityLabel="Correo electrónico"
        />

        <TextInput
          placeholder="Contraseña"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          onFocus={() => hablar("Campo contraseña. Tercer campo del formulario.")}
          accessibilityLabel="Contraseña"
        />

        <TextInput
          placeholder="Confirmar contraseña"
          style={styles.input}
          secureTextEntry
          value={confirmar}
          onChangeText={setConfirmar}
          onFocus={() => hablar("Campo confirmar contraseña. Cuarto y último campo del formulario.")}
          accessibilityLabel="Confirmar contraseña"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          accessibilityLabel="Botón Crear cuenta, parte inferior del formulario"
        >
          <Text style={styles.buttonText}>Crear cuenta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            hablar("Ir a inicio de sesión.");
            navigation.navigate("Login");
          }}
          accessibilityLabel="¿Ya tienes cuenta? Inicia sesión"
        >
          <Text style={styles.link}>
            ¿Ya tienes cuenta? Inicia sesión
          </Text>
        </TouchableOpacity>
      </View>

      {/* MODAL REGISTRO EXITOSO */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.check}>✅</Text>
            <Text style={styles.modalTitle}>Registro exitoso</Text>
            <Text style={styles.modalText}>
              Tu cuenta fue creada correctamente
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                hablar("Yendo a inicio de sesión.");
                navigation.navigate("Login");
              }}
              accessibilityLabel="Continuar a inicio de sesión"
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
    backgroundColor: "#333",
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
    top: 150,
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
    marginBottom: 12
  },
  button: {
    backgroundColor: "#7B61FF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
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
  check: { fontSize: 40, marginBottom: 10 },
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