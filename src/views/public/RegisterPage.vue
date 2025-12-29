# Crear RegisterPage.vue
Set-Content -Path "src/views/public/RegisterPage.vue" -Value @'
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/login"></ion-back-button>
        </ion-buttons>
        <ion-title>Registro</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div style="text-align: center; margin-top: 50px;">
        <h2>Registro para Aspirantes</h2>
        <p>Formulario de registro en construcción</p>
        <p>Esta página permitirá el registro de nuevos aspirantes al TESE</p>
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