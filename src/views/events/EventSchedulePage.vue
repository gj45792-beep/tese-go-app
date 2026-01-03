<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <!-- Header pequeño de Ionic -->
        <IonTitle size="small">Agenda</IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent class="event-schedule-content" color="primary">
      <!-- TU HEADER PERSONALIZADO -->
      <div class="header">
        <h1>📅 Agenda de Eventos</h1>
        <p class="subtitle">Selecciona un evento para ver detalles y navegar</p>
      </div>

      <!-- Selector de fecha -->
      <div class="date-selector">
        <button class="nav-btn" @click="previousDay">◀</button>
        
        <div class="current-date">
          <span class="day">{{ formattedDay }}</span>
          <span class="date">{{ formattedDate }}</span>
        </div>
        
        <button class="nav-btn" @click="nextDay">▶</button>
      </div>

      <!-- Contenido principal -->
      <div class="schedule-content">
        <div class="events-list">
          <h3>Eventos de hoy ({{ events.length }})</h3>
          
          <!-- Lista de eventos -->
          <div v-for="event in events" :key="event.id" class="event-card">
            <div class="event-time">
              <span class="time-badge">{{ event.time }}</span>
              <span class="duration">{{ event.duration }} min</span>
            </div>
            
            <div class="event-details">
              <h4>{{ event.title }}</h4>
              <p class="event-location">📍 {{ event.location }}</p>
              <p class="event-category">🏷️ {{ event.category }}</p>
              <small v-if="event.ponentes" class="event-ponentes">
                👥 {{ event.ponentes.join(', ') }}
              </small>
            </div>
            
            <button class="nav-to-event" @click="goToEvent(event)">
              🚀
            </button>
          </div>
        </div>
      </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
// PRIMERO los imports de Ionic
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent 
} from '@ionic/vue'

import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Estado reactivo
const currentDate = ref(new Date())
const events = ref<any[]>([])

// Computed properties para formato español
const formattedDay = computed(() => {
  return currentDate.value.toLocaleDateString('es-ES', { 
    weekday: 'long',
    timeZone: 'America/Mexico_City'
  })
})

const formattedDate = computed(() => {
  return currentDate.value.toLocaleDateString('es-ES', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric',
    timeZone: 'America/Mexico_City'
  })
})

// ESTILO COMO STRING (para evitar errores TypeScript)
const pageStyleString = computed(() => {
  return {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    minHeight: '100vh', // CAMBIA height por minHeight
    overflow: 'auto',
    paddingTop: '70px', // AGREGA ESTO DE NUEVO
    paddingLeft: '20px', // AGREGA ESTO
    paddingRight: '20px', // AGREGA ESTO
    boxSizing: 'border-box'
  } as any
})

// Métodos para navegación entre días
const previousDay = () => {
  const newDate = new Date(currentDate.value)
  newDate.setDate(newDate.getDate() - 1)
  currentDate.value = newDate
  loadEventsForDate()
}

const nextDay = () => {
  const newDate = new Date(currentDate.value)
  newDate.setDate(newDate.getDate() + 1)
  currentDate.value = newDate
  loadEventsForDate()
}

const loadEventsForDate = () => {
  // Datos de ejemplo MEJORADOS
  events.value = [
    {
      id: 1,
      title: 'Conferencia: Inteligencia Artificial en Educación',
      time: '10:00 AM',
      location: 'Aula Magna - Edificio Principal',
      duration: 90,
      category: 'Académico',
      ponentes: ['Dr. Carlos Méndez', 'Dra. Ana López']
    },
    {
      id: 2,
      title: 'Taller Práctico: Desarrollo con Vue.js 3',
      time: '14:00 PM',
      location: 'Laboratorio 3 - Edificio de Computación',
      duration: 120,
      category: 'Taller Técnico',
      ponentes: ['Ing. Roberto García']
    },
    {
      id: 3,
      title: 'Protocolo de Titulación: Entrega de Documentos',
      time: '16:30 PM',
      location: 'Oficina de Control Escolar',
      duration: 60,
      category: 'Protocolo',
      ponentes: ['Lic. María Fernández']
    }
  ]
  
  console.log('📅 Eventos cargados para:', formattedDate.value)
}

const goToEvent = (event: any) => {
  console.log('Navegando al evento:', event.title)
  // Aquí integrarás con la navegación después
  router.push({
    name: 'LiveNavigation',
    query: {
      event: event.title,
      location: event.location,
      time: event.time
    }
  })
}

// Cargar eventos al iniciar
loadEventsForDate()
</script>

<style scoped>
/* Header del componente */
.header {
  text-align: center;
  margin-bottom: 25px;
}

h1 {
  margin: 0 0 8px 0;
  font-size: 1.8rem;
  font-weight: 700;
}
/* Agrega esto a tu sección de estilos */
.header {
  text-align: center;
  padding: 15px 20px 0;
}

.header h1 {
  margin: 0 0 8px 0;
  font-size: 1.8rem;
  font-weight: 700;
}

.subtitle {
  opacity: 0.9;
  margin: 0 0 20px 0;
  font-size: 0.95rem;
}

/* Selector de fecha */
.date-selector {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin: 25px 0;
  background: rgba(255, 255, 255, 0.1);
  padding: 15px 20px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.nav-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.nav-btn:active {
  transform: scale(0.95);
}

.current-date {
  text-align: center;
  min-width: 200px;
}

.current-date .day {
  display: block;
  font-size: 1.3rem;
  font-weight: bold;
  text-transform: capitalize;
  margin-bottom: 4px;
}

.current-date .date {
  display: block;
  font-size: 0.9rem;
  opacity: 0.85;
}

/* Contenido principal */
.schedule-content {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 25px;
  min-height: 300px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

/* Tarjetas de evento */
.event-card {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: transform 0.2s, background 0.3s;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.event-card:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.event-time {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
}

.time-badge {
  background: rgba(255, 255, 255, 0.25);
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9rem;
}

.duration {
  font-size: 0.8rem;
  opacity: 0.8;
  margin-top: 4px;
}

.event-details {
  flex: 1;
}

.event-details h4 {
  margin: 0 0 8px 0;
  font-size: 1.1rem;
}

.event-location, .event-category, .event-ponentes {
  margin: 4px 0;
  font-size: 0.9rem;
  opacity: 0.9;
}

.event-ponentes {
  display: block;
  font-style: italic;
}

.nav-to-event {
  background: rgba(255, 255, 255, 0.25);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s;
}

.nav-to-event:hover {
  background: rgba(255, 255, 255, 0.4);
  transform: scale(1.1);
}

.events-list h3 {
  margin-top: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 12px;
  margin-bottom: 20px;
  font-size: 1.3rem;
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .date-selector {
    gap: 15px;
    padding: 12px 15px;
  }
  
  .current-date {
    min-width: 160px;
  }
  
  .current-date .day {
    font-size: 1.1rem;
  }
  
  h1 {
    font-size: 1.5rem;
  }
  
  .event-card {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }
  
  .event-time {
    flex-direction: row;
    gap: 10px;
  }

  /* Agrega esto al FINAL de tu sección de estilos */
:deep(ion-content) {
  --padding-top: 20px;
  --padding-start: 20px;
  --padding-end: 20px;
  --padding-bottom: 20px;
}

.event-schedule-page {
  padding: 0;
  display: block;
}
}
</style>