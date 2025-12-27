# Reemplaza Header.vue con esta versión simplificada
cat > src/components/common/Header.vue << 'EOF'
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
        <!-- Usuario autenticado SIMPLIFICADO -->
        <div v-if="authStore.user" class="user-info">
          <ion-chip color="success">
            <ion-avatar>
              <img 
                v-if="authStore.user?.photoURL" 
                :src="authStore.user.photoURL" 
                alt="Foto"
              />
              <ion-icon v-else :icon="personCircle" />
            </ion-avatar>
            <ion-label>Hola, {{ authStore.user?.displayName || 'Usuario' }}</ion-label>
          </ion-chip>
          <ion-button @click="authStore.logout()" fill="clear" color="light">
            <ion-icon slot="icon-only" :icon="logOutOutline" />
          </ion-button>
        </div>

        <!-- NO autenticado: solo título -->
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
  IonLabel
} from '@ionic/vue';
import { logOutOutline, personCircle } from 'ionicons/icons';
import { useAuthSimpleStore } from '@/stores/auth-simple.store';

// --- PROPS ---
const props = defineProps<{
  title?: string;
  showLogo?: boolean;
}>();

// --- STORE SIMPLE ---
const authStore = useAuthSimpleStore();
</script>

<style scoped>
.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
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

.user-info ion-label {
  color: #FFED4E !important;
  font-weight: 600;
}

.user-info ion-avatar {
  margin-right: 20px;
}
</style>
EOF