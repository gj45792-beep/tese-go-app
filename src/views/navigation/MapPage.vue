<template>
  <ion-page>
    <!-- Header reutilizable -->
    <Header title="Navegación Inteligente" :show-logo="true" />

    <!-- Contenido principal -->
    <ion-content class="ion-padding" :fullscreen="true">
      <!-- Selector de movilidad mejorado -->
      <div class="mobility-section">
        <h3>¿Cómo te mueves?</h3>
        <MobilitySelector 
          :initial-mobility="mobilityType"
          @mobility-changed="handleMobilityChange"
        />
      </div>

      <!-- Selectores de origen y destino -->
      <div class="route-controls">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Planificar Ruta</ion-card-title>
          </ion-card-header>
          
          <ion-card-content>
            <ion-grid>
              <ion-row>
                <ion-col size="12">
                  <ion-item>
                    <ion-label position="stacked">Origen</ion-label>
                    <ion-select 
                      v-model="selectedStart" 
                      placeholder="Seleccionar origen"
                      interface="popover"
                    >
                      <ion-select-option 
                        v-for="option in startOptions" 
                        :key="option.value" 
                        :value="option.value"
                      >
                        {{ option.label }}
                      </ion-select-option>
                    </ion-select>
                  </ion-item>
                </ion-col>
                
                <ion-col size="12">
                  <ion-item>
                    <ion-label position="stacked">Destino</ion-label>
                    <ion-select 
                      v-model="selectedEnd" 
                      placeholder="Seleccionar destino"
                      interface="popover"
                    >
                      <ion-select-option 
                        v-for="option in endOptions" 
                        :key="option.value" 
                        :value="option.value"
                      >
                        {{ option.label }}
                      </ion-select-option>
                    </ion-select>
                  </ion-item>
                </ion-col>
              </ion-row>
              
              <ion-row>
                <ion-col size="12">
                  <ion-button 
                    @click="calculateRoute" 
                    expand="block" 
                    :disabled="isLoading || !selectedStart || !selectedEnd"
                  >
                    <ion-icon :icon="navigateOutline" slot="start" />
                    {{ isLoading ? 'Calculando...' : 'Calcular Ruta' }}
                  </ion-button>
                  
                  <ion-button 
                    v-if="calculatedRoute" 
                    @click="clearRoute" 
                    expand="block" 
                    fill="outline" 
                    color="medium"
                    class="ion-margin-top"
                  >
                    Limpiar Ruta
                  </ion-button>
                </ion-col>
              </ion-row>
            </ion-grid>
          </ion-card-content>
        </ion-card>
      </div>

      <!-- Mapa con ruta -->
      <div class="map-section">
        <h3>Ruta en el Mapa</h3>
        <RouteMap 
          :route="calculatedRoute as any"
          @start-navigation="startNavigation"
        />
        <!-- Overlay de información de ruta -->
        <div v-if="calculatedRoute" class="map-overlay">
         <div class="overlay-content">
           <h3>Ruta Encontrada</h3>
            <p>Distancia total: {{ calculatedRoute.totalDistance.toFixed(0) }} metros</p>
            <p>Pasos: {{ calculatedRoute.steps.length }}</p>
    
          <ion-button 
           @click="startNavigation" 
           expand="block" 
           color="primary"
           class="ion-margin-top"
          >
         <ion-icon :icon="arrowForwardOutline" slot="start" />
          Iniciar Navegación
          </ion-button>
  </div>
