<template>
  <v-container>
    <v-row>
      <v-col sm="6" md="6" lg="6">
        <v-card class="pa-4" elevation="2">
          <h1 class="mb-4 text-h5">Excepciones comunes</h1>

          <div class="checkbox-container mb-4">
            <v-checkbox v-model="excepciones" value="Falta de capacidad" label="Falta de capacidad" density="compact" hide-details></v-checkbox>
            <v-checkbox v-model="excepciones" value="Falsedad del título" label="Falsedad del título" density="compact" hide-details></v-checkbox>
            <v-checkbox v-model="excepciones" value="Falta de requisitos" label="Falta de requisitos" density="compact" hide-details></v-checkbox>
            <v-checkbox v-model="excepciones" value="Exceso de avalúo" label="Exceso de avalúo" density="compact" hide-details></v-checkbox>
            <v-checkbox v-model="excepciones" value="Pago de la deuda" label="Pago de la deuda" density="compact" hide-details></v-checkbox>
            <v-checkbox v-model="excepciones" value="Concesión de esperas" label="Concesión de esperas" density="compact" hide-details></v-checkbox>
            <v-checkbox v-model="excepciones" value="Nulidad de la obligación" label="Nulidad de la obligación" density="compact" hide-details></v-checkbox>
            <v-checkbox v-model="excepciones" value="Litispendencia" label="Litispendencia" density="compact" hide-details></v-checkbox>
            <v-checkbox v-model="excepciones" value="Beneficio de excusión" label="Beneficio de excusión" density="compact" hide-details></v-checkbox>
            <v-checkbox v-model="excepciones" value="Remisión" label="Remisión" density="compact" hide-details></v-checkbox>
            <v-checkbox v-model="excepciones" value="Novación" label="Novación" density="compact" hide-details></v-checkbox>
            <v-checkbox v-model="excepciones" value="Compensación" label="Compensación" density="compact" hide-details></v-checkbox>
            <v-checkbox v-model="excepciones" value="Pérdida de la cosa" label="Pérdida de la cosa" density="compact" hide-details></v-checkbox>
            <v-checkbox v-model="excepciones" value="Transacción" label="Transacción" density="compact" hide-details></v-checkbox>
            <v-checkbox v-model="excepciones" value="Cosa Juzgada" label="Cosa Juzgada" density="compact" hide-details></v-checkbox>
          </div>
          <v-divider class="mb-4"></v-divider>
          <div class="checkbox-container2">
            <v-checkbox v-model="excepciones" value="Incompetencia" label="Incompetencia" density="compact" hide-details></v-checkbox>
            <v-checkbox v-model="excepciones" value="Ineptitud del libelo" label="Ineptitud del libelo" density="compact" hide-details></v-checkbox>
            <v-checkbox v-model="excepciones" value="Prescripción" label="Prescripción" density="compact" hide-details></v-checkbox>
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
          <div ref="ResolucionText" class="resolucion-texto mb-4" style="max-height: 400px; overflow-y: auto; border: 1px solid #444; padding: 10px; border-radius: 4px;">
            <p><strong>Resolviendo presentación de fecha XXXX de XXXXX de XXXX, de folio XXXX:</strong><br></p>
            <p>Téngase por evacuado el traslado conferido por resolución de folio XXXX. Estese a lo que se resolverá. <br></p>
            <p><strong>VISTOS:</strong><br></p>
            <p>Se declaran admisibles las excepciones deducidas, y se reciben a prueba por el término legal, fijándose como puntos sobre los cuales deberán recaer, los siguientes:<br></p>
            <ol v-if="puntosNumerados.length > 0" class="pl-5">
              <li v-for="(texto, index) in puntosNumerados" :key="index">
                {{ texto }}
              </li>
            </ol>

            <div v-if="excepcionesNoNumeradas.length > 0">
              <p v-for="(excepcion, index) in excepcionesNoNumeradas" :key="index">
                {{ generarTexto(excepcion) }}
              </p>
            </div>

            <br><p>En caso que las partes ofrezcan prueba testimonial y/o confesional dentro del plazo legal, esta se rendirá en forma presencial en el tribunal los últimos tres días del probatorio a las 9:30 horas, principiando con el demandante.</p> <br>
            <p><strong>Notifíquese por cédula.</strong></p>
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
  name: 'CausaapruebaView', 

  data() {
    return {
      excepciones: [],
      tooltipVisible: false,
    };
  },
  computed: {
    excepcionesFiltradas() {
      const grupo1 = ['Falta de capacidad', 'Falsedad del título', 'Falta de requisitos', 'Exceso de avalúo', 'Pago de la deuda', 'Concesión de esperas', 'Nulidad de la obligación', 'Litispendencia', 'Beneficio de excusión', 'Remisión', 'Novación', 'Compensación', 'Pérdida de la cosa', 'Transacción', 'Cosa Juzgada'];
      return this.excepciones.filter(ex => grupo1.includes(ex));
    },
    excepcionesNoNumeradas() {
      const grupo2 = ['Incompetencia', 'Ineptitud del libelo', 'Prescripción'];
      return this.excepciones.filter(ex => grupo2.includes(ex));
    },
    puntosNumerados() {
      const puntos = [];
      this.excepcionesFiltradas.forEach(ex => {
        const texto = this.generarTexto(ex);
        if (Array.isArray(texto)) {
          puntos.push(...texto);
        } else {
          puntos.push(texto);
        }
      });
      return puntos;
    }
  },
  methods: {
    // MÉTODO BORRAR CAMPOS AÑADIDO AQUÍ
    borrarCampos() {
      this.excepciones = [];
    },
    generarTexto(excepcion) {
      if (excepcion === 'Incompetencia') {
        return 'Respecto a la excepción de incompetencia, se omite su recepción a prueba por tratarse de un punto de derecho.';
      } else if (excepcion === 'Falta de capacidad') {
        return 'Efectividad de existir la falta de capacidad del demandante o de la personería o representación legal de la persona que comparece en su nombre para actuar en autos.';
      } else if (excepcion === 'Ineptitud del libelo') {
        return 'Respecto a la excepción de ineptitud del libelo, atendida su naturaleza, se omite su recepción a prueba.';
      } else if (excepcion === 'Falsedad del título') {
        return 'Efectividad que el título que se hace valer en juicio es falso.';
      } else if (excepcion === 'Falta de requisitos') {
        return 'Efectividad que el título que se hace valer en juicio carece de alguno de los requisitos o condiciones que establece la ley para que tenga mérito ejecutivo.';
      } else if (excepcion === 'Pago de la deuda') {
        return 'Efectividad que las demandadas pagaron total o parcialmente la obligación que se persigue; fechas y montos.';
      } else if (excepcion === 'Concesión de esperas') {
        return 'Efectividad de haber concedido la ejecutante esperas o prórrogas del plazo a la ejecutada.';
      } else if (excepcion === 'Novación') { 
        return 'Efectividad que la obligación que se persigue en autos fue objeto de novación.';
      } else if (excepcion === 'Nulidad de la obligación') {
        return 'Efectividad que la obligación que se persigue en estos autos es nula.';
      } else if (excepcion === 'Exceso de avalúo') { 
        return 'Efectividad de existir un exceso de avalúo de los casos contemplados en los números 2° y 3° del art. 438 del Código de Procedimiento Civil, al momento de cuantificar el monto del presente negocio por la parte demandante.';
      } else if (excepcion === 'Beneficio de excusión') { 
        return 'Garantías y cauciones que se constituyeron con ocasión de la obligación que se persigue en autos. En su caso, efectividad de existir deudores subsidiarios.';
      } else if (excepcion === 'Remisión') { 
        return 'Efectividad de haberse extinguido la obligación por operar la remisión de la deuda.';
      } else if (excepcion === 'Compensación') { 
        return 'Efectividad que entre la parte ejecutante y la ejecutada, se haya producido una compensación total o parcial de la obligación perseguida en el presente juicio.';
      } else if (excepcion === 'Litispendencia') { 
        return 'Efectividad de existir identidad legal de personas, de la cosa pedida, y de la causa de pedir, entre las partes de este juicio y las que comparecen en los autos Rol C-XXXX-XXXX, seguidos ante el XX° Juzgado Civil de Santiago';
      } else if (excepcion === 'Prescripción') {
        return 'Respecto a la excepción de prescripción, atendida su naturaleza, se omite su recepción a prueba.';
      } else if (excepcion === 'Pérdida de la cosa') {
        return 'Efectividad de haberse perdido la cosa debida, por un hecho no imputable a la demandada. Hechos y circunstancias.';
      } else if (excepcion === 'Transacción') {
        return [
          'Efectividad de haber operado transacción en relación a la obligación que se persigue en autos; circunstancias.',
          'Existencia, condiciones y estipulaciones de la transacción invocada por el ejecutado.'
        ];
      } else if (excepcion === 'Cosa Juzgada') {
        return 'Efectividad de existir identidad legal de personas, de la cosa pedida y de la causa de pedir, entre las partes de este juicio y las que comparecen en los autos Rol C-XXXX-XXX, caratulados "XXXX", seguidos ante el XX° Juzgado Civil de XXXX.';
      }
      return '';
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
.checkbox-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px; 
}

.checkbox-container > .v-checkbox {
  flex-basis: calc(50% - 4px); 
}

.checkbox-container2 {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.checkbox-container2 > .v-checkbox {
  flex-basis: calc(50% - 4px);
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

.text-right {
  text-align: right;
}
</style>