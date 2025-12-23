<template>
  <ion-page>
    <ion-content class="ion-padding ion-text-center welcome-content">
      <!-- Logo con animación -->
      <div class="logo-container">
        <transition name="zoom" appear>
          <div class="logo-wrapper">
            <img 
              :src="logoImage" 
              alt="Logo TESE" 
              class="animated-logo"
              loading="eager"
              fetchpriority="high"
            >
          </div>
        </transition>
      </div>

      <!-- Títulos con animación -->
      <transition name="fade-slide" appear>
        <div class="text-content">
          <h1 class="welcome-title">BIENVENIDO A</h1>
          <h2 class="app-title">T E S E &nbsp; G O</h2>
          <p class="tagline">"Ciencia y tecnología al bienestar social"</p>
          <div class="description-container">
            <p class="app-description">
              Tu guía inteligente para navegar el campus TESE. Encuentra rutas optimizadas 
              para peatones, vehículos y personas con discapacidad. Accede a información 
              en tiempo real sobre eventos, ubicaciones y servicios disponibles en el campus, 
              facilitando tu movilidad y experiencia académica.
            </p>
          </div>
        </div>
      </transition>

      <!-- Ilustración con animación -->
      <transition name="slide-up" appear>
        <div class="illustration-container">
          <img 
            :src="campusImage" 
            alt="Campus TESE" 
            class="campus-image"
            loading="lazy"
          >
        </div>
      </transition>

      <!-- Botones con animación -->
      <transition name="fade" appear>
        <div class="buttons-container">
          <ion-button 
            expand="block" 
            fill="outline"
            class="enter-button"
            @click="navigateToLogin"
          >
            COMENZAR
          </ion-button>
          <ion-button 
            expand="block" 
            fill="outline" 
            class="login-button"
            @click="navigateToLogin"
          >
            INICIAR SESIÓN
          </ion-button>
        </div>
      </transition>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonButton } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

// ✅ RUTAS CORREGIDAS (desde views/public/)
import logoImage from '../../assets/images/logo-tese.jpg';
import campusImage from '../../assets/images/campus-map.jpg';

const router = useRouter();
const navigateToLogin = () => router.push('/login');

onMounted(() => {
  // Precargar imagen del campus para mejor experiencia
  const img = new Image();
  img.src = campusImage;

  // Animación del logo
  const logo = document.querySelector('.animated-logo');
  if (logo) logo.classList.add('pulse');
});
</script>

