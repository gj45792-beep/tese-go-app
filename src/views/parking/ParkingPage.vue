<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/app/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Estacionamiento</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="refreshParkingData">
            <ion-icon slot="icon-only" :icon="refresh"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- Mapa de estacionamientos -->
      <div class="parking-map-container">
        <div class="campus-map">
          <!-- Edificios -->
          <div 
            v-for="building in buildings" 
            :key="building.id"
            class="building"
            :style="{
              left: building.x + '%',
              top: building.y + '%',
              width: building.width + '%',
              height: building.height + '%'
            }"
            :class="building.type"
          >
            <span class="building-label">{{ building.name }}</span>
          </div>

          <!-- Estacionamientos -->
          <div 
            v-for="parking in parkingLots" 
            :key="parking.id"
            class="parking-lot"
            :style="{
              left: parking.x + '%',
              top: parking.y + '%'
            }"
            :class="[
              parking.type,
              { 'available': parking.availableSpots > 0, 'full': parking.availableSpots === 0 }
            ]"
            @click="selectParking(parking)"
          >
            <div class="parking-marker">
              <ion-icon :icon="getParkingIcon(parking.type)" size="small"></ion-icon>
              <span class="spots-count">{{ parking.availableSpots }}</span>
            </div>
            <div class="parking-info" v-if="selectedParking?.id === parking.id">
              <strong>{{ parking.name }}</strong>
              <p>{{ parking.availableSpots }} espacios libres</p>
            </div>
          </div>
        </div>

        <!-- Leyenda -->
        <div class="legend">
          <div class="legend-item">
            <div class="color-box general"></div>
            <span>General</span>
          </div>
          <div class="legend-item">
            <div class="color-box disabled"></div>
            <span>Discapacidad</span>
          </div>
          <div class="legend-item">
            <div class="color-box faculty"></div>
            <span>Docentes</span>
          </div>
          <div class="legend-item">
            <div class="color-box bicycle"></div>
            <span>Bicicletas</span>
          </div>
          <div class="legend-item">
            <div class="color-box available"></div>
            <span>Disponible</span>
          </div>
          <div class="legend-item">
            <div class="color-box full"></div>
            <span>Lleno</span>
          </div>
        </div>
      </div>

      <!-- Información del estacionamiento seleccionado -->
      <ion-card v-if="selectedParking" class="ion-margin-top">
        <ion-card-header>
          <ion-card-title>
            <ion-icon :icon="car" slot="start"></ion-icon>
            {{ selectedParking.name }}
          </ion-card-title>
          <ion-card-subtitle>
            <ion-badge :color="getParkingStatusColor(selectedParking.availableSpots)">
              {{ selectedParking.availableSpots > 0 ? 'Disponible' : 'Lleno' }}
            </ion-badge>
          </ion-card-subtitle>
        </ion-card-header>
        
        <ion-card-content>
          <ion-list lines="none">
            <ion-item>
              <ion-icon slot="start" :icon="locationOutline"></ion-icon>
              <ion-label>
                <h3>Ubicación</h3>
                <p>{{ selectedParking.location }}</p>
              </ion-label>
            </ion-item>
            
            <ion-item>
              <ion-icon slot="start" :icon="timeOutline"></ion-icon>
              <ion-label>
                <h3>Horario</h3>
                <p>{{ selectedParking.schedule }}</p>
              </ion-label>
            </ion-item>
            
            <ion-item>
              <ion-icon slot="start" :icon="cashOutline"></ion-icon>
              <ion-label>
                <h3>Tarifa</h3>
                <p>{{ selectedParking.rate }}</p>
              </ion-label>
            </ion-item>
            
            <ion-item>
              <ion-icon slot="start" :icon="statsChartOutline"></ion-icon>
              <ion-label>
                <h3>Disponibilidad</h3>
                <p>{{ selectedParking.availableSpots }} / {{ selectedParking.totalSpots }} espacios</p>
              </ion-label>
            </ion-item>
          </ion-list>

          <ion-progress-bar 
            :value="selectedParking.availableSpots / selectedParking.totalSpots"
            :color="getParkingStatusColor(selectedParking.availableSpots)"
            class="ion-margin-vertical"
          ></ion-progress-bar>

          <div class="action-buttons">
            <ion-button expand="block" color="primary" @click="navigateToParking">
              <ion-icon slot="start" :icon="navigate"></ion-icon>
              Navegar hasta aquí
            </ion-button>
            
            <ion-button 
              expand="block" 
              color="secondary" 
              @click="reserveSpot"
              :disabled="selectedParking.availableSpots === 0"
            >
              <ion-icon slot="start" :icon="bookmark"></ion-icon>
              Reservar espacio
            </ion-button>
          </div>
        </ion-card-content>
      </ion-card>

      <!-- Filtros -->
      <ion-segment v-model="parkingFilter" @ionChange="filterParkingLots">
        <ion-segment-button value="all">
          <ion-label>Todos</ion-label>
        </ion-segment-button>
        <ion-segment-button value="general">
          <ion-label>General</ion-label>
        </ion-segment-button>
        <ion-segment-button value="disabled">
          <ion-label>Discapacidad</ion-label>
        </ion-segment-button>
        <ion-segment-button value="faculty">
          <ion-label>Docentes</ion-label>
        </ion-segment-button>
      </ion-segment>

      <!-- Lista de estacionamientos -->
      <ion-list class="ion-margin-top">
        <ion-list-header>
          <ion-label>Estacionamientos del campus</ion-label>
        </ion-list-header>
        
        <ion-item 
          v-for="parking in filteredParkingLots" 
          :key="parking.id"
          :button="true"
          @click="selectParking(parking)"
          :class="{ 'selected': selectedParking?.id === parking.id }"
        >
          <ion-icon 
            slot="start" 
            :icon="getParkingIcon(parking.type)" 
            :color="getParkingStatusColor(parking.availableSpots)"
          ></ion-icon>
          
          <ion-label>
            <h2>{{ parking.name }}</h2>
            <p>{{ parking.availableSpots }} espacios disponibles</p>
          </ion-label>
          
          <ion-badge slot="end" :color="getParkingStatusColor(parking.availableSpots)">
            {{ parking.availableSpots > 0 ? 'Libre' : 'Lleno' }}
          </ion-badge>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonButton, IonIcon, IonButtons, IonBackButton, 
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
  IonList, IonItem, IonLabel, IonBadge, IonProgressBar,
  IonSegment, IonSegmentButton, IonListHeader,
  alertController 
} from '@ionic/vue';
import { 
  car, navigate, bookmark, refresh, locationOutline,
  timeOutline, cashOutline, statsChartOutline,
  accessibility, school, bicycle, carOutline
} from 'ionicons/icons';

