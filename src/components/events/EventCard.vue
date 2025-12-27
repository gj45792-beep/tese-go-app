<template>
  <div class="event-card" @click="handleClick">
    <div class="event-header">
      <div class="event-category" :class="categoryClass">
        {{ event.category }}
      </div>
      <div class="event-time">
        {{ formatTime(event.time) }}
      </div>
    </div>
    
    <div class="event-content">
      <h3 class="event-title">{{ event.title }}</h3>
      <p class="event-location">
        <ion-icon :icon="locationOutline" />
        {{ event.location }}
      </p>
      <p class="event-description" v-if="event.description">
        {{ event.description }}
      </p>
    </div>
    
    <div class="event-footer">
      <div class="event-tags">
        <span 
          v-for="tag in event.tags" 
          :key="tag" 
          class="event-tag"
        >
          {{ tag }}
        </span>
      </div>
      <ion-button 
        v-if="showActionButton" 
        size="small" 
        fill="clear"
        @click.stop="handleAction"
      >
        {{ actionText }}
      </ion-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonIcon, IonButton } from '@ionic/vue';
import { locationOutline } from 'ionicons/icons';

// Props del componente
const props = defineProps<{
  event: {
    id: string | number;
    title: string;
    time: string;
    location: string;
    category: string;
    description?: string;
    tags?: string[];
  };
  showActionButton?: boolean;
  actionText?: string;
}>();

// Emits (eventos que emite el componente)
const emit = defineEmits<{
  click: [id: string | number];
  action: [id: string | number];
}>();

// Clase CSS basada en categoría
const categoryClass = computed(() => {
  const categories: Record<string, string> = {
    'academic': 'category-academic',
    'cultural': 'category-cultural',
    'sports': 'category-sports',
    'admission': 'category-admission',
    'graduation': 'category-graduation'
  };
  return categories[props.event.category] || 'category-default';
});

// Métodos
const handleClick = () => {
  emit('click', props.event.id);
};

const handleAction = () => {
  emit('action', props.event.id);
};

const formatTime = (time: string) => {
  // Formatear hora si es necesario
  return time;
};
</script>

<script lang="ts">
import { computed } from 'vue';
export { computed };
</script>

<style scoped>
.event-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.event-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.event-category {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.event-time {
  font-size: 0.9rem;
  color: var(--ion-color-medium);
  font-weight: 500;
}

.event-content {
  margin-bottom: 16px;
}

.event-title {
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--ion-color-dark);
}

.event-location {
  margin: 0 0 8px 0;
  font-size: 0.9rem;
  color: var(--ion-color-medium);
  display: flex;
  align-items: center;
  gap: 6px;
}

.event-description {
  margin: 0;
  font-size: 0.9rem;
  color: var(--ion-color-dark);
  line-height: 1.4;
}

.event-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.event-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.event-tag {
  padding: 2px 8px;
  background: var(--ion-color-light);
  border-radius: 12px;
  font-size: 0.8rem;
  color: var(--ion-color-medium);
}

/* Colores por categoría */
.category-academic {
  background: var(--ion-color-primary);
  color: white;
}

.category-cultural {
  background: var(--ion-color-warning);
  color: white;
}

.category-sports {
  background: var(--ion-color-success);
  color: white;
}

.category-admission {
  background: var(--ion-color-tese-green);
  color: white;
}

.category-graduation {
  background: var(--ion-color-tese-gold);
  color: white;
}

.category-default {
  background: var(--ion-color-medium);
  color: white;
}
</style>