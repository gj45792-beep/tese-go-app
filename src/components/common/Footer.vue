<template>
  <ion-footer class="tese-footer" :translucent="true">
    <ion-toolbar>
      <div class="footer-content">
        <!-- Información de contacto -->
        <div class="footer-section">
          <h4>Tecnológico de Estudios Superiores de Ecatepec</h4>
          <p class="footer-text">
            Av. Tecnológico s/n, Col. Valle de Anáhuac, Ecatepec de Morelos, Estado de México
          </p>
          <p class="footer-text">
            📞 (55) 5000 0000 | ✉️ contacto@tese.edu.mx
          </p>
        </div>

        <!-- Enlaces rápidos -->
        <div class="footer-links">
          <a href="#" class="footer-link" @click.prevent="goToAbout">Acerca de</a>
          <a href="#" class="footer-link" @click.prevent="goToPrivacy">Privacidad</a>
          <a href="#" class="footer-link" @click.prevent="goToTerms">Términos</a>
          <a href="#" class="footer-link" @click.prevent="goToHelp">Ayuda</a>
        </div>

        <!-- Copyright -->
        <div class="footer-copyright">
          <p>© {{ currentYear }} TESE GO. Todos los derechos reservados.</p>
          <p class="footer-version">v1.0.0-alpha</p>
        </div>
      </div>
    </ion-toolbar>
  </ion-footer>
</template>

<script setup lang="ts">
import { IonFooter, IonToolbar } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();
const currentYear = ref(new Date().getFullYear());

const goToAbout = () => {
  router.push('/about');
  console.log('Navegando a Acerca de');
};

const goToPrivacy = () => {
  router.push('/privacy');
  console.log('Navegando a Privacidad');
};

const goToTerms = () => {
  router.push('/terms');
  console.log('Navegando a Términos');
};

const goToHelp = () => {
  router.push('/help');
  console.log('Navegando a Ayuda');
};
</script>

<style scoped>
.tese-footer {
  --background: var(--ion-color-tese-green);
  --color: white;
  --border-color: var(--ion-color-tese-gold);
  --border-width: 2px 0 0 0;
}

.footer-content {
  padding: 1rem;
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
}

.footer-section {
  margin-bottom: 1rem;
}

.footer-section h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: var(--ion-color-tese-gold);
  font-weight: 600;
}

.footer-text {
  margin: 0.3rem 0;
  font-size: 0.85rem;
  opacity: 0.9;
  line-height: 1.4;
}

.footer-links {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin: 1rem 0;
  padding: 1rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.footer-link {
  color: white;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: var(--ion-color-tese-gold);
  text-decoration: underline;
}

.footer-copyright {
  margin-top: 1rem;
  font-size: 0.8rem;
  opacity: 0.8;
}

.footer-version {
  font-size: 0.75rem;
  font-style: italic;
  margin-top: 0.3rem;
}

/* Responsive */
@media (max-width: 768px) {
  .footer-content {
    padding: 0.8rem;
  }
  
  .footer-links {
    gap: 1rem;
  }
  
  .footer-text {
    font-size: 0.8rem;
  }
}
</style>