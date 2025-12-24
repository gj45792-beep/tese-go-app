// src/stores/auth.store.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { 
  onAuthStateChanged, 
  type User 
} from 'firebase/auth';
import { auth } from '@/services/auth/firebase.config';

export const useAuthStore = defineStore('auth', () => {
  // Estado reactivo: el usuario de Firebase o `null` si no hay sesión
  const currentUser = ref<User | null>(null);
  const isLoading = ref(true); // Para saber cuando Firebase termina de verificar

  // Getters (propiedades computadas)
  const isAuthenticated = computed(() => !!currentUser.value);
  const userDisplayName = computed(() => currentUser.value?.displayName || '');

  // Acción: Configurar el observador de Firebase
  const initAuthListener = () => {
    // Esta función "escucha" cambios en el estado de autenticación
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      currentUser.value = user; // Se actualiza automáticamente al loguearse/desloguearse
      isLoading.value = false;
      console.log('🔄 Store de autenticación actualizado:', user ? user.email : 'No user');
    });

    // Devuelve la función para cancelar la suscripción si es necesario
    return unsubscribe;
  };
   initAuthListener();
  // Acción: Cerrar sesión
  const logout = async () => {
    try {
      await auth.signOut();
      // Nota: El observador `onAuthStateChanged` se encargará de poner currentUser.value = null
      console.log('👋 Store: Solicitud de cierre de sesión enviada');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  };

  return {
    // Estado y getters
    currentUser,
    isLoading,
    isAuthenticated,
    userDisplayName,
    
    // Acciones
    initAuthListener,
    logout,
  };
});