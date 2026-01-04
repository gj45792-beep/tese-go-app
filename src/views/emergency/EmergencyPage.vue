<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="danger">
        <ion-buttons slot="start">
          <ion-back-button default-href="/app/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Emergencias</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="refreshLocation">
            <ion-icon slot="icon-only" :icon="refresh"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- ALERTA DE EMERGENCIA -->
      <div class="emergency-alert ion-text-center ion-margin-bottom">
        <ion-icon :icon="warning" color="danger" size="large"></ion-icon>
        <h2 class="ion-text-uppercase ion-no-margin">Sistema de Emergencias TESE</h2>
        <p class="ion-text-wrap">En caso de emergencia, utiliza uno de los siguientes contactos</p>
      </div>

      <!-- BOTÓN DE PÁNICO -->
      <div class="panic-button-container ion-text-center ion-margin-vertical">
        <ion-button 
          @click="triggerPanic" 
          color="danger" 
          size="large" 
          class="panic-button"
          shape="round"
        >
          <ion-icon slot="start" :icon="alertCircle"></ion-icon>
          EMERGENCIA
        </ion-button>
        <p class="ion-text-sm">Presiona solo en caso de emergencia real</p>
      </div>

      <!-- CONTACTOS DE EMERGENCIA -->
      <ion-list>
        <ion-list-header>
          <ion-label>Contactos de Emergencia</ion-label>
        </ion-list-header>

        <ion-item button @click="callEmergency('911')">
          <ion-icon slot="start" :icon="call" color="danger"></ion-icon>
          <ion-label>
            <h2>Emergencias General</h2>
            <p>911 - Atención inmediata</p>
          </ion-label>
          <ion-button fill="clear" slot="end">
            <ion-icon :icon="callOutline"></ion-icon>
          </ion-button>
        </ion-item>

        <ion-item button @click="callEmergency('555-123-4567')">
          <ion-icon slot="start" :icon="medical" color="primary"></ion-icon>
          <ion-label>
            <h2>Servicio Médico TESE</h2>
            <p>555-123-4567</p>
          </ion-label>
          <ion-button fill="clear" slot="end">
            <ion-icon :icon="callOutline"></ion-icon>
          </ion-button>
        </ion-item>

        <ion-item button @click="callEmergency('555-987-6543')">
          <ion-icon slot="start" :icon="shieldCheckmark" color="warning"></ion-icon>
          <ion-label>
            <h2>Seguridad Campus</h2>
            <p>555-987-6543</p>
          </ion-label>
          <ion-button fill="clear" slot="end">
            <ion-icon :icon="callOutline"></ion-icon>
          </ion-button>
        </ion-item>

        <ion-item button @click="callEmergency('555-555-7890')">
          <ion-icon slot="start" :icon="car" color="secondary"></ion-icon>
          <ion-label>
            <h2>Emergencias Viales</h2>
            <p>555-555-7890</p>
          </ion-label>
          <ion-button fill="clear" slot="end">
            <ion-icon :icon="callOutline"></ion-icon>
          </ion-button>
        </ion-item>
      </ion-list>

      <!-- UBICACIÓN ACTUAL -->
      <ion-card class="ion-margin-top">
        <ion-card-header>
          <ion-card-title>
            <ion-icon :icon="location" slot="start"></ion-icon>
            Tu ubicación
          </ion-card-title>
        </ion-card-header>
        
        <ion-card-content>
          <div v-if="currentLocation">
            <p><strong>Edificio:</strong> {{ currentLocation.building }}</p>
            <p><strong>Sala/Piso:</strong> {{ currentLocation.room }}</p>
            <p><strong>Coordenadas:</strong> {{ currentLocation.coords }}</p>
            
            <ion-button 
              expand="block" 
              color="medium" 
              @click="shareLocation"
              class="ion-margin-top"
            >
              <ion-icon slot="start" :icon="shareSocial"></ion-icon>
              Compartir ubicación
            </ion-button>
          </div>
          
          <div v-else class="ion-text-center">
            <ion-spinner name="crescent"></ion-spinner>
            <p>Obteniendo ubicación...</p>
          </div>
        </ion-card-content>
      </ion-card>

      <!-- INSTRUCCIONES -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>Instrucciones en caso de emergencia</ion-card-title>
        </ion-card-header>
        
        <ion-card-content>
          <ion-list lines="none">
            <ion-item>
              <ion-icon slot="start" :icon="checkmarkCircle" color="success"></ion-icon>
              <ion-label class="ion-text-wrap">
                Mantén la calma y llama al número correspondiente
              </ion-label>
            </ion-item>
            
            <ion-item>
              <ion-icon slot="start" :icon="checkmarkCircle" color="success"></ion-icon>
              <ion-label class="ion-text-wrap">
                Proporciona tu ubicación exacta del campus
              </ion-label>
            </ion-item>
            
            <ion-item>
              <ion-icon slot="start" :icon="checkmarkCircle" color="success"></ion-icon>
              <ion-label class="ion-text-wrap">
                Sigue las instrucciones del personal de emergencia
              </ion-label>
            </ion-item>
            
            <ion-item>
              <ion-icon slot="start" :icon="checkmarkCircle" color="success"></ion-icon>
              <ion-label class="ion-text-wrap">
                Si es seguro, dirígete al punto de encuentro más cercano
              </ion-label>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonButton, IonIcon, IonButtons, IonBackButton, 
  IonList, IonItem, IonLabel, IonCard, IonCardHeader, 
  IonCardTitle, IonCardContent, IonSpinner, IonListHeader,
  alertController 
} from '@ionic/vue';
import { 
  warning, alertCircle, call, medical, shieldCheckmark, 
  car, location, shareSocial, checkmarkCircle, 
  callOutline, refresh 
} from 'ionicons/icons';

