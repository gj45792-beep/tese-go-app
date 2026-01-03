<template>
  <div class="event-detail">
    <div class="modal-header">
      <h3>{{ event.title }}</h3>
      <button @click="$emit('close')" class="close-btn">
        <i class="fas fa-times"></i>
      </button>
    </div>
    
    <div class="modal-content">
      <div class="info-section">
        <div class="info-row">
          <i class="fas fa-clock"></i>
          <span>{{ formatTime(event.startTime) }} - {{ formatTime(event.endTime) }}</span>
        </div>
        
        <div class="info-row">
          <i class="fas fa-map-marker-alt"></i>
          <span>{{ event.location }}</span>
        </div>
        
        <div class="info-row" v-if="event.speaker">
          <i class="fas fa-user"></i>
          <span>{{ event.speaker }}</span>
        </div>
        
        <div class="description">
          <p>{{ event.description }}</p>
        </div>
      </div>
      
      <div class="action-buttons">
        <button @click="$emit('navigate')" class="btn-navigate">
          <i class="fas fa-location-arrow"></i> Navegar al evento
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EventDetail',
  props: {
    event: {
      type: Object,
      required: true
    }
  },
  setup() {
    const formatTime = (time) => {
      if (!time) return ''
      const [hours, minutes] = time.split(':')
      const hour = parseInt(hours)
      const ampm = hour >= 12 ? 'PM' : 'AM'
      const displayHour = hour % 12 || 12
      return `${displayHour}:${minutes} ${ampm}`
    }

    return {
      formatTime
    }
  }
}
</script>

<style scoped>
.event-detail {
  background: white;
  border-radius: 10px;
  overflow: hidden;
}

.modal-header {
  background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.2em;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
}

.modal-content {
  padding: 20px;
}

.info-section {
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  color: #333;
}

.info-row i {
  color: #1a237e;
  width: 20px;
}

.description {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.description p {
  margin: 0;
  color: #555;
  line-height: 1.5;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.btn-navigate {
  flex: 1;
  padding: 12px;
  background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-navigate:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(26, 35, 126, 0.3);
}
</style>