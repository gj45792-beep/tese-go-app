// src/stores/auth-simple.store.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { auth } from '@/services/auth/firebase-simple.config';
import { 
  onAuthStateChanged, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  type User 
} from 'firebase/auth';

export const useAuthSimpleStore = defineStore('auth-simple', () => {
  // Estado
  const user = ref<User | null>(null);
  const loading = ref(true);

  // Iniciar observador (llamar esto en App.vue)
  const init = () => {
    onAuthStateChanged(auth, (firebaseUser) => {
      console.log('🔄 AuthSimple: Usuario detectado:', firebaseUser?.email || 'null');
      user.value = firebaseUser;
      loading.value = false;
    });
  };

  // Login con Google
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log('✅ AuthSimple: Login exitoso:', result.user.email);
      return { success: true, user: result.user };
    } catch (error) {
      console.error('❌ AuthSimple: Error en login:', error);
      return { success: false, error };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      console.log('👋 AuthSimple: Sesión cerrada');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Getters
  const isAuthenticated = () => !!user.value;
  const displayName = () => user.value?.displayName || 'Usuario';

  return {
    // Estado
    user,
    loading,
    
    // Acciones
    init,
    loginWithGoogle,
    logout,
    
    // Getters
    isAuthenticated,
    displayName
  };
});