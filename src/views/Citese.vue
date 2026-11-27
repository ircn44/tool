<template>
  <v-container>
    <v-row>
      <v-col sm="6" md="6" lg="6">
        <!-- Card principal con checkboxes -->
        <v-card class="pa-2 mb-2" elevation="2">
          <h1 class="mb-2 text-h5">Lista</h1>

          <div class="checkbox-container-full mb-2">
            <v-checkbox 
              v-model="checkItems" 
              value="notificacion_demanda" 
              label="Notificación de la demanda a todos los demandados." 
              density="compact" 
              hide-details
              :class="{ 'checkbox-active': checkItems.includes('notificacion_demanda') }"
            ></v-checkbox>
            
            <v-checkbox 
              v-model="checkItems" 
              value="revisar_cantidad" 
              label="Si hay persona jurídica, revisar si hay más de un rep. legal. En caso afirmativo, revisar si en la demanda se redactó como 'y' o como 'y/o', para determinar cuáles de ellos deben ser notificados." 
              density="compact" 
              hide-details
              :class="{ 'checkbox-active': checkItems.includes('revisar_cantidad') }"
            ></v-checkbox>
            
            <v-checkbox 
              v-model="checkItems" 
              value="notificados_calidad" 
              label="Revisar que los demandados/codeudores/rep.legal, fueron notificados en su calidad." 
              density="compact" 
              hide-details
              :class="{ 'checkbox-active': checkItems.includes('notificados_calidad') }"
            ></v-checkbox>
            
            <v-checkbox 
              v-model="checkItems" 
              value="titulo_custodiado" 
              label="Revisar que el título esté custodiado. Si no lo está, revisar que tenga FEA." 
              density="compact" 
              hide-details
              :class="{ 'checkbox-active': checkItems.includes('titulo_custodiado') }"
            ></v-checkbox>
            
            <v-checkbox 
              v-model="checkItems" 
              value="titulo_escaneado" 
              label="Revisar que el título esté correctamente escaneado. En caso negativo, ver en custodia." 
              density="compact" 
              hide-details
              :class="{ 'checkbox-active': checkItems.includes('titulo_escaneado') }"
            ></v-checkbox>
            
            <v-checkbox 
              v-model="checkItems" 
              value="incidente_nulidad" 
              label="Revisar si hay incidente de nulidad por falta de emplazamiento." 
              density="compact" 
              hide-details
              :class="{ 'checkbox-active': checkItems.includes('incidente_nulidad') }"
            ></v-checkbox>
            
            <v-checkbox 
              v-model="checkItems" 
              value="notificacion_auto_prueba" 
              label="Revisar que las partes estén notificadas del auto de prueba. Todos tienen que ser notificados." 
              density="compact" 
              hide-details
              :class="{ 'checkbox-active': checkItems.includes('notificacion_auto_prueba') }"
            ></v-checkbox>
            
            <v-checkbox 
              v-model="checkItems" 
              value="traslado_rebeldia" 
              label="Revisar si se indicó 'por evacuado el traslado en rebeldía del ejecutante'." 
              density="compact" 
              hide-details
              :class="{ 'checkbox-active': checkItems.includes('traslado_rebeldia') }"
            ></v-checkbox>
            
            <v-checkbox 
              v-model="checkItems" 
              value="verificar_prueba" 
              label="Verificar que se rindió toda la prueba." 
              density="compact" 
              hide-details
              :class="{ 'checkbox-active': checkItems.includes('verificar_prueba') }"
            ></v-checkbox>

            <v-checkbox 
              v-model="checkItems" 
              value="verificar_escritos" 
              label="Verificar no hay escritos pendientes de resolver." 
              density="compact" 
              hide-details
              :class="{ 'checkbox-active': checkItems.includes('verificar_escritos') }"
            ></v-checkbox>
          </div>

          <v-divider class="mb-2"></v-divider>
        </v-card>

        <!-- Sección de seguimiento de demandados movida aquí -->
        <v-card class="pa-4" elevation="2">
          <div class="d-flex align-center justify-space-between mb-3">
            <h3 class="text-h6">Seguimiento de notificaciones</h3>
            <div>
              <v-btn
                v-if="demandados.length > 3"
                @click="quitarDemandado"
                icon
                size="small"
                variant="text"
                color="var(--custom-orange-accent)"
                class="mr-1"
              >
                <v-icon>mdi-minus</v-icon>
              </v-btn>
              <v-btn
                @click="agregarDemandado"
                icon
                size="small"
                variant="text"
                color="var(--custom-orange-accent)"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </div>
          </div>
          <div class="tabla-demandados">
            <table class="w-100">
              <thead>
                <tr>
                  <th class="text-left" style="width: 40%;">Demandado</th>
                  <th class="text-center" style="width: 20%;">Notif. Demanda</th>
                  <th class="text-center" style="width: 20%;">Req. Pago</th>
                  <th class="text-center" style="width: 20%;">Notif. Prueba</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(demandado, index) in demandados" :key="index">
                  <td>
                    <v-text-field
                      v-model="demandado.nombre"
                      placeholder="Nombre..."
                      density="compact"
                      variant="outlined"
                      hide-details
                      class="input-demandado"
                    ></v-text-field>
                  </td>
                  <td class="text-center">
                    <v-checkbox
                      v-model="demandado.notifDemanda"
                      density="compact"
                      hide-details
                      color="green"
                    ></v-checkbox>
                  </td>
                  <td class="text-center">
                    <v-checkbox
                      v-model="demandado.reqPago"
                      density="compact"
                      hide-details
                      color="green"
                    ></v-checkbox>
                  </td>
                  <td class="text-center">
                    <v-checkbox
                      v-model="demandado.notifPrueba"
                      density="compact"
                      hide-details
                      color="green"
                    ></v-checkbox>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="mt-3 text-right">
            <v-btn 
              color="var(--custom-orange-accent)"
              variant="text" 
              @click="borrarCampos" 
              class="mr-2"
            >
              Borrar
            </v-btn>
            <v-btn color="var(--custom-orange-accent)" variant="text" :to="'/'">Volver</v-btn>
          </div>
        </v-card>
      </v-col>

      <v-col sm="6" md="6" lg="6">
        <v-card class="pa-4" elevation="2">
          <h2 class="mb-4 text-h5">Resolución</h2>
          <div ref="ResolucionText" class="resolucion-texto mb-4" style="max-height: 400px; overflow-y: auto; border: 1px solid #444; padding: 10px; border-radius: 4px;">
            <!-- Resolución dinámica basada en checkboxes -->
            <div v-if="todosCompletos">
              <!-- Si todos los checkboxes están marcados -->
              <p><strong>Resolviendo presentación de fecha XXXX, de folio XXXX:</strong><br></p>
              <p>Como se pide, cítese a las partes para oír sentencia.<br></p>
            </div>
            
            <div v-else-if="faltaSoloNotificacionDemanda">
              <!-- Si solo falta notificación de demanda -->
              <p><strong>Resolviendo presentación de fecha XXXX, de folio XXXX:</strong><br></p>
              <p>Previo a proveer, notifíquese la demanda a todos los demandados.<br></p>
            </div>

            <div v-else-if="faltaSoloCantidadRepLegal">
              <!-- Si solo falta revisar cantidad/rep legal -->
              <p><strong>Resolviendo presentación de fecha XXXX, de folio XXXX:</strong><br></p>
              <p>Previo a proveer, notifíquese la demanda o la resolución que recibe la causa a prueba al representante legal de la demandada don XXXXX.<br></p>
            </div>

            <div v-else-if="faltaSoloTituloCustodiado">
              <!-- Si solo falta custodia del título -->
              <p><strong>Resolviendo presentación de fecha XXXX, de folio XXXX:</strong><br></p>
              <p>Previo a proveer, custódiese el título fundante en dependencias del tribunal, dentro de quinto día, bajo apercibimiento de dar curso progresivo con los antecedentes que constan en autos.<br></p>
            </div>

            <div v-else-if="faltaSoloNotificacionAutoPrueba">
              <!-- Si solo falta notificación auto de prueba -->
              <p><strong>Resolviendo presentación de fecha XXXX, de folio XXXX:</strong><br></p>
              <p>Previo a proveer, notifíquese de la resolución que recibe la causa a prueba a don XXXXX.<br></p>
            </div>

            <div v-else-if="faltaSoloVerificarPrueba">
              <!-- Si solo falta verificar prueba -->
              <p><strong>Resolviendo presentación de fecha XXXX, de folio XXXX:</strong><br></p>
              <p>No ha lugar por ahora, previamente concédase un plazo de tres días para que la parte XXXX indique si se desiste de la prueba, bajo apercibimiento de dar curso progresivo conforme a lo dispuesto en los artículos 431 y 432 del Código de Procedimiento Civil.<br></p>
            </div>

            <div v-else>
              <!-- Si no hay checkboxes marcados o faltan varios -->
              <p>Por favor, seleccione los ítems revisados en el panel izquierdo para generar la resolución correspondiente.</p>
            </div>
          </div>
          
          <div class="text-right">
            <v-tooltip v-model="tooltipVisible" location="bottom">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  @click="copyToClipboard"
                  color="var(--custom-orange-accent)"
                  variant="flat"
                  :disabled="!mostrarResolucion"
                >
                  Copiar
                </v-btn>
              </template>
              <span>Copiar al portapapeles</span>
            </v-tooltip>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'CitarSentenciaView',

  data() {
    return {
      checkItems: [],
      tooltipVisible: false,
      demandados: [
        { nombre: '', notifDemanda: false, reqPago: false, notifPrueba: false },
        { nombre: '', notifDemanda: false, reqPago: false, notifPrueba: false },
        { nombre: '', notifDemanda: false, reqPago: false, notifPrueba: false }
      ]
    };
  },
  
  computed: {
    todosLosItems() {
      return [
        'notificacion_demanda',
        'revisar_cantidad',
        'notificados_calidad',
        'titulo_custodiado',
        'titulo_escaneado',
        'incidente_nulidad',
        'notificacion_auto_prueba',
        'traslado_rebeldia',
        'verificar_prueba'
      ];
    },

    todosCompletos() {
      return this.todosLosItems.every(item => this.checkItems.includes(item));
    },

    faltaSoloNotificacionDemanda() {
      const itemsSinNotifDemanda = this.todosLosItems.filter(item => item !== 'notificacion_demanda');
      return itemsSinNotifDemanda.every(item => this.checkItems.includes(item)) && 
             !this.checkItems.includes('notificacion_demanda');
    },

    faltaSoloCantidadRepLegal() {
      const itemsSinCantidad = this.todosLosItems.filter(item => item !== 'revisar_cantidad');
      return itemsSinCantidad.every(item => this.checkItems.includes(item)) && 
             !this.checkItems.includes('revisar_cantidad');
    },

    faltaSoloTituloCustodiado() {
      const itemsSinTitulo = this.todosLosItems.filter(item => item !== 'titulo_custodiado');
      return itemsSinTitulo.every(item => this.checkItems.includes(item)) && 
             !this.checkItems.includes('titulo_custodiado');
    },

    faltaSoloNotificacionAutoPrueba() {
      const itemsSinAutoPrueba = this.todosLosItems.filter(item => item !== 'notificacion_auto_prueba');
      return itemsSinAutoPrueba.every(item => this.checkItems.includes(item)) && 
             !this.checkItems.includes('notificacion_auto_prueba');
    },

    faltaSoloVerificarPrueba() {
      const itemsSinVerificarPrueba = this.todosLosItems.filter(item => item !== 'verificar_prueba');
      return itemsSinVerificarPrueba.every(item => this.checkItems.includes(item)) && 
             !this.checkItems.includes('verificar_prueba');
    },

    mostrarResolucion() {
      return this.todosCompletos || 
             this.faltaSoloNotificacionDemanda || 
             this.faltaSoloCantidadRepLegal || 
             this.faltaSoloTituloCustodiado || 
             this.faltaSoloNotificacionAutoPrueba || 
             this.faltaSoloVerificarPrueba;
    }
  },
  
  methods: {
    agregarDemandado() {
      this.demandados.push({ 
        nombre: '', 
        notifDemanda: false, 
        reqPago: false, 
        notifPrueba: false 
      });
    },

    quitarDemandado() {
      if (this.demandados.length > 3) {
        this.demandados.pop();
      }
    },

    borrarCampos() {
      this.checkItems = [];
      // Reiniciar a 3 demandados vacíos
      this.demandados = [
        { nombre: '', notifDemanda: false, reqPago: false, notifPrueba: false },
        { nombre: '', notifDemanda: false, reqPago: false, notifPrueba: false },
        { nombre: '', notifDemanda: false, reqPago: false, notifPrueba: false }
      ];
    },
    
    async copyToClipboard() {
      if (!this.$refs.ResolucionText) return;
      try {
        const htmlToCopy = this.$refs.ResolucionText.innerHTML;
        const blobHtml = new Blob([htmlToCopy], { type: 'text/html' });
        const blobText = new Blob([this.$refs.ResolucionText.innerText], { type: 'text/plain' });
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/html': blobHtml,
            'text/plain': blobText
          })
        ]);
        this.tooltipVisible = true;
        setTimeout(() => {
          this.tooltipVisible = false;
        }, 2000);
      } catch (err) {
        console.error('Error al copiar al portapapeles: ', err);
      }
    }
  }
}
</script>

