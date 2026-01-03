<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>🗺️ Navegación en Vivo - TESE</IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent class="live-navigation-content">
      <!-- Header de navegación -->
      <div class="nav-header">
        <div class="destination-info">
          <h2>📍 Hacia: {{ destination }}</h2>
          <p class="eta">⏱️ ETA: {{ eta }}</p>
        </div>
        
        <div class="nav-stats">
          <div class="stat">
            <span class="stat-value">{{ distance }}</span>
            <span class="stat-label">Distancia</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ timeRemaining }}</span>
            <span class="stat-label">Tiempo</span>
          </div>
        </div>
      </div>

      <!-- Mapa REAL con OpenStreetMap -->
      <div class="map-container">
        <div ref="mapContainer" class="real-map"></div>
      </div>

      <!-- Instrucciones paso a paso -->
      <div class="instructions-container">
        <h3>📝 Instrucciones de Navegación</h3>
        <div class="instructions-list">
          <div v-for="(step, index) in instructions" 
               :key="index" 
               class="instruction-step"
               :class="{ active: step.active }">
            <span class="step-number">{{ index + 1 }}</span>
            <div class="step-content">
              <p class="step-text">{{ step.text }}</p>
              <p class="step-distance">{{ step.distance }}</p>
            </div>
            <span v-if="step.active" class="current-indicator">▶</span>
          </div>
        </div>
      </div>

      <!-- Controles de navegación -->
      <div class="nav-controls">
        <button class="control-btn pause-btn" @click="togglePause">
          {{ isPaused ? '▶ Reanudar' : '⏸️ Pausar' }}
        </button>
        <button class="control-btn end-btn" @click="endNavigation">
          🏁 Finalizar
        </button>
        <button class="control-btn sim-btn" @click="startSimulation" v-if="!isSimulating">
          🚶 Simular Recorrido
        </button>
        <button class="control-btn reset-btn" @click="resetSimulation" v-if="isSimulating">
          🔄 Reiniciar
        </button>
      </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent 
} from '@ionic/vue'
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const route = useRoute()
const router = useRouter()

// Estado de navegación
const destination = ref(route.query.destination || 'Auditorio de Usos Múltiples TESE')
const eta = ref('10 min')
const distance = ref('520 m')
const timeRemaining = ref('9:30')
const isPaused = ref(false)
const isSimulating = ref(false)
const hasShownArrival = ref(false)

// Referencias para el mapa
const mapContainer = ref<HTMLElement | null>(null)
const map = ref<any>(null)
const userMarker = ref<any>(null)
const startMarker = ref<any>(null) // Marcador de inicio FIJO
const destinationMarker = ref<any>(null)
const routeLine = ref<any>(null)
let simulationInterval: NodeJS.Timeout | null = null
const mapRemoved = ref(false)

// Instrucciones de navegación
const instructions = ref([
  { text: 'Salir de la entrada principal', distance: '0 m', active: true },
  { text: 'Tomar el camino principal a la derecha', distance: '80 m', active: false },
  { text: 'Pasar frente a Ingeniería en Informática', distance: '120 m', active: false },
  { text: 'Continuar recto por el corredor central', distance: '150 m', active: false },
  { text: 'Girar a la izquierda en el cruce', distance: '50 m', active: false },
  { text: 'Llegar al Auditorio de Usos Múltiples', distance: '120 m', active: false },
  { text: '🎉 ¡Has llegado a tu destino!', distance: '0 m', active: false }
])

