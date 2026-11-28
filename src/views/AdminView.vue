<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="pa-4" elevation="2">
          <div class="d-flex align-center mb-4">
            <h2 class="text-h5">Administración de accesos</h2>
            <v-spacer></v-spacer>
            <v-btn color="var(--custom-orange-accent)" variant="text" :to="'/'">Volver</v-btn>
          </div>

          <v-alert v-if="error" type="error" density="compact" variant="tonal" class="mb-4">
            {{ error }}
          </v-alert>

          <!-- Solicitudes pendientes -->
          <h3 class="text-subtitle-1 mb-2">Solicitudes pendientes</h3>
          <div v-if="cargando" class="text-center my-4">
            <v-progress-circular indeterminate color="var(--custom-orange-accent)"></v-progress-circular>
          </div>
          <template v-else>
            <p v-if="solicitudes.length === 0" class="text-caption mb-4" style="color:#9E9E9E;">
              No hay solicitudes pendientes.
            </p>
            <v-list v-else class="mb-4" bg-color="transparent">
              <v-list-item
                v-for="s in solicitudes"
                :key="s.id"
                :title="s.nombre || s.email"
                :subtitle="s.email"
              >
                <template #append>
                  <v-btn
                    color="success"
                    variant="text"
                    size="small"
                    :loading="accion === s.email"
                    @click="aprobar(s)"
                  >
                    Aprobar
                  </v-btn>
                  <v-btn
                    color="error"
                    variant="text"
                    size="small"
                    :loading="accion === s.email"
                    @click="rechazar(s)"
                  >
                    Rechazar
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>
          </template>

          <v-divider class="mb-4"></v-divider>

          <!-- Autorizados -->
          <h3 class="text-subtitle-1 mb-2">Correos autorizados</h3>
          <template v-if="!cargando">
            <p v-if="autorizados.length === 0" class="text-caption" style="color:#9E9E9E;">
              Aún no hay correos autorizados.
            </p>
            <v-list v-else bg-color="transparent">
              <v-list-item
                v-for="a in autorizados"
                :key="a.id"
                :title="a.nombre || a.email"
                :subtitle="a.email"
              >
                <template #append>
                  <v-btn
                    color="error"
                    variant="text"
                    size="small"
                    :loading="accion === a.email"
                    @click="quitar(a)"
                  >
                    Quitar
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>
          </template>

          <v-divider class="my-4"></v-divider>

          <!-- Importar modelos del Drive -->
          <h3 class="text-subtitle-1 mb-2">Importar modelos del Drive</h3>
          <p class="text-caption mb-2" style="color:#9E9E9E;">
            Sube los archivos <code>modelos_*.json</code> exportados del Drive. Reemplaza los existentes.
          </p>
          <v-file-input
            v-model="archivos"
            label="Archivos JSON"
            multiple
            accept=".json,application/json"
            density="compact"
            variant="outlined"
            prepend-icon="mdi-upload"
            hide-details
            class="mb-2"
          ></v-file-input>
          <v-btn
            color="var(--custom-orange-accent)"
            variant="flat"
            :loading="importando"
            :disabled="!archivos || archivos.length === 0"
            @click="importar"
          >
            Importar
          </v-btn>
          <p v-if="progreso" class="text-caption mt-2" style="color:#9E9E9E;">{{ progreso }}</p>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {
  listarSolicitudes,
  listarAutorizados,
  aprobarSolicitud,
  rechazarSolicitud,
  quitarAutorizado
} from '../auth'
import { importarCategorias } from '../modelos'

export default {
  name: 'AdminView',
  data() {
    return {
      solicitudes: [],
      autorizados: [],
      cargando: true,
      accion: '',
      error: '',
      archivos: [],
      importando: false,
      progreso: ''
    }
  },
  async mounted() {
    await this.cargar()
  },
  methods: {
    async cargar() {
      this.cargando = true
      this.error = ''
      try {
        const [sol, aut] = await Promise.all([listarSolicitudes(), listarAutorizados()])
        this.solicitudes = sol
        this.autorizados = aut
      } catch (e) {
        this.error = 'No se pudieron cargar los datos. Revisa tu conexión y las reglas de Firestore.'
      } finally {
        this.cargando = false
      }
    },
    async aprobar(s) {
      this.accion = s.email
      this.error = ''
      try {
        await aprobarSolicitud(s.email, s.nombre || '')
        await this.cargar()
      } catch (e) {
        this.error = 'No se pudo aprobar la solicitud.'
      } finally {
        this.accion = ''
      }
    },
    async rechazar(s) {
      this.accion = s.email
      this.error = ''
      try {
        await rechazarSolicitud(s.email)
        await this.cargar()
      } catch (e) {
        this.error = 'No se pudo rechazar la solicitud.'
      } finally {
        this.accion = ''
      }
    },
    async quitar(a) {
      this.accion = a.email
      this.error = ''
      try {
        await quitarAutorizado(a.email)
        await this.cargar()
      } catch (e) {
        this.error = 'No se pudo quitar el autorizado.'
      } finally {
        this.accion = ''
      }
    },
    async importar() {
      this.importando = true
      this.error = ''
      this.progreso = 'Leyendo archivos…'
      try {
        const arboles = []
        for (const f of this.archivos) {
          const txt = await f.text()
          arboles.push(JSON.parse(txt))
        }
        await importarCategorias(arboles, (hechos, total, nombre) => {
          this.progreso = `Guardando ${hechos}/${total}: ${nombre}`
        })
        this.progreso = `Listo. Se importaron ${arboles.length} categoría(s).`
        this.archivos = []
      } catch (e) {
        this.error = 'Error al importar: ' + (e && e.message ? e.message : e)
        this.progreso = ''
      } finally {
        this.importando = false
      }
    }
  }
}
</script>
