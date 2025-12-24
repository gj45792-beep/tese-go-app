<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar class="tese-green-bg">
        <ion-title class="header-title">TESE GO</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding login-content">
      <div class="login-logo">
        <img 
          :src="logoImage" 
          alt="Logo TESE" 
          class="small-logo"
        >
      </div>

      <div v-if="errorMessage" class="error-message" role="alert" aria-live="assertive">
        <ion-icon :icon="warning" color="danger" />
        {{ errorMessage }}
      </div>

      <section class="login-section card">
        <h2 tabindex="0"><ion-icon :icon="lockClosed" color="primary" /> ACCESO COMUNIDAD TESE</h2>
        <ion-list lines="none" class="input-list">
          <ion-item>
            <ion-input
              ref="emailInput"
              label="📧 Correo electrónico"
              label-placement="floating"
              type="email"
              placeholder="usuario@tese.edu.mx"
              class="custom-input"
              v-model="email"
              :disabled="isLoading"
              aria-required="true"
              @keydown.enter="() => passwordInput?.$el?.setFocus()"
            ></ion-input>
          </ion-item>
          <ion-item>
            <ion-input
              ref="passwordInput"
              label="🔒 Contraseña"
              label-placement="floating"
              type="password"
              placeholder="••••••••"
              class="custom-input"
              v-model="password"
              :disabled="isLoading"
              aria-required="true"
              
            ></ion-input>
          </ion-item>
        </ion-list>
        <ion-button 
          expand="block" 
          class="login-button"
          
          :disabled="isLoading"
          aria-label="Iniciar sesión"
        >
          <ion-spinner v-if="isLoading" name="crescent"></ion-spinner>
          <span v-else>Ingresar</span>
        </ion-button>
        <div class="forgot-password">
          <a href="#" aria-label="Recuperar contraseña">¿Olvidaste tu contraseña?</a>
        </div>
      </section>

      <section class="guest-section card">
        <h2 tabindex="0"><ion-icon :icon="people" color="primary" /> ACCESO INVITADO</h2>

        <div class="guest-options-divider">
          <span class="divider-text">SELECCIONA UN TIPO ESPECÍFICO</span>
        </div>

        <div class="guest-options">
          <ion-button 
            expand="block" 
            class="login-button guest-button"
            
            :disabled="isLoading"
            aria-label="Acceso como visitante externo"
          >
            <div class="button-content">
              <ion-icon :icon="person" class="button-icon" />
              <span>EXTERNO (VISITANTE)</span>
            </div>
          </ion-button>
          
          <ion-button 
            expand="block" 
            class="login-button guest-button"
            
            :disabled="isLoading"
            aria-label="Acceso como egresado"
          >
            <div class="button-content">
              <ion-icon :icon="school" class="button-icon" />
              <span>EGRESADO</span>
            </div>
          </ion-button>
          
          <ion-button 
            expand="block" 
            class="login-button guest-button"
            
            :disabled="isLoading"
            aria-label="Acceso para nuevos estudiantes"
          >
            <div class="button-content">
              <ion-icon :icon="personAdd" class="button-icon" />
              <span>ADMISIÓN (NUEVOS ESTUDIANTES)</span>
            </div>
          </ion-button>
        </div>
      </section>

            <section class="social-section card">
        <h2 tabindex="0"><ion-icon :icon="globe" color="primary" /> ACCESO RÁPIDO</h2>
        <SocialLoginButtons 
          :isLoading="isLoading"
          @social-login="handleQuickAccess"
        />
      </section>
      
      <div class="bottom-spacer"></div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, 
  IonContent, IonList, IonItem, IonInput, 
  IonButton, IonIcon, IonSpinner
} from '@ionic/vue';
import { 
  lockClosed, person, people, globe, warning,
  logoGoogle, logoFacebook, mail,
  school, personAdd, logoTwitter, logoX
} from 'ionicons/icons';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth.store';
//import type { User } from '../stores/auth.store'; // Importación separada para tipos
import logoImage from '../../assets/images/logo-tese.jpg';
import { loginWithGoogle } from '../../services/auth/auth.service';
import SocialLoginButtons from '../../components/auth/SocialLoginButtons.vue';

const router = useRouter();
const authStore = useAuthStore();
const email = ref('');
const password = ref('');
const isLoading = ref(false);
const errorMessage = ref('');
const emailInput = ref<InstanceType<typeof IonInput>>();
const passwordInput = ref<InstanceType<typeof IonInput>>();

  
/**
const handleLogin = async () => {
  try {
    if (!email.value || !password.value) {
      errorMessage.value = 'Por favor completa todos los campos';
      return;
    }

    isLoading.value = true;
    errorMessage.value = '';
    
    await authStore.login(email.value, password.value);
    router.push('/home');
    
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      errorMessage.value = 'Credenciales incorrectas. Verifica tu email y contraseña.';
    } else if (error.response && error.response.status === 403) {
      errorMessage.value = 'Tu cuenta está suspendida. Contacta al administrador.';
    } else {
      errorMessage.value = 'Usuario o contraseña incorrecta';
    }
  } finally {
    isLoading.value = false;
  }
};

const handleExternalGuest = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = '';
    
    await authStore.guestLogin('external');
    router.push('/home');
    
  } catch (error) {
    errorMessage.value = 'Error al iniciar como visitante externo. Intenta nuevamente.';
  } finally {
    isLoading.value = false;
  }
};

const handleAlumniGuest = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = '';
    
    await authStore.guestLogin('alumni');
    router.push('/home');
    
  } catch (error) {
    errorMessage.value = 'Error al iniciar como egresado. Intenta nuevamente.';
  } finally {
    isLoading.value = false;
  }
};

const handleProspectiveStudent = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = '';
    
    await authStore.guestLogin('prospective_student');
    router.push('/home');
    
  } catch (error) {
    errorMessage.value = 'Error al iniciar como prospecto de admisión. Intenta nuevamente.';
  } finally {
    isLoading.value = false;
  }
};*/