</div>
        <div v-if="!calculatedRoute" class="no-route-message">
          <p>Seleccione origen y destino para ver la ruta en el mapa</p>
          <p class="hint">Ruta por defecto: Entrada Principal → Biblioteca Central</p>
        </div>
      </div>

      <!-- Instrucciones de navegación -->
      <div v-if="calculatedRoute && showRouteDetails" class="navigation-section">
        <h3>Instrucciones Paso a Paso</h3>
        <NavigationSteps 
          :steps="calculatedRoute.steps"
          :total-distance="calculatedRoute.totalDistance"
          @step-selected="(index) => console.log('Paso seleccionado:', index)"
        />
        
        <div class="route-summary">
          <ion-card>
            <ion-card-content>
              <ion-grid>
                <ion-row>
                  <ion-col size="6">
                    <div class="summary-item">
                      <strong>Distancia total:</strong>
                      <p>{{ calculatedRoute.totalDistance.toFixed(0) }} metros</p>
                    </div>
                  </ion-col>
                  <ion-col size="6">
                    <div class="summary-item">
                      <strong>Pasos:</strong>
                      <p>{{ calculatedRoute.steps.length }}</p>
                    </div>
                  </ion-col>
                </ion-row>
                
                <ion-row>
                  <ion-col size="12">
                    <ion-button 
                      @click="startNavigation" 
                      expand="block" 
                      color="primary"
                      class="ion-margin-top"
                    >
                      <ion-icon :icon="arrowForwardOutline" slot="start" />
                      Iniciar Navegación
                    </ion-button>
                  </ion-col>
                </ion-row>
              </ion-grid>
            </ion-card-content>
          </ion-card>
        </div>
      </div>

      <!-- Información de edificios -->
       <!-- Comentar temporalmente:
      <div class="buildings-section">
        <h3>Edificios del Campus</h3>
        <div class="buildings-grid">
          <BuildingCard 
            v-for="buildingItem in campusBuildings.slice(0, 4)"
            :key="buildingItem.id"
            :building="{
                id: buildingItem.id,
                name: buildingItem.name,
                code: buildingItem.code,
                description: buildingItem.description,
                services: buildingItem.facilities  // ← CAMBIAR facilities por services
             }"
               @select="(id) => selectedEnd = getNodeIdFromBuilding(id)"
          />
        </div>
      </div>
       -->
      <!-- Footer -->
      <Footer />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { 
  IonPage, 
  IonContent, 
  IonSegment, 
  IonSegmentButton, 
  IonLabel,
  IonIcon,
  IonButton,
  IonChip,
  IonFab,
  IonFabButton,
  IonFabList,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonSelect,
  IonSelectOption,
  IonItem,
  IonList,
  IonNote
} from '@ionic/vue';
import { 
  walkOutline,
  carOutline,
  accessibilityOutline,
  navigateOutline,
  locateOutline,
  earthOutline,
  schoolOutline,
  libraryOutline,
  restaurantOutline,
  medkitOutline,
  businessOutline,
  searchOutline,
  arrowForwardOutline,
  chevronDownOutline
} from 'ionicons/icons';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

// Importar componentes creados ayer
import Header from '@/components/common/Header.vue';
import Footer from '@/components/common/Footer.vue';
import BuildingCard from '@/components/campus/BuildingCard.vue';
import RouteMap from '@/components/navigation/RouteMap.vue';
import NavigationSteps from '@/components/navigation/NavigationSteps.vue';
import MobilitySelector from '@/components/campus/MobilitySelector.vue';

// Importar algoritmo A* y tipos
import { 
  findPathAStar, 
  findNearestNode,
  type Graph,
  type PathResult,
  type Node 
} from '@/utils/algorithms/a-star';

