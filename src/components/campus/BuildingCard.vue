<template>
  <div class="building-card" @click="handleClick">
    <!-- Imagen del edificio -->
    <div class="building-image-container">
      <img 
        v-if="building.image" 
        :src="building.image" 
        :alt="building.name"
        class="building-image"
      />
      <div v-else class="building-image-placeholder">
        <ion-icon :icon="businessOutline" />
      </div>
      
      <!-- Badge de distancia -->
      <div class="distance-badge" v-if="building.distance">
        {{ building.distance }} m
      </div>
      
      <!-- Badge de categoría -->
      <div class="category-badge" :class="building.category">
        {{ getCategoryLabel(building.category) }}
      </div>
    </div>

    <!-- Información del edificio -->
    <div class="building-info">
      <div class="building-header">
        <h3 class="building-name">{{ building.name }}</h3>
        <div class="building-code" v-if="building.code">
          {{ building.code }}
        </div>
      </div>
      
      <p class="building-description" v-if="building.description">
        {{ building.description }}
      </p>
      
      <!-- Servicios disponibles -->
      <div class="building-services" v-if="building.services && building.services.length > 0">
        <div 
          v-for="service in building.services.slice(0, 3)" 
          :key="service"
          class="service-tag"
        >
          <ion-icon :icon="getServiceIcon(service)" />
          <span>{{ service }}</span>
        </div>
        <div v-if="building.services.length > 3" class="more-services">
          +{{ building.services.length - 3 }} más
        </div>
      </div>
      
      <!-- Horario -->
      <div class="building-schedule" v-if="building.schedule">
        <ion-icon :icon="timeOutline" />
        <span>{{ building.schedule }}</span>
      </div>
      
      <!-- Estado (abierto/cerrado) -->
      <div class="building-status" :class="building.status || 'open'">
        <div class="status-dot"></div>
        <span>{{ getStatusText(building.status) }}</span>
      </div>
    </div>

    <!-- Acciones -->
    <div class="building-actions">
      <ion-button 
        fill="clear" 
        size="small"
        @click.stop="handleNavigate"
      >
        <ion-icon :icon="navigateOutline" slot="start" />
        Navegar
      </ion-button>
      
      <ion-button 
        fill="clear" 
        size="small"
        @click.stop="handleDetails"
        v-if="showDetailsButton"
      >
        <ion-icon :icon="informationCircleOutline" slot="start" />
        Detalles
      </ion-button>
      
      <ion-button 
        fill="clear" 
        size="small"
        @click.stop="handleFavorite"
        class="favorite-button"
      >
        <ion-icon 
          :icon="building.isFavorite ? heart : heartOutline" 
          slot="icon-only"
          :color="building.isFavorite ? 'danger' : 'medium'"
        />
      </ion-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  IonButton, 
  IonIcon 
} from '@ionic/vue';
import { 
  businessOutline,
  navigateOutline,
  informationCircleOutline,
  heartOutline,
  heart,
  timeOutline,
  wifiOutline,
  restaurantOutline,
  libraryOutline,
  fitnessOutline,
  carOutline,
  medicalOutline,
  schoolOutline
} from 'ionicons/icons';

// Props del componente
const props = defineProps<{
  building: {
    id: string | number;
    name: string;
    code?: string;
    description?: string;
    image?: string;
    distance?: number;
    category: string;
    services?: string[];
    schedule?: string;
    status?: 'open' | 'closed' | 'limited';
    isFavorite?: boolean;
  };
  showDetailsButton?: boolean;
}>();

// Emits
const emit = defineEmits<{
  click: [id: string | number];
  navigate: [id: string | number];
  details: [id: string | number];
  favorite: [id: string | number];
}>();

// Métodos
const handleClick = () => {
  emit('click', props.building.id);
};

const handleNavigate = () => {
  emit('navigate', props.building.id);
};

const handleDetails = () => {
  emit('details', props.building.id);
};

const handleFavorite = () => {
  emit('favorite', props.building.id);
};

const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    academic: 'Académico',
    administrative: 'Administrativo',
    library: 'Biblioteca',
    sports: 'Deportivo',
    food: 'Alimentos',
    parking: 'Estacionamiento',
    medical: 'Médico',
    residential: 'Residencial'
  };
  return labels[category] || 'Edificio';
};

const getServiceIcon = (service: string) => {
  const icons: Record<string, any> = {
    'WiFi': wifiOutline,
    'Cafetería': restaurantOutline,
    'Biblioteca': libraryOutline,
    'Gimnasio': fitnessOutline,
    'Estacionamiento': carOutline,
    'Enfermería': medicalOutline,
    'Aulas': schoolOutline
  };
  return icons[service] || businessOutline;
};

const getStatusText = (status?: string) => {
  const texts: Record<string, string> = {
    open: 'Abierto ahora',
    closed: 'Cerrado',
    limited: 'Horario limitado'
  };
  return texts[status || 'open'] || 'Abierto';
};
</script>

<style scoped>
.building-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  margin-bottom: 20px;
}

.building-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.building-image-container {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.building-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.building-image-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--ion-color-tese-green) 0%, #1a5f3e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.building-image-placeholder ion-icon {
  font-size: 64px;
  color: white;
  opacity: 0.7;
}

.distance-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.category-badge {
  position: absolute;
  bottom: 12px;
  left: 12px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: white;
}

.category-badge.academic {
  background: var(--ion-color-primary);
}

.category-badge.administrative {
  background: var(--ion-color-secondary);
}

.category-badge.library {
  background: var(--ion-color-tertiary);
}

.category-badge.sports {
  background: var(--ion-color-success);
}

.category-badge.food {
  background: var(--ion-color-warning);
}

.category-badge.parking {
  background: var(--ion-color-medium);
}

.category-badge.medical {
  background: var(--ion-color-danger);
}

.category-badge.residential {
  background: var(--ion-color-tese-gold);
}

.building-info {
  padding: 16px;
}

.building-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.building-name {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--ion-color-dark);
  flex: 1;
}

.building-code {
  background: var(--ion-color-light);
  color: var(--ion-color-medium);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-left: 8px;
  white-space: nowrap;
}

.building-description {
  margin: 0 0 12px 0;
  font-size: 0.9rem;
  color: var(--ion-color-medium);
  line-height: 1.4;
}

.building-services {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.service-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  background: var(--ion-color-light);
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  color: var(--ion-color-medium);
}

.service-tag ion-icon {
  font-size: 0.9rem;
}

.more-services {
  background: var(--ion-color-light);
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  color: var(--ion-color-medium);
  font-weight: 600;
}

.building-schedule {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: var(--ion-color-medium);
  margin-bottom: 8px;
}

.building-schedule ion-icon {
  font-size: 1rem;
}

.building-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  font-weight: 600;
}

.building-status.open {
  color: var(--ion-color-success);
}

.building-status.closed {
  color: var(--ion-color-danger);
}

.building-status.limited {
  color: var(--ion-color-warning);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.building-status.open .status-dot {
  background: var(--ion-color-success);
}

.building-status.closed .status-dot {
  background: var(--ion-color-danger);
}

.building-status.limited .status-dot {
  background: var(--ion-color-warning);
}

.building-actions {
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  border-top: 1px solid var(--ion-color-light-shade);
}

.favorite-button {
  margin-left: auto;
}
</style>