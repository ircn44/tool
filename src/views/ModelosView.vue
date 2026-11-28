<template>
  <v-container>
    <v-card class="pa-4" elevation="2">
      <!-- Encabezado: breadcrumb + inicio -->
      <div class="d-flex align-center mb-3 flex-wrap" style="gap:8px;">
        <div class="breadcrumb">
          <a @click="irIndice">Modelos</a>
          <template v-if="catTree">
            <span class="sep">/</span><a @click="irCategoria">{{ catTree.name }}</a>
          </template>
          <template v-for="(f, i) in path" :key="i">
            <span class="sep">/</span><a @click="irPath(i)">{{ f.name }}</a>
          </template>
        </div>
        <v-spacer></v-spacer>
        <v-btn variant="text" color="var(--custom-orange-accent)" :to="'/'">Inicio</v-btn>
      </div>

      <!-- Buscador (dentro de una categoría, en modo navegación) -->
      <v-text-field
        v-if="catTree && !docSel"
        v-model="buscar"
        label="Buscar modelo en esta categoría"
        prepend-inner-icon="mdi-magnify"
        density="compact"
        variant="outlined"
        hide-details
        clearable
        class="mb-4"
      ></v-text-field>

      <!-- Cargando / error -->
      <div v-if="loading" class="text-center my-6">
        <v-progress-circular indeterminate color="var(--custom-orange-accent)"></v-progress-circular>
      </div>
      <v-alert v-else-if="error" type="error" density="compact" variant="tonal">
        {{ error }}
      </v-alert>

      <!-- Vista de un modelo -->
      <template v-else-if="docSel">
        <div class="d-flex align-center mb-3" style="gap:8px;">
          <h3 class="text-subtitle-1">{{ docSel.name }}</h3>
          <v-spacer></v-spacer>
          <v-btn variant="text" size="small" @click="docSel = null">Volver</v-btn>
        </div>
        <template v-if="docSel.html">
          <div ref="docHtml" class="modelo-contenido" v-html="docSel.html"></div>
          <div class="text-right mt-3">
            <span v-if="errorCopia" class="text-caption mr-3" style="color:#FF8A65;">No se pudo copiar</span>
            <v-btn color="var(--custom-orange-accent)" variant="flat" @click="copiar">
              {{ copiado ? '¡Copiado!' : 'Copiar' }}
            </v-btn>
          </div>
        </template>
        <v-alert v-else type="info" density="compact" variant="tonal">
          Este archivo no es un documento de texto ({{ docSel.tipoArchivo || 'otro' }}).
          <a :href="docSel.url" target="_blank" rel="noopener">Abrir en Drive</a>
        </v-alert>
      </template>

      <!-- Resultados de búsqueda -->
      <template v-else-if="resultadosBusqueda">
        <p v-if="resultadosBusqueda.length === 0" class="text-caption" style="color:#9E9E9E;">
          Sin resultados para "{{ buscar }}".
        </p>
        <v-list v-else bg-color="transparent">
          <v-list-item
            v-for="(r, i) in resultadosBusqueda"
            :key="i"
            :title="r.node.name"
            :subtitle="r.ruta"
            prepend-icon="mdi-file-document-outline"
            @click="docSel = r.node"
          ></v-list-item>
        </v-list>
      </template>

      <!-- Índice de categorías -->
      <template v-else-if="!catTree">
        <p v-if="categorias.length === 0" class="text-caption" style="color:#9E9E9E;">
          Todavía no hay modelos cargados.
        </p>
        <div class="botones">
          <v-btn
            v-for="c in categorias"
            :key="c.id"
            class="boton-item"
            color="var(--custom-orange-accent)"
            variant="flat"
            prepend-icon="mdi-folder"
            @click="abrirCategoria(c)"
          >
            {{ c.nombre }}
          </v-btn>
        </div>
      </template>

      <!-- Navegación dentro de una categoría -->
      <template v-else>
        <p v-if="hijos.length === 0" class="text-caption" style="color:#9E9E9E;">
          Carpeta vacía.
        </p>
        <div class="botones">
          <v-btn
            v-for="(n, i) in hijos"
            :key="i"
            class="boton-item"
            :color="n.type === 'folder' ? 'var(--custom-orange-accent)' : undefined"
            :variant="n.type === 'folder' ? 'flat' : 'outlined'"
            :prepend-icon="n.type === 'folder' ? 'mdi-folder' : 'mdi-file-document-outline'"
            @click="abrir(n)"
          >
            {{ n.name }}
          </v-btn>
        </div>
      </template>
    </v-card>
  </v-container>
