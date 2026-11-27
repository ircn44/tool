<template>
  <v-container>
    <v-row>
      <v-col sm="6" md="6" lg="6">
        <v-card class="pa-4" elevation="2">
          <h2 class="mb-4 text-h5">Requisitos bases de remate</h2>

          <div class="checkbox-container mb-4">
            <v-checkbox
              v-model="requisitos.certificadosActualizados"
              label="Certificados actualizados"
              density="compact"
              hide-details
            ></v-checkbox>
            <v-checkbox
              v-model="requisitos.citarAcreedorHipotecario"
              label="Citar acreedor hipotecario"
              density="compact"
              hide-details
            ></v-checkbox>
            <v-checkbox
              v-model="requisitos.consentirRemate"
              label="Consentir en el remate (mismo acreedor)"
              density="compact"
              hide-details
            ></v-checkbox>
            <v-checkbox
              v-model="requisitos.notificacion486"
              label="Notificación art 486 CPC"
              density="compact"
              hide-details
            ></v-checkbox>
            <v-checkbox
              v-model="requisitos.minimoActualizado"
              label="Mínimo actualizado"
              density="compact"
              hide-details
            ></v-checkbox>
            <v-checkbox
              v-model="requisitos.deslindesLimitaciones"
              label="Deslindes y limitaciones"
              density="compact"
              hide-details
            ></v-checkbox>
          </div>

          <template v-if="todosMarcados">
            <h3 class="text-subtitle-1 mb-2 mt-2">Cláusulas que se mantienen</h3>
            <v-select
              v-model="clausulasIndividualizacion"
              :items="opcionesClausula"
              label="Individualización del inmueble y gravámenes"
              density="compact"
              hide-details
              class="mb-3"
              multiple
              chips
            ></v-select>
            <v-select
              v-model="clausulaMinimo"
              :items="opcionesClausula"
              label="Mínimo a fijar para la subasta"
              density="compact"
              hide-details
              class="mb-3"
            ></v-select>
            <v-checkbox
              v-model="sinFecha"
              label="Sin fecha"
              density="compact"
              hide-details
            ></v-checkbox>
          </template>

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
            <template v-if="todosMarcados">
              <div v-html="modeloBases"></div>
            </template>

            <template v-else>
              <p class="indent"><strong>Resolviendo presentación de fecha XXXX de XXXX de XXXX, de folio XXXX:</strong></p>
              <p class="indent" v-html="cuerpoResolucion"></p>
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
  name: 'BasesRemateView',

  data() {
    return {
      requisitos: {
        certificadosActualizados: false,
        citarAcreedorHipotecario: false,
        consentirRemate: false,
        notificacion486: false,
        minimoActualizado: false,
        deslindesLimitaciones: false,
      },
      tooltipVisible: false,
      sinFecha: false,
      // Cada cláusula es un fragmento verbo-inicial (imperativo enclítico) que se
      // encadena tras "Previo a proveer,". El orden de este arreglo es el orden en
      // que aparecerán cuando su checkbox esté DESMARCADO. La citación va primera.
      clausulas: [
        {
          key: 'citarAcreedorHipotecario',
          fragmento: 'cítese al acreedor hipotecario Banco XXXXXXX, representada legalmente por XXXXXXX, con domicilio en XXXXXXX, con el fin de que haga valer sus derechos, si así lo estima pertinente, respecto a la hipoteca constituida a su favor a Fs. XXXX Nro. XXXX del año XXXX y la prohibición de celebrar actos y contratos inscritos a Fs. xxxx Nro. xxxx del año xxxx, del Registro de Hipotecas y Gravámenes del Conservador de Bienes Raíces de xxxxx, en conformidad a lo dispuesto en el artículo 2428 del Código Civil. Notifíquese personalmente o, de conformidad a lo dispuesto en el artículo 44 del Código de Procedimiento Civil, para tales efectos',
        },
        {
          key: 'certificadosActualizados',
          fragmento: 'acompáñese certificado de hipotecas y gravámenes, con una vigencia no superior a los 30 días al momento de su presentación',
        },
        {
          key: 'deslindesLimitaciones',
          fragmento: 'compleméntense las bases de remate incluyendo los deslindes y todas las limitaciones al dominio del inmueble a subastar',
        },
        {
          key: 'minimoActualizado',
          fragmento: 'actualícese el mínimo para la subasta acompañando certificado de avalúo fiscal correspondiente al segundo semestre del año en curso',
        },
        {
          key: 'consentirRemate',
          fragmento: 'señálese lo que corresponda de conformidad con lo dispuesto en el artículo 1464 N°3 del Código Civil',
        },
        {
          key: 'notificacion486',
          fragmento: 'cúmplase con la notificación por cédula de conformidad con lo dispuesto en el artículo 486 del Código de Procedimiento Civil',
        },
      ],
      // Cláusulas de la propuesta del ejecutante que el Tribunal mantiene.
      // El usuario elige qué número de cláusula corresponde a cada concepto;
      // el articulado posterior se renumera saltando estos números.
      clausulasIndividualizacion: [1, 2],
      clausulaMinimo: 3,
      opcionesClausula: [
        { title: 'Primera', value: 1 },
        { title: 'Segunda', value: 2 },
        { title: 'Tercera', value: 3 },
        { title: 'Cuarta', value: 4 },
        { title: 'Quinta', value: 5 },
      ],
      // Texto fijo del modelo que precede al articulado.
      vistosIntro: `
        <p class="indent"><strong>A la presentación de fecha XXX de XXXX de XXXX, de folio XXXX:</strong></p>
        <p class="indent"><strong>VISTOS:</strong></p>
        <p class="indent">Teniendo presente el término del estado de alerta sanitaria el día 31 de agosto de 2023, de conformidad a lo dispuesto en el inciso segundo del artículo 495 del Código de Procedimiento Civil, y que el desarrollo de las audiencias de remate mediante la plataforma zoom no ha significado ningún inconveniente para todos los intervinientes, y que además las dependencias del Tribunal no permiten una alta concurrencia como suele ocurrir en las subastas de inmuebles, se resuelve mantener dicha modalidad y se estará al siguiente proveído respecto de las bases de remate propuestas por la ejecutante.</p>
      `,
      // Cláusulas del articulado, en orden. Cada elemento es un arreglo de párrafos:
      // el primero recibe el ordinal (en negrita) que se asigna dinámicamente; los
      // demás son párrafos de continuación de esa misma cláusula.
      clausulasCorte: [
        [
          'La subasta se realizará por videoconferencia, mediante la función de la plataforma Zoom, el día XXXX de XXX de XXXX, a las XXXX horas. Los oferentes que cumplan con lo establecido en las bases podrán participar en la subasta y se adjudicará a la oferta más alta sobre el mínimo fijado.',
          'Para participar en la subasta los interesados deberán entregar vale vista a la orden del Tribunal, nominativo o endosable, por el monto que corresponda al 10% del mínimo. Esta será la única forma de constituir garantía suficiente para la subasta.',
          'No se podrá válidamente constituir garantía mediante depósito en la cuenta corriente del Tribunal, cupón de pago del Banco, ni transferencia electrónica.',
          'Los interesados en participar de la subasta junto al vale vista, deberán entregar copia digitalizada de su carnet de identidad, además de señalar el nombre completo del postor, su email y teléfono, con al menos veinticuatro horas de anticipación a la fecha fijada para el remate, a fin de verificar la garantía, y la observancia de las normas legales para la participación en la subasta.',
          'Sólo cumplidos los trámites señalados, se remitirá vía correo electrónico el link con la invitación a la subasta. La garantía para aquellos postores que no se adjudiquen el bien subastado será devuelta mediante la devolución del vale vista a quien corresponda; mientras que la garantía rendida por el que se adjudique la propiedad se imputará como parte del precio.',
          'Cada postor será responsable de verificar que se efectúe en forma oportuna y correctamente la constitución de la garantía en la causa que corresponda.',
          'Todo interesado en participar en la subasta como postor, deberá tener activa su Clave Única del Estado, para la eventual suscripción de la correspondiente acta de remate.',
        ],
        [
          'El ministro de fe del Tribunal, con objeto de dar cumplimiento a lo dispuesto en el inciso quinto del artículo 29 de la Ley N° 21.389, deberá corroborar en el Registro de Deudores de Pensión de Alimentos, si el postor registra inscripción vigente en calidad de deudor de alimentos. En caso afirmativo, se excluirá del listado de postores autorizados para participar en la subasta.',
          'Luego, el ministro de fe del tribunal certificará la suficiencia de las garantías que se hubieren depositado para participar en la subasta individualizando al postor, monto y número de vale vista.',
          'Verificado ello se le remitirá a cada postor un correo electrónico, con los antecedentes para conectarse a la audiencia de remate, siendo carga de los interesados el disponer de los elementos tecnológicos y de conexión necesarios para participar, correspondiendo al Tribunal el coordinar su ingreso y participación con la debida anticipación.',
        ],
        [
          'El ejecutante, o en su caso, el tercerista de prelación que haga valer su crédito preferente, podrá participar en la subasta sin necesidad de rendir caución, y en caso de adjudicarse el inmueble con cargo al crédito que cobra en estos autos en un monto superior a éste, deberá consignar la diferencia dentro de quinto día hábil de practicada la liquidación del crédito y las costas; y cumplido ello se procederá a escriturar la adjudicación.',
        ],
        [
          'Concluida la subasta, se verificarán los datos del adjudicatario y se le enviará a su correo electrónico un borrador del acta de remate, el que deberá de suscribirla mediante firma electrónica avanzada, y en caso de no contar con ésta, mediante firma electrónica simple (clave única), e ingresarla, de manera inmediata, en la causa correspondiente a través de la Oficina Judicial Virtual, para ser incorporada a la tramitación de la causa y ser firmada por la juez o juez de la causa y el ministro de fe quienes lo harán con su firma electrónica avanzada.',
          'El adjudicatario deberá consignar el saldo del precio dentro de quinto día hábil de realizada la subasta mediante depósito en la cuenta corriente del Tribunal.',
        ],
        [
          'Si no se entera el precio del remate en la oportunidad fijada en el numeral anterior, quedará sin efecto la subasta y se perderá por vía de pena la cantidad entregada en garantía, la que se girará en la forma prevenida por el artículo 494 del Código de Procedimiento Civil.',
        ],
        [
          'El adjudicatario, incluido el ejecutante en su caso, deberá suscribir la escritura pública de compraventa en el plazo de veinte días hábiles, contados desde la fecha en que se certifique que se encuentra ejecutoriada la resolución que ordena extenderla, una vez vencido el plazo de citación. Con todo, el referido plazo para escriturar no podrá exceder, en ningún caso, los 40 días hábiles en el caso que se pida ampliación fundada para ello.',
        ],
        [
          'El Notario Público no extenderá la escritura pública de compraventa, mientras no verifique que el adjudicatario no tiene una inscripción vigente en el Registro en calidad de deudor de alimentos. Si por lo dispuesto anteriormente no pudiere suscribirse la escritura pública de compraventa, el tribunal deberá dejar sin efecto el acta de remate y el proceso de subasta pública, haciendo efectiva la garantía de seriedad de la oferta, en los términos del artículo 494 del Código de Procedimiento Civil, y dispondrá la devolución del dinero del precio de venta consignado por el adjudicatario, con deducción del monto que éste adeude por pensión alimenticia, el que será retenido y pagado a su alimentario, en conformidad a la Ley.',
        ],
        [
          'El inmueble se rematará como especie o cuerpo cierto en el estado en que se encuentre al día del remate, con todos sus usos, costumbres, derechos y servidumbres, libres de todo embargo, prohibiciones e hipotecas si correspondiere, debiendo decretarse el alzamiento de ellos a solicitud de parte interesada. En cuanto al saneamiento debe estarse a lo dispuesto en los artículos 1801 inciso 2° y 1851 del Código Civil.',
        ],
        [
          'En cuanto a las hipotecas que pudieren haberse constituido sobre la propiedad a subastar, si habiendo el ejecutante citado a los acreedores hipotecarios en los términos dispuestos en el artículo 2428 del Código Civil, y habiendo transcurrido el plazo de emplazamiento entre la citación y el remate, estos nada señalen, u opten por pagarse de su crédito con el producto de la subasta según su grado de preferencia, se entenderán purgadas las referidas hipotecas.',
        ],
        [
          'Sólo se podrá solicitar el giro de los fondos producto de la subasta, así como los alzamientos de los gravámenes que correspondiere, una vez suscrita la escritura pública de adjudicación y certificado lo anterior por el Señor Secretario del Tribunal.',
        ],
        [
          'En caso que el ejecutado solicite el giro de los fondos producto de la subasta, el Sr. Secretario del Tribunal, deberá corroborar en el Registro de Deudores de Pensión de Alimentos si éste registra inscripción vigente en calidad de deudor de alimentos. En caso afirmativo, el tribunal, al hacer el pago, deberá considerar al alimentario como un acreedor preferente, en los términos del número 5 del artículo 2472 del Código Civil. Respecto del pago que al alimentario corresponda, deberá el tribunal hacer la retención correspondiente y pagar a través del depósito de los fondos en la cuenta bancaria inscrita en el Registro.',
          'Esta retención corresponderá al monto equivalente al cincuenta por ciento o el monto total de los alimentos adeudados si éste es inferior, y pagar dicha suma al alimentario a través del depósito de los fondos en la cuenta bancaria inscrita en el Registro.',
        ],
        [
          'Todos los gastos, derechos, impuestos e inscripciones de la escritura de compraventa, así como el pago de los impuestos territoriales, gastos municipales, contribuciones de aseo, gastos comunes y/o cuentas de servicios básicos de toda índole que se encontraren impagos, serán de cargo del adjudicatario. Sólo se considerarán como gastos del juicio las costas procesales y personales.',
        ],
        [
          'El adjudicatario deberá fijar domicilio dentro de los límites urbanos del tribunal, a fin que se le notifiquen las resoluciones que procedieren, bajo apercibimiento de ser notificado solo por estado diario. Asimismo, los contratantes deberán fijar domicilio en la ciudad de Santiago para los efectos de este juicio y de todos los previstos en las presentes bases de remate.',
        ],
        [
          'La aprehensión material del inmueble por el adjudicatario deberá hacerse en conformidad a la ley.',
        ],
        [
          'Si el ejecutante o un tercero pretenden hacer valer créditos distintos al cobrado en este juicio, deberá formular la petición incidental que correspondiere, con 72 horas de anticipación a la fecha del remate y acreditar la existencia, naturaleza, exigibilidad y monto del crédito perseguido, de forma legal.',
        ],
        [
          'En las publicaciones legales deberá indicarse que el remate se realizará por videoconferencia, vía plataforma zoom, aludiendo a los requisitos necesarios para participar en la misma. El ejecutante deberá acompañar hasta las 12:00 horas, del día anterior a la fecha de la subasta, las publicaciones que anuncian la subasta, mediante su incorporación digital a la causa. Este Tribunal no autoriza publicaciones destacadas o comerciales, porque ello hace más gravosa las costas del juicio en perjuicio del ejecutado.',
        ],
        [
          'Los certificados de dominio con vigencia y de hipotecas gravámenes y prohibiciones del inmueble a subastar, deberán ser acompañados al proceso con una antigüedad no mayor de veinte días hábiles anteriores a la fecha de subasta. Si ello no se cumpliere, no se llevará a efecto la subasta el día decretado. Asimismo no deberán tener una data superior a los veinte días previos a la fecha del remate. Todo lo anterior, bajo apercibimiento de suspender la subasta sin más trámite.',
        ],
        [
          'Todos los antecedentes e informaciones técnicas y jurídicas relativas a la propiedad que se remata, deben considerarse a título meramente ilustrativo e informativo, por lo que será de la exclusiva responsabilidad de los interesados visitar los inmuebles, estudiar sus títulos y antecedentes técnicos, no aceptándose reclamos posteriores a la adjudicación, en razón de desconocimiento de los antecedentes del inmueble.',
          'Además las partes podrán acompañar al correo electrónico mencionado en la base cuarta hasta dos fotografías de la propiedad a subastar para ser publicadas en el sitio web del Poder Judicial, no siendo responsabilidad de este último, el contenido proporcionado por los interesados a través de la página web ni el estado en que se encuentre actualmente el inmueble.',
          'Practíquense las publicaciones legales en el Diario El Mercurio de Santiago.',
        ],
      ],
    };
  },

  computed: {
    todosMarcados() {
      return Object.values(this.requisitos).every(Boolean);
    },

    cuerpoResolucion() {
      // Cláusulas activas = checkbox DESMARCADO (requisito no cumplido).
      const activas = this.clausulas.filter(c => !this.requisitos[c.key]);
      if (activas.length === 0) return '';

      const conectoresMedio = ['Asimismo,', 'Del mismo modo,', 'Adicionalmente,', 'Por otra parte,'];

      const partes = activas.map((c, i) => {
        let prefijo;
        if (i === 0) {
          prefijo = 'Previo a proveer,';
        } else if (i === activas.length - 1) {
          prefijo = activas.length === 2 ? 'Asimismo,' : 'Finalmente,';
        } else {
          prefijo = conectoresMedio[(i - 1) % conectoresMedio.length];
        }
        return `${prefijo} ${c.fragmento}.`;
      });

      return `<strong>A todo:</strong> ${partes.join(' ')}`;
    },

    modeloBases() {
      const ind = [...this.clausulasIndividualizacion].sort((a, b) => a - b);
      const min = this.clausulaMinimo;
      const mantenidas = [...new Set([...ind, min])];

      // Frase "Se mantiene …", evitando repetir el ordinal cuando el mínimo
      // coincide con una de las cláusulas de individualización.
      let frase;
      if (ind.length === 0) {
        frase = `la cláusula ${this.ordinalFemenino(min)} del mínimo a fijar para la subasta`;
      } else if (ind.includes(min)) {
        frase = `${this.fraseClausulas(ind)} de individualización del inmueble y sus gravámenes y del mínimo a fijar para la subasta`;
      } else {
        frase = `${this.fraseClausulas(ind)} de individualización del inmueble y sus gravámenes y cláusula ${this.ordinalFemenino(min)} del mínimo a fijar para la subasta`;
      }
      const seMantiene = `<p class="indent">Se mantiene ${frase}, dejándose sin efecto todas las demás cláusulas, debiendo estar a lo que se indica, con citación.</p>`;

      // A cada cláusula del articulado se le asigna el siguiente número correlativo
      // que NO esté ocupado por una cláusula mantenida.
      let n = 0;
      const articulado = this.clausulasCorte.map(parrafos => {
        n += 1;
        while (mantenidas.includes(n)) n += 1;
        const ordinal = this.ordinalMasculino(n);
        return parrafos
          .map((texto, i) =>
            i === 0
              ? `<p class="indent"><strong>${ordinal}:</strong> ${texto}</p>`
              : `<p class="indent">${texto}</p>`
          )
          .join('');
      });

      let html = this.vistosIntro + seMantiene + articulado.join('');

      // "Sin fecha": reemplaza el día/hora concretos por "en el día y hora a fijar".
      if (this.sinFecha) {
        html = html.replace(
          'el día XXXX de XXX de XXXX, a las XXXX horas',
          'en el día y hora a fijar'
        );
      }

      return html;
    },
  },

  methods: {
    ordinalFemenino(n) {
      const o = ['primera', 'segunda', 'tercera', 'cuarta', 'quinta'];
      return o[n - 1] || `${n}ª`;
    },

    // Enumera cláusulas en femenino: "la cláusula primera" / "las cláusulas primera y segunda".
    fraseClausulas(nums) {
      const ord = nums.map(n => this.ordinalFemenino(n));
      if (ord.length === 1) return `la cláusula ${ord[0]}`;
      return `las cláusulas ${ord.slice(0, -1).join(', ')} y ${ord[ord.length - 1]}`;
    },

    ordinalMasculino(n) {
      const o = [
        'PRIMERO', 'SEGUNDO', 'TERCERO', 'CUARTO', 'QUINTO', 'SEXTO', 'SÉPTIMO',
        'OCTAVO', 'NOVENO', 'DÉCIMO', 'UNDÉCIMO', 'DUODÉCIMO', 'DÉCIMO TERCERO',
        'DÉCIMO CUARTO', 'DÉCIMO QUINTO', 'DÉCIMO SEXTO', 'DÉCIMO SÉPTIMO',
        'DÉCIMO OCTAVO', 'DÉCIMO NOVENO', 'VIGÉSIMO', 'VIGÉSIMO PRIMERO',
        'VIGÉSIMO SEGUNDO', 'VIGÉSIMO TERCERO', 'VIGÉSIMO CUARTO', 'VIGÉSIMO QUINTO',
      ];
      return o[n - 1] || `${n}`;
    },

    borrarCampos() {
      Object.keys(this.requisitos).forEach(key => {
        this.requisitos[key] = false;
      });
      this.clausulasIndividualizacion = [1, 2];
      this.clausulaMinimo = 3;
      this.sinFecha = false;
    },

    async copyToClipboard() {
      if (!this.$refs.resolucionText) return;
      try {
        const htmlContent = this.$refs.resolucionText.innerHTML;
        let processedHtml = htmlContent.replace(
          /<p[^>]*class="indent"[^>]*>/g,
          '<p style="text-indent: 2em; margin-bottom: 0.5em;">'
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

.text-right {
  text-align: right;
}
</style>