<style scoped>
.checkbox-container-full {
  display: flex;
  flex-direction: column;
  gap: 3px; /* Reducido de 12px a 6px */
}

.checkbox-container-full .v-checkbox {
  margin-bottom: 2px; /* Reducido de 8px a 4px */
}

/* Estilo para checkboxes activos - color verde y negrita */
.checkbox-active :deep(.v-label) {
  color: #4caf50 !important;
  font-weight: bold !important;
}

.checkbox-active :deep(.v-input__control .v-selection-control__input i) {
  color: #4caf50 !important;
}

/* Ajuste para etiquetas largas */
.checkbox-container-full :deep(.v-label) {
  white-space: normal;
  line-height: 1.3; /* Reducido de 1.4 a 1.3 */
  font-size: 0.875rem;
}

/* Reducir espacio entre checkbox icon y label */
.checkbox-container-full :deep(.v-selection-control__wrapper) {
  margin-inline-end: 6px !important; /* Reducido el espacio entre checkbox y texto */
}



.resolucion-texto {
  font-family: 'Batang', serif;
  font-size: 12px;
  text-align: justify;
  line-height: 1.6;
  color: var(--custom-beige-text);
}

.text-h5 {
  color: #E0E0E0;
}

.text-h6 {
  color: #E0E0E0;
}

.text-right {
  text-align: right;
}

/* Estilos para la tabla de demandados */
.tabla-demandados {
  overflow-x: auto;
}

.tabla-demandados table {
  border-collapse: collapse;
  width: 100%;
}

.tabla-demandados th {
  padding: 8px 4px;
  border-bottom: 1px solid #444;
  font-size: 0.875rem;
  color: var(--custom-beige-text);
}

.tabla-demandados td {
  padding: 4px;
  vertical-align: middle;
}

.input-demandado :deep(.v-field__input) {
  font-size: 0.875rem;
  padding: 4px 8px;
  min-height: 32px;
}

.input-demandado :deep(.v-field) {
  min-height: 32px;
}

/* Ajuste para los checkboxes en la tabla */
.tabla-demandados .v-checkbox {
  justify-content: center;
}

.tabla-demandados :deep(.v-checkbox .v-selection-control) {
  min-height: auto;
}

/* Estilos para los botones de agregar/quitar */
.d-flex.align-center.justify-space-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>