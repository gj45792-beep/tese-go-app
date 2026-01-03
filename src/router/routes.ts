// src/router/routes.ts
// Definición centralizada de todas las rutas de la aplicación
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
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/public/LoginPage.vue'),
      },
      {
        path: 'forgot-password',
        name: 'ForgotPassword',
        component: () => import('@/views/public/ForgotPasswordPage.vue'),
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/public/RegisterPage.vue'),
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
        path: 'events/:id',
        name: 'EventDetail',
        component: () => import('@/views/events/EventDetailPage.vue'),
      },
     {
        path: 'events/:id/map',
        name: 'EventMap',
        component: () => import('@/views/events/EventMapPage.vue'),
      },
      {
        path: 'map',
        name: 'Map',
        component: () => import('@/views/navigation/MapPage.vue'),
      },
      {
        path: 'navigation/:from?/:to?',
        name: 'NavigationRoute',
        component: () => import('@/views/navigation/NavigationRoutePage.vue'),
      },
      {
        path: 'building/:id',
        name: 'BuildingDetail',
        component: () => import('@/views/navigation/BuildingDetailPage.vue'),
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/profile/ProfilePage.vue'),
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/profile/SettingsPage.vue'),
      },
      {
      path: 'event-schedule',
      name: 'EventSchedule',
      component: () => import('@/views/events/EventSchedulePage.vue'),
      },
      {
      path: 'live-navigation',
      name: 'LiveNavigation',
      component: () => import('@/views/navigation/LiveNavigationPage.vue'),
      },
    ],
  },
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
  {
    path: '/profile',
    redirect: '/app/profile',
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

export default routes;