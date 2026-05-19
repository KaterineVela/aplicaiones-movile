// Importaciones necesarias de Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuración del proyecto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDL6vSCeM0bL93QYROqbg4KNHdlxP6KyvA",
  authDomain: "icfes-app-20982.firebaseapp.com",
  projectId: "icfes-app-20982",
  storageBucket: "icfes-app-20982.firebasestorage.app",
  messagingSenderId: "294707517093",
  appId: "1:294707517093:web:2055240e7f65c6ffc09f4c"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta autenticación y base de datos
export const auth = getAuth(app);
export const db = getFirestore(app);