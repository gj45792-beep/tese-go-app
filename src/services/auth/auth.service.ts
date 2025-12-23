// src/services/auth/auth.service.ts
import { 
  GoogleAuthProvider, 
  FacebookAuthProvider,
  OAuthProvider,
  signInWithPopup 
} from 'firebase/auth';
import { auth } from './firebase.config';

// Configurar proveedores
const providers = {
  google: new GoogleAuthProvider(),
  facebook: new FacebookAuthProvider(),
  outlook: new OAuthProvider('microsoft.com')
} as const;

// Función principal para login con proveedor
export const loginWithProvider = async (provider: 'google' | 'facebook' | 'outlook') => {
  console.log(`⚠️  MODO DESARROLLO: Usando mock para ${provider}`);
  console.log('ℹ️  Para Firebase real, configura claves API en firebase.config.ts');
  
  // Usar mock para todos los proveedores temporalmente
  await new Promise(resolve => setTimeout(resolve, 800)); // Simular retraso
  
  return {
    uid: `mock-uid-${provider}`,
    email: `usuario.mock@tese.edu.mx`,
    displayName: `Usuario Mock ${provider}`,
    photoURL: null
  };
};

// Mock para Outlook (para desarrollo sin configuración real)
export const mockLoginWithOutlook = async () => {
  console.log('Usando mock de Outlook (modo desarrollo)');
  
  // Simular retraso de red
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    uid: "mock-outlook-uid-123",
    email: "usuario.prueba@tese.edu.mx",
    displayName: "Usuario de Prueba Outlook",
    photoURL: null
  };
};

// Funciones individuales para conveniencia
export const loginWithGoogle = () => loginWithProvider('google');
export const loginWithFacebook = () => loginWithProvider('facebook');
export const loginWithOutlook = () => loginWithProvider('outlook');