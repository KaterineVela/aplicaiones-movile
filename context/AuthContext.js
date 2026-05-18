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
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
      setCargando(false);
    });
    return unsub;
  }, []);

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email, password, nombre) => {
    const credencial = await createUserWithEmailAndPassword(auth, email, password);
    const user = credencial.user;

    // Guardar displayName en Firebase Auth
    await updateProfile(user, { displayName: nombre });

    // Guardar perfil completo en Firestore
    await setDoc(doc(db, "usuarios", user.uid, "perfil", "datos"), {
      nombre,
      email,
      racha: 0,
      ultimoDia: null,
      fechaRegistro: new Date().toISOString()
    });

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