// COORDENADAS REALES DEL TESE - Ruta realista con más puntos
const demoRoute: [number, number][] = [
  [19.512827, -99.042910], // 1. Entrada Principal (INICIO FIJO)
  [19.512815, -99.042880], // Camino suave 1
  [19.512800, -99.042850], // Curva 1
  [19.512780, -99.042820], // Camino 2
  [19.512760, -99.042790], // Curva 2
  [19.512740, -99.042760], // Recta 1
  [19.512720, -99.042730], // Curva 3
  [19.512700, -99.042700], // Recta 2
  [19.512680, -99.042670], // Aproximación 1
  [19.512660, -99.042640], // Aproximación 2
  [19.512640, -99.042610], // Cerca destino
  [19.512620, -99.042580], // Última curva
  [19.512600, -99.042550], // Recta final
  [19.512580, -99.042520], // Acercamiento
  [19.512560, -99.042490], // Casi llegando
  [19.512540, -99.042460], // Preparación entrada
  [19.512520, -99.042430], // Entrada edificio
  [19.512500, -99.042400], // Pasillo interior
  [19.512480, -99.042370], // Subida escaleras
  [19.512460, -99.042340], // Segundo piso
  [19.512440, -99.042310], // Pasillo interior 2
  [19.512420, -99.042280], // Cerca auditorio
  [19.512400, -99.042250], // Último tramo
  [19.512380, -99.042220], // Frente auditorio
  [19.512360, -99.042190], // Puerta auditorio
  [19.512340, -99.042160], // Interior auditorio
  [19.512320, -99.042130], // Asientos
  [19.512300, -99.042100], // Frente escenario
  [19.512280, -99.042070], // Escenario
  [19.512260, -99.042040], // Punto específico
  [19.512240, -99.042010], // Destino exacto
  [19.512220, -99.041980], // Ajuste final
  [19.512200, -99.041950], // Posición final
  [19.512180, -99.041920], // Ajuste
  [19.512159, -99.041705]  // Auditorio (DESTINO)
]

// Métodos de navegación
const togglePause = () => {
  isPaused.value = !isPaused.value
  console.log(isPaused.value ? '⏸️ Navegación pausada' : '▶ Navegación reanudada')
}

const endNavigation = () => {
  if (confirm('¿Finalizar navegación y regresar al inicio?')) {
    resetSimulation()
    router.push({ name: 'Home' })
  }
}

const resetSimulation = () => {
  // Detener simulación
  if (simulationInterval) {
    clearInterval(simulationInterval)
    simulationInterval = null
  }
  
  // Resetear estado
  isSimulating.value = false
  isPaused.value = false
  hasShownArrival.value = false
  
  // Resetear instrucciones
  instructions.value.forEach((inst, idx) => {
    inst.active = idx === 0
  })
  
  // Resetear estadísticas
  distance.value = '520 m'
  timeRemaining.value = '9:30'
  eta.value = '10 min'
  
  // Restaurar marcador de usuario al inicio
  if (userMarker.value && demoRoute.length > 0 && map.value && !mapRemoved.value) {
    try {
      userMarker.value.setLatLng(demoRoute[0])
      // Centrar en punto medio entre inicio y destino para ver toda la ruta
      const midPoint: [number, number] = [
        (demoRoute[0][0] + demoRoute[demoRoute.length - 1][0]) / 2,
        (demoRoute[0][1] + demoRoute[demoRoute.length - 1][1]) / 2
      ]
      map.value.setView(midPoint, 17, { animate: false })
    } catch (error) {
      console.warn('⚠️ Error al resetear posición:', error)
    }
  }
  
  console.log('🔄 Simulación reiniciada')
}