const campusBuildingsData = {
  buildings: [
    {
      "id": "rectoria",
      "name": "Gobierno TESE",
      "code": "GOB",
      "description": "Edificio de gobierno y administración del TESE.",
      "coordinates": { "lat": 19.510549, "lng": -99.041236 },
      "floors": 4,
      "accessibility": {
        "wheelchair": true,
        "elevator": true,
        "ramps": true,
        "accessibleBathrooms": true
      },
      "facilities": ["Oficinas administrativas", "Sala de juntas", "Recepción"],
      "departments": ["Rectoría", "Administración", "Dirección Académica"],
      "image": null
    },
    {
      "id": "biblioteca-central",
      "name": "Biblioteca TESE",
      "code": "BIB",
      "description": "Biblioteca con más de 50,000 volúmenes, sala de cómputo y áreas de estudio.",
      "coordinates": { "lat": 19.510908, "lng": -99.041829 },
      "floors": 3,
      "accessibility": {
        "wheelchair": true,
        "elevator": true,
        "ramps": true,
        "accessibleBathrooms": true
      },
      "facilities": ["Sala de lectura", "Computadoras", "Préstamo a domicilio", "Sala silenciosa"],
      "departments": ["Biblioteca", "Centro de cómputo"],
      "image": null
    },
    {
      "id": "laboratorios-ingenieria",
      "name": "División de Ingeniería Electrónica",
      "code": "DIE",
      "description": "Laboratorios especializados para prácticas de ingeniería electrónica.",
      "coordinates": { "lat": 19.511355, "lng": -99.040007 },
      "floors": 2,
      "accessibility": {
        "wheelchair": true,
        "elevator": false,
        "ramps": true,
        "accessibleBathrooms": false
      },
      "facilities": ["Laboratorio de cómputo", "Taller electrónico", "Sala de prototipos", "Laboratorio de circuitos"],
      "departments": ["Ingeniería Electrónica"],
      "image": null
    },
    {
      "id": "auditorio-principal",
      "name": "Auditorio de Usos Múltiples TESE",
      "code": "AUD",
      "description": "Auditorio con capacidad para 500 personas, equipado para conferencias y ceremonias.",
      "coordinates": { "lat": 19.512159, "lng": -99.041705 },
      "floors": 1,
      "accessibility": {
        "wheelchair": true,
        "elevator": false,
        "ramps": true,
        "accessibleBathrooms": true
      },
      "facilities": ["Proyectores HD", "Sistema de sonido", "Camerinos"],
      "departments": ["Eventos Especiales", "Extensión Universitaria"],
      "image": null
    },
    {
      "id": "cafeteria",
      "name": "Cafetería TESE",
      "code": "CAF",
      "description": "Área de alimentos y bebidas para estudiantes y personal.",
      "coordinates": { "lat": 19.510549, "lng": -99.039106 },
      "floors": 1,
      "accessibility": {
        "wheelchair": true,
        "elevator": false,
        "ramps": true,
        "accessibleBathrooms": true
      },
      "facilities": ["Comedor", "Cafetería", "Área de descanso", "Microondas"],
      "departments": ["Servicios Estudiantiles"],
      "image": null
    },
    {
      "id": "edificio-aulas-a",
      "name": "División Contaduría",
      "code": "DCO",
      "description": "Edificio con aulas para la división de contaduría y administración.",
      "coordinates": { "lat": 19.511274, "lng": -99.042411 },
      "floors": 3,
      "accessibility": {
        "wheelchair": true,
        "elevator": true,
        "ramps": true,
        "accessibleBathrooms": true
      },
      "facilities": ["Aulas equipadas", "Pizarrones inteligentes", "Proyectores", "Sala de profesores"],
      "departments": ["Contaduría", "Administración"],
      "image": null
    },
    // EDIFICIOS ADICIONALES
    {
      "id": "informatica",
      "name": "División en Ingeniería en Informática",
      "code": "DII",
      "description": "División especializada en ingeniería en informática y tecnologías de la información.",
      "coordinates": { "lat": 19.512827, "lng": -99.042910 },
      "floors": 3,
      "accessibility": {
        "wheelchair": true,
        "elevator": true,
        "ramps": true,
        "accessibleBathrooms": true
      },
      "facilities": ["Laboratorios de cómputo", "Aulas especializadas", "Sala de servidores"],
      "departments": ["Ingeniería en Informática"],
      "image": null
    },
    {
      "id": "sistemas",
      "name": "División Ingeniería en Sistemas Computacionales",
      "code": "DSC",
      "description": "División dedicada a la ingeniería en sistemas computacionales y desarrollo de software.",
      "coordinates": { "lat": 19.512751, "lng": -99.042271 },
      "floors": 3,
      "accessibility": {
        "wheelchair": true,
        "elevator": true,
        "ramps": true,
        "accessibleBathrooms": true
      },
      "facilities": ["Laboratorios de redes", "Aulas de programación", "Sala de proyectos"],
      "departments": ["Ingeniería en Sistemas Computacionales"],
      "image": null
    },
    {
      "id": "industrial",
      "name": "División de Ingeniería Industrial y Mecánica",
      "code": "DIM",
      "description": "División para ingeniería industrial, mecánica y de procesos.",
      "coordinates": { "lat": 19.512200, "lng": -99.042274 },
      "floors": 2,
      "accessibility": {
        "wheelchair": true,
        "elevator": false,
        "ramps": true,
        "accessibleBathrooms": true
      },
      "facilities": ["Taller mecánico", "Laboratorio de procesos", "Sala de diseño"],
      "departments": ["Ingeniería Industrial", "Ingeniería Mecánica"],
      "image": null
    },
    {
      "id": "quimica",
      "name": "División de Ingeniería Química y Bioquímica",
      "code": "DQB",
      "description": "División especializada en ingeniería química y bioquímica.",
      "coordinates": { "lat": 19.509979, "lng": -99.039685 },
      "floors": 3,
      "accessibility": {
        "wheelchair": true,
        "elevator": true,
        "ramps": true,
        "accessibleBathrooms": true
      },
      "facilities": ["Laboratorios químicos", "Sala de bioseguridad", "Planta piloto"],
      "departments": ["Ingeniería Química", "Ingeniería Bioquímica"],
      "image": null
    }
  ]
};
const graphData = {
  nodes: [
  // ENTRADAS
  {
    "id": "entrada-principal",
    "name": "Entrada Principal TESE",
    "coordinates": { "lat": 19.510320, "lng": -99.042213 },
    "type": "entrance",
    "buildingId": null
  },
  {
    "id": "entrada-vehicular",
    "name": "Entrada Vehicular",
    "coordinates": { "lat": 19.511500, "lng": -99.040800 },
    "type": "entrance",
    "buildingId": null
  },
  // EDIFICIOS PRINCIPALES
  {
    "id": "nodo-biblioteca",
    "name": "Biblioteca TESE",
    "coordinates": { "lat": 19.510908, "lng": -99.041829 },
    "type": "building",
    "buildingId": "biblioteca-central"
  },
  {
    "id": "nodo-rectoria",
    "name": "Gobierno TESE",
    "coordinates": { "lat": 19.510549, "lng": -99.041236 },
    "type": "building",
    "buildingId": "rectoria"
  },
  {
    "id": "nodo-auditorio",
    "name": "Auditorio de Usos Múltiples",
    "coordinates": { "lat": 19.512159, "lng": -99.041705 },
    "type": "building",
    "buildingId": "auditorio-principal"
  },
  {
    "id": "nodo-cafeteria",
    "name": "Cafetería TESE",
    "coordinates": { "lat": 19.510549, "lng": -99.039106 },
    "type": "building",
    "buildingId": "cafeteria"
  },
  {
    "id": "nodo-laboratorios",
    "name": "División de Ingeniería Electrónica",
    "coordinates": { "lat": 19.511355, "lng": -99.040007 },
    "type": "building",
    "buildingId": "laboratorios-ingenieria"
  },
  {
    "id": "nodo-aulas-a",
    "name": "División Contaduría",
    "coordinates": { "lat": 19.511274, "lng": -99.042411 },
    "type": "building",
    "buildingId": "edificio-aulas-a"
  },
  {
    "id": "nodo-informatica",
    "name": "División en Ingeniería en Informática",
    "coordinates": { "lat": 19.512827, "lng": -99.042910 },
    "type": "building",
    "buildingId": "informatica"
  },
  {
    "id": "nodo-aeronautica",
    "name": "Edificio W Ingeniería Aeronáutica",
    "coordinates": { "lat": 19.512718, "lng": -99.043492 },
    "type": "building",
    "buildingId": "aeronautica"
  },
  {
    "id": "nodo-sistemas",
    "name": "División Ingeniería en Sistemas Computacionales",
    "coordinates": { "lat": 19.512751, "lng": -99.042271 },
    "type": "building",
    "buildingId": "sistemas"
  },
  {
    "id": "nodo-industrial",
    "name": "División de Ingeniería Industrial y Mecánica",
    "coordinates": { "lat": 19.512200, "lng": -99.042274 },
    "type": "building",
    "buildingId": "industrial"
  },
  {
    "id": "nodo-quimica",
    "name": "División de Ingeniería Química y Bioquímica",
    "coordinates": { "lat": 19.509979, "lng": -99.039685 },
    "type": "building",
    "buildingId": "quimica"
  },
  // PUNTOS DE INTERÉS
  {
    "id": "nodo-interseccion-1",
    "name": "Intersección Central",
    "coordinates": { "lat": 19.511500, "lng": -99.042000 },
    "type": "intersection",
    "buildingId": null
  },
  {
    "id": "nodo-estacionamiento",
    "name": "Estacionamiento Principal",
    "coordinates": { "lat": 19.511992, "lng": -99.040528 },
    "type": "parking",
    "buildingId": null
  }
],
  edges: [
  // CONEXIONES DESDE ENTRADA PRINCIPAL
  {
    "from": "entrada-principal",
    "to": "nodo-rectoria",           // Gobierno TESE
    "distance": 80,
    "type": "sidewalk" as const,
    "baseWeight": 1.0
  },
  {
    "from": "entrada-principal",
    "to": "nodo-interseccion-1",     // Intersección Central
    "distance": 120,
    "type": "sidewalk" as const,
    "baseWeight": 1.0
  },
  // CONEXIONES INTersección Central
  {
    "from": "nodo-interseccion-1",
    "to": "nodo-biblioteca",         // Biblioteca
    "distance": 150,
    "type": "stairs" as const,
    "baseWeight": 1.5
  },
  {
    "from": "nodo-interseccion-1",
    "to": "nodo-auditorio",          // Auditorio
    "distance": 100,
    "type": "ramp" as const,
    "baseWeight": 1.0
  },
  {
    "from": "nodo-interseccion-1",
    "to": "nodo-aulas-a",            // Contaduría
    "distance": 90,
    "type": "sidewalk" as const,
    "baseWeight": 1.0
  },
  {
    "from": "nodo-interseccion-1",
    "to": "nodo-cafeteria",          // Cafetería
    "distance": 250,
    "type": "sidewalk" as const,
    "baseWeight": 1.0
  },
  {
    "from": "nodo-interseccion-1",
    "to": "nodo-laboratorios",       // Electrónica
    "distance": 180,
    "type": "steep" as const,
    "baseWeight": 2.0
  },
  // CONEXIONES ZONA ACADÉMICA (norte)
  {
    "from": "nodo-auditorio",
    "to": "nodo-informatica",        // Informática
    "distance": 120,
    "type": "sidewalk" as const,
    "baseWeight": 1.0
  },
  {
    "from": "nodo-informatica",
    "to": "nodo-aeronautica",        // Aeronáutica
    "distance": 70,
    "type": "sidewalk" as const,
    "baseWeight": 1.0
  },
  {
    "from": "nodo-informatica",
    "to": "nodo-sistemas",           // Sistemas
    "distance": 80,
    "type": "sidewalk" as const,
    "baseWeight": 1.0
  },
  {
    "from": "nodo-sistemas",
    "to": "nodo-industrial",         // Industrial
    "distance": 60,
    "type": "sidewalk" as const,
    "baseWeight": 1.0
  },
  // RUTAS PARA SILLA DE RUEDAS (alternativas sin escaleras)
  {
    "from": "nodo-interseccion-1",
    "to": "nodo-biblioteca",
    "distance": 200,                 // Ruta más larga pero accesible
    "type": "ramp" as const,
    "baseWeight": 1.0
  },
  // RUTAS PARA AUTOS
  {
    "from": "entrada-vehicular",
    "to": "nodo-estacionamiento",
    "distance": 50,
    "type": "road" as const,
    "baseWeight": 1.0
  },
  {
    "from": "nodo-estacionamiento",
    "to": "nodo-biblioteca",
    "distance": 180,
    "type": "road" as const,
    "baseWeight": 1.0
  },
  {
    "from": "nodo-estacionamiento",
    "to": "nodo-cafeteria",
    "distance": 220,
    "type": "road" as const,
    "baseWeight": 1.0
  },
  // CONEXIONES SUR
  {
    "from": "nodo-cafeteria",
    "to": "nodo-quimica",            // Química
    "distance": 100,
    "type": "sidewalk" as const,
    "baseWeight": 1.0
  },
  // CONEXIONES CRUZADAS
  {
    "from": "nodo-rectoria",
    "to": "nodo-biblioteca",
    "distance": 120,
    "type": "sidewalk" as const,
    "baseWeight": 1.0
  },
  {
    "from": "nodo-aulas-a",
    "to": "nodo-auditorio",
    "distance": 110,
    "type": "ramp" as const,
    "baseWeight": 1.0
  }
]
};
const router = useRouter();

