<template>
  <div class="route-map-container">
    <div ref="mapContainer" class="map-container"></div>
    
    <div v-if="route" class="route-info">
      <div class="route-summary">
        <h3>Ruta Encontrada</h3>
        <p>Distancia total: {{ (route.totalDistance).toFixed(0) }} metros</p>
        <p>Pasos: {{ route.steps.length }}</p>
      </div>
      
      <div class="controls">
        <ion-button @click="startNavigation" expand="block" color="primary">
          Iniciar Navegación
        </ion-button>
      </div>
    </div>
    
    <div v-else class="no-route">
      <p>Seleccione origen y destino para calcular ruta</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { IonButton } from '@ionic/vue';

// Definir props
const props = defineProps<{
  route?: {
    path: string[];
    totalDistance: number;
    steps: Array<{
      nodeId: string;
      nodeName: string;
      distanceFromPrevious: number;
      cumulativeDistance: number;
      instructions: string;
    }>;
    nodes: Array<{
      id: string;
      name: string;
      coordinates: { lat: number; lng: number };
      type: string;
      buildingId: string | null;
    }>;
  } | null;
}>();

const emit = defineEmits<{
  'start-navigation': [];
}>();

const mapContainer = ref<HTMLElement | null>(null);
let map: any = null;

// Inicializar mapa
onMounted(() => {
  // Esta función se implementará cuando agreguemos OpenStreetMap
  // Por ahora es un placeholder
  console.log('Map container ready:', mapContainer.value);
});

// Limpiar al desmontar
onUnmounted(() => {
  if (map) {
    // Limpiar recursos del mapa
  }
});

// Observar cambios en la ruta
watch(() => props.route, (newRoute) => {
  if (newRoute && map) {
    drawRoute(newRoute);
  }
}, { deep: true });

// Función para dibujar ruta en el mapa
function drawRoute(route: NonNullable<typeof props.route>) {
  console.log('Dibujando ruta:', route);
  // Implementar con OpenStreetMap/Leaflet más adelante
}

// Función para iniciar navegación
function startNavigation() {
  if (props.route) {
    emit('start-navigation');
  }
}
</script>

<style scoped>
.route-map-container {
  position: relative;
  height: 400px;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
}

.map-container {
  height: 100%;
  width: 100%;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-weight: 500;
}

.route-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  padding: 16px;
  border-top: 1px solid #eee;
  backdrop-filter: blur(10px);
}

.route-summary h3 {
  margin: 0 0 8px 0;
  color: #2c3e50;
}

.route-summary p {
  margin: 4px 0;
  color: #666;
  font-size: 14px;
}

.controls {
  margin-top: 12px;
}

.no-route {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.no-route p {
  margin: 0;
  color: #666;
}
</style>