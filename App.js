// Importación de React y hook useContext
import React, { useContext } from "react";

// Importación del contenedor principal de navegación
import { NavigationContainer } from "@react-navigation/native";

// Importación para crear navegación tipo Stack
import { createStackNavigator } from "@react-navigation/stack";

// ---------------------------------------------------
// IMPORTACIÓN DE PANTALLAS
// ---------------------------------------------------

// Pantalla de inicio / splash
import PantallaInicio from "./screens/SplashScreen";

// Pantalla de inicio de sesión
import LoginScreen from "./screens/LoginScreen";

// Pantalla principal
import HomeScreen from "./screens/HomeScreen";

// Pantalla del simulacro
import SimulacroScreen from "./screens/SimulacroScreen";

// Pantalla para seleccionar materia
import SeleccionMateriaScreen from "./screens/SeleccionMateriaScreen";

// Material de estudio de sociales
import MaterialSocialesScreen from "./screens/MaterialSocialesScreen";

// Material de estudio de inglés
import MaterialInglesScreen from "./screens/MaterialInglesScreen";

// Pantalla de preguntas incorrectas
import PreguntasIncorrectasScreen from "./screens/PreguntasIncorrectasScreen";

// Pantalla del quiz
import QuizScreen from "./screens/QuizScreen";

// Pantalla de resultados
import ResultScreen from "./screens/ResultScreen";

// Pantalla de registro
import RegisterScreen from "./screens/RegisterScreen";

// Pantalla de recomendaciones
import RecomendacionesScreen from "./screens/RecomendacionesScreen";

// Pantalla general de material
import MaterialScreen from "./screens/MaterialScreen";

// Pantalla de ajustes
import AjustesScreen from "./screens/AjustesScreen";

// Pantalla de historial
import HistorialScreen from "./screens/HistorialScreen";

// Pantalla de progreso
import ProgresoScreen from "./screens/ProgresoScreen";

// ---------------------------------------------------
// IMPORTACIÓN DE CONTEXTOS
// ---------------------------------------------------

// Contexto de autenticación
import { AuthProvider, AuthContext } from "./context/AuthContext";

// Contexto del quiz
import { QuizProvider } from "./context/QuizContext";

// Contexto de accesibilidad
import { AccessibilityProvider } from "./context/AccessibilityContext";

// ---------------------------------------------------
// CREACIÓN DEL STACK DE NAVEGACIÓN
// ---------------------------------------------------
const Stack = createStackNavigator();

// ---------------------------------------------------
// STACK DE AUTENTICACIÓN
// Pantallas visibles cuando el usuario NO ha iniciado sesión
// ---------------------------------------------------
function AuthStack() {

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
    >

      {/* Pantalla splash */}
      <Stack.Screen
        name="Splash"
        component={PantallaInicio}
      />

      {/* Pantalla login */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />

      {/* Pantalla registro */}
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
      />

    </Stack.Navigator>
  );
}

// ---------------------------------------------------
// STACK PRINCIPAL DE LA APP
// Pantallas visibles cuando el usuario inicia sesión
// ---------------------------------------------------
function AppStack() {

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
    >

      {/* Pantalla principal */}
      <Stack.Screen
        name="Home"
        component={HomeScreen}
      />

      {/* Historial de resultados */}
      <Stack.Screen
        name="Historial"
        component={HistorialScreen}
      />

      {/* Pantalla de progreso */}
      <Stack.Screen
        name="Progreso"
        component={ProgresoScreen}
      />

      {/* Pantalla simulacro */}
      <Stack.Screen
        name="Simulacro"
        component={SimulacroScreen}

        // Configuración del header
        options={{
          headerShown: true,
          title: "Simulacro de Examen"
        }}
      />

      {/* Selección de materia */}
      <Stack.Screen
        name="SeleccionMateria"
        component={SeleccionMateriaScreen}
        options={{
          headerShown: true,
          title: "Selecciona una materia"
        }}
      />

      {/* Material de Sociales */}
      <Stack.Screen
        name="MaterialSociales"
        component={MaterialSocialesScreen}
        options={{
          headerShown: true,
          title: "Ciencias Sociales"
        }}
      />

      {/* Material de Inglés */}
      <Stack.Screen
        name="MaterialIngles"
        component={MaterialInglesScreen}
        options={{
          headerShown: true,
          title: "Inglés"
        }}
      />

      {/* Preguntas incorrectas */}
      <Stack.Screen
        name="PreguntasIncorrectas"
        component={PreguntasIncorrectasScreen}
        options={{
          headerShown: true,
          title: "Preguntas incorrectas"
        }}
      />

      {/* Pantalla del quiz */}
      <Stack.Screen
        name="Quiz"
        component={QuizScreen}
      />

      {/* Pantalla resultados */}
      <Stack.Screen
        name="Resultados"
        component={ResultScreen}
      />

      {/* Pantalla recomendaciones */}
      <Stack.Screen
        name="Recomendaciones"
        component={RecomendacionesScreen}
      />

      {/* Pantalla material */}
      <Stack.Screen
        name="Material"
        component={MaterialScreen}
      />

      {/* Pantalla ajustes */}
      <Stack.Screen
        name="Ajustes"
        component={AjustesScreen}
      />

    </Stack.Navigator>
  );
}

// ---------------------------------------------------
// NAVEGADOR PRINCIPAL
// Decide qué stack mostrar según autenticación
// ---------------------------------------------------
function RootNavigator() {

  // Obtiene información del usuario y estado de carga
  const { usuario, cargando } = useContext(AuthContext);

  // Mientras carga la sesión no muestra nada
  if (cargando) return null;

  // Si existe usuario → AppStack
  // Si no existe → AuthStack
  return usuario
    ? <AppStack />
    : <AuthStack />;
}

// ---------------------------------------------------
// COMPONENTE PRINCIPAL DE LA APP
// ---------------------------------------------------
export default function App() {

  return (

    // Provider de accesibilidad
    <AccessibilityProvider>

      {/* Provider de autenticación */}
      <AuthProvider>

        {/* Provider del quiz */}
        <QuizProvider>

          {/* Contenedor principal de navegación */}
          <NavigationContainer>

            {/* Navegador raíz */}
            <RootNavigator />

          </NavigationContainer>
        </QuizProvider>
      </AuthProvider>
    </AccessibilityProvider>
  );
}