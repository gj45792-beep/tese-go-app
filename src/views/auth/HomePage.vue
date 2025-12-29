<template>
  <ion-page>
    <!-- Header reutilizable -->
    <Header title="Inicio" :show-logo="true" />

    <!-- Contenido principal -->
    <ion-content class="ion-padding app-content">
      <!-- Sección Hero con accesos directos -->
      <div class="hero-section">
        <h1 class="hero-title">¡Bienvenido{{ user.name ? ', ' + user.name : '' }}!</h1>
        <p class="hero-subtitle">¿A dónde deseas ir hoy?</p>
        
        <div class="quick-access-grid">
          <div 
            v-for="(shortcut, index) in quickAccess"
            :key="index"
            class="shortcut-card"
            :style="{ 'background': shortcut.color }"
            @click="handleShortcut(shortcut.action)"
          >
            <ion-icon :icon="shortcut.icon" />
            <span>{{ shortcut.label }}</span>
          </div>
        </div>
      </div>

      <!-- Sección de eventos inteligente -->
      <div class="smart-events-container glass-card">
        <ion-segment v-model="eventViewMode" @ionChange="changeEventView">
          <ion-segment-button value="timeline">
            <ion-label>Próximos eventos</ion-label>
          </ion-segment-button>
          <ion-segment-button value="map">
            <ion-label>Ver en mapa</ion-label>
          </ion-segment-button>
        </ion-segment>

        <!-- Vista de timeline CON EVENTCARD REUTILIZABLE -->
        <div v-if="eventViewMode === 'timeline'" class="timeline-view">
          <EventCard 
            v-for="event in filteredFeaturedEvents"
            :key="event.id"
            :event="{
              id: event.id,
              title: event.title,
              time: event.time,
              location: event.location,
              category: event.categoryId,
              tags: [getCategoryName(event.categoryId)]
            }"

          />
        </div>

        <!-- Vista de mapa (placeholder) -->
        <div v-else class="map-preview">
          <img 
            src="https://maps.googleapis.com/maps/api/staticmap?center=TESE,Ecatepec&zoom=16&size=600x300&maptype=roadmap&markers=color:red%7CTESE,Ecatepec" 
            alt="Mapa del TESE"
            class="map-image"
          >
          <ion-button 
            expand="block" 
            fill="clear"
            @click="goToMap"
          >
            Ver mapa completo
          </ion-button>
        </div>
      </div>

      <!-- Asistente de rutas flotante -->
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="openSmartAssistant" color="gold">
          <ion-icon :icon="sparkles" />
        </ion-fab-button>
        
        <ion-fab-list side="top">
          <ion-fab-button 
            v-for="(feature, index) in smartFeatures"
            :key="index"
            color="light"
            @click="feature.action"
          >
            <ion-icon :icon="feature.icon" />
            <ion-label>{{ feature.label }}</ion-label>
          </ion-fab-button>
        </ion-fab-list>
      </ion-fab>
    </ion-content>
     <Footer variant="nav" activeTab="home" />
  </ion-page>
</template>

<script setup lang="ts">
import { 
  IonPage, 
  IonContent, 
  IonButton, 
  IonIcon, 
  IonChip,
  IonLabel, 
  IonSegment, 
  IonSegmentButton, 
  IonFab, 
  IonFabButton, 
  IonFabList 
} from '@ionic/vue';
import { 
  location, 
  sparkles,
  school, 
  accessibility, 
  carSport,
  map as mapIcon, 
  walk 
} from 'ionicons/icons';
import { useRouter } from 'vue-router';
import { useAuthSimpleStore } from '@/stores/auth-simple.store';
import { ref, computed } from 'vue';
import Header from '@/components/common/Header.vue';
import Footer from '@/components/common/Footer.vue';
import EventCard from '@/components/events/EventCard.vue';

const router = useRouter();
const authStore = useAuthSimpleStore();

// Datos del usuario
const user = computed(() => ({
  name: authStore.displayName() || '',
  role: 'guest'
}));

// Configuración de UI
const eventViewMode = ref('timeline');