// ======================
// ESTADO REACTIVO
// ======================
const mobilityType = ref<'walking' | 'wheelchair' | 'car'>('walking');
const selectedStart = ref<string>('entrada-principal');
const selectedEnd = ref<string>('nodo-biblioteca');
const calculatedRoute = ref<PathResult | null>(null);
const isLoading = ref(false);
const showRouteDetails = ref(false);

// ======================
// CARGAR DATOS
// ======================
const campusBuildings = ref(campusBuildingsData.buildings);
const navigationGraph = ref<Graph>({
  nodes: graphData.nodes,
  edges: graphData.edges
});

// ======================
// LISTAS PARA SELECTORES
// ======================
const startOptions = computed(() => {
  return navigationGraph.value.nodes
    .filter(node => node.type === 'entrance' || node.type === 'building')
    .map(node => ({
      value: node.id,
      label: node.name,
      buildingId: node.buildingId
    }));
});

const endOptions = computed(() => {
  return navigationGraph.value.nodes
    .filter(node => node.type === 'building')
    .map(node => ({
      value: node.id,
      label: node.name,
      buildingId: node.buildingId
    }));
});

// ======================
// MÉTODOS
// ======================
const calculateRoute = async () => {
  console.log('=== CALCULANDO RUTA ===');
  console.log('Start:', selectedStart.value);
  console.log('End:', selectedEnd.value);
  console.log('Mobility:', mobilityType.value);
  console.log('Graph nodes:', navigationGraph.value.nodes.length);
  console.log('Graph edges:', navigationGraph.value.edges.length);
  if (!selectedStart.value || !selectedEnd.value) {
    console.error('Seleccione origen y destino');
    return;
  }

  if (selectedStart.value === selectedEnd.value) {
    console.error('Origen y destino no pueden ser iguales');
    return;
  }

  isLoading.value = true;
  
  try {
    // Usar algoritmo A* para encontrar ruta óptima
    const route = findPathAStar(
      
      navigationGraph.value,
      selectedStart.value,
      selectedEnd.value,
      mobilityType.value
    );

    if (route) {
      calculatedRoute.value = route;
      showRouteDetails.value = true;
      console.log('Ruta calculada:', route);
    } else {
      console.error('No se encontró ruta entre los puntos seleccionados');
      calculatedRoute.value = null;
    }
  } catch (error) {
    console.error('Error calculando ruta:', error);
    calculatedRoute.value = null;
  } finally {
    isLoading.value = false;
  }
};