// Tipos
interface ParkingLot {
  id: number;
  name: string;
  type: 'general' | 'disabled' | 'faculty' | 'bicycle';
  x: number;
  y: number;
  location: string;
  schedule: string;
  rate: string;
  totalSpots: number;
  availableSpots: number;
}

interface Building {
  id: number;
  name: string;
  type: 'academic' | 'administration' | 'library' | 'sports';
  x: number;
  y: number;
  width: number;
  height: number;
}

// Datos de ejemplo
const parkingLots = ref<ParkingLot[]>([
  { id: 1, name: 'Estacionamiento Norte', type: 'general', x: 20, y: 30, location: 'Frente a Edificio A', schedule: '6:00 AM - 10:00 PM', rate: '$20/día', totalSpots: 50, availableSpots: 15 },
  { id: 2, name: 'Estacionamiento Sur', type: 'general', x: 70, y: 40, location: 'Frente a Biblioteca', schedule: '6:00 AM - 10:00 PM', rate: '$20/día', totalSpots: 40, availableSpots: 0 },
  { id: 3, name: 'Estacionamiento Discapacidad', type: 'disabled', x: 40, y: 60, location: 'Edificio Principal', schedule: '24 horas', rate: 'Gratuito', totalSpots: 10, availableSpots: 3 },
  { id: 4, name: 'Estacionamiento Docentes', type: 'faculty', x: 60, y: 20, location: 'Edificio B', schedule: '7:00 AM - 7:00 PM', rate: '$15/mes', totalSpots: 30, availableSpots: 12 },
  { id: 5, name: 'Estacionamiento Bicicletas', type: 'bicycle', x: 80, y: 70, location: 'Cerca de Cafetería', schedule: '6:00 AM - 10:00 PM', rate: '$10/día', totalSpots: 20, availableSpots: 8 },
  { id: 6, name: 'Estacionamiento Este', type: 'general', x: 30, y: 80, location: 'Frente a Laboratorios', schedule: '6:00 AM - 10:00 PM', rate: '$20/día', totalSpots: 35, availableSpots: 10 },
]);

const buildings = ref<Building[]>([
  { id: 1, name: 'Edificio A', type: 'academic', x: 15, y: 20, width: 15, height: 20 },
  { id: 2, name: 'Biblioteca', type: 'library', x: 65, y: 30, width: 15, height: 25 },
  { id: 3, name: 'Edificio B', type: 'academic', x: 55, y: 10, width: 15, height: 20 },
  { id: 4, name: 'Laboratorios', type: 'academic', x: 20, y: 70, width: 20, height: 15 },
  { id: 5, name: 'Administración', type: 'administration', x: 40, y: 50, width: 10, height: 15 },
]);

// Estado
const selectedParking = ref<ParkingLot | null>(null);
const parkingFilter = ref<string>('all');

