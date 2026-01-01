<template>
  <div class="route-map-container">
    <div ref="mapContainer" class="map-container"></div>
       
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick, PropType } from 'vue';
import { IonButton } from '@ionic/vue';
//import type { PropType } from 'vue';

// Importar Leaflet (se hará dinámicamente para SSR)
let L: any = null;

// Definir props
const props = defineProps({
  route: {
    type: Object as PropType<{
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
    }>,
    default: null
  },
  currentPath: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  currentNode: {
  type: String as PropType<string | undefined>,
  default: undefined  // ← CAMBIA A undefined
  }
});

// Referencias
const mapContainer = ref<HTMLElement | null>(null);
let map: any = null;
let routeLayer: any = null;
let markersLayer: any = null;

// Inicializar mapa
const initMap = async () => {
  if (typeof window === 'undefined') return; // Para SSR
  
  // Cargar Leaflet dinámicamente
  L = await import('leaflet');
  await import('leaflet/dist/leaflet.css');
  
  if (!mapContainer.value) return;
  
  // Coordenadas del campus TESE (centro del mapa)
  const campusCenter: [number, number] = [19.4420, -99.2040];
  
  // Crear mapa
  map = L.map(mapContainer.value).setView(campusCenter, 18);
  
  // Agregar capa de OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(map);
  
  // Crear capas para marcadores y rutas
  markersLayer = L.layerGroup().addTo(map);
  routeLayer = L.layerGroup().addTo(map);
  
  // Dibujar elementos iniciales
  drawMapElements();
};

// Dibujar elementos en el mapa
const drawMapElements = () => {
  if (!map || !L || !props.route || !props.route.nodes) return; // ← AÑADE !props.route.nodes
  
  // Limpiar capas anteriores
  markersLayer.clearLayers();
  routeLayer.clearLayers();
  
  // Si hay ruta, dibujarla
  if (props.route.nodes.length > 0) {  // ← Ya seguro que nodes existe
    drawRoute();
    drawNodes();
  }
};

// Dibujar nodos como marcadores
const drawNodes = () => {
  if (!props.route || !L) return;
  
  props.route.nodes.forEach(node => {
    const isCurrent = props.currentNode === node.id;
    const isInPath = props.currentPath.includes(node.id);
    
    // Color según tipo de nodo
    let markerColor = 'blue';
    if (node.type === 'building') markerColor = 'green';
    if (node.type === 'entrance') markerColor = 'red';
    if (isCurrent) markerColor = 'orange';
    if (isInPath && !isCurrent) markerColor = 'purple';
    
    // Crear ícono personalizado
    const icon = L.divIcon({
      html: `
        <div style="
          background-color: ${markerColor};
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 10px;
          font-weight: bold;
        ">
          ${isCurrent ? '📍' : '•'}
        </div>
      `,
      className: 'custom-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
    
    // Agregar marcador
    const marker = L.marker([node.coordinates.lat, node.coordinates.lng], { icon })
      .addTo(markersLayer);
    
    // Tooltip con nombre del nodo
    marker.bindTooltip(node.name, {
      direction: 'top',
      offset: [0, -10]
    });
  });
};

// Dibujar línea de ruta
const drawRoute = () => {
  if (!props.route || !L || props.route.nodes.length < 2) return;
  
  // Ordenar nodos según el path
  const orderedNodes = props.route.path
    .map(nodeId => props.route!.nodes.find(n => n.id === nodeId))
    .filter(Boolean) as Array<{ coordinates: { lat: number; lng: number } }>;
  
  if (orderedNodes.length < 2) return;
  
  // Crear array de coordenadas
  const latlngs = orderedNodes.map(node => 
    [node.coordinates.lat, node.coordinates.lng] as [number, number]
  );
  
  // Dibujar línea
  const polyline = L.polyline(latlngs, {
    color: '#3880ff',
    weight: 4,
    opacity: 0.8,
    dashArray: '10, 10'
  }).addTo(routeLayer);
  
  // Ajustar vista para mostrar toda la ruta
  if (map) {
    map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
  }
};

// Lifecycle hooks
onMounted(() => {
  nextTick(() => {
    initMap();
  });
});

onUnmounted(() => {
  if (map) {
    map.remove();
    map = null;
  }
});

// Observar cambios en la ruta
watch(() => props.route, () => {
  drawMapElements();
}, { deep: true });

// Observar cambios en el nodo actual
watch(() => props.currentNode, () => {
  drawMapElements();
});
</script>

<style scoped>
.route-map-container {
  position: relative;
  width: 100%;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.map-container {
  width: 100%;
  height: 100%;
  z-index: 1;
}

.route-info-overlay,
.no-route-overlay {
  position: absolute;
  top: 16px;
  left: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.95);
  padding: 16px;
  border-radius: 8px;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.no-route-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
}

.route-summary h3 {
  margin-top: 0;
  color: var(--ion-color-primary);
}

.controls {
  margin-top: 16px;
}

@media (min-width: 768px) {
  .route-map-container {
    height: 500px;
  }
  
  .route-info-overlay {
    max-width: 300px;
  }
}
</style>