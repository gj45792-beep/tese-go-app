Set-Content -Path "src/views/navigation/NavigationRoutePage.vue" -Value @'
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/app/map"></ion-back-button>
        </ion-buttons>
        <ion-title>Navegación Activa</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="toggleSimulation">
            {{ isSimulating ? 'Pausar' : 'Comenzar' }}
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    
    <ion-content class="ion-padding">
      <!-- BARRA DE PROGRESO -->
      <div class="progress-container" v-if="currentRoute">
        <div class="progress-info">
          <span>{{ currentStep }}/{{ totalSteps }}</span>
          <span>{{ Math.round(progressPercentage) }}%</span>
        </div>
        <ion-progress-bar :value="progressPercentage / 100" color="primary"></ion-progress-bar>
      </div>
      
      <!-- INSTRUCCIONES PASO A PASO -->
      <div class="navigation-instructions" v-if="currentRoute">
        <h3>Instrucciones de Navegación</h3>
        <NavigationSteps 
          :steps="pathSteps"
          :total-distance="currentRoute?.totalDistance || 0"
          :current-step-index="currentStep - 1"
          @step-selected="onStepSelected"
        />
      </div>
      
      <!-- MAPA DE RUTA -->
      <div class="route-map-container">
        <RouteMap 
          :route="currentRoute as any"
          :current-path="currentRoute?.path || []"
          :current-node="(currentStep > 0 && currentRoute?.path?.[currentStep - 1]) || undefined"
          :hide-info-overlay="true" 
         />
      </div>
      
      <!-- CONTROLES DE NAVEGACIÓN -->
      <div class="navigation-controls" v-if="currentRoute">
        <ion-button expand="block" @click="previousStep" :disabled="currentStep <= 1">
          <ion-icon slot="start" :icon="chevronBack"></ion-icon>
          Paso Anterior
        </ion-button>
        
        <ion-button expand="block" color="primary" @click="nextStep" :disabled="currentStep >= totalSteps">
          Siguiente Paso
          <ion-icon slot="end" :icon="chevronForward"></ion-icon>
        </ion-button>
        
        <ion-button expand="block" color="medium" @click="resetNavigation">
          <ion-icon slot="start" :icon="refresh"></ion-icon>
          Reiniciar
        </ion-button>
      </div>
      
      <!-- INFO DE RUTA -->
      <div class="route-info" v-if="currentRoute">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Información de la Ruta</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p><strong>Distancia total:</strong> {{ currentRoute.totalDistance }} metros</p>
            <p><strong>Tipo de movilidad:</strong> {{ mobilityType }}</p>
            <p><strong>Tiempo estimado:</strong> {{ estimatedTime }} minutos</p>
            <p><strong>Origen:</strong> {{ originName }}</p>
            <p><strong>Destino:</strong> {{ destinationName }}</p>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonBackButton, IonButtons, IonButton, IonProgressBar,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonIcon
} from '@ionic/vue';
import { chevronBack, chevronForward, refresh } from 'ionicons/icons';
import NavigationSteps from '@/components/navigation/NavigationSteps.vue';
import RouteMap from '@/components/navigation/RouteMap.vue';
import { findPathAStar, type PathStep } from '@/utils/algorithms/a-star';
import graphData from '@/data/graph-nodes.json';


// ======================
// FUNCIONES HELPER PARA VALIDACIÓN DE TIPOS
// ======================

// Validar tipos de edges
function isValidEdgeType(type: string): type is "sidewalk" | "ramp" | "stairs" | "steep" | "road" {
  return ["sidewalk", "ramp", "stairs", "steep", "road"].includes(type);
}

// Validar tipos de movilidad
function isValidMobilityType(type: string): type is "walking" | "wheelchair" | "car" {
  return ["walking", "wheelchair", "car"].includes(type);
}

// Convertir graphData a tipos seguros
function getTypedGraph() {
  const typedEdges = graphData.edges.map(edge => {
    if (!isValidEdgeType(edge.type)) {
      console.warn(`Tipo de edge inválido en edge ${edge.from}-${edge.to}: ${edge.type}, usando 'sidewalk' por defecto`);
      return { ...edge, type: "sidewalk" as const };
    }
    return { ...edge, type: edge.type };
  });
  
  return {
    nodes: graphData.nodes,
    edges: typedEdges
  };
}