</template>

<script>
import { cargarIndice, cargarCategoria } from '../modelos'

export default {
  name: 'ModelosView',
  data() {
    return {
      categorias: [],
      catTree: null,
      path: [],
      docSel: null,
      buscar: '',
      loading: true,
      error: '',
      copiado: false,
      errorCopia: false
    }
  },
  computed: {
    nodoActual() {
      if (!this.catTree) return null
      return this.path.length ? this.path[this.path.length - 1] : this.catTree
    },
    hijos() {
      return this.nodoActual ? (this.nodoActual.children || []) : []
    },
    resultadosBusqueda() {
      const q = this.norm((this.buscar || '').trim())
      if (!this.catTree || !q) return null
      const out = []
      const walk = (node, ruta) => {
        const items = node.children || []
        items.forEach((c) => {
          if (c.type === 'doc') {
            if (this.norm(c.name).includes(q)) out.push({ node: c, ruta: ruta.join(' / ') })
          } else {
            walk(c, ruta.concat(c.name))
          }
        })
      }
      walk(this.catTree, [this.catTree.name])
      return out
    }
  },
  async mounted() {
    try {
      this.categorias = await cargarIndice()
    } catch (e) {
      this.error = 'No se pudieron cargar los modelos. Revisa tu acceso.'
    } finally {
      this.loading = false
    }
  },
  methods: {
    norm(s) {
      return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    },
    async abrirCategoria(c) {
      this.loading = true
      this.error = ''
      this.buscar = ''
      this.path = []
      this.docSel = null
      try {
        const res = await cargarCategoria(c.id)
        this.catTree = res ? res.arbol : null
        if (!this.catTree) this.error = 'No se pudo cargar esta categoría.'
      } catch (e) {
        this.error = 'No se pudo cargar esta categoría.'
      } finally {
        this.loading = false
      }
    },
    abrir(n) {
      if (n.type === 'folder') {
        this.path.push(n)
      } else {
        this.docSel = n
      }
    },
    irIndice() {
      this.catTree = null
      this.path = []
      this.docSel = null
      this.buscar = ''
    },
    irCategoria() {
      this.path = []
      this.docSel = null
      this.buscar = ''
    },
    irPath(i) {
      this.path = this.path.slice(0, i + 1)
      this.docSel = null
    },
    async copiar() {
      if (!this.docSel || !this.docSel.html) return
      try {
        const div = document.createElement('div')
        div.innerHTML = this.docSel.html
        const plain = div.innerText
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/html': new Blob([this.docSel.html], { type: 'text/html' }),
            'text/plain': new Blob([plain], { type: 'text/plain' })
          })
        ])
        this.copiado = true
        setTimeout(() => { this.copiado = false }, 2000)
      } catch (e) {
        this.errorCopia = true
        setTimeout(() => { this.errorCopia = false }, 3000)
      }
    }
  }
}
</script>

<style scoped>
.breadcrumb a {
  color: var(--custom-orange-accent);
  cursor: pointer;
}
.breadcrumb .sep {
  margin: 0 6px;
  color: #777;
}
.botones {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.boton-item {
  justify-content: flex-start;
  text-transform: none;
}
.modelo-contenido {
  max-height: 440px;
  overflow-y: auto;
  border: 1px solid #555;
  border-radius: 4px;
  padding: 14px;
  background: #fff;
  color: #000;
}
</style>
