<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/app/profile"></ion-back-button>
        </ion-buttons>
        <ion-title>Configuración</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div style="text-align: center; margin-top: 50px;">
        <h2>Configuración y Preferencias</h2>
        <p>Aquí se configurará el tipo de movilidad (peatón, silla de ruedas, auto).</p>
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