<!-- src/components/auth/SocialLoginButtons.vue -->
<template>
  <div class="social-login-buttons">
    <!-- Botón de Google (REAL) -->
    <ion-button 
      expand="block" 
      color="light" 
      @click="signInWithGoogle"
      :disabled="loading"
    >
      <ion-icon :icon="logoGoogle" slot="start" />
      {{ loading ? 'Iniciando sesión...' : 'Continuar con Google' }}
    </ion-button>

    <!-- Botón de Outlook (MOCK por ahora) -->
    <ion-button 
      expand="block" 
      color="secondary" 
      @click="signInWithOutlook"
      :disabled="loading"
    >
      <ion-icon :icon="mailOutline" slot="start" />
      {{ loading ? 'Iniciando sesión...' : 'Continuar con Outlook' }}
    </ion-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonButton, IonIcon, toastController } from '@ionic/vue';
import { logoGoogle, mailOutline } from 'ionicons/icons';
import { useAuthSimpleStore } from '@/stores/auth-simple.store';
import { useRouter } from 'vue-router'; // ⬅️ NUEVA IMPORTACIÓN

const loading = ref(false);
const authStore = useAuthSimpleStore();
const router = useRouter(); // ⬅️ NUEVO: Instancia del router

// 🔥 FUNCIÓN PARA GOOGLE (usando el nuevo store + redirección)
const signInWithGoogle = async () => {
  loading.value = true;
  try {
    const result = await authStore.loginWithGoogle();
    
    if (result.success) {
      const toast = await toastController.create({
        message: `¡Bienvenido, ${result.user?.displayName}!`,
        duration: 3000,
        color: 'success'
      });
      await toast.present();
      
      // ⭐⭐ NUEVO: Redirige a la página de inicio (Home)
      router.push('/home');
      
    } else {
      throw result.error;
    }
  } catch (error: any) {
    console.error('❌ Error en autenticación Google:', error);
    const toast = await toastController.create({
      message: `Error: ${error.message}`,
      duration: 4000,
      color: 'danger'
    });
    await toast.present();
  } finally {
    loading.value = false;
  }
};

// 📧 FUNCIÓN MOCK PARA OUTLOOK (por ahora) - SE MANTIENE IGUAL
const signInWithOutlook = async () => {
  loading.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const toast = await toastController.create({
      message: 'Autenticación con Outlook en desarrollo.',
      duration: 3000,
      color: 'warning'
    });
    await toast.present();
    
    console.log('🛠️ Autenticación Outlook (mock) - Pendiente de implementar');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.social-login-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
}
</style>