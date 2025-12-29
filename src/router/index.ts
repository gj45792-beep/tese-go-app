// src/router/index.ts
// Punto de entrada del router - SOLO creación del router
import { createRouter, createWebHistory } from '@ionic/vue-router';
import routes from './routes'; // Importa las rutas desde el archivo separado

// Crear instancia del router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Exportar router para uso en main.ts
export default router;