// Inicializar mapa con coordenadas reales TESE
const initMap = () => {
  if (!mapContainer.value) {
    console.error('❌ Contenedor del mapa no encontrado')
    return
  }
  
  try {
    // Coordenadas centrales del TESE
    const teseCenter: [number, number] = [19.5125, -99.0425]
    
    // Crear mapa centrado en TESE
    map.value = L.map(mapContainer.value).setView(teseCenter, 17)
    
    // Agregar capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | TESE GO APP',
      maxZoom: 20,
      minZoom: 15
    }).addTo(map.value)
    
    // Agregar escala
    L.control.scale({
      imperial: false,
      metric: true,
      position: 'bottomleft',
      maxWidth: 150
    }).addTo(map.value)
    
    // Iconos personalizados
    const userIcon = L.divIcon({
      className: 'custom-user-icon',
      html: '<div class="user-marker" title="Tu posición actual">📍</div>',
      iconSize: [45, 45],
      iconAnchor: [22, 45]
    })
    
    const startIcon = L.divIcon({
      className: 'custom-start-icon',
      html: '<div class="start-marker" title="Punto de inicio">🟢</div>',
      iconSize: [35, 35],
      iconAnchor: [17, 35]
    })
    
    const destinationIcon = L.divIcon({
      className: 'custom-dest-icon',
      html: `<div class="dest-marker" title="${destination.value}">🎯</div>`,
      iconSize: [45, 45],
      iconAnchor: [22, 45]
    })
    
    // Posiciones iniciales
    const userStartPos: [number, number] = demoRoute[0]
    const destinationPos: [number, number] = demoRoute[demoRoute.length - 1]
    
    // Agregar marcador de INICIO FIJO (verde)
    startMarker.value = L.marker(userStartPos, { icon: startIcon })
      .addTo(map.value)
      .bindPopup('<b>🟢 Punto de inicio</b><br>Entrada Principal TESE')
    
    // Agregar marcador de USUARIO (se mueve durante simulación)
    userMarker.value = L.marker(userStartPos, { icon: userIcon })
      .addTo(map.value)
      .bindPopup('<b>📍 Tu posición actual</b>')
    
    // Agregar marcador de DESTINO
    destinationMarker.value = L.marker(destinationPos, { icon: destinationIcon })
      .addTo(map.value)
      .bindPopup(`<b>🎯 Destino</b><br>${destination.value}<br><small>Auditorio de Usos Múltiples</small>`)
    
    // Dibujar línea de ruta
    routeLine.value = L.polyline(demoRoute, {
      color: '#2E7D32', // Verde TESE
      weight: 5,
      opacity: 0.7,
      lineCap: 'round',
      dashArray: '10, 10'
    }).addTo(map.value)
    
    // Agregar puntos de referencia importantes
    const importantBuildings = [
      { coords: [19.512751, -99.042271], name: 'Ing. Sistemas Computacionales' },
      { coords: [19.512483, -99.042778], name: 'CCAI' },
      { coords: [19.512199, -99.042273], name: 'Ing. Industrial y Mecánica' },
      { coords: [19.511896, -99.042979], name: 'Edificio S' },
      { coords: [19.511557, -99.042429], name: 'Edificio J' },
      { coords: [19.511274, -99.042410], name: 'División Contaduría' }
    ]
    
    importantBuildings.forEach((building, index) => {
      L.circleMarker(building.coords as [number, number], {
        radius: 7,
        fillColor: '#8E0000', // Rojo TESE
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
      })
      .addTo(map.value)
      .bindPopup(`<b>🏛️ ${building.name}</b><br><small>Punto de referencia ${index + 1}</small>`)
    })
    
    // Ajustar vista para mostrar TODA la ruta con buen margen
    if (routeLine.value) {
      const bounds = routeLine.value.getBounds()
      map.value.fitBounds(bounds.pad(0.25), {
        animate: false, // Sin animación para evitar error
        padding: [40, 40],
        maxZoom: 18
      })
    }
    
    console.log('🗺️ Mapa TESE inicializado correctamente')
    
  } catch (error) {
    console.error('❌ Error al inicializar mapa:', error)
  }
}

