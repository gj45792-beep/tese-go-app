import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import pinia from './stores'; // Importa desde ./stores

import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';

// Importar defineCustomElements para evitar error de classList
import { defineCustomElements } from '@ionic/core/loader';

// Crear la app de Vue
const app = createApp(App);

// Usar IonicVue con configuración
app.use(IonicVue, {
  mode: 'ios', // o 'md' para Material Design
  swipeBackEnabled: true,
});

// Usar router y store
app.use(router);
app.use(pinia);

// Esto arregla el error "Cannot read properties of undefined (reading 'classList')"
defineCustomElements(window);

// Montar la app
app.mount('#app');

// Opcional: Configurar modo oscuro
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
if (prefersDark.matches) {
  document.body.classList.toggle('dark', true);
}