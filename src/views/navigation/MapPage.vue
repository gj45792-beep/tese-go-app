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
          </div>
          
          <img 
            src="@/assets/images/campus-map.jpg" 
            alt="Mapa del Campus TESE"
            class="campus-map"
          />
        </div>

        <!-- Información del edificio seleccionado -->
        <div v-if="selectedPOI" class="building-info">
          <h3>{{ selectedPOI.name }}</h3>
          <p>{{ selectedPOI.description }}</p>
          
          <div class="building-services">
            <ion-chip v-for="service in selectedPOI.services" :key="service">
              {{ service }}
            </ion-chip>
          </div>

          <ion-button expand="block" @click="navigateTo(selectedPOI)">
            <ion-icon :icon="navigateOutline" slot="start" />
            Navegar hasta aquí
          </ion-button>
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

const router = useRouter();

// Estado
const mobilityType = ref('walking');
const currentLocation = ref('Edificio A - Sala de Computo');
const nearestBuilding = ref('Biblioteca Central');
const selectedPOI = ref<any>(null);

// Métodos
const changeMobilityType = () => {
  console.log('Tipo de movilidad:', mobilityType.value);
};

const navigateTo = (poi: any) => {
  router.push(`/navigation?to=${poi.id}&type=${mobilityType.value}`);
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

.building-info {
  padding: 16px;
  background: var(--ion-color-light);
  border-top: 1px solid var(--ion-color-medium-shade);
}

.building-info h3 {
  margin: 0 0 8px 0;
  color: var(--ion-color-dark);
}

.building-info p {
  margin: 0 0 12px 0;
  color: var(--ion-color-medium);
  font-size: 0.9rem;
}

.building-services {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
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