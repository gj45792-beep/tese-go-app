Set-Content -Path "src/views/navigation/NavigationRoutePage.vue" -Value @'
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/app/map"></ion-back-button>
        </ion-buttons>
        <ion-title>Navegación</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div style="text-align: center; margin-top: 50px;">
        <h2>Navegación Tipo Waze</h2>
        <p>Aquí irá la navegación paso a paso dentro del campus.</p>
        <p>Mostrará la ruta óptima usando algoritmo A*.</p>
        <p>Funcionalidad en construcción.</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonBackButton, 
  IonButtons 
} from '@ionic/vue';
</script>
'@ -Encoding UTF8