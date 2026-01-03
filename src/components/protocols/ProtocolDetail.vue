<template>
  <div class="protocol-detail">
    <div class="detail-header">
      <div class="header-content">
        <span class="protocol-code">{{ protocol.code }}</span>
        <span class="protocol-status-badge" :class="protocol.status">
          {{ getStatusText(protocol.status) }}
        </span>
      </div>
      <button @click="$emit('close')" class="close-btn">
        <i class="fas fa-times"></i>
      </button>
    </div>
    
    <div class="detail-content">
      <h2 class="protocol-title">{{ protocol.title }}</h2>
      
      <div class="section">
        <h3><i class="fas fa-info-circle"></i> Descripción</h3>
        <p class="description">{{ protocol.description }}</p>
      </div>
      
      <div class="section">
        <h3><i class="fas fa-user-tie"></i> Responsable</h3>
        <p class="responsible">{{ protocol.responsible }}</p>
      </div>
      
      <div class="section">
        <h3><i class="fas fa-calendar-check"></i> Fecha de Entrega</h3>
        <div class="date-info">
          <span class="due-date">{{ protocol.dueDate }}</span>
          <span class="days-left" :class="getDaysLeftClass()">
            {{ getDaysLeft() }}
          </span>
        </div>
      </div>
      
      <div class="section">
        <h3><i class="fas fa-tasks"></i> Requisitos</h3>
        <ul class="requirements-list">
          <li v-for="(req, index) in protocol.requirements" :key="index">
            <i class="fas fa-check-circle"></i> {{ req }}
          </li>
        </ul>
      </div>
      
      <div class="section">
        <h3><i class="fas fa-chart-line"></i> Progreso</h3>
        <div class="progress-container">
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: protocol.progress + '%' }"
            ></div>
          </div>
          <span class="progress-text">{{ protocol.progress }}% completado</span>
        </div>
      </div>
      
      <div class="section" v-if="protocol.documents > 0">
        <h3><i class="fas fa-folder-open"></i> Documentos Adjuntos</h3>
        <div class="documents-list">
          <div class="document-item">
            <i class="fas fa-file-pdf"></i>
            <span>{{ protocol.code }}.pdf</span>
            <button class="doc-btn">
              <i class="fas fa-download"></i>
            </button>
          </div>
          <div class="document-item" v-if="protocol.documents > 1">
            <i class="fas fa-file-word"></i>
            <span>Formato editable.docx</span>
            <button class="doc-btn">
              <i class="fas fa-download"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="detail-actions">
      <button 
        v-if="protocol.status === 'pending'"
        @click="$emit('action', 'start', protocol)"
        class="action-btn primary large"
      >
        <i class="fas fa-play-circle"></i> Iniciar Protocolo
      </button>
      
      <button 
        v-if="protocol.status === 'in-progress'"
        @click="$emit('action', 'submit', protocol)"
        class="action-btn success large"
      >
        <i class="fas fa-paper-plane"></i> Enviar para Revisión
      </button>
      
      <button 
        v-if="protocol.status === 'approved'"
        @click="$emit('action', 'download', protocol)"
        class="action-btn download large"
      >
        <i class="fas fa-download"></i> Descargar Completado
      </button>
      
      <button 
        @click="$emit('close')"
        class="action-btn secondary"
      >
        <i class="fas fa-times"></i> Cerrar
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProtocolDetail',
  props: {
    protocol: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const getStatusText = (status) => {
      const statusMap = {
        'pending': 'Pendiente',
        'in-progress': 'En Proceso',
        'approved': 'Aprobado',
        'rejected': 'Rechazado'
      }
      return statusMap[status] || status
    }

    const getDaysLeft = () => {
      // Lógica simplificada para el ejemplo
      const dateMap = {
        '15 Ene 2024': '5 días restantes',
        '20 Ene 2024': '10 días restantes',
        '25 Ene 2024': '15 días restantes',
        '10 Feb 2024': '25 días restantes'
      }
      return dateMap[props.protocol.dueDate] || 'Fecha no disponible'
    }

    const getDaysLeftClass = () => {
      if (props.protocol.dueDate.includes('Ene')) {
        return 'urgent'
      }
      return 'normal'
    }

    return {
      getStatusText,
      getDaysLeft,
      getDaysLeftClass
    }
  }
}
</script>

<style scoped>
.protocol-detail {
  padding: 0;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
  color: white;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.protocol-code {
  font-family: 'Courier New', monospace;
  font-size: 1.2em;
  font-weight: 600;
}

.protocol-status-badge {
  padding: 5px 15px;
  border-radius: 15px;
  font-size: 0.9em;
  font-weight: 600;
  text-transform: uppercase;
  display: inline-block;
  width: fit-content;
}

.protocol-status-badge.pending {
  background: #ff9800;
}

.protocol-status-badge.in-progress {
  background: #2196f3;
}

.protocol-status-badge.approved {
  background: #4caf50;
}

.protocol-status-badge.rejected {
  background: #f44336;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.detail-content {
  padding: 25px;
}

.protocol-title {
  margin: 0 0 25px 0;
  color: #1a237e;
  font-size: 1.5em;
  line-height: 1.4;
}

.section {
  margin-bottom: 25px;
}

.section h3 {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 15px 0;
  color: #333;
  font-size: 1.2em;
}

.section h3 i {
  color: #1a237e;
}

.description {
  margin: 0;
  line-height: 1.6;
  color: #555;
}

.responsible {
  margin: 0;
  padding: 10px 15px;
  background: #f0f7ff;
  border-radius: 8px;
  border-left: 4px solid #1a237e;
  font-weight: 500;
}

.date-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.due-date {
  font-size: 1.1em;
  font-weight: 600;
  color: #333;
}

.days-left {
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.9em;
  font-weight: 500;
}

.days-left.urgent {
  background: #ffebee;
  color: #d32f2f;
}

.days-left.normal {
  background: #e8f5e9;
  color: #388e3c;
}

.requirements-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.requirements-list li {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  gap: 10px;
}

.requirements-list li:last-child {
  border-bottom: none;
}

.requirements-list li i {
  color: #4caf50;
}

.progress-container {
  padding: 15px;
  background: #f8f9ff;
  border-radius: 10px;
}

.progress-bar {
  height: 12px;
  background: #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4caf50, #8bc34a);
  border-radius: 6px;
  transition: width 0.3s ease;
}

.progress-text {
  display: block;
  text-align: center;
  font-weight: 600;
  color: #333;
}

.documents-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.document-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  background: #f8f9ff;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.document-item i:first-child {
  color: #d32f2f;
  margin-right: 10px;
  font-size: 1.2em;
}

.document-item span {
  flex: 1;
  color: #333;
}

.doc-btn {
  background: none;
  border: none;
  color: #1a237e;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.doc-btn:hover {
  background: #e3e8ff;
}

.detail-actions {
  padding: 20px;
  background: #f8f9ff;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.action-btn {
  padding: 15px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.action-btn.large {
  font-size: 1.1em;
}

.action-btn.primary {
  background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
  color: white;
}

.action-btn.secondary {
  background: #f0f0f0;
  color: #333;
}

.action-btn.success {
  background: linear-gradient(135deg, #4caf50 0%, #8bc34a 100%);
  color: white;
}

.action-btn.download {
  background: linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%);
  color: white;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

@media (max-width: 480px) {
  .detail-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .header-content {
    align-items: center;
  }
  
  .date-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
}
</style>