<template>
  <ion-page>
    <Header 
      title="Mi Perfil" 
      :showBackButton="true"
      backButtonRoute="/app/home"
    />
    
    <ion-content class="ion-padding" :fullscreen="true">
      <div class="profile-container">
        
        <!-- Sección: Información del usuario -->
        <div class="user-info-section">
          <!-- Avatar/Foto -->
          <div class="avatar-container">
            <div class="profile-avatar-placeholder">
              <ion-icon :icon="personCircle" />
            </div>
          </div>
          
          <!-- Nombre y email -->
          <div class="user-details">
            <h1 class="user-name">Usuario TESE</h1>
            <p class="user-email">usuario@tese.edu.mx</p>
            <ion-chip color="primary" outline>
              <ion-icon :icon="school" />
              <ion-label>Estudiante TESE</ion-label>
            </ion-chip>
          </div>
        </div>
        
        <!-- Separador -->
        <ion-item-divider>
          <ion-label>Preferencias</ion-label>
        </ion-item-divider>
        
        <!-- Sección: Preferencias -->
        <ion-list lines="full" class="preferences-section">
          <!-- Modo oscuro/claro -->
          <ion-item>
            <ion-icon slot="start" :icon="moon" color="medium" />
            <ion-label>Modo oscuro</ion-label>
            <ion-toggle />
          </ion-item>
          
          <!-- Tipo de movilidad -->
          <ion-item button>
            <ion-icon slot="start" :icon="accessibility" color="medium" />
            <ion-label>
              <h3>Tipo de movilidad</h3>
              <p>A pie</p>
            </ion-label>
            <ion-icon slot="end" :icon="chevronForward" />
          </ion-item>
        </ion-list>
        
        <!-- Separador -->
        <ion-item-divider>
          <ion-label>Cuenta</ion-label>
        </ion-item-divider>
        
        <!-- Sección: Cuenta -->
        <ion-list lines="full">
          <!-- Cerrar sesión -->
          <ion-item button @click="logout">
            <ion-icon slot="start" :icon="logOut" color="danger" />
            <ion-label>Cerrar sesión</ion-label>
          </ion-item>
        </ion-list>
        
        <!-- Versión de la app -->
        <div class="app-version">
          <p>TESE GO v1.0.0</p>
        </div>
      </div>
    </ion-content>
    
    <Footer variant="nav" activeTab="profile" />
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonList, IonItem, IonLabel, IonIcon, IonToggle, IonChip, IonItemDivider } from '@ionic/vue';
import { personCircle, school, moon, accessibility, chevronForward, logOut } from 'ionicons/icons';
import { useRouter } from 'vue-router';

// Importar componentes
import Header from '@/components/common/Header.vue';
import Footer from '@/components/common/Footer.vue';

const router = useRouter();

const logout = () => {
  console.log('Cerrar sesión');
  router.push('/');
};
</script>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 0 auto;
}

.user-info-section {
  display: flex;
  align-items: center;
  padding: 20px 0;
  gap: 20px;
}

.avatar-container {
  width: 100px;
  height: 100px;
}

.profile-avatar-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: var(--ion-color-light);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid var(--ion-color-primary);
}

.profile-avatar-placeholder ion-icon {
  font-size: 60px;
  color: var(--ion-color-medium);
}

.user-details {
  flex: 1;
}

.user-name {
  margin: 0 0 5px 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--ion-color-dark);
}

.user-email {
  margin: 0 0 10px 0;
  color: var(--ion-color-medium);
  font-size: 0.9rem;
}

.preferences-section {
  margin-bottom: 20px;
}

.app-version {
  text-align: center;
  margin-top: 30px;
  padding: 10px;
  color: var(--ion-color-medium);
  font-size: 0.8rem;
}
</style>