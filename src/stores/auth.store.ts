// src/stores/auth.store.ts
import { defineStore } from 'pinia';
import { loginWithProvider, mockLoginWithOutlook } from '@/services/auth.service'; // Añade el mock

type GuestType = 'external' | 'alumni' | 'prospective_student';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  guestType?: GuestType;
  provider?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isGuest: boolean;
  isAuthenticated: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isGuest: false,
    isAuthenticated: false
  }),

  actions: {
    async firebaseLogin(provider: 'google' | 'facebook' | 'outlook') {
      try {
        const { uid, email, displayName } = await loginWithProvider(provider);
        this.setAuthData(
          {
            id: uid,
            email: email,
            name: displayName,
            role: 'user',
            provider: provider
          },
          'firebase-token',
          false
        );
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error desconocido';
        throw new Error(`Error con ${provider}: ${message}`);
      }
    },

    // Nueva acción para mock de Outlook
    async mockOutlookLogin() {
      try {
        const { uid, email, displayName } = await mockLoginWithOutlook();
        this.setAuthData(
          {
            id: "mock-uid",
            email: "Usuario de Prueba",
            name: "usuario@tese.edu.mx",
            role: 'user',
            provider: 'outlook'
          },
          'mock-token',
          false
        );
      } catch (error) {
        throw new Error(`Error en mock: ${error instanceof Error ? error.message : String(error)}`);
      }
    },

    setAuthData(user: User, token: string, isGuest: boolean) {
      this.user = user;
      this.token = token;
      this.isGuest = isGuest;
      this.isAuthenticated = true;
      localStorage.setItem('auth_data', JSON.stringify({
        user,
        token,
        isGuest,
        timestamp: new Date().getTime()
      }));
    },

    logout() {
      this.user = null;
      this.token = null;
      this.isGuest = false;
      this.isAuthenticated = false;
      localStorage.removeItem('auth_data');
    },

    initialize() {
      const authData = localStorage.getItem('auth_data');
      if (authData) {
        try {
          const { user, token, isGuest, timestamp } = JSON.parse(authData);
          const TWELVE_HOURS = 12 * 60 * 60 * 1000;
          if (new Date().getTime() - timestamp > TWELVE_HOURS) {
            this.logout();
            return;
          }
          this.user = user;
          this.token = token;
          this.isGuest = isGuest;
          this.isAuthenticated = true;
        } catch (error) {
          console.error('Error al inicializar sesión:', error);
          this.logout();
        }
      }
    }
  }
});