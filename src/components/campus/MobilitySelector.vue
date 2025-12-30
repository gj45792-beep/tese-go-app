<template>
  <div class="mobility-selector">
    <h4>Modo de Movilidad</h4>
    <div class="mobility-options">
      <div 
        v-for="option in mobilityOptions"
        :key="option.id"
        :class="['mobility-option', { 'selected': selectedMobility === option.id }]"
        @click="selectMobility(option.id)"
      >
        <div class="option-icon">
          <ion-icon :icon="option.icon"></ion-icon>
        </div>
        <div class="option-info">
          <div class="option-title">{{ option.title }}</div>
          <div class="option-description">{{ option.description }}</div>
        </div>
        <div v-if="selectedMobility === option.id" class="option-check">
          <ion-icon :icon="checkmark"></ion-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonIcon } from '@ionic/vue';
import { walk, accessibility, car } from 'ionicons/icons';
import { checkmark } from 'ionicons/icons';

// Definir props y emits
const props = defineProps<{
  initialMobility?: 'walking' | 'wheelchair' | 'car';
}>();

const emit = defineEmits<{
  'mobility-changed': [mobility: 'walking' | 'wheelchair' | 'car'];
}>();

// Opciones de movilidad
const mobilityOptions = [
  {
    id: 'walking' as const,
    title: 'Peatón',
    description: 'Rutas para caminar',
    icon: walk
  },
  {
    id: 'wheelchair' as const,
    title: 'Silla de ruedas',
    description: 'Rutas accesibles',
    icon: accessibility  // Icono correcto de ionicons
  },
  {
    id: 'car' as const,
    title: 'Automóvil',
    description: 'Rutas para vehículos',
    icon: car
  }
];

// Estado
const selectedMobility = ref(props.initialMobility || 'walking');

// Métodos
function selectMobility(mobility: 'walking' | 'wheelchair' | 'car') {
  selectedMobility.value = mobility;
  emit('mobility-changed', mobility);
}

// Exponer valor actual
defineExpose({
  getSelectedMobility: (): 'walking' | 'wheelchair' | 'car' => selectedMobility.value
});
</script>

<style scoped>
.mobility-selector {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.mobility-selector h4 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.mobility-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mobility-option {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.mobility-option:hover {
  border-color: #667eea;
  background-color: #f8f9fa;
}

.mobility-option.selected {
  border-color: #2196f3;
  background-color: #e8f4ff;
}

.option-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  flex-shrink: 0;
}

.mobility-option.selected .option-icon {
  background: linear-gradient(135deg, #2196f3 0%, #21cbf3 100%);
}

.option-info {
  flex: 1;
}

.option-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.option-description {
  font-size: 14px;
  color: #666;
}

.option-check {
  color: #4caf50;
  font-size: 20px;
  flex-shrink: 0;
}
</style>