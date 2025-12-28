<template>
  <ion-app>
    <!-- Solo el contenido de login -->
    <ion-content :fullscreen="true">
      <ion-router-outlet />
    </ion-content>
    
    <!-- Footer mínimo para login -->
   
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonContent, IonRouterOutlet } from '@ionic/vue';
</script>