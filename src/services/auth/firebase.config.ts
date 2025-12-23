// src/services/auth/firebase.config.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Configuración de Firebase (REEMPLAZAR con tus datos reales)
const firebaseConfig = {
  apiKey: "AIzaSyA3MzQsY95bSMYblKBbFQQ9XBOgBJnubW4",
  authDomain: "tese-go-rutasoptimas.firebaseapp.com",
  projectId: "tese-go-rutasoptimas",
  storageBucket: "tese-go-rutasoptimas.firebasestorage.app",
  messagingSenderId: "540578178990",
  appId: "1:540578178990:web:2f8736fed32ff9ae80ca3f",
  measurementId: "G-WHC3NBFQGC"
};


// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Exportar instancia para usar en toda la app
export default app;