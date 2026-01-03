<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/app/events"></ion-back-button>
        </ion-buttons>
        <ion-title>Detalle del Evento</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div style="text-align: center; margin-top: 50px;">
        <h2>Detalles del Evento</h2>
        <p>Aquí se mostrarán los ponentes, horarios y ubicación del evento.</p>
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