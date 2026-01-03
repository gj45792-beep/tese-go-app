<template>
  <div class="event-schedule-page" style="overflow-y: auto; height: 100vh;">
    <!-- Header con logo TESE -->
    <div class="tese-header">
      <div class="header-content">
        <img src="@/assets/images/logo-tese.jpg" alt="TESE Logo" class="logo" />
        <h1>Cronograma de Eventos</h1>
        <p class="subtitle">Maestría en Tecnologías de la Información</p>
      </div>
      <div class="date-display">
        {{ currentDate }}
      </div>
    </div>

    <!-- Selector de vistas -->
    <div class="view-selector">
      <button 
        @click="activeView = 'list'"
        :class="{ active: activeView === 'list' }"
        class="view-btn"
      >
        <i class="fas fa-list"></i> Lista
      </button>
      <button 
        @click="activeView = 'map'"
        :class="{ active: activeView === 'map' }"
        class="view-btn"
      >
        <i class="fas fa-map"></i> Mapa
      </button>
      <button 
        @click="activeView = 'calendar'"
        :class="{ active: activeView === 'calendar' }"
        class="view-btn"
      >
        <i class="fas fa-calendar"></i> Calendario
      </button>
    </div>

    <!-- Vista de Lista -->
    <div v-if="activeView === 'list'" class="list-view">
      <div class="time-filter">
        <button 
          v-for="day in days"
          :key="day.id"
          @click="filterByDay(day.id)"
          :class="{ active: selectedDay === day.id }"
          class="day-btn"
        >
          {{ day.label }}
        </button>
      </div>

      <div class="events-list">
        <div 
          v-for="event in filteredEvents"
          :key="event.id"
          class="event-card"
          @click="selectEvent(event)"
        >
          <div class="event-time">
            <span class="time">{{ formatTime(event.startTime) }}</span>
            <span class="duration">{{ event.duration }} min</span>
          </div>
          <div class="event-details">
            <h3 class="event-title">{{ event.title }}</h3>
            <p class="event-location">
              <i class="fas fa-map-marker-alt"></i> {{ event.location }}
            </p>
            <div class="event-tags">
              <span class="tag" :class="event.type">{{ event.type }}</span>
              <span v-if="event.speaker" class="speaker-tag">
                <i class="fas fa-user"></i> {{ event.speaker }}
              </span>
            </div>
          </div>
          <button 
            @click.stop="navigateToEvent(event)"
            class="navigate-btn"
            title="Navegar al evento"
          >
            <i class="fas fa-location-arrow"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Vista de Mapa -->
    <div v-if="activeView === 'map'" class="map-view">
      <div class="map-container">
        <!-- Mapa SVG del campus TESE -->
        <svg class="campus-map" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
          <!-- Fondo del mapa -->
          <rect width="800" height="600" fill="#f0f7ff" />
          
          <!-- Edificios principales -->
          <g class="buildings">
            <!-- Edificio A (Administración) -->
            <rect x="100" y="150" width="120" height="180" fill="#4a90e2" rx="8" />
            <text x="160" y="240" text-anchor="middle" fill="white" font-weight="bold">Edificio A</text>
            
            <!-- Edificio B (Aulas) -->
            <rect x="300" y="100" width="150" height="200" fill="#50c878" rx="8" />
            <text x="375" y="200" text-anchor="middle" fill="white" font-weight="bold">Edificio B</text>
            
            <!-- Auditorio -->
            <ellipse cx="550" cy="250" rx="80" ry="60" fill="#ff6b6b" />
            <text x="550" y="255" text-anchor="middle" fill="white" font-weight="bold">Auditorio</text>
            
            <!-- Biblioteca -->
            <rect x="200" y="400" width="140" height="120" fill="#ffa500" rx="8" />
            <text x="270" y="460" text-anchor="middle" fill="white" font-weight="bold">Biblioteca</text>
            
            <!-- Cafetería -->
            <rect x="450" y="400" width="100" height="100" fill="#9b59b6" rx="8" />
            <text x="500" y="450" text-anchor="middle" fill="white" font-weight="bold">Cafetería</text>
            
            <!-- Laboratorios -->
            <rect x="600" y="350" width="120" height="150" fill="#1abc9c" rx="8" />
            <text x="660" y="425" text-anchor="middle" fill="white" font-weight="bold">Labs TI</text>
          </g>
          
          <!-- Calles y caminos -->
          <g class="paths">
            <path d="M220 330 L300 330 L300 300" stroke="#666" stroke-width="3" fill="none" />
            <path d="M375 300 L375 330 L450 330" stroke="#666" stroke-width="3" fill="none" />
            <path d="M450 330 L450 400" stroke="#666" stroke-width="3" fill="none" />
            <path d="M500 350 L500 400" stroke="#666" stroke-width="3" fill="none" />
            <path d="M550 310 L550 350 L600 350" stroke="#666" stroke-width="3" fill="none" />
            <path d="M250 480 L300 480 L300 400" stroke="#666" stroke-width="3" fill="none" />
          </g>
          
          <!-- Marcadores de eventos -->
          <g class="event-markers">
            <circle 
              v-for="event in eventsWithCoordinates"
              :key="event.id"
              :cx="event.mapX"
              :cy="event.mapY"
              r="15"
              :fill="getEventColor(event.type)"
              :class="{ selected: selectedEventId === event.id }"
              @click="selectEvent(event)"
              class="event-marker"
            >
              <title>{{ event.title }} - {{ event.location }}</title>
            </circle>
            
            <!-- Etiquetas de marcadores -->
            <text 
              v-for="event in eventsWithCoordinates"
              :key="'label-' + event.id"
              :x="event.mapX"
              :y="event.mapY - 20"
              text-anchor="middle"
              fill="#333"
              font-size="12"
              font-weight="bold"
            >
              {{ event.shortTitle }}
            </text>
          </g>
          
          <!-- Leyenda del mapa -->
          <g class="map-legend" transform="translate(20, 20)">
            <rect width="200" height="130" fill="white" opacity="0.9" rx="8" stroke="#ddd" />
            <text x="100" y="30" text-anchor="middle" font-weight="bold">Leyenda</text>
            
            <g transform="translate(20, 45)">
              <circle cx="10" cy="0" r="6" fill="#4a90e2" />
              <text x="25" y="4">Conferencia</text>
            </g>
            
            <g transform="translate(20, 65)">
              <circle cx="10" cy="0" r="6" fill="#50c878" />
              <text x="25" y="4">Taller</text>
            </g>
            
            <g transform="translate(20, 85)">
              <circle cx="10" cy="0" r="6" fill="#ff6b6b" />
              <text x="25" y="4">Presentación</text>
            </g>
            
            <g transform="translate(20, 105)">
              <circle cx="10" cy="0" r="6" fill="#ffa500" />
              <text x="25" y="4">Reunión</text>
            </g>
          </g>
        </svg>
      </div>
      
      <!-- Panel lateral de información del evento -->
      <div v-if="selectedEvent" class="event-info-panel">
        <div class="panel-header">
          <h3>{{ selectedEvent.title }}</h3>
          <button @click="selectedEvent = null" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="panel-content">
          <div class="info-row">
            <i class="fas fa-clock"></i>
            <span>{{ formatTime(selectedEvent.startTime) }} - {{ formatTime(selectedEvent.endTime) }}</span>
          </div>
          <div class="info-row">
            <i class="fas fa-map-marker-alt"></i>
            <span>{{ selectedEvent.location }}</span>
          </div>
          <div class="info-row" v-if="selectedEvent.speaker">
            <i class="fas fa-user"></i>
            <span>{{ selectedEvent.speaker }}</span>
          </div>
          <div class="info-row" v-if="selectedEvent.description">
            <i class="fas fa-info-circle"></i>
            <span>{{ selectedEvent.description }}</span>
          </div>
          <div class="panel-actions">
            <button @click="navigateToEvent(selectedEvent)" class="action-btn primary">
              <i class="fas fa-location-arrow"></i> Navegar al evento
            </button>
            <button @click="addToCalendar(selectedEvent)" class="action-btn secondary">
              <i class="fas fa-calendar-plus"></i> Agendar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Vista de Calendario -->
    <div v-if="activeView === 'calendar'" class="calendar-view">
      <div class="calendar-header">
        <button @click="prevMonth" class="nav-btn">
          <i class="fas fa-chevron-left"></i>
        </button>
        <h3>{{ currentMonthYear }}</h3>
        <button @click="nextMonth" class="nav-btn">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
      <div class="calendar-grid">
        <div class="calendar-day" v-for="day in ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']" :key="day">
          {{ day }}
        </div>
        <div 
          v-for="day in calendarDays"
          :key="day.date"
          :class="[
            'calendar-day',
            { 
              'current-month': day.isCurrentMonth,
              'has-events': day.hasEvents,
              'today': day.isToday
            }
          ]"
          @click="selectCalendarDay(day)"
        >
          <div class="day-number">{{ day.day }}</div>
          <div v-if="day.eventsCount > 0" class="events-indicator">
            <span class="event-dot"></span>
            <span class="events-count">{{ day.eventsCount }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de detalles del evento -->
    <div v-if="showEventModal" class="modal-overlay" @click="showEventModal = false">
      <div class="modal-content" @click.stop>
        <EventDetail 
          :event="selectedEvent"
          @close="showEventModal = false"
          @navigate="navigateToEvent(selectedEvent)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import EventDetail from '@/components/events/EventDetail.vue'

export default {
  name: 'EventSchedulePage',
  components: {
    EventDetail
  },
  setup() {
    const router = useRouter()
    const activeView = ref('list')
    const selectedDay = ref('all')
    const selectedEvent = ref(null)
    const selectedEventId = ref(null)
    const showEventModal = ref(false)
    const currentDate = ref('')
    const currentMonth = ref(new Date().getMonth())
    const currentYear = ref(new Date().getFullYear())

    // Datos de ejemplo para eventos
    const events = ref([
      {
        id: 1,
        title: 'Inauguración del Semestre',
        shortTitle: 'Inauguración',
        startTime: '09:00',
        endTime: '10:30',
        duration: 90,
        date: '2024-01-15',
        location: 'Auditorio Principal',
        type: 'conferencia',
        speaker: 'Dra. María González',
        description: 'Ceremonia de bienvenida y presentación del programa académico.',
        mapX: 550,
        mapY: 250
      },
      {
        id: 2,
        title: 'Taller de Metodologías Ágiles',
        shortTitle: 'Metodologías',
        startTime: '11:00',
        endTime: '13:00',
        duration: 120,
        date: '2024-01-15',
        location: 'Edificio B - Aula 201',
        type: 'taller',
        speaker: 'Ing. Carlos Ruiz',
        description: 'Introducción a Scrum y Kanban para proyectos TI.',
        mapX: 375,
        mapY: 200
      },
      {
        id: 3,
        title: 'Presentación de Proyectos Finales',
        shortTitle: 'Proyectos',
        startTime: '14:00',
        endTime: '16:00',
        duration: 120,
        date: '2024-01-15',
        location: 'Laboratorio de TI',
        type: 'presentacion',
        speaker: 'Mtra. Ana López',
        description: 'Exposición de proyectos de generación anterior.',
        mapX: 660,
        mapY: 425
      },
      {
        id: 4,
        title: 'Reunión con Asesores',
        shortTitle: 'Asesores',
        startTime: '10:00',
        endTime: '11:30',
        duration: 90,
        date: '2024-01-16',
        location: 'Edificio A - Sala de Juntas',
        type: 'reunion',
        speaker: null,
        description: 'Coordinación de temas de tesis.',
        mapX: 160,
        mapY: 240
      },
      {
        id: 5,
        title: 'Conferencia: Inteligencia Artificial',
        shortTitle: 'IA',
        startTime: '16:00',
        endTime: '18:00',
        duration: 120,
        date: '2024-01-16',
        location: 'Biblioteca - Sala Digital',
        type: 'conferencia',
        speaker: 'Dr. Roberto Mendoza',
        description: 'Aplicaciones prácticas de IA en la industria.',
        mapX: 270,
        mapY: 460
      }
    ])

    const days = [
      { id: 'all', label: 'Todos' },
      { id: 'today', label: 'Hoy' },
      { id: 'tomorrow', label: 'Mañana' },
      { id: 'week', label: 'Esta semana' }
    ]

    // Computed properties
    const filteredEvents = computed(() => {
      if (selectedDay.value === 'all') return events.value
      if (selectedDay.value === 'today') {
        const today = new Date().toISOString().split('T')[0]
        return events.value.filter(event => event.date === today)
      }
      // Para simplicidad, filtramos por fecha específica
      return events.value.filter(event => event.date.includes('2024-01-15'))
    })

    const eventsWithCoordinates = computed(() => {
      return events.value.filter(event => event.mapX && event.mapY)
    })

    const calendarDays = computed(() => {
      const daysInMonth = new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
      const firstDayOfMonth = new Date(currentYear.value, currentMonth.value, 1).getDay()
      
      const daysArray = []
      
      // Días del mes anterior
      const prevMonthDays = new Date(currentYear.value, currentMonth.value, 0).getDate()
      for (let i = firstDayOfMonth - 1; i >= 0; i--) {
        daysArray.push({
          day: prevMonthDays - i,
          isCurrentMonth: false,
          hasEvents: false,
          isToday: false,
          eventsCount: 0
        })
      }
      
      // Días del mes actual
      const today = new Date()
      for (let i = 1; i <= daysInMonth; i++) {
        const dateStr = `${currentYear.value}-${(currentMonth.value + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`
        const dayEvents = events.value.filter(event => event.date === dateStr)
        
        daysArray.push({
          day: i,
          date: dateStr,
          isCurrentMonth: true,
          hasEvents: dayEvents.length > 0,
          isToday: today.getDate() === i && 
                   today.getMonth() === currentMonth.value && 
                   today.getFullYear() === currentYear.value,
          eventsCount: dayEvents.length
        })
      }
      
      // Completar con días del siguiente mes
      const totalCells = 42 // 6 semanas
      while (daysArray.length < totalCells) {
        daysArray.push({
          day: daysArray.length - daysInMonth - firstDayOfMonth + 1,
          isCurrentMonth: false,
          hasEvents: false,
          isToday: false,
          eventsCount: 0
        })
      }
      
      return daysArray
    })

    const currentMonthYear = computed(() => {
      const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ]
      return `${months[currentMonth.value]} ${currentYear.value}`
    })

    // Métodos
    const formatTime = (time) => {
      if (!time) return ''
      const [hours, minutes] = time.split(':')
      const hour = parseInt(hours)
      const ampm = hour >= 12 ? 'PM' : 'AM'
      const displayHour = hour % 12 || 12
      return `${displayHour}:${minutes} ${ampm}`
    }

    const filterByDay = (dayId) => {
      selectedDay.value = dayId
    }

    const selectEvent = (event) => {
      selectedEvent.value = event
      selectedEventId.value = event.id
      
      if (activeView.value === 'map') {
        // En vista de mapa, mostramos el panel lateral
        selectedEvent.value = event
      } else {
        // En otras vistas, mostramos modal
        showEventModal.value = true
      }
    }

    const navigateToEvent = (event) => {
      // Navegar a LiveNavigationPage con las coordenadas del evento
      router.push({
        name: 'LiveNavigation',
        query: {
          destination: event.location,
          destX: event.mapX,
          destY: event.mapY
        }
      })
    }

    const addToCalendar = (event) => {
      // Lógica para agregar a calendario
      alert(`Evento "${event.title}" agregado a tu calendario`)
    }

    const getEventColor = (type) => {
      const colors = {
        conferencia: '#4a90e2',
        taller: '#50c878',
        presentacion: '#ff6b6b',
        reunion: '#ffa500'
      }
      return colors[type] || '#9b59b6'
    }

    const prevMonth = () => {
      if (currentMonth.value === 0) {
        currentMonth.value = 11
        currentYear.value--
      } else {
        currentMonth.value--
      }
    }

    const nextMonth = () => {
      if (currentMonth.value === 11) {
        currentMonth.value = 0
        currentYear.value++
      } else {
        currentMonth.value++
      }
    }

    const selectCalendarDay = (day) => {
      if (day.hasEvents) {
        const dayEvents = events.value.filter(event => event.date === day.date)
        if (dayEvents.length > 0) {
          selectEvent(dayEvents[0])
        }
      }
    }

    // Inicialización
    onMounted(() => {
      const now = new Date()
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
      currentDate.value = now.toLocaleDateString('es-ES', options)
    })

    return {
      activeView,
      selectedDay,
      selectedEvent,
      selectedEventId,
      showEventModal,
      currentDate,
      events,
      days,
      filteredEvents,
      eventsWithCoordinates,
      calendarDays,
      currentMonthYear,
      formatTime,
      filterByDay,
      selectEvent,
      navigateToEvent,
      addToCalendar,
      getEventColor,
      prevMonth,
      nextMonth,
      selectCalendarDay
    }
  }
}
</script>

