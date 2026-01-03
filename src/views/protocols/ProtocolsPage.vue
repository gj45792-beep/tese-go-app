<template>
  <div class="protocols-page" style="overflow-y: auto; height: 100vh;">
    <!-- Header -->
    <div class="tese-header">
      <div class="header-content">
        <img src="@/assets/images/logo-tese.jpg" alt="TESE Logo" class="logo" />
        <div class="header-text">
          <h1>Protocolos de Titulación</h1>
          <p class="subtitle">Maestría en Tecnologías de la Información</p>
        </div>
      </div>
    </div>

    <!-- Search and Filter -->
    <div class="controls-section">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Buscar protocolo o palabra clave..."
          class="search-input"
        />
      </div>
      
      <div class="filter-buttons">
        <button 
          v-for="filter in filters"
          :key="filter.id"
          @click="toggleFilter(filter.id)"
          :class="{ active: activeFilters.includes(filter.id) }"
          class="filter-btn"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <!-- Progress Tracker -->
    <div class="progress-tracker">
      <h3>Progreso de Titulación</h3>
      <div class="progress-steps">
        <div 
          v-for="step in progressSteps"
          :key="step.id"
          :class="['progress-step', { active: step.active, completed: step.completed }]"
        >
          <div class="step-icon">
            <i :class="step.icon"></i>
          </div>
          <div class="step-info">
            <span class="step-title">{{ step.title }}</span>
            <span class="step-status">{{ step.status }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Protocols Grid -->
    <div class="protocols-grid">
      <div 
        v-for="protocol in filteredProtocols"
        :key="protocol.id"
        :class="['protocol-card', protocol.status]"
      >
        <div class="protocol-header">
          <span class="protocol-code">{{ protocol.code }}</span>
          <span class="protocol-status-badge" :class="protocol.status">
            {{ getStatusText(protocol.status) }}
          </span>
        </div>
        
        <div class="protocol-content">
          <h3 class="protocol-title">{{ protocol.title }}</h3>
          <p class="protocol-description">{{ protocol.description }}</p>
          
          <div class="protocol-meta">
            <div class="meta-item">
              <i class="fas fa-user"></i>
              <span>{{ protocol.responsible }}</span>
            </div>
            <div class="meta-item">
              <i class="fas fa-calendar"></i>
              <span>{{ protocol.dueDate }}</span>
            </div>
            <div class="meta-item">
              <i class="fas fa-file-pdf"></i>
              <span>{{ protocol.documents }} documentos</span>
            </div>
          </div>
        </div>
        
        <div class="protocol-actions">
          <button 
            @click="viewProtocol(protocol)"
            class="action-btn primary"
          >
            <i class="fas fa-eye"></i> Ver Detalles
          </button>
          <button 
            v-if="protocol.status === 'pending'"
            @click="startProtocol(protocol)"
            class="action-btn secondary"
          >
            <i class="fas fa-play"></i> Iniciar
          </button>
          <button 
            v-if="protocol.status === 'in-progress'"
            @click="submitProtocol(protocol)"
            class="action-btn success"
          >
            <i class="fas fa-paper-plane"></i> Enviar
          </button>
          <button 
            v-if="protocol.status === 'approved'"
            @click="downloadProtocol(protocol)"
            class="action-btn download"
          >
            <i class="fas fa-download"></i> Descargar
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <h3>Acciones Rápidas</h3>
      <div class="actions-grid">
        <button @click="openDocumentTemplate" class="quick-action-btn">
          <i class="fas fa-file-alt"></i>
          <span>Plantilla de Tesis</span>
        </button>
        <button @click="openFormatGuide" class="quick-action-btn">
          <i class="fas fa-book"></i>
          <span>Guía de Formato</span>
        </button>
        <button @click="openCalendar" class="quick-action-btn">
          <i class="fas fa-calendar-alt"></i>
          <span>Calendario de Defensas</span>
        </button>
        <button @click="contactAdvisor" class="quick-action-btn">
          <i class="fas fa-comments"></i>
          <span>Contactar Asesor</span>
        </button>
      </div>
    </div>

    <!-- Important Dates -->
    <div class="important-dates">
      <h3>Fechas Importantes</h3>
      <div class="dates-list">
        <div 
          v-for="date in importantDates"
          :key="date.id"
          :class="['date-item', { upcoming: date.upcoming }]"
        >
          <div class="date-icon">
            <i :class="date.icon"></i>
          </div>
          <div class="date-info">
            <span class="date-title">{{ date.title }}</span>
            <span class="date">{{ date.date }}</span>
          </div>
          <div class="date-reminder">
            <button v-if="date.upcoming" @click="setReminder(date)" class="reminder-btn">
              <i class="fas fa-bell"></i> Recordar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Protocol Detail Modal -->
    <div v-if="selectedProtocol" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <ProtocolDetail 
          :protocol="selectedProtocol"
          @close="closeModal"
          @action="handleProtocolAction"
        />
      </div>
    </div>
  </div>
</template>

<script>
// TU SCRIPT VA AQUÍ (el que ya me mostraste)
import { ref, computed, onMounted } from 'vue'
import ProtocolDetail from '@/components/protocols/ProtocolDetail.vue'

export default {
  name: 'ProtocolsPage',
  components: {
    ProtocolDetail
  },
  setup() {
    const searchQuery = ref('')
    const activeFilters = ref(['all'])
    const selectedProtocol = ref(null)

    const filters = [
      { id: 'all', label: 'Todos' },
      { id: 'pending', label: 'Pendientes' },
      { id: 'in-progress', label: 'En Proceso' },
      { id: 'approved', label: 'Aprobados' },
      { id: 'rejected', label: 'Rechazados' }
    ]

    const progressSteps = ref([
      {
        id: 1,
        title: 'Propuesta de Tema',
        icon: 'fas fa-lightbulb',
        status: 'Completado',
        active: false,
        completed: true
      },
      {
        id: 2,
        title: 'Protocolo de Investigación',
        icon: 'fas fa-clipboard-list',
        status: 'En Proceso',
        active: true,
        completed: false
      },
      {
        id: 3,
        title: 'Desarrollo de Tesis',
        icon: 'fas fa-code',
        status: 'Pendiente',
        active: false,
        completed: false
      },
      {
        id: 4,
        title: 'Revisión de Asesor',
        icon: 'fas fa-user-check',
        status: 'Pendiente',
        active: false,
        completed: false
      },
      {
        id: 5,
        title: 'Defensa Final',
        icon: 'fas fa-graduation-cap',
        status: 'Pendiente',
        active: false,
        completed: false
      }
    ])

    const protocols = ref([
      {
        id: 1,
        code: 'PROT-MTI-2024-001',
        title: 'Protocolo de Investigación - Propuesta Inicial',
        description: 'Documento inicial que describe el problema de investigación, objetivos, metodología y alcance del proyecto de tesis.',
        responsible: 'Dr. Juan Pérez',
        dueDate: '15 Ene 2024',
        documents: 3,
        status: 'in-progress',
        requirements: [
          'Formato oficial TESE',
          'Carta de aceptación del director',
          'Anteproyecto completo'
        ],
        progress: 65
      },
      {
        id: 2,
        code: 'PROT-MTI-2024-002',
        title: 'Carta de Aceptación del Director',
        description: 'Documento formal donde el director de tesis acepta supervisar el proyecto de investigación.',
        responsible: 'Dra. Ana García',
        dueDate: '20 Ene 2024',
        documents: 1,
        status: 'pending',
        requirements: [
          'Firma del director',
          'Sello institucional'
        ],
        progress: 0
      },
      {
        id: 3,
        code: 'PROT-MTI-2024-003',
        title: 'Formato de Inscripción al SIN',
        description: 'Formulario para inscripción del proyecto en el Sistema Institucional de Investigación.',
        responsible: 'Depto. Investigación',
        dueDate: '25 Ene 2024',
        documents: 2,
        status: 'pending',
        requirements: [
          'Datos completos del proyecto',
          'Firma del director'
        ],
        progress: 0
      },
      {
        id: 4,
        code: 'PROT-MTI-2024-004',
        title: 'Avance de Capítulos 1-3',
        description: 'Primeros tres capítulos de la tesis: Introducción, Marco Teórico y Metodología.',
        responsible: 'Dr. Carlos López',
        dueDate: '10 Feb 2024',
        documents: 1,
        status: 'pending',
        requirements: [
          'Formato APA 7ma edición',
          'Mínimo 40 páginas'
        ],
        progress: 0
      },
      {
        id: 5,
        code: 'PROT-MTI-2023-015',
        title: 'Acta de Examen de Grado',
        description: 'Documento oficial que registra los resultados del examen de grado.',
        responsible: 'Coordinación Académica',
        dueDate: '15 Dic 2023',
        documents: 1,
        status: 'approved',
        requirements: [],
        progress: 100
      },
      {
        id: 6,
        code: 'PROT-MTI-2023-012',
        title: 'Solicitud de Defensa',
        description: 'Formulario para solicitar fecha y tribunal para la defensa de tesis.',
        responsible: 'Secretaría Académica',
        dueDate: '01 Dic 2023',
        documents: 3,
        status: 'approved',
        requirements: [],
        progress: 100
      }
    ])

    const importantDates = ref([
      {
        id: 1,
        title: 'Entrega Protocolo Final',
        date: '31 Enero 2024',
        icon: 'fas fa-file-upload',
        upcoming: true
      },
      {
        id: 2,
        title: 'Revisión de Asesores',
        date: '15 Febrero 2024',
        icon: 'fas fa-user-check',
        upcoming: true
      },
      {
        id: 3,
        title: 'Inscripción SIN',
        date: '28 Febrero 2024',
        icon: 'fas fa-clipboard-check',
        upcoming: true
      },
      {
        id: 4,
        title: 'Entrega Tesis Completa',
        date: '30 Abril 2024',
        icon: 'fas fa-book',
        upcoming: false
      },
      {
        id: 5,
        title: 'Periodo de Defensas',
        date: '15-30 Mayo 2024',
        icon: 'fas fa-graduation-cap',
        upcoming: false
      }
    ])

    // Computed properties
    const filteredProtocols = computed(() => {
      let filtered = protocols.value

      // Filter by search query
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(protocol => 
          protocol.title.toLowerCase().includes(query) ||
          protocol.description.toLowerCase().includes(query) ||
          protocol.code.toLowerCase().includes(query)
        )
      }

      // Filter by status
      if (!activeFilters.value.includes('all')) {
        filtered = filtered.filter(protocol => 
          activeFilters.value.includes(protocol.status)
        )
      }

      return filtered
    })

    // Methods
    const toggleFilter = (filterId) => {
      if (filterId === 'all') {
        activeFilters.value = ['all']
      } else {
        const index = activeFilters.value.indexOf(filterId)
        const allIndex = activeFilters.value.indexOf('all')
        
        if (index === -1) {
          // Remove 'all' if another filter is selected
          if (allIndex !== -1) {
            activeFilters.value.splice(allIndex, 1)
          }
          activeFilters.value.push(filterId)
        } else {
          activeFilters.value.splice(index, 1)
          // If no filters selected, show all
          if (activeFilters.value.length === 0) {
            activeFilters.value = ['all']
          }
        }
      }
    }

    const getStatusText = (status) => {
      const statusMap = {
        'pending': 'Pendiente',
        'in-progress': 'En Proceso',
        'approved': 'Aprobado',
        'rejected': 'Rechazado'
      }
      return statusMap[status] || status
    }

    const viewProtocol = (protocol) => {
      selectedProtocol.value = protocol
    }

    const closeModal = () => {
      selectedProtocol.value = null
    }

    const startProtocol = (protocol) => {
      protocol.status = 'in-progress'
      protocol.progress = 10
      alert(`Protocolo ${protocol.code} iniciado`)
    }

    const submitProtocol = (protocol) => {
      if (confirm(`¿Estás seguro de enviar ${protocol.code} para revisión?`)) {
        protocol.status = 'approved'
        protocol.progress = 100
        alert('Protocolo enviado para revisión')
      }
    }

    const downloadProtocol = (protocol) => {
      alert(`Descargando ${protocol.code}...`)
    }

    const handleProtocolAction = (action, protocol) => {
      switch (action) {
        case 'start':
          startProtocol(protocol)
          break
        case 'submit':
          submitProtocol(protocol)
          break
        case 'download':
          downloadProtocol(protocol)
          break
      }
      closeModal()
    }

    const openDocumentTemplate = () => {
      alert('Abriendo plantilla de tesis...')
    }

    const openFormatGuide = () => {
      alert('Abriendo guía de formato...')
    }

    const openCalendar = () => {
      alert('Abriendo calendario de defensas...')
    }

    const contactAdvisor = () => {
      alert('Contactando asesor...')
    }

    const setReminder = (date) => {
      alert(`Recordatorio configurado para: ${date.title}`)
    }

    onMounted(() => {
      // Carga inicial de datos
    })

    return {
      searchQuery,
      activeFilters,
      selectedProtocol,
      filters,
      progressSteps,
      protocols,
      importantDates,
      filteredProtocols,
      toggleFilter,
      getStatusText,
      viewProtocol,
      closeModal,
      startProtocol,
      submitProtocol,
      downloadProtocol,
      handleProtocolAction,
      openDocumentTemplate,
      openFormatGuide,
      openCalendar,
      contactAdvisor,
      setReminder
    }
  }
}
</script>

