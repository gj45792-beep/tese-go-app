<template>
  <ion-app>
    <!-- Header para páginas autenticadas -->
    <Header :show-logo="true" />
    
    <!-- Contenido principal CON ESPACIO para footer -->
    <ion-content class="ion-padding" :fullscreen="true">
      <ion-router-outlet />
    </ion-content>
    
    <!-- Footer TEMPORAL minimalista -->
    <ion-footer>
      <ion-toolbar>
        <div class="simple-footer">
          <ion-title size="small">TESE GO - Navegación Inteligente</ion-title>
        </div>
      </ion-toolbar>
    </ion-footer>
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonContent, IonRouterOutlet, IonFooter, IonToolbar, IonTitle } from '@ionic/vue';
import Header from '@/components/common/Header.vue';
</script>

<style scoped>
.simple-footer {
  text-align: center;
  padding: 8px 0;
  font-size: 12px;
}
</style>