// Computed
const filteredParkingLots = computed(() => {
  if (parkingFilter.value === 'all') {
    return parkingLots.value;
  }
  return parkingLots.value.filter(p => p.type === parkingFilter.value);
});

// Métodos
const getParkingIcon = (type: string) => {
  switch (type) {
    case 'disabled': return accessibility;
    case 'faculty': return school;
    case 'bicycle': return bicycle;
    default: return carOutline;
  }
};

const getParkingStatusColor = (availableSpots: number) => {
  if (availableSpots === 0) return 'danger';
  if (availableSpots < 5) return 'warning';
  return 'success';
};

const selectParking = (parking: ParkingLot) => {
  selectedParking.value = parking;
};

const navigateToParking = () => {
  if (selectedParking.value) {
    // Redirigir a LiveNavigation con las coordenadas
    alertController.create({
      header: 'Navegación',
      message: `Iniciando navegación hacia ${selectedParking.value.name}`,
      buttons: ['OK']
    }).then(alert => alert.present());
    
    // En una implementación real:
    // router.push({ 
    //   name: 'LiveNavigation', 
    //   query: { destination: selectedParking.value.location } 
    // });
  }
};

const reserveSpot = async () => {
  if (!selectedParking.value) return;
  
  const alert = await alertController.create({
    header: 'Reservar espacio',
    message: `¿Deseas reservar un espacio en ${selectedParking.value.name}?`,
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Reservar',
        handler: () => {
          if (selectedParking.value && selectedParking.value.availableSpots > 0) {
            selectedParking.value.availableSpots--;
            alertController.create({
              header: 'Reserva confirmada',
              message: `Espacio reservado en ${selectedParking.value.name}. Tienes 15 minutos para llegar.`,
              buttons: ['OK']
            }).then(alert => alert.present());
          }
        }
      }
    ]
  });
  
  await alert.present();
};

const refreshParkingData = () => {
  // Simular actualización de datos
  parkingLots.value.forEach(parking => {
    // Simular cambio en disponibilidad
    const change = Math.floor(Math.random() * 3) - 1; // -1, 0, o 1
    parking.availableSpots = Math.max(0, Math.min(parking.totalSpots, parking.availableSpots + change));
  });
  
  alertController.create({
    header: 'Datos actualizados',
    message: 'La información de estacionamientos ha sido actualizada.',
    buttons: ['OK']
  }).then(alert => alert.present());
};

const filterParkingLots = () => {
  // El computed se encarga
};

// Inicializar
onMounted(() => {
  if (parkingLots.value.length > 0) {
    selectedParking.value = parkingLots.value[0];
  }
});
</script>

<style scoped>
.parking-map-container {
  position: relative;
  width: 100%;
  height: 300px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  background-color: #f8f9fa;
  margin-bottom: 20px;
}

.campus-map {
  position: relative;
  width: 100%;
  height: 100%;
}

.building {
  position: absolute;
  background-color: #4a8cff;
  border: 2px solid #2c6bff;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.building.academic { background-color: #4a8cff; }
.building.administration { background-color: #ff6b4a; }
.building.library { background-color: #9c4aff; }
.building.sports { background-color: #4aff6b; }

.building-label {
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  text-align: center;
  padding: 2px;
}

.parking-lot {
  position: absolute;
  cursor: pointer;
  transition: transform 0.2s;
  z-index: 10;
}

.parking-lot:hover {
  transform: scale(1.2);
}

.parking-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: white;
  font-weight: bold;
  font-size: 0.8rem;
}

.parking-lot.general .parking-marker { background-color: #4CAF50; }
.parking-lot.disabled .parking-marker { background-color: #9C27B0; }
.parking-lot.faculty .parking-marker { background-color: #FF9800; }
.parking-lot.bicycle .parking-marker { background-color: #607D8B; }

.parking-lot.available .parking-marker {
  border: 3px solid #4CAF50;
}

.parking-lot.full .parking-marker {
  background-color: #f44336 !important;
}

.spots-count {
  font-size: 0.9rem;
  font-weight: bold;
}

.parking-info {
  position: absolute;
  top: 45px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  padding: 8px 12px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  white-space: nowrap;
  z-index: 100;
  font-size: 0.8rem;
}

.legend {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  max-width: 200px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.7rem;
}

.color-box {
  width: 15px;
  height: 15px;
  border-radius: 3px;
}

.color-box.general { background-color: #4CAF50; }
.color-box.disabled { background-color: #9C27B0; }
.color-box.faculty { background-color: #FF9800; }
.color-box.bicycle { background-color: #607D8B; }
.color-box.available { background-color: #4CAF50; }
.color-box.full { background-color: #f44336; }

.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

ion-item.selected {
  --background: rgba(76, 175, 80, 0.1);
  --border-color: #4CAF50;
}
</style>