// Validar y obtener tipo de movilidad seguro
function getSafeMobilityType(mobility: string): "walking" | "wheelchair" | "car" {
  if (!isValidMobilityType(mobility)) {
    console.warn(`Tipo de movilidad inválido: ${mobility}, usando 'walking' por defecto`);
    return "walking";
  }
  return mobility;
}


// Tipos e interfaces
interface NavigationRoute {
  path: string[];
  steps: PathStep[];
  totalDistance: number;
  nodes?: Array<{  // ← AÑADE ESTO
    id: string;
    name: string;
    coordinates: { lat: number; lng: number };
    type: string;
    buildingId: string | null;
  }>;
}

const route = useRoute();
const isSimulating = ref(false);
const currentStep = ref(1);
const simulationInterval = ref<NodeJS.Timeout | null>(null);

// Datos de ejemplo (luego vendrán de MapPage)
const currentRoute = ref<NavigationRoute | null>(null);
const mobilityType = ref('walking');
const originName = ref('Edificio A');
const destinationName = ref('Biblioteca');

// Convertir steps para NavigationSteps
const pathSteps = computed(() => currentRoute.value?.steps || []);

// Calcular valores computados
const totalSteps = computed(() => currentRoute.value?.steps.length || 0);
const progressPercentage = computed(() => 
  totalSteps.value > 0 ? (currentStep.value / totalSteps.value) * 100 : 0
);

const estimatedTime = computed(() => {
  if (!currentRoute.value) return 0;
  // Suponer velocidad promedio: 1.4 m/s para peatón
  const speed = mobilityType.value === 'car' ? 4.0 : 
                mobilityType.value === 'wheelchair' ? 1.0 : 1.4;
  return Math.round((currentRoute.value.totalDistance / speed) / 60);
});

// Cargar ruta inicial
onMounted(() => {
  loadRouteFromParams();
  //generateSampleRoute();
});

function loadRouteFromParams() {
  // ============ DEBUG ============
  console.log("🔍 [DEBUG] loadRouteFromParams INICIADO");
  console.log("📋 Parámetros URL completos:", JSON.stringify(route.query, null, 2));
  console.log("📍 from:", route.query.from);
  console.log("📍 to:", route.query.to);
  console.log("🚗 mobility:", route.query.mobility);
  console.log("🗺️ routeData presente?:", route.query.routeData ? "SÍ" : "NO");
  console.log("🏷️ fromName:", route.query.fromName);
  console.log("🏷️ toName:", route.query.toName);
  // ============ FIN DEBUG ============

  const from = route.query.from as string;
  const to = route.query.to as string;
  const mobility = route.query.mobility as string;
  const routeData = route.query.routeData as string;
  const fromName = route.query.fromName as string;
  const toName = route.query.toName as string;
  
  if (from && to && mobility) {
    mobilityType.value = mobility as any;
    originName.value = fromName || from;
    destinationName.value = toName || to;
    
    // Si tenemos ruta precalculada de MapPage, usarla
    if (routeData) {
      try {
        const parsedRoute = JSON.parse(routeData);
        currentRoute.value = {
          path: parsedRoute.path,
          steps: parsedRoute.steps || [],
          totalDistance: parsedRoute.totalDistance || 0
        };
        console.log("Ruta cargada desde MapPage:", currentRoute.value);
      } catch (error) {
        console.error("Error parseando routeData:", error);
        generateSampleRoute();
      }
    } else {
      // Calcular ruta usando A* si no hay datos precalculados
      calculateRealRoute(from, to);
    }
  } else {
    // Datos de ejemplo para demostración
    generateSampleRoute();
  }
}