const startNavigation = () => {
  if (calculatedRoute.value) {
       // ============ DEBUG ============
    console.log("🔍 [DEBUG MapPage] startNavigation");
    console.log("📍 selectedStart:", selectedStart.value);
    console.log("📍 selectedEnd:", selectedEnd.value);
    console.log("🚗 mobilityType:", mobilityType.value);
    console.log("🗺️ Ruta calculada:", calculatedRoute.value);
    // ============ FIN DEBUG ============
    // Encontrar nombres de los nodos para mostrar en la navegación
    const fromNode = navigationGraph.value.nodes.find(n => n.id === selectedStart.value);
    const toNode = navigationGraph.value.nodes.find(n => n.id === selectedEnd.value);
    
    // Pasar la ruta completa como parámetro
    router.push({
      path: "/app/navigation/route",
      query: {
        from: selectedStart.value,
        to: selectedEnd.value,
        mobility: mobilityType.value,
        routeData: JSON.stringify(calculatedRoute.value),
        fromName: fromNode?.name || selectedStart.value,
        toName: toNode?.name || selectedEnd.value
      }
    });
  }
};

const handleMobilityChange = (newMobility: 'walking' | 'wheelchair' | 'car') => {
  mobilityType.value = newMobility;
  
  // Recalcular ruta si ya existe una
  if (calculatedRoute.value) {
    calculateRoute();
  }
};

