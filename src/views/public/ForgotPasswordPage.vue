<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/login"></ion-back-button>
        </ion-buttons>
        <ion-title>Recuperar Contraseña</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div style="text-align: center; margin-top: 50px;">
        <h2>Recuperación de Contraseña</h2>
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