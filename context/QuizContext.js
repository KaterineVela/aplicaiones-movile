import React, { createContext, useState } from "react";
import { preguntas } from "../data/preguntas";

export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [respuestas, setRespuestas] = useState([]);

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