<style scoped>
.protocols-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
  overflow-y: auto;
}

.tese-header {
  background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
  color: white;
  padding: 25px;
  border-radius: 15px;
  margin-bottom: 25px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.logo {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: white;
  padding: 8px;
}

.header-text h1 {
  margin: 0;
  font-size: 2.2em;
  font-weight: 600;
}

.subtitle {
  margin: 5px 0 0 0;
  opacity: 0.9;
  font-size: 1.1em;
}

.controls-section {
  background: white;
  padding: 20px;
  border-radius: 15px;
  margin-bottom: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.search-box {
  position: relative;
  margin-bottom: 20px;
}

.search-box i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.search-input {
  width: 100%;
  padding: 15px 15px 15px 45px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1em;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #1a237e;
  box-shadow: 0 0 0 3px rgba(26, 35, 126, 0.1);
}

.filter-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 10px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 25px;
  background: white;
  color: #666;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn.active {
  background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
  color: white;
  border-color: #1a237e;
}

.filter-btn:hover:not(.active) {
  border-color: #1a237e;
  color: #1a237e;
}

.progress-tracker {
  background: white;
  padding: 25px;
  border-radius: 15px;
  margin-bottom: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.progress-tracker h3 {
  margin: 0 0 20px 0;
  color: #1a237e;
  font-size: 1.4em;
}

.progress-steps {
  display: flex;
  justify-content: space-between;
  position: relative;
}

.progress-steps::before {
  content: '';
  position: absolute;
  top: 30px;
  left: 50px;
  right: 50px;
  height: 4px;
  background: #e0e0e0;
  z-index: 1;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  flex: 1;
}

.step-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  border: 4px solid white;
  transition: all 0.3s ease;
}

.step-icon i {
  font-size: 1.5em;
  color: #666;
}

.progress-step.completed .step-icon {
  background: #4caf50;
  border-color: #4caf50;
}

.progress-step.completed .step-icon i {
  color: white;
}

.progress-step.active .step-icon {
  background: #1a237e;
  border-color: #1a237e;
  transform: scale(1.1);
}

.progress-step.active .step-icon i {
  color: white;
}

.step-info {
  text-align: center;
}

.step-title {
  display: block;
  font-weight: 600;
  margin-bottom: 5px;
  color: #333;
}

.step-status {
  font-size: 0.9em;
  color: #666;
}

.protocols-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.protocol-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border-left: 5px solid #ccc;
}

