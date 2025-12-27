import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/layouts/PublicLayout.vue'),
    children: [
      {
        path: '',
        name: 'Welcome',
        component: () => import('@/views/public/WelcomePage.vue'),
      },
    ],
  },
  {
    path: '/login',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        name: 'Login',
        component: () => import('@/views/public/LoginPage.vue'),
      },
    ],
  },
  {
    path: '/app',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/auth/HomePage.vue'),
      },
      {
        path: 'events',
        name: 'Events',
        component: () => import('@/views/events/EventsListPage.vue'),
      },
      {
        path: 'map',
        name: 'Map',
        component: () => import('@/views/navigation/MapPage.vue'),
      },
      // Aquí después agregarás más páginas
    ],
  },
  // Redirecciones para compatibilidad
  {
    path: '/home',
    redirect: '/app/home',
  },
  {
    path: '/events',
    redirect: '/app/events',
  },
  {
    path: '/map',
    redirect: '/app/map',
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;