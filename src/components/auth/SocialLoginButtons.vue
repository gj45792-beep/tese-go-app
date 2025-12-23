<!-- src/components/auth/SocialLoginButtons.vue -->
<template>
  <div class="social-login-container">
    <div class="social-buttons-grid">
      <!-- Botón Google -->
      <ion-button 
        fill="clear" 
        class="social-button google-button"
        @click="handleSocialLogin('google')"
        :disabled="isLoading"
        aria-label="Iniciar sesión con Google"
      >
        <div class="button-content">
          <ion-icon :icon="logoGoogle" class="social-icon" />
          <span class="button-text">Google</span>
        </div>
      </ion-button>

      <!-- Botón Facebook -->
      <ion-button 
        fill="clear" 
        class="social-button facebook-button"
        @click="handleSocialLogin('facebook')"
        :disabled="isLoading"
        aria-label="Iniciar sesión con Facebook"
      >
        <div class="button-content">
          <ion-icon :icon="logoFacebook" class="social-icon" />
          <span class="button-text">Facebook</span>
        </div>
      </ion-button>

      <!-- Botón Outlook -->
      <ion-button 
        fill="clear" 
        class="social-button outlook-button"
        @click="handleSocialLogin('outlook')"
        :disabled="isLoading"
        aria-label="Iniciar sesión con Outlook"
      >
        <div class="button-content">
          <ion-icon :icon="mail" class="social-icon" />
          <span class="button-text">Outlook</span>
        </div>
      </ion-button>

      <!-- Botón Twitter (opcional, deshabilitado por ahora) -->
      <!--
      <ion-button 
        fill="clear" 
        class="social-button twitter-button"
        @click="handleSocialLogin('twitter')"
        :disabled="true"
        aria-label="Iniciar sesión con Twitter"
      >
        <div class="button-content">
          <ion-icon :icon="logoTwitter" class="social-icon" />
          <span class="button-text">Twitter</span>
        </div>
      </ion-button>
      -->
    </div>

    <!-- Estado de carga -->
    <div v-if="isLoading" class="loading-overlay">
      <ion-spinner name="crescent"></ion-spinner>
      <span>Conectando...</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  IonButton, 
  IonIcon, 
  IonSpinner 
} from '@ionic/vue';
import { 
  logoGoogle, 
  logoFacebook, 
  mail,
  logoTwitter 
} from 'ionicons/icons';
import { ref } from 'vue';

// Props del componente
const props = defineProps<{
  isLoading?: boolean;
}>();

// Emits para comunicar con el padre
const emit = defineEmits<{
  'social-login': [provider: 'google' | 'facebook' | 'outlook'];
}>();

const isLoading = ref(props.isLoading || false);

const handleSocialLogin = async (provider: 'google' | 'facebook' | 'outlook') => {
  if (isLoading.value) return;
  
  isLoading.value = true;
  
  try {
    // Emitir evento al componente padre
    emit('social-login', provider);
  } finally {
    // El padre controla cuándo termina el loading
    // Solo resetemos si el padre no pasa isLoading como prop
    if (!props.isLoading) {
      setTimeout(() => {
        isLoading.value = false;
      }, 1000);
    }
  }
};
</script>

<style scoped>
.social-login-container {
  position: relative;
  margin: 1.5rem 0;
}

.social-buttons-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  max-width: 400px;
  margin: 0 auto;
}

@media (max-width: 480px) {
  .social-buttons-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.social-button {
  --border-radius: 12px;
  --border-width: 2px;
  --padding-start: 8px;
  --padding-end: 8px;
  height: 56px;
  margin: 0;
  transition: all 0.3s ease;
}

.social-button:not([disabled]):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.button-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 4px;
}

.social-icon {
  font-size: 1.5rem;
  margin-bottom: 2px;
}

.button-text {
  font-size: 0.8rem;
  font-weight: 500;
}

/* Colores específicos para cada botón */
.google-button {
  --border-color: #DB4437;
  --color: #DB4437;
  --background-hover: rgba(219, 68, 55, 0.1);
}

.facebook-button {
  --border-color: #4267B2;
  --color: #4267B2;
  --background-hover: rgba(66, 103, 178, 0.1);
}

.outlook-button {
  --border-color: #0078D4;
  --color: #0078D4;
  --background-hover: rgba(0, 120, 212, 0.1);
}

.twitter-button {
  --border-color: #1DA1F2;
  --color: #1DA1F2;
  --background-hover: rgba(29, 161, 242, 0.1);
}

/* Loading overlay */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border-radius: 12px;
  z-index: 10;
}

.loading-overlay span {
  color: var(--ion-color-tese-green);
  font-weight: 500;
}
</style>