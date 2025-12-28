<template>
  <ion-page>
    <!-- Header reutilizable -->
    <Header title="Mapa del Campus" :show-logo="true" />

    <!-- Contenido principal -->
    <ion-content class="ion-padding" :fullscreen="true">
      <!-- Selector de tipo de movilidad -->
      <div class="mobility-selector">
        <ion-segment v-model="mobilityType" @ionChange="changeMobilityType">
          <ion-segment-button value="walking">
            <ion-icon :icon="walkOutline" />
            <ion-label>A pie</ion-label>
          </ion-segment-button>
          <ion-segment-button value="vehicle">
            <ion-icon :icon="carOutline" />
            <ion-label>En auto</ion-label>
          </ion-segment-button>
          <ion-segment-button value="accessible">
            <ion-icon :icon="accessibilityOutline" />
            <ion-label>Accesible</ion-label>
          </ion-segment-button>
        </ion-segment>
      </div>

      <!-- Contenedor del mapa -->
      <div class="map-container">
        <!-- Mapa placeholder -->
        <div class="map-placeholder">
          <div class="map-overlay">
            <h3>Mapa Interactivo TESE</h3>
            <p>📍 Ubicación actual: {{ currentLocation }}</p>
            <p>🏛️ Edificio más cercano: {{ nearestBuilding }}</p>
            
            <!-- Puntos de interés simulados -->
            <div class="points-of-interest">
              <div 
                v-for="poi in pointsOfInterest" 
                :key="poi.id"
                class="poi-item"
                :style="{ top: poi.top + '%', left: poi.left + '%' }"
                @click="selectPOI(poi)"
              >
                <div class="poi-marker" :class="poi.type">
                  <ion-icon :icon="getPoiIcon(poi.type)" />
                </div>
                <div class="poi-label">{{ poi.name }}</div>
              </div>
            </div>
          </div>
          
          <img 
            src="@/assets/images/campus-map.jpg" 
            alt="Mapa del Campus TESE"
            class="campus-map"
          />
        </div>

        <!-- Información del edificio seleccionado CON BUILDINGCARD REUTILIZABLE -->
        <div v-if="selectedPOI" class="building-info">
          <BuildingCard 
            :building="{
              id: selectedPOI.id,
              name: selectedPOI.name,
              description: selectedPOI.description,
              category: selectedPOI.type,
              services: selectedPOI.services,
              distance: 150, // Ejemplo: 150 metros
              status: 'open',
              schedule: '7:00 AM - 10:00 PM'
            }"
            :show-details-button="true"
            @click="selectPOI(selectedPOI)"
            @navigate="navigateTo(selectedPOI)"
            @details="goToBuildingDetail(selectedPOI.id)"
          />
        </div>
      </div>

      <!-- Botones de acción rápida -->
      <div class="quick-actions">
        <ion-button @click="findNearestRestroom" fill="outline">
          <ion-icon :icon="waterOutline" slot="start" />
          Baño más cercano
        </ion-button>
        
        <ion-button @click="findParking" fill="outline">
          <ion-icon :icon="carOutline" slot="start" />
          Estacionamiento
        </ion-button>
        
        <ion-button @click="showRoutePlanner" fill="outline">
          <ion-icon :icon="mapOutline" slot="start" />
          Planificar ruta
        </ion-button>
      </div>

      <!-- Botón flotante para mi ubicación -->
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="centerOnUser" color="primary">
          <ion-icon :icon="locateOutline" />
        </ion-fab-button>
        <ion-fab-list side="top">
          <ion-fab-button @click="toggleSatellite" color="light">
            <ion-icon :icon="earthOutline" />
          </ion-fab-button>
        </ion-fab-list>
      </ion-fab>
    </ion-content>

    <Footer variant="nav" activeTab="map" />
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
  IonFabList
} from '@ionic/vue';
import { 
  walkOutline,
  carOutline,
  accessibilityOutline,
  navigateOutline,
  waterOutline,
  mapOutline,
  locateOutline,
  earthOutline,
  schoolOutline,
  libraryOutline,
  restaurantOutline,
  medkitOutline,
  businessOutline
} from 'ionicons/icons';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Header from '@/components/common/Header.vue';
import Footer from '@/components/common/Footer.vue';
import BuildingCard from '@/components/campus/BuildingCard.vue';

const router = useRouter();

// Estado
const mobilityType = ref('walking');
const currentLocation = ref('Edificio A - Sala de Computo');
const nearestBuilding = ref('Biblioteca Central');
const selectedPOI = ref<any>(null);

// Puntos de interés del campus
const pointsOfInterest = ref([
  {
    id: 1,
    name: 'Edificio A',
    type: 'academic',
    top: 30,
    left: 40,
    description: 'Edificio de aulas principales y salas de cómputo',
    services: ['Aulas', 'Computo', 'Cafetería']
  },
  {
    id: 2,
    name: 'Biblioteca',
    type: 'library',
    top: 50,
    left: 60,
    description: 'Biblioteca central con sala de estudio y recursos digitales',
    services: ['Libros', 'Estudio', 'Computadoras']
  },
  {
    id: 3,
    name: 'Canchas Deportivas',
    type: 'sports',
    top: 70,
    left: 30,
    description: 'Área deportiva con canchas de fútbol, básquetbol y voleibol',
    services: ['Fútbol', 'Básquetbol', 'Voleibol']
  },
  {
    id: 4,
    name: 'Cafetería',
    type: 'food',
    top: 40,
    left: 20,
    description: 'Cafetería principal con variedad de alimentos',
    services: ['Comida', 'Bebidas', 'Snacks']
  },
  {
    id: 5,
    name: 'Enfermería',
    type: 'medical',
    top: 60,
    left: 80,
    description: 'Servicio médico y primeros auxilios',
    services: ['Médico', 'Medicamentos', 'Emergencias']
  },
  {
    id: 6,
    name: 'Auditorio',
    type: 'event',
    top: 20,
    left: 70,
    description: 'Auditorio principal para eventos y conferencias',
    services: ['Eventos', 'Conferencias', 'Presentaciones']
  }
]);

// Métodos
const changeMobilityType = () => {
  console.log('Tipo de movilidad:', mobilityType.value);
};

const getPoiIcon = (type: string) => {
  const icons: Record<string, any> = {
    academic: schoolOutline,
    library: libraryOutline,
    sports: carOutline,
    food: restaurantOutline,
    medical: medkitOutline,
    event: businessOutline
  };
  return icons[type] || schoolOutline;
};

const selectPOI = (poi: any) => {
  selectedPOI.value = poi;
};

const navigateTo = (poi: any) => {
  router.push(`/navigation?to=${poi.id}&type=${mobilityType.value}`);
};

const goToBuildingDetail = (id: number) => {
  router.push(`/building-detail/${id}`);
};

const findNearestRestroom = () => {
  console.log('Buscando baño más cercano...');
};

const findParking = () => {
  console.log('Buscando estacionamiento...');
};

const showRoutePlanner = () => {
  router.push('/route-planner');
};

const centerOnUser = () => {
  console.log('Centrando en usuario...');
};

const toggleSatellite = () => {
  console.log('Alternando vista satélite...');
};
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
</style>