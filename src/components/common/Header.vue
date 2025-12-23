<template>
  <ion-header :translucent="true">
    <ion-toolbar class="tese-toolbar">
      <!-- Botón menú (izquierda) -->
      <ion-buttons slot="start">
        <ion-button @click="toggleMenu" aria-label="Menú principal">
          <ion-icon :icon="menu" slot="icon-only" />
        </ion-button>
      </ion-buttons>

      <!-- Logo y título (centro) -->
      <div class="header-center">
        <img 
          v-if="showLogo"
          :src="logoImage" 
          alt="TESE" 
          class="header-logo"
        />
        <ion-title class="header-title">
          <span class="gold-text">TESE</span> GO
        </ion-title>
      </div>

      <!-- Acciones (derecha) -->
      <ion-buttons slot="end">
        <ion-button @click="goToNotifications" aria-label="Notificaciones">
          <ion-icon :icon="notifications" slot="icon-only" />
          <ion-badge color="danger" v-if="notificationCount > 0">
            {{ notificationCount }}
          </ion-badge>
        </ion-button>
        <ion-button @click="goToProfile" aria-label="Perfil">
          <ion-icon :icon="personCircle" slot="icon-only" />
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
</template>

<script setup lang="ts">
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonButtons, 
  IonButton, 
  IonIcon, 
  IonBadge 
} from '@ionic/vue';
import { 
  menu, 
  notifications, 
  personCircle,
  compass,
  location 
} from 'ionicons/icons';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// Props del componente
const props = defineProps<{
  showLogo?: boolean;
  showBackButton?: boolean;
}>();

const emit = defineEmits<{
  'menu-toggle': [];
  'back-click': [];
}>();

const router = useRouter();
const notificationCount = ref(0);

// Importar imagen (ajusta la ruta según tu estructura)
const logoImage = new URL('../../../assets/images/logo-tese.jpg', import.meta.url).href;

const toggleMenu = () => {
  emit('menu-toggle');
  console.log('Menú toggled');
};

const goToNotifications = () => {
  router.push('/notifications');
};

const goToProfile = () => {
  router.push('/profile');
};

const goBack = () => {
  emit('back-click');
  router.back();
};
</script>

<style scoped>
.tese-toolbar {
  --background: var(--ion-color-tese-green);
  --color: white;
  --border-color: var(--ion-color-tese-gold);
  --border-width: 0 0 2px 0;
}

.header-center {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex: 1;
}

.header-logo {
  height: 32px;
  width: auto;
  border-radius: 50%;
  border: 2px solid var(--ion-color-tese-gold);
}

.header-title {
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: 1px;
}

.gold-text {
  color: var(--ion-color-tese-gold);
}

ion-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  font-size: 0.7rem;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Efectos hover */
ion-button {
  --color: white;
  --background-hover: rgba(255, 255, 255, 0.1);
  transition: opacity 0.3s ease;
}

ion-button:hover {
  opacity: 0.9;
}
</style>