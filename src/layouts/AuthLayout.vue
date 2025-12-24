<template>
  <ion-app>
    <!-- Solo el contenido de login -->
    <ion-content :fullscreen="true">
      <ion-router-outlet />
    </ion-content>
    
    <!-- Footer mínimo para login -->
    <ion-footer>
      <ion-toolbar>
        <ion-title size="small">Tecnológico de Estudios Superiores de Ecatepec</ion-title>
      </ion-toolbar>
    </ion-footer>
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonContent, IonRouterOutlet, IonFooter, IonToolbar, IonTitle } from '@ionic/vue';
</script>