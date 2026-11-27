<template>
  <v-container>
    <v-row>
      <v-col sm="6" md="6" lg="6">
        <v-card class="pa-4" elevation="2">
          <h2 class="mb-4 text-h5">Seleccione el previo</h2>

          <div class="checkbox-container mb-4">
            <v-checkbox
              :model-value="selectedPrevio === 'ratifiquePoder'"
              @update:model-value="val => selectedPrevio = val ? 'ratifiquePoder' : null"
              label="Ratifique poder"
              density="compact"
              hide-details
            ></v-checkbox>
            <v-checkbox
              :model-value="selectedPrevio === 'previoContrato'"
              @update:model-value="val => selectedPrevio = val ? 'previoContrato' : null"
              label="Falta contrato"
              density="compact"
              hide-details
            ></v-checkbox>
            <v-checkbox
              :model-value="selectedPrevio === 'previoPrescripcion'"
              @update:model-value="val => selectedPrevio = val ? 'previoPrescripcion' : null"
              label="Cuotas prescritas"
              density="compact"
              hide-details
            ></v-checkbox>
            <v-checkbox
              :model-value="selectedPrevio === 'previoDeuda'"
              @update:model-value="val => selectedPrevio = val ? 'previoDeuda' : null"
              label="Aclare deuda"
              density="compact"
              hide-details
            ></v-checkbox>
            <v-checkbox
              :model-value="selectedPrevio === 'previoCaja'"
              @update:model-value="val => selectedPrevio = val ? 'previoCaja' : null"
              label="Reprogamación caja"
              density="compact"
              hide-details
            ></v-checkbox>
            <v-checkbox
              :model-value="selectedPrevio === 'previoDiscordancia'"
              @update:model-value="val => selectedPrevio = val ? 'previoDiscordancia' : null"
              label="Discordancia suscriptor"
              density="compact"
              hide-details
            ></v-checkbox>
          </div>

          <div class="mt-6 text-right">
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
          <div
            ref="resolucionText"
            class="resolucion-texto mb-4"
            style="max-height: 400px; overflow-y: auto; border: 1px solid #444; padding: 10px; border-radius: 4px;"
          >
            <p class="indent"><strong>Resolviendo presentación de fecha XXXX de XXXX de XXXX, de folio XXXX:</strong></p>

            <template v-if="selectedPrevio === 'ratifiquePoder'">
              <p class="indent"><strong>A todo:</strong> En atención a la modificación introducida por la Ley Nº 21.394 al artículo 7 de la Ley Nº20.886, previo a resolver, ratifíquese la firma electrónica simple ante el señor Secretario del tribunal, de Lunes a Viernes entre las 08:00 y las 14:00 horas, en las dependencias del Tribunal.</p>
              <p class="indent">Sin perjuicio de lo resuelto, en caso que no sea posible la comparecencia presencial, podrá realizarse la diligencia por vía remota, a través de la plataforma zoom que estará disponible de lunes a viernes desde las 9:00 a las 10:00 horas, debiendo permanecer conectado hasta su atención personalizada. El enlace es el siguiente:</p>
              <p class="zoom-centered">Unirse a la reunión Zoom<br>https://zoom.us/j/99701778374<br>ID de reunión: 997 0177 8374</p>
              <p class="indent">Cumpla con lo ordenado, dentro de tercero día, bajo apercibimiento de no dar curso a la demanda y archivar los antecedentes.</p>
            </template>
            <template v-if="selectedPrevio === 'previoContrato'">
              <p class="indent"><strong>A todo:</strong> Previo a proveer, acompáñese por la parte ejecutante el contrato efectivamente suscrito por el deudor, que lo faculta para suscribir pagarés u otros documentos en su nombre o representación.</p>
              <p class="indent">Cumpla dentro de tercero día bajo apercibimiento de tener por no presentada la demanda.</p>
            </template>
            <template v-if="selectedPrevio === 'previoPrescripcion'">
              <p class="indent"><strong>A todo:</strong> Previo a proveer, atendida la fecha de vencimiento de la obligación, y existiendo períodos prescritos, aclare su presentación en cuanto al vencimiento y mora de los mismos, y, en su caso, rebaje el monto a los períodos no prescritos.</p>
              <p class="indent">Cumpla dentro de tercero día bajo apercibimiento de tener por no presentada la demanda.</p>
            </template>
            <template v-if="selectedPrevio === 'previoDeuda'">
              <p class="indent"><strong>A todo:</strong> Previo a proveer, aclare el ejecutante, el monto total por el cual fue suscrito el pagaré, número de cuotas totales, la fecha de vencimiento y número de cuota en que la parte deudora incurrió en mora.</p>
              <p class="indent">Cumpla dentro de tercero día bajo apercibimiento de tener por no presentada la demanda.</p>
            </template>
            <template v-if="selectedPrevio === 'previoCaja'">
              <p class="indent"><strong>A todo:</strong> Previo a proveer, acompañe documento que acredite haberse efectuado la reprogramación de la deuda por el ejecutado. En su defecto, aclare su presentación en cuanto al vencimiento y mora de las cuotas del pagaré, y señale el monto y fecha de vencimiento por las cuotas no prescritas.</p>
              <p class="indent">Cumpla dentro de tercero día bajo apercibimiento de tener por no presentada la demanda.</p>
            </template>
            <template v-if="selectedPrevio === 'previoDiscordancia'">
              <p class="indent"><strong>A todo:</strong> Previo a proveer, atendida la discordancia entre lo señalado en la demanda y el título que acompaña, respecto al suscriptor, aclare.</p>
              <p class="indent">Cumpla dentro de tercero día bajo apercibimiento de tener por no presentada la demanda.</p>
            </template>
          </div>
          <div class="text-right">
            <v-tooltip v-model="tooltipVisible" location="bottom">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  @click="copyToClipboard"
                  color="var(--custom-orange-accent)"
                  variant="flat"
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
  name: 'PreviosView',

  data() {
    return {
      selectedPrevio: null,
      tooltipVisible: false,
    };
  },

  methods: {
    borrarCampos() {
      this.selectedPrevio = null;
    },

    async copyToClipboard() {
      if (!this.$refs.resolucionText) return;
      try {
        const htmlContent = this.$refs.resolucionText.innerHTML;
        let processedHtml = htmlContent.replace(
          /<p[^>]*class="indent"[^>]*>/g,
          '<p style="text-indent: 2em; margin-bottom: 0.5em;">'
        );
        processedHtml = processedHtml.replace(
          /<p[^>]*class="zoom-centered"[^>]*>/g,
          '<p style="text-align: center; margin-bottom: 0.5em;">'
        );
        const styledHtmlToCopy = `<div style="font-family: Batang, serif; font-size: 12pt; text-align: justify; line-height: 1.5;">${processedHtml}</div>`;
        const plainText = this.$refs.resolucionText.innerText;

        await navigator.clipboard.write([
          new ClipboardItem({
            'text/html': new Blob([styledHtmlToCopy], { type: 'text/html' }),
            'text/plain': new Blob([plainText], { type: 'text/plain' }),
          })
        ]);
        this.tooltipVisible = true;
        setTimeout(() => {
          this.tooltipVisible = false;
        }, 2000);
      } catch (err) {
        console.error('No se pudo copiar el texto: ', err);
      }
    },
  },
};
</script>

<style scoped>
.checkbox-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.checkbox-container > .v-checkbox {
  flex-basis: calc(50% - 4px);
}

.resolucion-texto {
  font-family: 'Batang', serif;
  font-size: 12px;
  text-align: justify;
  line-height: 1.5;
  color: var(--custom-beige-text);
}

.text-h5 {
  color: #E0E0E0;
}

.indent {
  text-indent: 2em;
  margin-bottom: 1em;
}

.zoom-centered {
  text-align: center;
  margin-bottom: 1em;
}

.text-right {
  text-align: right;
}
</style>
