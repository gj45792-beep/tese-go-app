<template>
  <ion-header>
    <ion-toolbar color="primary">
      <div v-if="showLogo" slot="start" class="logo-container">
        <img 
          src="@/assets/images/logo-tese.jpg" 
          alt="Logo TESE" 
          class="logo"
        />
      </div>

      <ion-title class="ion-text-center">{{ title }}</ion-title>
      
      <ion-buttons slot="end">
        <!-- USUARIO AUTENTICADO: accede DIRECTAMENTE a los getters del store -->
        <div v-if="!isLoading && isAuth" class="user-info">
          <ion-chip color="success">
            <ion-avatar>
              <img 
                v-if="authStore.user?.photoURL" 
                :src="authStore.user.photoURL" 
                alt="Foto"
              />
              <ion-icon v-else :icon="personCircle" />
            </ion-avatar>
            <!-- Usa displayName() que es un getter computado -->
            <ion-label>Hola, {{ userDisplayName }}</ion-label>
          </ion-chip>
          <ion-button @click="authStore.logout()" fill="clear" color="light">
            <ion-icon slot="icon-only" :icon="logOutOutline" />
          </ion-button>
        </div>

        <!-- CARGANDO -->
        <div v-else-if="authStore.loading" class="loading-state">
          <ion-spinner name="crescent" />
        </div>
        <!-- NO autenticado: no muestra nada extra -->
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
  IonChip,
  IonAvatar,
  IonLabel,
  IonSpinner
} from '@ionic/vue';
import { logOutOutline, personCircle } from 'ionicons/icons';
import { useAuthSimpleStore } from '@/stores/auth-simple.store';
import { ref, watch } from 'vue'; // <-- Añade watch

// --- PROPS ---
const props = defineProps<{
  title?: string;
  showLogo?: boolean;
}>();

// --- CONEXIÓN AL STORE CON WATCH ---
const authStore = useAuthSimpleStore();

// Crea variables locales REACTIVAS
const userDisplayName = ref('');
const isLoading = ref(true);
const isAuth = ref(false);

watch(
  () => authStore.user,
  (newUser) => {
    console.log('🔍 WATCH activado. Nuevo usuario:', newUser);
    console.log('   - Email:', newUser?.email);
    console.log('   - DisplayName:', newUser?.displayName);
    userDisplayName.value = newUser?.displayName || 'Usuario';
    isAuth.value = !!newUser;
  },
  { immediate: true }
);

watch(
  () => authStore.loading, // Observa el estado de carga
  (newLoading) => {
    isLoading.value = newLoading;
  },
  { immediate: true }
);

// Función de logout
const logout = () => {
  authStore.logout();
};
</script>
<style scoped>
.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.loading-state {
  padding: 0 8px;
}

ion-avatar {
  width: 24px;
  height: 24px;
}

.logo-container {
  display: flex;
  align-items: center;
  padding-left: 12px;
}

.logo {
  height: 32px;
  width: auto;
  border-radius: 4px;
}
/* Cambia el color del texto del chip (Hola, Nombre) */
.user-info ion-label {
  color: #FFED4E !important; /* Dorado TESE - ajusta si quieres otro */
  font-weight: 600;
}

/* Ajusta el espacio entre la foto y el texto "Hola, Nombre" */
.user-info ion-avatar {
  margin-right: 20px; /* Aumenta este valor si quieres más separación */
}

</style>