const getBuildingInfo = (buildingId: string | null) => {
  if (!buildingId) return null;
  return campusBuildings.value.find(b => b.id === buildingId);
};

const clearRoute = () => {
  calculatedRoute.value = null;
  showRouteDetails.value = false;
};

// ======================
// FUNCIONES AUXILIARES
// ======================
const getNodeIdFromBuilding = (buildingId: string): string => {
  // Buscar nodo correspondiente al edificio
  const node = navigationGraph.value.nodes.find(n => n.buildingId === buildingId);
  return node ? node.id : 'nodo-biblioteca'; // fallback a biblioteca
};

// ======================
// CICLO DE VIDA
// ======================
onMounted(() => {
  console.log('Datos del campus cargados:', campusBuildings.value.length, 'edificios');
  console.log('Grafo de navegación:', navigationGraph.value.nodes.length, 'nodos');
  
  // Calcular ruta por defecto al cargar
  setTimeout(() => {
    calculateRoute();
  }, 500);
});
</script>

<style scoped>
.mobility-selector {
  background: white;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.map-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.map-placeholder {
  position: relative;
  height: 400px;
  overflow: hidden;
}

.campus-map {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.8;
}

.map-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  z-index: 10;
}

.map-overlay h3 {
  margin: 0 0 10px 0;
  color: var(--ion-color-primary);
}

