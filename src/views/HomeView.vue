<template>
  <v-main>
    <v-container fluid class="d-flex align-center justify-center fill-height">
      <v-col cols="12" class="d-flex flex-column align-center justify-center">
        <v-btn 
          :to="'/oficios'"
          x-large 
          rounded 
          class="home-button apply-pulse-effect mb-4"
          color="var(--custom-orange-accent)"
          variant="flat"
        >
          <v-icon start size="large">mdi-email-edit-outline</v-icon> Oficios
        </v-btn>
        
        <v-btn 
          :to="'/causaaprueba'"
          x-large 
          rounded 
          class="home-button apply-pulse-effect mb-4"
          color="var(--custom-orange-accent)"
          variant="flat"
        >
          <v-icon start size="large">mdi-scale-balance</v-icon> Recibir Causa a Prueba
        </v-btn>
        
        <v-btn
          :to="'/demandanueva'"
          x-large
          rounded
          class="home-button apply-pulse-effect mb-4"
          color="var(--custom-orange-accent)"
          variant="flat"
        >
          <v-icon start size="large">mdi-text-box-plus-outline</v-icon> Demanda Nueva
        </v-btn>

        <v-btn
          :to="'/previos'"
          x-large
          rounded
          class="home-button apply-pulse-effect mb-4"
          color="var(--custom-orange-accent)"
          variant="flat"
        >
          <v-icon start size="large">mdi-format-list-checks</v-icon> Previos
        </v-btn>

        <v-btn
          :to="'/basesremate'"
          x-large
          rounded
          class="home-button apply-pulse-effect mb-4"
          color="var(--custom-orange-accent)"
          variant="flat"
        >
          <v-icon start size="large">mdi-gavel</v-icon> Bases de remate
        </v-btn>
      </v-col>
    </v-container>
  </v-main>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HomeView',
});
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
}

.home-button {
  min-width: 300px; /* Un poco más de ancho */
  min-height: 60px !important; /* Altura para x-large si es necesario */
  font-size: 1.15rem !important;
  text-transform: none;
  letter-spacing: 0.5px;
  color: white !important; /* Texto del botón blanco para contraste con naranja */
  transition: background-color 0.2s ease-in-out;
}

/* Para asegurar centrado vertical de texto e icono en v-btn */
.home-button .v-btn__content {
  display: flex;
  align-items: center;
  justify-content: center;
}
.home-button .v-icon--start {
  margin-right: 12px; /* Más espacio entre icono y texto */
}

/* Efecto hover para los botones */
.home-button:hover {
  background-color: var(--custom-orange-accent-darken) !important;
}
</style>