.protocol-card.pending {
  border-left-color: #ff9800;
}

.protocol-card.in-progress {
  border-left-color: #2196f3;
}

.protocol-card.approved {
  border-left-color: #4caf50;
}

.protocol-card.rejected {
  border-left-color: #f44336;
}

.protocol-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.protocol-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: #f8f9ff;
}

.protocol-code {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: #333;
}

.protocol-status-badge {
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.85em;
  font-weight: 600;
  text-transform: uppercase;
}

.protocol-status-badge.pending {
  background: #fff3e0;
  color: #f57c00;
}

.protocol-status-badge.in-progress {
  background: #e3f2fd;
  color: #1976d2;
}

.protocol-status-badge.approved {
  background: #e8f5e9;
  color: #388e3c;
}

.protocol-status-badge.rejected {
  background: #ffebee;
  color: #d32f2f;
}

.protocol-content {
  padding: 20px;
}

.protocol-title {
  margin: 0 0 15px 0;
  color: #1a237e;
  font-size: 1.2em;
  line-height: 1.4;
}

.protocol-description {
  margin: 0 0 20px 0;
  color: #666;
  line-height: 1.6;
}

.protocol-meta {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #555;
  font-size: 0.95em;
}

.meta-item i {
  color: #1a237e;
  width: 20px;
}

