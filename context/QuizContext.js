import React, { createContext, useState } from "react";
import { preguntas } from "../data/preguntas";

export const QuizContext = createContext();

// Maneja el estado de una sesión de quiz: acumula respuestas y las limpia
// al terminar. Las preguntas vienen de un archivo estático, no del estado.
export const QuizProvider = ({ children }) => {
  const [respuestas, setRespuestas] = useState([]);

  // Agrega la respuesta de una pregunta. No valida duplicados,
  // se asume que cada pregunta se responde una sola vez.
  const responder = (preguntaId, respuesta) => {
    setRespuestas([...respuestas, { preguntaId, respuesta }]);
  };

  const limpiar = () => {
    setRespuestas([]);
  };

  return (
    <QuizContext.Provider value={{ preguntas, respuestas, responder, limpiar }}>
      {children}
    </QuizContext.Provider>
  );
};