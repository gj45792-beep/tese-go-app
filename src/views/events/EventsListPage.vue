<template>
  <ion-page>
    <!-- Header reutilizable -->
    <Header title="Eventos" :show-logo="true" />

    <!-- Contenido principal -->
    <ion-content class="ion-padding">
      <!-- Filtros de eventos -->
      <div class="filters-section">
        <ion-segment v-model="selectedCategory" @ionChange="filterEvents">
          <ion-segment-button value="all">
            <ion-label>Todos</ion-label>
          </ion-segment-button>
          <ion-segment-button value="academic">
            <ion-label>Académicos</ion-label>
          </ion-segment-button>
          <ion-segment-button value="cultural">
            <ion-label>Culturales</ion-label>
          </ion-segment-button>
          <ion-segment-button value="sports">
            <ion-label>Deportivos</ion-label>
          </ion-segment-button>
        </ion-segment>

        <!-- Barra de búsqueda -->
        <ion-searchbar
          v-model="searchQuery"
          placeholder="Buscar eventos..."
          @ionInput="searchEvents"
          class="event-searchbar"
        />
      </div>

      <!-- Lista de eventos -->
      <div class="events-list">
        <div v-if="filteredEvents.length === 0" class="no-events">
          <ion-icon :icon="calendarOutline" size="large" />
          <h3>No hay eventos disponibles</h3>
          <p>Intenta con otros filtros o vuelve más tarde</p>
        </div>

        <EventCard
          v-for="event in filteredEvents"
          :key="event.id"
          :event="event"
          :show-action-button="true"
          action-text="Ver detalles"
          @click="goToEventDetail(event.id)"
          @action="goToEventDetail(event.id)"
          class="event-card-item"
        />
      </div>

      <!-- Botón flotante para crear/agregar evento -->
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="goToMap" color="primary">
          <ion-icon :icon="mapOutline" />
        </ion-fab-button>
        <ion-fab-list side="top">
          <ion-fab-button @click="shareEvents" color="light">
            <ion-icon :icon="shareOutline" />
          </ion-fab-button>
        </ion-fab-list>
      </ion-fab>
    </ion-content>

    <!-- Footer reutilizable -->
    <Footer />
  </ion-page>
</template>

<script setup lang="ts">
import { 
  IonPage, 
  IonContent, 
  IonSegment, 
  IonSegmentButton, 
  IonLabel,
  IonSearchbar,
  IonFab,
  IonFabButton,
  IonFabList,
  IonIcon
} from '@ionic/vue';
import { 
  calendarOutline, 
  mapOutline, 
  shareOutline 
} from 'ionicons/icons';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Header from '@/components/common/Header.vue';
import Footer from '@/components/common/Footer.vue';
import EventCard from '@/components/events/EventCard.vue';

const router = useRouter();

// Estado
const selectedCategory = ref('all');
const searchQuery = ref('');
const allEvents = ref<any[]>([]);

// Datos de ejemplo (en producción vendrían de un API/store)
const sampleEvents = [
  {
    id: 1,
    title: 'Feria de Ciencias 2025',
    time: '10:00 AM',
    location: 'Auditorio Principal',
    category: 'academic',
    description: 'Presentación de proyectos científicos de estudiantes',
    tags: ['Ciencias', 'Investigación', 'Estudiantes']
  },
  {
    id: 2,
    title: 'Torneo Intercampus de Fútbol',
    time: '3:00 PM',
    location: 'Canchas Deportivas',
    category: 'sports',
    description: 'Final del torneo deportivo intercampus',
    tags: ['Deportes', 'Fútbol', 'Competencia']
  },
  {
    id: 3,
    title: 'Festival Cultural Primavera',
    time: '4:00 PM',
    location: 'Plaza Central',
    category: 'cultural',
    description: 'Presentaciones artísticas y culturales',
    tags: ['Arte', 'Música', 'Cultura']
  },
  {
    id: 4,
    title: 'Conferencia: Inteligencia Artificial',
    time: '11:00 AM',
    location: 'Aula Magna',
    category: 'academic',
    description: 'Conferencia sobre aplicaciones de IA en la educación',
    tags: ['Tecnología', 'IA', 'Educación']
  },
  {
    id: 5,
    title: 'Exposición de Arte Visual',
    time: '2:00 PM',
    location: 'Galería de Arte',
    category: 'cultural',
    description: 'Exposición de obras de estudiantes de arte',
    tags: ['Arte', 'Exposición', 'Estudiantes']
  },
  {
    id: 6,
    title: 'Maratón TESE 5K',
    time: '7:00 AM',
    location: 'Circuito Universitario',
    category: 'sports',
    description: 'Carrera atlética para toda la comunidad TESE',
    tags: ['Deportes', 'Salud', 'Comunidad']
  }
];

// Eventos filtrados
const filteredEvents = computed(() => {
  let events = allEvents.value;

  // Filtrar por categoría
  if (selectedCategory.value !== 'all') {
    events = events.filter(event => event.category === selectedCategory.value);
  }

  // Filtrar por búsqueda
  if (searchQuery.value.trim() !== '') {
    const query = searchQuery.value.toLowerCase();
    events = events.filter(event =>
      event.title.toLowerCase().includes(query) ||
      event.description.toLowerCase().includes(query) ||
      event.location.toLowerCase().includes(query) ||
      event.tags.some((tag: string) => tag.toLowerCase().includes(query))
    );
  }

  return events;
});

// Métodos
const filterEvents = () => {
  console.log('Categoría seleccionada:', selectedCategory.value);
};

const searchEvents = () => {
  console.log('Buscando:', searchQuery.value);
};

const goToEventDetail = (id: number) => {
  router.push(`/event-detail/${id}`);
};

const goToMap = () => {
  router.push('/map');
};

const shareEvents = () => {
  console.log('Compartir eventos');
};

// Inicializar
onMounted(() => {
  allEvents.value = sampleEvents;
});
</script>

<style scoped>
.filters-section {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.event-searchbar {
  margin-top: 16px;
  --background: var(--ion-color-light);
  --border-radius: 8px;
}

.events-list {
  margin-top: 16px;
}

.event-card-item {
  margin-bottom: 16px;
}

.no-events {
  text-align: center;
  padding: 40px 20px;
  color: var(--ion-color-medium);
}

.no-events ion-icon {
  color: var(--ion-color-light);
  margin-bottom: 16px;
}

.no-events h3 {
  margin: 0 0 8px 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.no-events p {
  margin: 0;
  font-size: 0.9rem;
}
</style>