<style scoped>
.event-schedule-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}

.tese-header {
  background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
  color: white;
  padding: 20px;
  border-radius: 15px;
  margin-bottom: 25px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 10px;
}

.logo {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: white;
  padding: 5px;
}

.header-content h1 {
  margin: 0;
  font-size: 2em;
  font-weight: 600;
}

.subtitle {
  margin: 0;
  opacity: 0.9;
  font-size: 1.1em;
}

.date-display {
  text-align: center;
  font-size: 1.2em;
  font-weight: 500;
  margin-top: 10px;
}

.view-selector {
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
  justify-content: center;
}

.view-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 25px;
  background: white;
  color: #333;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.view-btn.active {
  background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(26, 35, 126, 0.3);
}

.view-btn:hover:not(.active) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Vista de Lista */
.list-view {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.time-filter {
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
  overflow-x: auto;
  padding: 5px;
}

.day-btn {
  padding: 10px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 20px;
  background: white;
  color: #666;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.day-btn.active {
  background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
  color: white;
  border-color: #1a237e;
}

.day-btn:hover:not(.active) {
  border-color: #1a237e;
  color: #1a237e;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.event-card {
  display: flex;
  align-items: center;
  padding: 20px;
  background: #f8f9ff;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 4px solid #4a90e2;
  position: relative;
}

.event-card:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 15px rgba(74, 144, 226, 0.2);
  background: white;
}