const handleQuickAccess = async (provider: 'google' | 'facebook' | 'outlook') => {
  try {
    isLoading.value = true;
    errorMessage.value = '';
    
    //await authStore.firebaseLogin(provider);
    router.push('/home');
    
  } catch (error: any) {
    errorMessage.value = error.message || 'Error en autenticación';
    console.error('Error en login:', error);
  } finally {
    isLoading.value = false;
  }
};


/*const handleRealOutlook = async () => {
  try {
    await authStore.firebaseLogin('outlook');
    // Redirige a /home u otra página
  } catch (error) {
    console.error("Error real:", error);
  }
};*/
</script>

<style scoped>
.login-content {
  --background: #ebedef;
  padding-top: 20px;
  padding-bottom: 120px;
}

/* Agregar al FINAL del estilo de LoginPage.vue */
.social-section .social-login-container {
  margin-top: 1rem;
}

.social-section .social-buttons-grid {
  max-width: 400px;
  margin: 0 auto;
}

.bottom-spacer {
  height: 60px;
}

.login-logo {
  text-align: center;
  margin-bottom: 1.5rem;
}

.small-logo {
  max-width: 80px;
  border-radius: 50%;
  border: 2px solid var(--ion-color-tese-gold);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.header-title {
  font-weight: 600;
  color: var(--ion-color-tese-gold);
  text-align: center;
  font-size: 1.5rem;
  letter-spacing: 1px;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: var(--ion-color-danger-light);
  color: var(--ion-color-danger);
  border-radius: 8px;
  padding: 10px 15px;
  margin-bottom: 20px;
  font-size: 0.9rem;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-left: 4px solid var(--ion-color-tese-gold);
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.2rem;
  color: #2c3e50;
  margin-top: 0;
  font-weight: 500;
}

h2 ion-icon {
  color: var(--ion-color-tese-gold);
}

.input-list {
  background: transparent;
}

.custom-input {
  --border-radius: 12px;
  --border-color: #e0e0e0;
  --highlight-color-focused: #730617;
  --background: #f8f9fa;
  --color: #2c3e50;
  --placeholder-color: #a0a0a0;
  margin-bottom: 1rem;
  border-radius: 12px;
  transition: all 0.3s ease;
}

ion-item.item-has-focus .custom-input {
  --background: rgba(115, 6, 23, 0.05);
  --border-color: #730617;
  --color: #730617;
}

ion-item.item-has-focus ion-label {
  color: #730617 !important;
}

.custom-input:focus-within {
  box-shadow: 0 0 0 2px rgba(115, 6, 23, 0.2);
}

.login-button {
  --background: var(--ion-color-tese-green);
  --background-hover: var(--ion-color-primary-shade);
  --background-activated: var(--ion-color-primary-shade);
  margin-top: 0.5rem;
  font-weight: 500;
  height: 48px;
  font-size: 0.95rem;
}

.login-button[disabled] {
  --background: #cccccc;
  opacity: 0.7;
}

.social-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 10px;
}

.social-button {
  transition: transform 0.3s ease;
}

.social-button[disabled] {
  --color: #cccccc;
  opacity: 0.7;
}

.social-button:hover {
  transform: scale(1.1);
}

.forgot-password {
  text-align: center;
  margin-top: 10px;
}

.forgot-password a {
  color: var(--ion-color-tese-green);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.forgot-password a:hover {
  color: var(--ion-color-tese-red);
  text-decoration: underline;
}

.guest-options-divider {
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  color: #666;
}

.guest-options-divider::before,
.guest-options-divider::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid #e0e0e0;
}

.divider-text {
  padding: 0 10px;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.guest-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 8px;
  padding: 0 8px;
}

.button-icon {
  font-size: 1.15rem;
  margin-right: 4px;
  flex-shrink: 0;
}

.guest-button {
  --padding-start: 8px;
  --padding-end: 8px;
}

.guest-button span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: clip;
  flex-shrink: 1;
}

ion-button.guest-button::part(native) {
  padding-top: 2px;
  padding-bottom: 2px;
  min-height: 48px;
}

[role="button"]:focus,
button:focus,
input:focus,
a:focus {
  outline: 2px solid var(--ion-color-tese-gold);
  outline-offset: 2px;
}

[tabindex]:focus {
  outline: 2px dashed var(--ion-color-tese-green);
}

ion-input.input-highlight {
  --color: #730617;
}

ion-item.item-has-focus {
  --highlight-color-focused: #730617;
}
</style>