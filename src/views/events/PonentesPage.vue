<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/app/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Ponentes TESE</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="toggleViewMode">
            <ion-icon :icon="viewMode === 'grid' ? list : grid"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      
      <ion-toolbar>
        <ion-searchbar
          v-model="searchQuery"
          placeholder="Buscar ponente..."
          animated
          @ion-input="filterPonentes"
          @ion-clear="filterPonentes"
        ></ion-searchbar>
        
        <ion-segment v-model="selectedCategory" @ionChange="filterPonentes">
          <ion-segment-button value="all">
            <ion-label>Todos</ion-label>
          </ion-segment-button>
          <ion-segment-button value="academic">
            <ion-label>Académico</ion-label>
          </ion-segment-button>
          <ion-segment-button value="industry">
            <ion-label>Industrial</ion-label>
          </ion-segment-button>
          <ion-segment-button value="research">
            <ion-label>Investigación</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <!-- Vista de cuadrícula -->
      <div v-if="viewMode === 'grid' && filteredPonentes.length > 0" class="grid-view">
        <div class="grid-container">
          <div 
            v-for="ponente in filteredPonentes" 
            :key="ponente.id"
            class="grid-item"
            @click="viewPonenteDetail(ponente)"
          >
            <div class="ponente-card">
              <div class="avatar-container">
                <img 
                  :src="ponente.avatar" 
                  :alt="ponente.nombre"
                  class="ponente-avatar"
                  @error="handleImageError"
                />
                <div class="category-badge" :class="ponente.categoria">
                  {{ getCategoryLabel(ponente.categoria) }}
                </div>
              </div>
              
              <div class="ponente-info">
                <h3 class="ponente-name">{{ ponente.nombre }}</h3>
                <p class="ponente-title">{{ ponente.titulo }}</p>
                <p class="ponente-specialty">{{ ponente.especialidad }}</p>
                
                <div class="stats">
                  <span class="stat">
                    <ion-icon :icon="calendar"></ion-icon>
                    {{ ponente.eventosCount }} eventos
                  </span>
                  <span class="stat">
                    <ion-icon :icon="star"></ion-icon>
                    {{ ponente.rating }}/5
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Vista de lista -->
      <ion-list v-else-if="viewMode === 'list' && filteredPonentes.length > 0" lines="full">
        <ion-item 
          v-for="ponente in filteredPonentes" 
          :key="ponente.id"
          @click="viewPonenteDetail(ponente)"
          class="list-item"
        >
          <ion-avatar slot="start">
            <img :src="ponente.avatar" :alt="ponente.nombre" @error="handleImageError" />
          </ion-avatar>
          
          <ion-label>
            <h2>{{ ponente.nombre }}</h2>
            <p>{{ ponente.titulo }}</p>
            <p>
              <ion-badge :color="getCategoryColor(ponente.categoria)" class="category-tag">
                {{ getCategoryLabel(ponente.categoria) }}
              </ion-badge>
              <span class="event-count">{{ ponente.eventosCount }} eventos</span>
            </p>
          </ion-label>
          
          <ion-button fill="clear" slot="end">
            <ion-icon slot="icon-only" :icon="chevronForward"></ion-icon>
          </ion-button>
        </ion-item>
      </ion-list>

      <!-- Estado vacío -->
      <div v-else class="empty-state">
        <ion-icon :icon="peopleOutline" class="empty-icon"></ion-icon>
        <h3>No se encontraron ponentes</h3>
        <p>Intenta con otros términos de búsqueda</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton, IonButton, IonIcon,
  IonSearchbar, IonSegment, IonSegmentButton, IonLabel,
  IonList, IonItem, IonAvatar, IonBadge,
  onIonViewWillEnter
} from '@ionic/vue';
import {
  grid, list, calendar, star, chevronForward,
  peopleOutline, school, business, flask
} from 'ionicons/icons';

interface Ponente {
  id: number;
  nombre: string;
  titulo: string;
  especialidad: string;
  categoria: 'academic' | 'industry' | 'research';
  avatar: string;
  bio: string;
  eventosCount: number;
  rating: number;
  email?: string;
  telefono?: string;
  eventos: Array<{
    id: number;
    nombre: string;
    fecha: string;
  }>;
}

const router = useRouter();
const viewMode = ref<'grid' | 'list'>('grid');
const searchQuery = ref('');
const selectedCategory = ref('all');
const allPonentes = ref<Ponente[]>([]);
const filteredPonentes = ref<Ponente[]>([]);

