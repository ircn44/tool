import { db } from './firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

// Lee el índice de categorías (ligero).
export async function cargarIndice() {
  const snap = await getDoc(doc(db, 'modelos_index', 'index'))
  return snap.exists() ? (snap.data().categorias || []) : []
}

// Lee una categoría completa y devuelve su árbol ya parseado.
export async function cargarCategoria(id) {
  const snap = await getDoc(doc(db, 'modelos', id))
  if (!snap.exists()) return null
  const data = snap.data()
  let arbol = null
  try {
    arbol = JSON.parse(data.arbol)
  } catch (e) {
    arbol = null
  }
  return { nombre: data.nombre, arbol }
}

// --- Importación (solo admin) ---
// Recibe una lista de árboles (el JSON de cada categoría) y los escribe a
// Firestore: un documento por categoría + el índice. Devuelve el índice.
export async function importarCategorias(arboles, onProgress) {
  const indice = []
  let hechos = 0
  for (const arbol of arboles) {
    const nombre = arbol.name || 'Sin nombre'
    const m = nombre.match(/^(\d+)/)
    const orden = m ? parseInt(m[1], 10) : 900 + hechos
    const id = 'c' + orden
    await setDoc(doc(db, 'modelos', id), {
      nombre,
      orden,
      arbol: JSON.stringify(arbol)
    })
    indice.push({ id, nombre, orden })
    hechos += 1
    if (onProgress) onProgress(hechos, arboles.length, nombre)
  }
  indice.sort((a, b) => a.orden - b.orden)
  await setDoc(doc(db, 'modelos_index', 'index'), { categorias: indice })
  return indice
}