.map-overlay p {
  margin: 0 0 8px 0;
  color: var(--ion-color-medium);
}

.points-of-interest {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.poi-item {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: pointer;
  text-align: center;
}

.poi-marker {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 4px;
  color: white;
  font-size: 16px;
}

.poi-marker.academic { background: var(--ion-color-primary); }
.poi-marker.library { background: var(--ion-color-secondary); }
.poi-marker.sports { background: var(--ion-color-success); }
.poi-marker.food { background: var(--ion-color-warning); }
.poi-marker.medical { background: var(--ion-color-danger); }
.poi-marker.event { background: var(--ion-color-tese-gold); }

.poi-label {
  font-size: 0.8rem;
  font-weight: 600;
  background: white;
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.building-info {
  padding: 16px;
  background: var(--ion-color-light);
  border-top: 1px solid var(--ion-color-medium-shade);
}

.quick-actions {
  display: flex;
  gap: 12px;
  justify-content: space-between;
  margin-bottom: 20px;
}

.quick-actions ion-button {
  flex: 1;
}
.map-overlay {
  position: relative; /* Cambia de absolute a relative */
  top: 16px;
  left: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.95);
  padding: 16px;
  border-radius: 8px;
  z-index: 10; /* Reduce z-index */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 16px 0; /* Espaciado vertical */
}

.overlay-content h3 {
  margin-top: 0;
  color: var(--ion-color-primary);
}

.overlay-content p {
  margin: 8px 0;
  color: var(--ion-color-medium);
}

.map-section {
  position: relative;
  margin-bottom: 20px;
}
</style>