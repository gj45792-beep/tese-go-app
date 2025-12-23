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
import { auth } from '@/services/auth/firebase.config'; // Importa la autenticación REAL
import { 
  GoogleAuthProvider, 
  signInWithPopup,
  signOut 
} from 'firebase/auth';

const loading = ref(false);

// 🔥 FUNCIÓN REAL PARA GOOGLE
const signInWithGoogle = async () => {
  loading.value = true;
  try {
    const provider = new GoogleAuthProvider();
    // Esto abrirá una ventana emergente de Google para autenticar
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    console.log('✅ Usuario autenticado con Google:', user.displayName);
    
    // Muestra un mensaje de éxito
    const toast = await toastController.create({
      message: `¡Bienvenido, ${user.displayName}!`,
      duration: 3000,
      color: 'success'
    });
    await toast.present();

    // Futuro: Aquí redirigirás al HomePage o guardarás el estado en auth.store
    // Por ahora, solo recarga la página para ver el cambio
    setTimeout(() => {
      window.location.reload();
    }, 1500);

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

// 📧 FUNCIÓN MOCK PARA OUTLOOK (por ahora)
const signInWithOutlook = async () => {
  loading.value = true;
  try {
    // Simula un retardo de red
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