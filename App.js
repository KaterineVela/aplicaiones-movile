import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import PantallaInicio from "./screens/SplashScreen";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import SimulacroScreen from "./screens/SimulacroScreen";
import SeleccionMateriaScreen from "./screens/SeleccionMateriaScreen";
import MaterialSocialesScreen from "./screens/MaterialSocialesScreen";
import MaterialInglesScreen from "./screens/MaterialInglesScreen";
import PreguntasIncorrectasScreen from "./screens/PreguntasIncorrectasScreen";
import QuizScreen from "./screens/QuizScreen";
import ResultScreen from "./screens/ResultScreen";
import RegisterScreen from "./screens/RegisterScreen";
import RecomendacionesScreen from "./screens/RecomendacionesScreen";
import MaterialScreen from "./screens/MaterialScreen";
import AjustesScreen from "./screens/AjustesScreen";
import HistorialScreen from "./screens/HistorialScreen";
import ProgresoScreen from "./screens/ProgresoScreen";

import { AuthProvider, AuthContext } from "./context/AuthContext";
import { QuizProvider } from "./context/QuizContext";
import { AccessibilityProvider } from "./context/AccessibilityContext";

const Stack = createStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={PantallaInicio} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Historial" component={HistorialScreen} />
      <Stack.Screen name="Progreso" component={ProgresoScreen} />
      <Stack.Screen
        name="Simulacro"
        component={SimulacroScreen}
        options={{ headerShown: true, title: "Simulacro de Examen" }}
      />
      <Stack.Screen
        name="SeleccionMateria"
        component={SeleccionMateriaScreen}
        options={{ headerShown: true, title: "Selecciona una materia" }}
      />
      <Stack.Screen
        name="MaterialSociales"
        component={MaterialSocialesScreen}
        options={{ headerShown: true, title: "Ciencias Sociales" }}
      />
      <Stack.Screen
        name="MaterialIngles"
        component={MaterialInglesScreen}
        options={{ headerShown: true, title: "Inglés" }}
      />
      <Stack.Screen
        name="PreguntasIncorrectas"
        component={PreguntasIncorrectasScreen}
        options={{ headerShown: true, title: "Preguntas incorrectas" }}
      />
      <Stack.Screen name="Quiz" component={QuizScreen} />
      <Stack.Screen name="Resultados" component={ResultScreen} />
      <Stack.Screen name="Recomendaciones" component={RecomendacionesScreen} />
      <Stack.Screen name="Material" component={MaterialScreen} />
      <Stack.Screen name="Ajustes" component={AjustesScreen} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { usuario, cargando } = useContext(AuthContext);
  if (cargando) return null;
  return usuario ? <AppStack /> : <AuthStack />;
}

export default function App() {
  return (
    <AccessibilityProvider>
      <AuthProvider>
        <QuizProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </QuizProvider>
      </AuthProvider>
    </AccessibilityProvider>
  );
}