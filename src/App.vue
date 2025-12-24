<!-- src/App.vue -->
<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { useAuthSimpleStore } from '@/stores/auth-simple.store';
import { onMounted } from 'vue';

const authStore = useAuthSimpleStore();

// Iniciar el observador de autenticación al cargar la app
onMounted(() => {
  authStore.init();
});
</script>