// Actualizar posición del usuario SIN ANIMACIÓN
const updateUserPosition = (lat: number, lng: number) => {
  if (!userMarker.value || !map.value || mapRemoved.value) return
  
  try {
    // Solo actualizar posición del marcador (NO centrar mapa automáticamente)
    userMarker.value.setLatLng([lat, lng])
    
    // Opcional: ajustar vista suavemente cada 5 pasos
    if (map.value && !isPaused.value) {
      // Solo ajustar ocasionalmente para mejor rendimiento
      const currentZoom = map.value.getZoom()
      map.value.setView([lat, lng], currentZoom, {
        animate: false, // IMPORTANTE: false para evitar errores
        duration: 0,
        easeLinearity: 0
      })
    }
  } catch (error) {
    console.warn('⚠️ Error al actualizar posición:', error)
  }
}

// Simulación de movimiento
const startSimulation = () => {
  if (isSimulating.value) return
  
  resetSimulation() // Limpiar estado previo
  isSimulating.value = true
  hasShownArrival.value = false
  
  let step = 0
  const totalSteps = demoRoute.length
  const totalInstructions = instructions.value.length
  
  // Calcular pasos por instrucción
  const stepsPerInstruction = Math.max(1, Math.floor(totalSteps / (totalInstructions - 1)))
  
  simulationInterval = setInterval(() => {
    // Verificar si está pausado
    if (isPaused.value) return
    
    // Verificar si llegamos al final
    if (step >= totalSteps) {
      if (simulationInterval) {
        clearInterval(simulationInterval)
        simulationInterval = null
      }
      
      // Activar última instrucción
      instructions.value.forEach(inst => inst.active = false)
      instructions.value[totalInstructions - 1].active = true
      
      // Ajustar vista para mostrar TODA la ruta al final
      if (map.value && routeLine.value && !mapRemoved.value) {
        setTimeout(() => {
          try {
            map.value.fitBounds(routeLine.value.getBounds().pad(0.2), {
              animate: false,
              padding: [50, 50],
              maxZoom: 17
            })
          } catch (error) {
            console.warn('⚠️ Error al ajustar vista final:', error)
          }
        }, 500)
      }
      
      // Mostrar mensaje de llegada solo una vez
      if (!hasShownArrival.value) {
        setTimeout(() => {
          alert('🎉 ¡Has llegado a tu destino!\n\nAuditorio de Usos Múltiples TESE')
          hasShownArrival.value = true
        }, 1000)
      }
      
      isSimulating.value = false
      return
    }
    
    // Actualizar posición en el mapa
    updateUserPosition(demoRoute[step][0], demoRoute[step][1])
    
    // Actualizar instrucciones paso a paso
    const currentInstruction = Math.min(
      Math.floor(step / stepsPerInstruction),
      totalInstructions - 2
    )
    
    instructions.value.forEach((inst, idx) => {
      inst.active = idx === currentInstruction
    })
    
    // Actualizar estadísticas realistas
    const remainingSteps = totalSteps - step - 1
    const remainingMeters = Math.max(0, remainingSteps * 15) // ~15m por paso (más realista)
    distance.value = `${remainingMeters} m`
    
    const remainingMinutes = Math.max(0, Math.floor(remainingSteps / 2))
    const remainingSeconds = Math.max(0, (remainingSteps % 2) * 30)
    timeRemaining.value = `${remainingMinutes}:${remainingSeconds.toString().padStart(2, '0')}`
    
    eta.value = `${Math.ceil(remainingSteps / 3)} min`
    
    step++
    
  }, 1800) // Cada 1.8 segundos (ritmo más natural)
}

// Intervalo de actualización general
let updateInterval: NodeJS.Timeout | null = null
//aqui esta el nuevo codigo
// ELIMINA el onBeforeUnmount completo y usa SOLO este onUnmounted:

