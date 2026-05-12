import React, { createContext, useState, useEffect, useRef } from "react";
import { Platform } from "react-native";
import * as Speech from "expo-speech";

export const AccessibilityContext = createContext();

// Orden de preferencia de voces en español (de mejor a peor calidad)
// Estas son las voces naturales disponibles en Chrome/Edge/Safari
const VOCES_PREFERIDAS = [
  // Google (Chrome en cualquier OS) — suenan muy naturales
  "Google español",
  "Google español de Estados Unidos",
  // Microsoft Natural (Edge en Windows 10/11) — las mejores
  "Microsoft Sabina Online (Natural) - Spanish (Mexico)",
  "Microsoft Dalia Online (Natural) - Spanish (Mexico)",
  "Microsoft Elena Online (Natural) - Spanish (Spain)",
  "Microsoft Laura Online (Natural) - Spanish (Spain)",
  // Microsoft estándar (Windows)
  "Microsoft Sabina - Spanish (Mexico)",
  "Microsoft Helena - Spanish (Spain)",
  "Microsoft Laura - Spanish (Spain)",
  // Mac / iOS Safari
  "Mónica",
  "Paulina",
  "Jorge",
  // Android Chrome
  "Spanish Spain TTS",
  "Spanish Latin America TTS",
];

function elegirMejorVoz(voces) {
  // 1. Buscar por nombre exacto en orden de preferencia
  for (const nombre of VOCES_PREFERIDAS) {
    const encontrada = voces.find(
      v => v.name.toLowerCase().includes(nombre.toLowerCase())
    );
    if (encontrada) return encontrada;
  }

  // 2. Buscar voces "online" o "natural" en español (mayor calidad)
  const online = voces.find(
    v =>
      (v.lang.startsWith("es")) &&
      (v.name.toLowerCase().includes("online") ||
        v.name.toLowerCase().includes("natural"))
  );
  if (online) return online;

  // 3. Cualquier voz en español latinoamericano
  const latam = voces.find(v => v.lang === "es-MX" || v.lang === "es-US" || v.lang === "es-419");
  if (latam) return latam;

  // 4. Cualquier voz en español
  const espanol = voces.find(v => v.lang.startsWith("es"));
  if (espanol) return espanol;

  return null;
}

export const AccessibilityProvider = ({ children }) => {
  const [vozActiva, setVozActiva] = useState(true);
  const vozRef = useRef(null); // guarda la voz elegida en web

  // En web: esperar a que el navegador cargue las voces y elegir la mejor
  useEffect(() => {
    if (Platform.OS !== "web") return;
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const cargarVoces = () => {
      const voces = window.speechSynthesis.getVoices();
      if (voces.length > 0) {
        const mejor = elegirMejorVoz(voces);
        vozRef.current = mejor;
        console.log(
          mejor
            ? `✅ Voz seleccionada: ${mejor.name} (${mejor.lang})`
            : "⚠️ No se encontró voz en español, usando la del sistema"
        );
      }
    };

    // Las voces a veces tardan en cargar en el navegador
    cargarVoces();
    window.speechSynthesis.onvoiceschanged = cargarVoces;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const toggleVoz = () => {
    setVozActiva(prev => {
      const nuevoEstado = !prev;
      if (!nuevoEstado) {
        try {
          if (Platform.OS === "web") {
            if (typeof window !== "undefined" && "speechSynthesis" in window) {
              window.speechSynthesis.cancel();
            }
          } else {
            Speech.stop();
          }
        } catch (error) {
          console.log("Error cancelando voz:", error);
        }
      }
      return nuevoEstado;
    });
  };

  const hablar = (texto) => {
    if (!texto || !vozActiva) return;

    try {
      if (Platform.OS === "web") {
        if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

        const synth = window.speechSynthesis;

        // Cancelar lo que esté hablando
        if (synth.speaking) synth.cancel();

        const mensaje = new SpeechSynthesisUtterance(texto);

        // Asignar la mejor voz disponible
        if (vozRef.current) {
          mensaje.voice = vozRef.current;
          mensaje.lang = vozRef.current.lang;
        } else {
          mensaje.lang = "es-MX"; // fallback
        }

        // Configuración para sonar más natural
        mensaje.rate = 0.92;   // un poco más lento que el defecto (1.0)
        mensaje.pitch = 1.0;   // tono neutro
        mensaje.volume = 1.0;

        // Pequeño delay para que el cancel() anterior surta efecto en Chrome
        setTimeout(() => {
          synth.speak(mensaje);
        }, 100);

      } else {
        // Móvil: expo-speech
        Speech.stop();
        Speech.speak(texto, {
          language: "es-MX",
          rate: 0.9,
          pitch: 1.0,
        });
      }
    } catch (error) {
      console.log("Error en voz:", error);
    }
  };

  return (
    <AccessibilityContext.Provider value={{ vozActiva, toggleVoz, hablar }}>
      {children}
    </AccessibilityContext.Provider>
  );
};