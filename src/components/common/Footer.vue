<template>
  <!-- MODO INFORMATIVO (Welcome/Login) -->
  <div v-if="variant === 'info'" class="info-footer">
    <div class="info-content">
      <p class="institution-name">Tecnológico de Estudios Superiores de Ecatepec</p>
      <p class="copyright">© {{ currentYear }} TESE GO</p>
      <p class="contact-email">jafg@tese.edu.mx</p>
    </div>
  </div>

  <!-- MODO NAVEGACIÓN (Home/Events/Map/Profile) -->
  <div v-else class="nav-footer">
    <!-- Tabs de navegación -->
    <div class="nav-tabs">
      <router-link 
        to="/app/home" 
        class="nav-tab" 
        :class="{ 'active': activeTab === 'home' }"
      >
        <ion-icon :icon="home" />
        <span class="tab-label">Inicio</span>
      </router-link>
      
      <router-link 
        to="/app/events" 
        class="nav-tab" 
        :class="{ 'active': activeTab === 'events' }"
      >
        <ion-icon :icon="calendar" />
        <span class="tab-label">Eventos</span>
      </router-link>
      
      <router-link 
        to="/app/map" 
        class="nav-tab" 
        :class="{ 'active': activeTab === 'map' }"
      >
        <ion-icon :icon="map" />
        <span class="tab-label">Mapa</span>
      </router-link>
      
      <router-link 
        to="/app/profile" 
        class="nav-tab" 
        :class="{ 'active': activeTab === 'profile' }"
      >
        <ion-icon :icon="person" />
        <span class="tab-label">Perfil</span>
      </router-link>
    </div>
    
    <!-- Copyright -->
    <div class="nav-copyright">
      <p>© {{ currentYear }} TESE GO jafg</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { home, calendar, map, person } from 'ionicons/icons';
import { IonIcon } from '@ionic/vue';
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

const currentYear = ref(new Date().getFullYear());

// Props
const props = defineProps({
  variant: {
    type: String,
    default: 'nav',
    validator: (value: string) => ['nav', 'info'].includes(value)
  },
  activeTab: {
    type: String,
    default: 'home'
  }
});
</script>

<style scoped>
/* ===== MODO INFORMATIVO ===== */
.info-footer {
  background: #811D22;
  color: white;
  text-align: center;
  padding: 12px 15px 10px;
}

.institution-name {
  font-size: 0.85rem;
  margin: 0 0 6px 0;
  font-weight: 600;
}

.copyright {
  font-size: 0.75rem;
  margin: 0 0 4px 0;
  opacity: 0.95;
}

.contact-email {
  font-size: 0.8rem;
  color: #ffd700;
  margin: 0;
  font-weight: 600;
}

/* ===== MODO NAVEGACIÓN ===== */
.nav-footer {
  background: #f8f9fa;
  padding: 10px 0 5px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
}

.nav-tabs {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 5px;
}

.nav-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #6c757d;
  padding: 8px 5px;
  border-radius: 8px;
  transition: all 0.2s;
  flex: 1;
  max-width: 80px;
}

.nav-tab:hover {
  background-color: #e9ecef;
}

.nav-tab.active {
  color: #8b0000;
  background-color: rgba(139, 0, 0, 0.1);
}

.nav-tab ion-icon {
  font-size: 1.5rem;
  margin-bottom: 4px;
}

.tab-label {
  font-size: 0.7rem;
  font-weight: 600;
}

.nav-copyright {
  text-align: center;
  padding: 8px 0 5px;
  margin-top: 5px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  background: #f8f9fa;
}

.nav-copyright p {
  font-size: 0.7rem;
  color: #8b0000;
  margin: 0;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 350px) {
  .tab-label {
    font-size: 0.65rem;
  }
  
  .nav-tab {
    padding: 6px 3px;
    max-width: 70px;
  }
}
</style>