onUnmounted(() => {
  // 1. Marcar como removido
  mapRemoved.value = true
  
  // 2. Detener intervalos
  if (updateInterval) {
    clearInterval(updateInterval)
    updateInterval = null
  }
  
  if (simulationInterval) {
    clearInterval(simulationInterval)
    simulationInterval = null
  }
  
  // 3. Limpiar mapa SIN animaciones
  if (map.value) {
    try {
      // Forzar detención de animaciones
      map.value.stop()
      
      // Remover manualmente el contenedor
      const container = map.value.getContainer()
      if (container && container.parentNode) {
        container.parentNode.removeChild(container)
      }
      
      // Limpiar referencia
      map.value = null
    } catch (error) {
      console.warn('⚠️ Limpieza segura de mapa:', error)
    }
  }
  
  console.log('🧹 Componente desmontado correctamente')
})
onMounted(() => {
  console.log('🚀 LiveNavigation TESE iniciada para:', destination.value)
  
  nextTick(() => {
    initMap()
    
    setTimeout(() => {
      if (map.value && !mapRemoved.value) {
        map.value.invalidateSize()
      }
    }, 500)
  })
  
  updateInterval = setInterval(() => {
    if (!isPaused.value && isSimulating.value) {
      // Lógica de GPS en producción
    }
  }, 10000)
})

onUnmounted(() => {
  // Detener primero
  mapRemoved.value = true
  
  if (updateInterval) {
    clearInterval(updateInterval)
    updateInterval = null
  }
  
  if (simulationInterval) {
    clearInterval(simulationInterval)
    simulationInterval = null
  }
  
  // Limpiar mapa SIN animaciones
  if (map.value && map.value._container) {
    try {
      // Eliminar contenedor directamente
      const container = map.value._container
      if (container && container.parentNode) {
        container.parentNode.removeChild(container)
      }
      map.value = null
    } catch (error) {
      console.warn('⚠️ Limpieza segura de mapa:', error)
    }
  }
  
  console.log('🧹 Componente desmontado correctamente')
})
</script>

<style scoped>
.live-navigation-content {
  --background: #f8f9fa;
  --color: #333;
}

/* Header de navegación */
.nav-header {
  background: linear-gradient(135deg, #4a6fa5 0%, #2e4a7a 100%);
  color: white;
  padding: 20px;
  border-radius: 0 0 20px 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.destination-info h2 {
  margin: 0 0 8px 0;
  font-size: 1.4rem;
}

.eta {
  margin: 0;
  opacity: 0.9;
  font-size: 0.95rem;
}

.nav-stats {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.8rem;
  font-weight: bold;
}

.stat-label {
  display: block;
  font-size: 0.85rem;
  opacity: 0.8;
  margin-top: 4px;
}

/* Contenedor del mapa */
.map-container {
  margin: 20px;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  height: 350px;
  position: relative;
  background: #e0f7fa;
}

/* Mapa real de Leaflet */
.real-map {
  width: 100%;
  height: 100%;
  z-index: 1;
}

/* Estilos para los marcadores personalizados de Leaflet */
:deep(.leaflet-div-icon) {
  background: transparent !important;
  border: none !important;
}

:deep(.user-marker) {
  font-size: 36px;
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.4));
  animation: float 3s ease-in-out infinite;
}

:deep(.start-marker) {
  font-size: 28px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  opacity: 0.9;
}

:deep(.dest-marker) {
  font-size: 36px;
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.4));
  animation: pulse 2s infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-4px) rotate(5deg); }
  75% { transform: translateY(-4px) rotate(-5deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.1); }
}

/* Mejorar visibilidad de capas */
:deep(.leaflet-pane) {
  z-index: 300 !important;
}

:deep(.leaflet-overlay-pane) {
  z-index: 400 !important;
}

:deep(.leaflet-marker-pane) {
  z-index: 600 !important;
}

/* Estilos para controles de Leaflet */
:deep(.leaflet-control-zoom) {
  border: none !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
  border-radius: 8px !important;
  overflow: hidden;
}

:deep(.leaflet-control-zoom a) {
  background: white !important;
  color: #333 !important;
  border-bottom: 1px solid #eee !important;
  width: 36px !important;
  height: 36px !important;
  line-height: 36px !important;
  font-size: 18px !important;
}