// Accesos rápidos
const quickAccess = ref([
  { 
    icon: mapIcon, 
    label: 'Mapa', 
    color: 'var(--ion-color-tese-green)', 
    action: () => router.push('/map') 
  },
  { 
    icon: school, 
    label: 'Aulas', 
    color: 'var(--ion-color-primary)', 
    action: () => router.push('/locations/classrooms') 
  },
  { 
    icon: accessibility, 
    label: 'Rutas accesibles', 
    color: 'var(--ion-color-tese-mint)', 
    action: () => router.push('/accessible-routes') 
  },
  { 
    icon: carSport, 
    label: 'Estacionamiento', 
    color: 'var(--ion-color-tese-sky)', 
    action: () => router.push('/parking') 
  }
]);

// Asistente inteligente
const smartFeatures = ref([
  {
    icon: accessibility,
    label: 'Ruta accesible',
    action: () => router.push('/navigation?type=accessible')
  },
  {
    icon: walk,
    label: 'A pie',
    action: () => router.push('/navigation?type=walking')
  },
  {
    icon: carSport,
    label: 'En auto',
    action: () => router.push('/navigation?type=driving')
  }
]);

// Eventos (simplificado para el ejemplo)
const filteredFeaturedEvents = ref([
  {
    id: 1,
    title: 'Feria de Ciencias 2025',
    time: '10:00 AM',
    location: 'Auditorio Principal',
    categoryId: 'academic'
  },
  {
    id: 2,
    title: 'Torneo Deportivo',
    time: '3:00 PM',
    location: 'Canchas Deportivas',
    categoryId: 'sports'
  },
  {
    id: 3,
    title: 'Festival Cultural',
    time: '4:00 PM',
    location: 'Plaza Central',
    categoryId: 'cultural'
  }
]);

// Métodos
const getCategoryName = (id: string) => {
  const categories: Record<string, string> = {
    academic: 'Académico',
    sports: 'Deportivo',
    cultural: 'Cultural'
  };
  return categories[id] || 'Evento';
};

const getCategoryColor = (id: string) => {
  const colors: Record<string, string> = {
    academic: 'primary',
    sports: 'success',
    cultural: 'warning'
  };
  return colors[id] || 'medium';
};

const openSmartAssistant = () => {
  console.log('Asistente activado');
};

const goToMap = () => router.push('/map');
const goToEventDetail = (id: number) => router.push(`/event-detail/${id}`);
const handleShortcut = (action: Function) => action();
const changeEventView = () => console.log('Cambiando vista:', eventViewMode.value);
</script>

<style scoped>
/* Variables de diseño */
:root {
  --tese-elevation-1: 0 1px 3px rgba(0,0,0,0.12);
  --tese-elevation-2: 0 4px 6px rgba(0,0,0,0.16);
  --tese-corner-radius: 16px;
  --ion-color-tese-sky: #68c5ff;
  --ion-color-tese-mint: #5de2a3;
}

/* Sección Hero */
.hero-section {
  background: linear-gradient(135deg, var(--ion-color-tese-green) 0%, #1a5f3e 100%);
  border-radius: var(--tese-corner-radius);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  color: white;
}

.hero-title {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
}

.hero-subtitle {
  margin: 0.5rem 0 1.5rem;
  opacity: 0.9;
}

.quick-access-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.shortcut-card {
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  text-align: center;
  transition: transform 0.2s ease;
}

.shortcut-card:active {
  transform: scale(0.95);
}

.shortcut-card ion-icon {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.shortcut-card span {
  font-size: 0.9rem;
  font-weight: 500;
}

/* Contenedor de eventos */
.glass-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: var(--tese-corner-radius);
  padding: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: var(--tese-elevation-1);
}

/* Timeline de eventos */
.timeline-view {
  margin-top: 1rem;
}

/* Vista de mapa */
.map-preview {
  margin-top: 1rem;
}

.map-image {
  width: 100%;
  border-radius: 12px;
  height: 180px;
  object-fit: cover;
}

/* Responsive */
@media (min-width: 768px) {
  .quick-access-grid {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .hero-section {
    padding: 2rem;
  }
}
</style>