<style scoped>
.welcome-content {
  --background: var(--welcome-gradient, linear-gradient(160deg, var(--ion-color-tese-green) 0%, #1B5E20 100%));
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  padding: 20px 0;
}

/* Contenedor principal responsivo */
.text-content {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 16px;
}

.logo-container {
  margin: 1rem 0 1.5rem;
  position: relative;
}

.logo-wrapper {
  position: relative;
  display: inline-block;
}

.animated-logo {
  width: clamp(120px, 25vw, 160px);
  height: clamp(120px, 25vw, 160px);
  border-radius: 50%;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  transition: all 0.5s ease;
  display: block;
  position: relative;
  z-index: 1;
  border: 6px solid var(--ion-color-tese-gold);
  padding: 3px;
  box-sizing: border-box;
  will-change: transform, box-shadow;
  backface-visibility: hidden;
}

.animated-logo::after {
  content: '';
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border-radius: 50%;
  border: 3px solid rgba(255, 215, 0, 0.5);
  z-index: -1;
  animation: glow 2s infinite alternate;
  will-change: box-shadow;
}

.animated-logo.pulse {
  animation: pulse 2s infinite;
}

.welcome-title {
  font-size: clamp(1.2rem, 4vw, 1.4rem);
  font-weight: 300;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.5rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.app-title {
  font-size: clamp(1.8rem, 6vw, 2.2rem);
  letter-spacing: 4px;
  margin: 0.5rem 0;
  color: var(--ion-color-tese-gold);
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.tagline {
  font-style: italic;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 1.5rem;
  font-size: clamp(0.85rem, 3vw, 0.95rem);
  max-width: 90%;
  margin-left: auto;
  margin-right: auto;
}

.description-container {
  padding: 0 10px;
  margin: 0 auto 2rem;
}

.app-description {
  color: rgba(255, 255, 255, 0.9);
  font-size: clamp(0.8rem, 3.2vw, 0.95rem);
  line-height: 1.6;
  text-align: justify;
  hyphens: auto;
  margin: 0 auto;
  max-width: 90%;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  padding: 0 5px;
}

.illustration-container {
  margin: 1.5rem auto;
  max-width: 90%;
  width: fit-content;
  padding: 0 10px;
}

.campus-image {
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  max-height: 40vh;
  object-fit: contain;
  border: 1px solid rgba(255, 215, 0, 0.3); 
  display: block;
}

.buttons-container {
  max-width: 90%;
  width: 100%;
  margin: 2rem auto 0;
  padding: 0 16px;
}

.enter-button {
  --background: var(--ion-color-tese-green);
  --background-hover: var(--ion-color-primary-shade);
  --background-activated: var(--ion-color-primary-shade);
  --box-shadow: 0 4px 8px rgba(46, 125, 50, 0.4);
  margin: 12px 0;
  font-weight: 500;
  --color: white;
  --border-radius: 50px;
  height: 50px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  will-change: transform, filter;
   --border-color: var(--ion-color-tese-gold); /* ← AGREGA ESTA LÍNEA */
  --border-width: 2px; /* ← Y ESTA LÍNEA */
}

.login-button {
  --color:white;
  --border-color: var(--ion-color-tese-gold);
  --background: var(--ion-color-tese-green);
  --background-hover: rgba(255, 214, 0, 0.1);
   --background-activated: var(--ion-color-primary-shade);
  --border-radius: 50px;
  height: 50px;
  font-weight: 500;
  --border-width: 2px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  will-change: transform, filter;
}

/* Animaciones optimizadas */
@keyframes pulse {
  0% { 
    transform: scale(1); 
    box-shadow: 
      0 0 0 0 rgba(255, 215, 0, 0.6),
      0 0 0 0 rgba(255, 215, 0, 0.3);
  }
  50% { 
    transform: scale(1.05); 
  }
  100% { 
    transform: scale(1); 
    box-shadow: 
      0 0 0 20px rgba(255, 215, 0, 0), 
      0 0 0 40px rgba(255, 215, 0, 0); 
  }
}

@keyframes glow {
  from {
    box-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
  }
  to {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
  }
}

/* Transiciones optimizadas */
.zoom-enter-active {
  animation: zoom-in 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  will-change: transform, opacity;
}

.fade-slide-enter-active {
  animation: fade-slide 1s ease-out;
  will-change: transform, opacity;
}

.slide-up-enter-active {
  animation: slide-up 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  will-change: transform, opacity;
}

.fade-enter-active {
  animation: fade-in 1.2s ease-out;
  will-change: opacity;
}

@keyframes zoom-in {
  0% { transform: scale(0.5); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes fade-slide {
  0% { transform: translateY(30px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

@keyframes slide-up {
  0% { transform: translateY(60px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

@keyframes fade-in {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

/* Efectos hover optimizados */
.enter-button:hover, .login-button:hover {
  filter: brightness(1.15);
  transform: translateY(-3px);
  transition: all 0.3s ease;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

/* Media queries para ajustes específicos */
@media (min-width: 768px) {
  .app-description {
    max-width: 80%;
    font-size: 1rem;
    line-height: 1.7;
  }
}

@media (min-width: 992px) {
  .app-description {
    max-width: 70%;
    font-size: 1.05rem;
  }
  
  .buttons-container {
    max-width: 60%;
  }
}

@media (max-height: 700px) {
  .welcome-content {
    padding: 10px 0;
  }
  
  .logo-container {
    margin: 0.5rem 0 1rem;
  }
  
  .description-container {
    margin-bottom: 1rem;
  }
}
</style>