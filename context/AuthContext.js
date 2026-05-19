import React, { createContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true); // evita renders antes de saber si hay sesión activa

  // Escucha cambios de sesión en tiempo real. Se dispara al login, logout
  // y también al arrancar la app si había una sesión guardada.
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
      setCargando(false);
    });
    return unsub; // limpia el listener al desmontar
  }, []);

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Crea la cuenta, actualiza el displayName y guarda el perfil en Firestore.
  // El perfil se guarda en usuarios/{uid}/perfil/datos para poder extenderlo
  // con más subcolecciones después (progreso, configuración, etc.).
  const register = async (email, password, nombre) => {
    const credencial = await createUserWithEmailAndPassword(auth, email, password);
    const user = credencial.user;

    await updateProfile(user, { displayName: nombre });

    await setDoc(doc(db, "usuarios", user.uid, "perfil", "datos"), {
      nombre,
      email,
      racha: 0,
      ultimoDia: null,
      fechaRegistro: new Date().toISOString()
    });

    // Actualiza el estado local con el nombre porque Firebase Auth
    // no lo refleja de inmediato en el objeto `user` recién creado.
    setUsuario({ ...user, displayName: nombre });
    return credencial;
  };

  const logout = () => {
    return signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, register, cargando }}>
      {children}
    </AuthContext.Provider>
  );
};