:deep(.leaflet-control-zoom a:hover) {
  background: #f5f5f5 !important;
}

:deep(.leaflet-control-scale-line) {
  background: rgba(255, 255, 255, 0.9) !important;
  border: 2px solid #777 !important;
  border-top: none !important;
  color: #333 !important;
  font-size: 11px !important;
  padding: 2px 5px !important;
}

/* Instrucciones */
.instructions-container {
  background: white;
  margin: 0 20px 20px;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.instructions-container h3 {
  margin: 0 0 18px 0;
  color: #2c3e50;
  font-size: 1.2rem;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
}

.instructions-list {
  max-height: 250px;
  overflow-y: auto;
  padding-right: 5px;
}

.instruction-step {
  display: flex;
  align-items: center;
  padding: 14px;
  border-radius: 12px;
  margin-bottom: 12px;
  background: #f8f9fa;
  border-left: 5px solid #ddd;
  transition: all 0.3s ease;
}

.instruction-step:hover {
  background: #edf2f7;
  transform: translateX(3px);
}

.instruction-step.active {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-left-color: #2196F3;
  transform: translateX(5px);
  box-shadow: 0 3px 10px rgba(33, 150, 243, 0.2);
}

.step-number {
  background: #607d8b;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  font-weight: bold;
  margin-right: 15px;
  flex-shrink: 0;
}

.instruction-step.active .step-number {
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
  box-shadow: 0 3px 8px rgba(33, 150, 243, 0.4);
}

.step-content {
  flex: 1;
}

.step-text {
  margin: 0 0 6px 0;
  font-weight: 600;
  color: #2c3e50;
  font-size: 1rem;
}

.step-distance {
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.7;
  color: #5d6d7e;
}

.current-indicator {
  color: #2196F3;
  font-size: 1.4rem;
  margin-left: 10px;
  animation: bounce 1.5s infinite;
  flex-shrink: 0;
}

@keyframes bounce {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(3px); }
}

/* Controles de navegación */
.nav-controls {
  display: flex;
  gap: 12px;
  padding: 0 20px 25px;
  flex-wrap: wrap;
}

.control-btn {
  flex: 1;
  min-width: 140px;
  padding: 16px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.control-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.control-btn:active {
  transform: translateY(-1px);
}

.pause-btn {
  background: linear-gradient(135deg, #FFC107 0%, #FFA000 100%);
  color: #333;
}

.pause-btn:hover {
  background: linear-gradient(135deg, #FFB300 0%, #FF8F00 100%);
}

.end-btn {
  background: linear-gradient(135deg, #F44336 0%, #D32F2F 100%);
  color: white;
}

.end-btn:hover {
  background: linear-gradient(135deg, #E53935 0%, #C62828 100%);
}

.sim-btn {
  background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%);
  color: white;
}

.sim-btn:hover {
  background: linear-gradient(135deg, #43A047 0%, #2E7D32 100%);
}

.reset-btn {
  background: linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%);
  color: white;
}

.reset-btn:hover {
  background: linear-gradient(135deg, #8E24AA 0%, #6A1B9A 100%);
}

/* Responsive */
@media (max-width: 768px) {
  .nav-stats {
    flex-direction: column;
    gap: 15px;
  }
  
  .map-container {
    height: 300px;
    margin: 15px;
  }
  
  .instructions-container {
    margin: 0 15px 15px;
    padding: 15px;
  }
  
  .nav-controls {
    flex-direction: column;
  }
  
  .control-btn {
    min-width: 100%;
  }
}

@media (max-width: 480px) {
  .destination-info h2 {
    font-size: 1.2rem;
  }
  
  .stat-value {
    font-size: 1.5rem;
  }
  
  .map-container {
    height: 250px;
    margin: 10px;
  }
  
  .control-btn {
    padding: 14px;
    font-size: 0.95rem;
  }
}
</style>