.event-time {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
  padding-right: 20px;
  border-right: 2px solid #e0e0e0;
}

.time {
  font-size: 1.4em;
  font-weight: 600;
  color: #1a237e;
}

.duration {
  font-size: 0.9em;
  color: #666;
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 10px;
  margin-top: 5px;
}

.event-details {
  flex: 1;
  padding: 0 20px;
}

.event-title {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 1.2em;
}

.event-location {
  margin: 5px 0;
  color: #666;
  font-size: 0.95em;
  display: flex;
  align-items: center;
  gap: 5px;
}

.event-tags {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.tag {
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.85em;
  font-weight: 500;
  text-transform: uppercase;
}

.tag.conferencia { background: #e3f2fd; color: #1976d2; }
.tag.taller { background: #e8f5e9; color: #388e3c; }
.tag.presentacion { background: #ffebee; color: #d32f2f; }
.tag.reunion { background: #fff3e0; color: #f57c00; }

.speaker-tag {
  padding: 4px 12px;
  border-radius: 15px;
  background: #f3e5f5;
  color: #7b1fa2;
  font-size: 0.85em;
  display: flex;
  align-items: center;
  gap: 5px;
}

.navigate-btn {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.navigate-btn:hover {
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 4px 15px rgba(26, 35, 126, 0.4);
}

/* Vista de Mapa */
.map-view {
  position: relative;
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  min-height: 600px;
}

.map-container {
  width: 100%;
  padding: 20px;
  background: #f8f9ff;
}

.campus-map {
  width: 100%;
  height: auto;
  max-height: 500px;
  border-radius: 10px;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.event-marker {
  cursor: pointer;
  transition: all 0.3s ease;
  stroke: white;
  stroke-width: 2;
}

.event-marker:hover {
  transform: scale(1.2);
  filter: brightness(1.2);
}

.event-marker.selected {
  transform: scale(1.3);
  stroke-width: 3;
  stroke: #ffd700;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1.3); }
  50% { transform: scale(1.4); }
  100% { transform: scale(1.3); }
}

.event-info-panel {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 350px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.panel-header {
  background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-header h3 {
  margin: 0;
  font-size: 1.2em;
  font-weight: 600;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.panel-content {
  padding: 20px;
}

.info-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 15px;
  color: #333;
}

.info-row i {
  color: #1a237e;
  margin-top: 2px;
  min-width: 20px;
}

.panel-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.action-btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.action-btn.primary {
  background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
  color: white;
}

.action-btn.secondary {
  background: #f0f0f0;
  color: #333;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Vista de Calendario */
.calendar-view {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.calendar-header h3 {
  margin: 0;
  color: #1a237e;
  font-size: 1.4em;
}

.nav-btn {
  background: #f0f0f0;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-btn:hover {
  background: #1a237e;
  color: white;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.calendar-day {
  padding: 15px 5px;
  text-align: center;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 80px;
  position: relative;
}

.calendar-day:first-child {
  color: #d32f2f;
}

.calendar-day.current-month {
  background: #f8f9ff;
}

.calendar-day.current-month:hover {
  background: #e3e8ff;
  transform: translateY(-2px);
}

.calendar-day.has-events {
  border: 2px solid #4a90e2;
}

.calendar-day.today {
  background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
  color: white;
}

.day-number {
  font-size: 1.2em;
  font-weight: 600;
  margin-bottom: 5px;
}

.events-indicator {
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.event-dot {
  width: 6px;
  height: 6px;
  background: #ff6b6b;
  border-radius: 50%;
}

.events-count {
  font-size: 0.8em;
  font-weight: 500;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 15px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }
  
  .view-selector {
    flex-wrap: wrap;
  }
  
  .event-card {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .event-time {
    flex-direction: row;
    gap: 15px;
    border-right: none;
    border-bottom: 2px solid #e0e0e0;
    padding-right: 0;
    padding-bottom: 10px;
    margin-bottom: 10px;
    width: 100%;
  }
  
  .event-info-panel {
    position: relative;
    width: 100%;
    top: 0;
    right: 0;
    margin-top: 20px;
  }
  
  .calendar-grid {
    grid-template-columns: repeat(7, 1fr);
    font-size: 0.9em;
  }
  
  .calendar-day {
    min-height: 60px;
    padding: 10px 2px;
  }
}
</style>