// Datos de ejemplo realistas para TESE
const samplePonentes: Ponente[] = [
  {
    id: 1,
    nombre: 'Dra. María González',
    titulo: 'Directora de Investigación',
    especialidad: 'Inteligencia Artificial',
    categoria: 'academic',
    avatar: 'https://i.pravatar.cc/150?img=1',
    bio: 'Doctora en Ciencias de la Computación con 15 años de experiencia en IA aplicada a educación.',
    eventosCount: 8,
    rating: 4.8,
    email: 'maria.gonzalez@tese.edu.mx',
    eventos: [
      { id: 101, nombre: 'Conferencia: IA en Educación', fecha: '2024-03-15' },
      { id: 102, nombre: 'Taller de Machine Learning', fecha: '2024-04-20' }
    ]
  },
  {
    id: 2,
    nombre: 'Ing. Carlos Rodríguez',
    titulo: 'CEO TechSolutions MX',
    especialidad: 'Desarrollo de Software Empresarial',
    categoria: 'industry',
    avatar: 'https://i.pravatar.cc/150?img=5',
    bio: 'Ingeniero en Sistemas con 20 años en desarrollo de software empresarial y consultoría.',
    eventosCount: 5,
    rating: 4.5,
    email: 'carlos@techsolutions.mx',
    eventos: [
      { id: 103, nombre: 'Panel: Innovación Tecnológica', fecha: '2024-03-22' }
    ]
  },
  {
    id: 3,
    nombre: 'Dr. Alejandro Martínez',
    titulo: 'Investigador Principal',
    especialidad: 'Robótica y Automatización',
    categoria: 'research',
    avatar: 'https://i.pravatar.cc/150?img=8',
    bio: 'PhD en Robótica con múltiples publicaciones internacionales y patentes.',
    eventosCount: 12,
    rating: 4.9,
    email: 'alejandro.martinez@tese.edu.mx',
    eventos: [
      { id: 104, nombre: 'Seminario de Robótica Avanzada', fecha: '2024-04-10' }
    ]
  },
  {
    id: 4,
    nombre: 'Mtra. Laura Sánchez',
    titulo: 'Coordinadora de Ingeniería',
    especialidad: 'Desarrollo Sostenible',
    categoria: 'academic',
    avatar: 'https://i.pravatar.cc/150?img=11',
    bio: 'Maestría en Desarrollo Sostenible con enfoque en tecnologías verdes.',
    eventosCount: 6,
    rating: 4.6,
    eventos: []
  },
  {
    id: 5,
    nombre: 'Lic. Roberto Vargas',
    titulo: 'Director de Innovación',
    especialidad: 'Emprendimiento Tecnológico',
    categoria: 'industry',
    avatar: 'https://i.pravatar.cc/150?img=15',
    bio: 'Especialista en emprendimiento con más de 50 startups asesoradas.',
    eventosCount: 9,
    rating: 4.7,
    eventos: []
  },
  {
    id: 6,
    nombre: 'Dra. Ana López',
    titulo: 'Investigadora en Biotecnología',
    especialidad: 'Biotecnología Ambiental',
    categoria: 'research',
    avatar: 'https://i.pravatar.cc/150?img=20',
    bio: 'Doctora en Biotecnología con proyectos de remediación ambiental.',
    eventosCount: 7,
    rating: 4.8,
    eventos: []
  }
];

// Inicializar datos
onMounted(() => {
  allPonentes.value = samplePonentes;
  filteredPonentes.value = [...samplePonentes];
});

onIonViewWillEnter(() => {
  console.log('📖 PonentesPage cargada');
});

const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid';
};

const filterPonentes = () => {
  let filtered = [...allPonentes.value];

  // Filtrar por categoría
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(p => p.categoria === selectedCategory.value);
  }

  // Filtrar por búsqueda
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(p => 
      p.nombre.toLowerCase().includes(query) ||
      p.titulo.toLowerCase().includes(query) ||
      p.especialidad.toLowerCase().includes(query)
    );
  }

  filteredPonentes.value = filtered;
};

const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    academic: 'Académico',
    industry: 'Industrial',
    research: 'Investigación'
  };
  return labels[category] || category;
};

const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    academic: 'primary',
    industry: 'success',
    research: 'tertiary'
  };
  return colors[category] || 'medium';
};

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = 'https://ionicframework.com/docs/img/demos/avatar.svg';
};

const viewPonenteDetail = (ponente: Ponente) => {
  // Por ahora solo muestra alerta
  // Luego puedes crear PonenteDetailPage.vue
  alert(`Detalle de: ${ponente.nombre}\n\n${ponente.bio}`);
  
  // Para futuro:
  // router.push(`/app/ponente-detail/${ponente.id}`);
};
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.grid-item {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.grid-item:hover {
  transform: translateY(-4px);
}

.ponente-card {
  background: var(--ion-card-background, white);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.avatar-container {
  position: relative;
  padding: 20px;
  display: flex;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.ponente-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 4px solid white;
  object-fit: cover;
}

.category-badge {
  position: absolute;
  bottom: 10px;
  right: 10px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
}

.category-badge.academic {
  background: var(--ion-color-primary);
}

.category-badge.industry {
  background: var(--ion-color-success);
}

.category-badge.research {
  background: var(--ion-color-tertiary);
}

.ponente-info {
  padding: 16px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.ponente-name {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--ion-color-dark);
}

.ponente-title {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: var(--ion-color-medium);
}

.ponente-specialty {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: var(--ion-color-primary);
  font-weight: 500;
}

.stats {
  display: flex;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid var(--ion-color-light);
}

.stat {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--ion-color-medium);
}

.stat ion-icon {
  font-size: 14px;
  color: var(--ion-color-primary);
}

/* List View Styles */
.list-item {
  --padding-start: 0;
  --inner-padding-end: 0;
  margin-bottom: 8px;
  border-radius: 8px;
  overflow: hidden;
}

.list-item ion-avatar {
  width: 60px;
  height: 60px;
  margin: 12px;
}

.category-tag {
  font-size: 10px;
  margin-right: 8px;
}

.event-count {
  font-size: 12px;
  color: var(--ion-color-medium);
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  text-align: center;
  padding: 20px;
}

.empty-icon {
  font-size: 80px;
  color: var(--ion-color-medium);
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state h3 {
  color: var(--ion-color-medium);
  margin-bottom: 8px;
}

.empty-state p {
  color: var(--ion-color-medium);
  opacity: 0.8;
}

/* Responsive */
@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (max-width: 480px) {
  .grid-container {
    grid-template-columns: 1fr;
  }
  
  .ponente-avatar {
    width: 80px;
    height: 80px;
  }
}
</style>