.protocol-actions {
  padding: 15px 20px;
  background: #f8f9ff;
  display: flex;
  gap: 10px;
}

.action-btn {
  flex: 1;
  padding: 10px;
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
  background: #ff9800;
  color: white;
}

.action-btn.success {
  background: #4caf50;
  color: white;
}

.action-btn.download {
  background: #9c27b0;
  color: white;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.quick-actions {
  background: white;
  padding: 25px;
  border-radius: 15px;
  margin-bottom: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.quick-actions h3 {
  margin: 0 0 20px 0;
  color: #1a237e;
  font-size: 1.4em;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.quick-action-btn {
  padding: 20px;
  background: #f8f9ff;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.quick-action-btn i {
  font-size: 2em;
  color: #1a237e;
}

.quick-action-btn span {
  font-weight: 500;
  color: #333;
}

.quick-action-btn:hover {
  background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
  border-color: #1a237e;
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(26, 35, 126, 0.2);
}

.quick-action-btn:hover i,
.quick-action-btn:hover span {
  color: white;
}

.important-dates {
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.important-dates h3 {
  margin: 0 0 20px 0;
  color: #1a237e;
  font-size: 1.4em;
}

.dates-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.date-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background: #f8f9ff;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.date-item.upcoming {
  background: linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%);
  border-left: 4px solid #ff9800;
}

.date-item:hover {
  transform: translateX(5px);
}

.date-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.date-icon i {
  font-size: 1.5em;
  color: #1a237e;
}

.date-item.upcoming .date-icon i {
  color: #ff9800;
}

.date-info {
  flex: 1;
}

.date-title {
  display: block;
  font-weight: 600;
  margin-bottom: 5px;
  color: #333;
}

.date {
  font-size: 0.9em;
  color: #666;
}

.reminder-btn {
  padding: 8px 15px;
  background: #ff9800;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;
}

.reminder-btn:hover {
  background: #f57c00;
  transform: scale(1.05);
}

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
  max-width: 600px;
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

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
  }
  
  .progress-steps {
    flex-direction: column;
    gap: 20px;
  }
  
  .progress-steps::before {
    display: none;
  }
  
  .protocols-grid {
    grid-template-columns: 1fr;
  }
  
  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .date-item {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }
  
  .date-icon {
    margin-right: 0;
  }
  
  .protocol-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .filter-buttons {
    justify-content: center;
  }
}
</style>