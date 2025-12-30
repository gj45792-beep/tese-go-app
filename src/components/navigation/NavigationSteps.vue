<template>
  <div class="navigation-steps">
    <div v-if="steps.length === 0" class="no-steps">
      <p>No hay pasos de navegación disponibles</p>
      <p>Seleccione origen y destino para calcular la ruta</p>
    </div>

    <div v-else class="steps-container">
      <div class="steps-header">
        <h3>Instrucciones de Navegación</h3>
        <div class="steps-summary">
          <span>{{ steps.length }} pasos</span>
          <span>{{ totalDistance.toFixed(0) }} metros</span>
        </div>
      </div>

      <div class="steps-list">
        <div 
          v-for="(step, index) in steps" 
          :key="step.nodeId"
          :class="['step-item', { 'current-step': index === currentStepIndex }]"
          @click="selectStep(index)"
        >
          <div class="step-indicator">
            <div class="step-number">{{ index + 1 }}</div>
            <div v-if="index < steps.length - 1" class="step-connector"></div>
          </div>

          <div class="step-content">
            <div class="step-main">
              <h4 class="step-title">{{ step.nodeName }}</h4>
              <p class="step-instructions">{{ step.instructions }}</p>
              
              <div v-if="index > 0" class="step-distance">
                <span class="distance-icon">↝</span>
                {{ step.distanceFromPrevious.toFixed(0) }} metros
              </div>
            </div>

            <div class="step-meta">
              <div v-if="index === 0" class="step-badge start">INICIO</div>
              <div v-else-if="index === steps.length - 1" class="step-badge end">DESTINO</div>
              <div v-else class="step-badge">Paso {{ index + 1 }}</div>
              
              <div class="step-cumulative">
                {{ step.cumulativeDistance.toFixed(0) }} m total
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="steps.length > 0" class="steps-controls">
        <ion-button 
          @click="previousStep" 
          :disabled="currentStepIndex <= 0"
          fill="clear"
          size="small"
        >
          <ion-icon :icon="chevronBack" slot="start"></ion-icon>
          Anterior
        </ion-button>
        
        <div class="step-progress">
          <span>Paso {{ currentStepIndex + 1 }} de {{ steps.length }}</span>
        </div>
        
        <ion-button 
          @click="nextStep" 
          :disabled="currentStepIndex >= steps.length - 1"
          fill="clear"
          size="small"
        >
          Siguiente
          <ion-icon :icon="chevronForward" slot="end"></ion-icon>
        </ion-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { IonButton, IonIcon } from '@ionic/vue';
import { chevronBack, chevronForward } from 'ionicons/icons';

// Definir props
interface Step {
  nodeId: string;
  nodeName: string;
  distanceFromPrevious: number;
  cumulativeDistance: number;
  instructions: string;
}

const props = defineProps<{
  steps: Step[];
  totalDistance: number;
}>();

// Emitir eventos
const emit = defineEmits<{
  'step-selected': [index: number];
  'step-changed': [index: number];
}>();

// Estado interno
const currentStepIndex = ref(0);

// Observar cambios en los steps
watch(() => props.steps, (newSteps) => {
  if (newSteps.length > 0) {
    currentStepIndex.value = 0;
  }
}, { immediate: true });

// Métodos
function selectStep(index: number) {
  currentStepIndex.value = index;
  emit('step-selected', index);
}

function nextStep() {
  if (currentStepIndex.value < props.steps.length - 1) {
    currentStepIndex.value++;
    emit('step-changed', currentStepIndex.value);
  }
}

function previousStep() {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--;
    emit('step-changed', currentStepIndex.value);
  }
}

// Exponer métodos
defineExpose({
  nextStep,
  previousStep,
  goToStep: selectStep
});
</script>

<style scoped>
.navigation-steps {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.no-steps {
  padding: 40px 20px;
  text-align: center;
  color: #666;
}

.no-steps p {
  margin: 8px 0;
}

.no-steps p:first-child {
  font-weight: 500;
  color: #333;
}

.steps-header {
  padding: 16px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.steps-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.steps-summary {
  display: flex;
  gap: 16px;
  font-size: 14px;
  opacity: 0.9;
}

.steps-list {
  padding: 16px;
  max-height: 400px;
  overflow-y: auto;
}

.step-item {
  display: flex;
  gap: 16px;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.step-item:hover {
  background-color: #f8f9fa;
}

.step-item.current-step {
  background-color: #e8f4ff;
  border-color: #2196f3;
}

.step-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.step-number {
  width: 32px;
  height: 32px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.step-item.current-step .step-number {
  background: #2196f3;
  transform: scale(1.1);
}

.step-connector {
  width: 2px;
  flex: 1;
  background: #e0e0e0;
  margin-top: 8px;
}

.step-item:last-child .step-connector {
  display: none;
}

.step-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.step-main {
  flex: 1;
}

.step-title {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.step-instructions {
  margin: 0 0 8px 0;
  color: #666;
  font-size: 14px;
  line-height: 1.4;
}

.step-distance {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #888;
  font-weight: 500;
}

.distance-icon {
  font-size: 16px;
  opacity: 0.7;
}

.step-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
}

.step-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: #f0f0f0;
  color: #666;
}

.step-badge.start {
  background: #4caf50;
  color: white;
}

.step-badge.end {
  background: #ff9800;
  color: white;
}

.step-cumulative {
  font-size: 12px;
  color: #888;
}

.steps-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-top: 1px solid #eee;
  background: #fafafa;
}

.step-progress {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}
</style>