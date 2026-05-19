// Importación de React y hooks necesarios
import React, { useState, useContext, useEffect } from "react";

// Importación de componentes de React Native
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert
} from "react-native";

// Importación del componente de gradiente
import { LinearGradient } from "expo-linear-gradient";

// Importación del contexto de accesibilidad
import { AccessibilityContext } from "../context/AccessibilityContext";

// Importación del contexto de autenticación
import { AuthContext } from "../context/AuthContext";

// Componente principal de la pantalla de registro
export default function RegisterScreen({ navigation }) {

  // Obtiene funciones y estados del contexto de accesibilidad
  const { vozActiva, toggleVoz, hablar } = useContext(AccessibilityContext);

  // Obtiene la función de registro desde el contexto de autenticación
  const { register } = useContext(AuthContext);

  // Estados para almacenar los datos ingresados por el usuario
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");

  // Estado para controlar la visibilidad del modal
  const [modalVisible, setModalVisible] = useState(false);

  // useEffect que se ejecuta al cargar la pantalla
  useEffect(() => {

    // Si la voz está activa, se reproduce una guía de la pantalla
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

  // Función encargada de registrar un nuevo usuario
  const handleRegister = async () => {

    // Validación de campos vacíos
    if (!nombre.trim() || !email.trim() || !password || !confirmar) {

      // Mensaje por voz
      hablar("Error. Debes completar todos los campos");

      // Mensaje visual
      Alert.alert("Error", "Debes completar todos los campos");
      return;
    }

    // Validación de coincidencia de contraseñas
    if (password !== confirmar) {

      // Mensaje por voz
      hablar("Error. Las contraseñas no coinciden");

      // Mensaje visual
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    // Validación de longitud mínima de contraseña
    if (password.length < 6) {

      // Mensaje por voz
      hablar("Error. La contraseña debe tener al menos 6 caracteres");

      // Mensaje visual
      Alert.alert("Error", "La contraseña debe tener mínimo 6 caracteres");
      return;
    }

    try {

      // Llama a la función register para crear el usuario
      await register(email, password, nombre);

      // Mensaje de éxito por voz
      hablar("Registro exitoso");

      // Muestra el modal de éxito
      setModalVisible(true);

    } catch (error) {

      // Mensaje genérico de error
      let mensaje = "Error al crear la cuenta";

      // Validación de errores específicos de Firebase/Auth
      if (error.code === "auth/email-already-in-use")
        mensaje = "Ya existe una cuenta con ese correo";

      if (error.code === "auth/invalid-email")
        mensaje = "El correo no es válido";

      if (error.code === "auth/weak-password")
        mensaje = "La contraseña es muy débil";

      // Reproduce el mensaje de error por voz
      hablar(mensaje);

      // Muestra alerta visual
      Alert.alert("Error", mensaje);
    }
  };

  // Renderizado principal del componente
  return (
    <View style={{ flex: 1 }}>

      {/* Botón para activar/desactivar la voz */}
      <TouchableOpacity style={styles.audioGlobal} onPress={toggleVoz}>
        <Text style={{ color: "#fff" }}>
          {vozActiva ? "🔊 Voz activada" : "🔇 Activar voz"}
        </Text>
      </TouchableOpacity>

      {/* Fondo superior con gradiente */}
      <LinearGradient colors={["#7B61FF", "#A78BFA"]} style={styles.top} />

      {/* Tarjeta principal del formulario */}
      <View style={styles.card}>

        {/* Título */}
        <Text style={styles.title}>Sign Up</Text>

        {/* Campo para nombre completo */}
        <TextInput
          placeholder="Nombre completo"
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}

          // Reproduce guía por voz al enfocar el campo
          onFocus={() => hablar("Campo nombre completo.")}
        />

        {/* Campo para correo electrónico */}
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"

          // Reproduce guía por voz
          onFocus={() => hablar("Campo correo electrónico.")}
        />

        {/* Campo para contraseña */}
        <TextInput
          placeholder="Contraseña"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}

          // Reproduce guía por voz
          onFocus={() => hablar("Campo contraseña.")}
        />

        {/* Campo para confirmar contraseña */}
        <TextInput
          placeholder="Confirmar contraseña"
          style={styles.input}
          secureTextEntry
          value={confirmar}
          onChangeText={setConfirmar}

          // Reproduce guía por voz
          onFocus={() => hablar("Campo confirmar contraseña.")}
        />

        {/* Botón para crear la cuenta */}
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Crear cuenta</Text>
        </TouchableOpacity>

        {/* Enlace para ir a la pantalla de inicio de sesión */}
        <TouchableOpacity
          onPress={() => {

            // Mensaje de voz
            hablar("Ir a inicio de sesión.");

            // Navegación a Login
            navigation.navigate("Login");
          }}
        >
          <Text style={styles.link}>
            ¿Ya tienes cuenta? Inicia sesión
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal que aparece cuando el registro es exitoso */}
      <Modal transparent visible={modalVisible} animationType="fade">

        {/* Fondo oscuro del modal */}
        <View style={styles.modalContainer}>

          {/* Caja principal del modal */}
          <View style={styles.modalBox}>

            {/* Icono de éxito */}
            <Text style={styles.check}>✅</Text>

            {/* Título del modal */}
            <Text style={styles.modalTitle}>Registro exitoso</Text>

            {/* Mensaje del modal */}
            <Text style={styles.modalText}>
              Tu cuenta fue creada correctamente
            </Text>

            {/* Botón para continuar */}
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {

                // Oculta el modal
                setModalVisible(false);

                // Navega a Login
                navigation.navigate("Login");
              }}
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

// Estilos de la pantalla
const styles = StyleSheet.create({

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

  // Parte superior con gradiente
  top: {
    height: 250,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40
  },

  // Tarjeta principal del formulario
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

  // Título principal
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#7B61FF",
    marginBottom: 20
  },

  // Campos de texto
  input: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12
  },

  // Botón principal
  button: {
    backgroundColor: "#7B61FF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10
  },

  // Texto del botón
  buttonText: {
    color: "#fff",
    fontWeight: "bold"
  },

  // Texto del enlace
  link: {
    marginTop: 15,
    textAlign: "center",
    color: "#888"
  },

  // Contenedor oscuro del modal
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center"
  },

  // Caja principal del modal
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    alignItems: "center"
  },

  // Icono de check
  check: {
    fontSize: 40,
    marginBottom: 10
  },

  // Título del modal
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10
  },

  // Texto descriptivo del modal
  modalText: {
    textAlign: "center",
    color: "#666",
    marginBottom: 20
  },

  // Botón del modal
  modalButton: {
    backgroundColor: "#7B61FF",
    padding: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center"
  }
});