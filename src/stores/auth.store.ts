// src/stores/auth.store.ts - VERSIÓN CORREGIDA
import { defineStore } from 'pinia';
import { loginWithProvider, mockLoginWithOutlook } from '../services/auth/auth.service';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as any,
    token: null as string | null,
    isGuest: false,
    isAuthenticated: false
  }),

  actions: {
    async firebaseLogin(provider: 'google' | 'facebook' | 'outlook') {
      try {
        console.log(`Iniciando firebaseLogin con ${provider}...`);
        
        // Si es outlook, usa el mock por ahora
        if (provider === 'outlook') {
          return await this.mockOutlookLogin();
        }
        
        // Para google/facebook, usa Firebase real
        const userData = await loginWithProvider(provider);
        
        // Guardar datos en el store
        this.user = {
          id: userData.uid,
          email: userData.email,
          name: userData.displayName,
          role: 'user',
          provider: provider
        };
        this.token = 'firebase-token-' + provider;
        this.isAuthenticated = true;
        
        // Guardar en localStorage
        localStorage.setItem('auth_data', JSON.stringify({
          user: this.user,
          token: this.token,
          timestamp: new Date().getTime()
        }));
        
        console.log('Login exitoso:', this.user.email);
        
      } catch (error: any) {
        console.error('Error en firebaseLogin:', error);
        throw error;
      }
    },

    async mockOutlookLogin() {
      try {
        console.log('Usando mockOutlookLogin...');
        const userData = await mockLoginWithOutlook();
        
        this.user = {
          id: userData.uid,
          email: userData.email,
          name: userData.displayName,
          role: 'user',
          provider: 'outlook'
        };
        this.token = 'mock-outlook-token';
        this.isAuthenticated = true;
        
        localStorage.setItem('auth_data', JSON.stringify({
          user: this.user,
          token: this.token,
          timestamp: new Date().getTime()
        }));
        
        console.log('Mock login exitoso:', this.user.email);
        
      } catch (error: any) {
        console.error('Error en mockOutlookLogin:', error);
        throw error;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      this.isGuest = false;
      this.isAuthenticated = false;
      localStorage.removeItem('auth_data');
    }
  }
});