function calculateRealRoute(from: string, to: string) {
  try {
    // Obtener grafo con tipos seguros
    const typedGraph = getTypedGraph();
    
    // Obtener tipo de movilidad seguro
    const safeMobility = getSafeMobilityType(mobilityType.value);
    
    // Usar el algoritmo A* para calcular ruta real
    const routeResult = findPathAStar(
      typedGraph,
      from,
      to,
      safeMobility
    );
    
    if (routeResult) {
      currentRoute.value = {
        path: routeResult.path,
        steps: routeResult.steps || [],
        totalDistance: routeResult.totalDistance || 0
      };
      console.log("Ruta calculada con A*:", currentRoute.value);
    } else {
      console.warn("No se pudo calcular ruta, usando datos de ejemplo");
      generateSampleRoute();
    }
  } catch (error) {
    console.error("Error calculando ruta:", error);
    generateSampleRoute();
  }
}
function generateSampleRoute() {
  // Crear steps compatibles con NavigationSteps (PathStep[])
  const sampleSteps: PathStep[] = [
    {
      nodeId: 'nodo-a',
      nodeName: originName.value,  // ← CAMBIADO: usa originName
      distanceFromPrevious: 0,
      cumulativeDistance: 0,
      instructions: `Comienza en ${originName.value}`
    },
    {
      nodeId: 'nodo-b',
      nodeName: 'Intersección Norte',
      distanceFromPrevious: 50,
      cumulativeDistance: 50,
      instructions: 'Camina 50 metros hacia el norte'
    },
    {
      nodeId: 'nodo-c',
      nodeName: 'Plaza Central',
      distanceFromPrevious: 30,
      cumulativeDistance: 80,
      instructions: 'Gira a la derecha en la intersección'
    },
    {
      nodeId: 'nodo-d',
      nodeName: 'Punto Intermedio',
      distanceFromPrevious: 20,
      cumulativeDistance: 100,
      instructions: mobilityType.value === 'wheelchair' ? 
        'Toma la ruta accesible' : 'Continúa por el camino'
    },
    {
      nodeId: 'nodo-e',
      nodeName: destinationName.value,  // ← CAMBIADO: usa destinationName
      distanceFromPrevious: 70,
      cumulativeDistance: 170,
      instructions: `Has llegado a ${destinationName.value}`
    }
  ];
  
  currentRoute.value = {
    path: sampleSteps.map(step => step.nodeId),
    steps: sampleSteps,
    totalDistance: 170,
     nodes: graphData.nodes  // ← CAMBIA ESTO: usa los nodos reales
  };
}

// Controles de navegación
function nextStep() {
  if (currentStep.value < totalSteps.value) {
    currentStep.value++;
  }
}

function previousStep() {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
}

function resetNavigation() {
  currentStep.value = 1;
  if (simulationInterval.value) {
    clearInterval(simulationInterval.value);
    simulationInterval.value = null;
  }
  isSimulating.value = false;
}

function toggleSimulation() {
  if (isSimulating.value) {
    // Pausar simulación
    if (simulationInterval.value) {
      clearInterval(simulationInterval.value);
      simulationInterval.value = null;
    }
    isSimulating.value = false;
  } else {
    // Comenzar simulación automática
    isSimulating.value = true;
    simulationInterval.value = setInterval(() => {
      if (currentStep.value < totalSteps.value) {
        currentStep.value++;
      } else {
        // Llegó al final
        if (simulationInterval.value) {
          clearInterval(simulationInterval.value);
          simulationInterval.value = null;
        }
        isSimulating.value = false;
      }
    }, 3000); // Cada 3 segundos avanza un paso
  }
}

// Evento cuando se selecciona un paso en NavigationSteps
function onStepSelected(index: number) {
  currentStep.value = index + 1; // Ajustar porque currentStep empieza en 1
}

// Datos para el mapa
const graphNodes = graphData.nodes;
const graphEdges = graphData.edges;
</script>

<style scoped>
.progress-container {
  margin-bottom: 20px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
}

.navigation-instructions {
  margin-bottom: 20px;
}

.route-map-container {
  height: 250px;
  margin-bottom: 20px;
  border-radius: 10px;
  overflow: hidden;
  background: #f5f5f5;
}

.navigation-controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.route-info {
  margin-top: 20px;
}

ion-card {
  margin: 0;
}

/* Responsive */
@media (min-width: 768px) {
  .navigation-controls {
    flex-direction: row;
  }
  
  .navigation-controls ion-button {
    flex: 1;
  }
}
</style>
'@ -Encoding UTF8