// Estado de ubicación
interface LocationData {
  building: string;
  room: string;
  coords: string;
  timestamp: Date;
}

const currentLocation = ref<LocationData | null>(null);

// Simular obtención de ubicación
const simulateLocation = () => {
  const buildings = ['Edificio A', 'Edificio B', 'Edificio C', 'Edificio D', 'Biblioteca'];
  const rooms = ['Sala 101', 'Sala 205', 'Sala 310', 'Laboratorio 1', 'Auditorio'];
  
  currentLocation.value = {
    building: buildings[Math.floor(Math.random() * buildings.length)],
    room: rooms[Math.floor(Math.random() * rooms.length)],
    coords: `${(19.504 + Math.random() * 0.01).toFixed(6)}, ${(-99.146 + Math.random() * 0.01).toFixed(6)}`,
    timestamp: new Date()
  };
};

// Llamar a emergencia
const callEmergency = (number: string) => {
  window.open(`tel:${number}`, '_system');
};

// Botón de pánico
const triggerPanic = async () => {
  const alert = await alertController.create({
    header: '¡ALERTA DE EMERGENCIA!',
    message: `¿Estás seguro de activar la alerta de emergencia? Se notificará a seguridad con tu ubicación: ${currentLocation.value?.building}`,
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Activar',
        handler: () => {
          showPanicAlert();
        }
      }
    ]
  });
  
  await alert.present();
};

const showPanicAlert = async () => {
  const alert = await alertController.create({
    header: 'Alerta enviada',
    message: 'El personal de seguridad ha sido notificado y está en camino.',
    buttons: ['OK']
  });
  
  await alert.present();
};

// Compartir ubicación
const shareLocation = () => {
  if (currentLocation.value) {
    const message = `Emergencia TESE - Ubicación: ${currentLocation.value.building}, ${currentLocation.value.room}. Coordenadas: ${currentLocation.value.coords}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Emergencia TESE',
        text: message
      });
    } else {
      // Fallback para navegadores sin Web Share API
      navigator.clipboard.writeText(message);
      
      alertController.create({
        header: 'Ubicación copiada',
        message: 'La información de ubicación ha sido copiada al portapapeles.',
        buttons: ['OK']
      }).then(alert => alert.present());
    }
  }
};

// Refrescar ubicación
const refreshLocation = () => {
  currentLocation.value = null;
  setTimeout(simulateLocation, 1000);
};

// Inicializar
onMounted(() => {
  setTimeout(simulateLocation, 1500);
});
</script>

<style scoped>
.emergency-alert {
  background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
  border-radius: 16px;
  padding: 20px;
  border: 2px solid #f44336;
}

.panic-button-container {
  padding: 20px;
}

.panic-button {
  height: 80px;
  width: 80px;
  border-radius: 50%;
  font-size: 16px;
  font-weight: bold;
  --box-shadow: 0 8px 20px rgba(244, 67, 54, 0.4);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.7);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 15px rgba(244, 67, 54, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(244, 67, 54, 0);
  }
}

ion-item {
  --padding-start: 16px;
  --padding-end: 16px;
  --inner-padding-end: 0;
}

ion-card {
  border-radius: 12px;
}

ion-button[color="danger"] {
  --background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
}
</style>