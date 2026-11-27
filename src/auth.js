import { auth, db } from './firebase'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  serverTimestamp
} from 'firebase/firestore'

const provider = new GoogleAuthProvider()

// Inicia sesión con Google (popup) y devuelve el usuario.
export async function signInGoogle() {
  const cred = await signInWithPopup(auth, provider)
  return cred.user
}

// ¿El correo está en la lista blanca (autorizados) o es admin?
export async function esAutorizado(user) {
  if (!user || !user.email) return false
  const email = user.email
  const [aut, adm] = await Promise.all([
    getDoc(doc(db, 'autorizados', email)),
    getDoc(doc(db, 'admins', email))
  ])
  return aut.exists() || adm.exists()
}

// ¿El correo es administrador?
export async function esAdmin(user) {
  if (!user || !user.email) return false
  const adm = await getDoc(doc(db, 'admins', user.email))
  return adm.exists()
}

// Crea (o actualiza) la solicitud de acceso del usuario. Doc id = email para no duplicar.
export async function crearSolicitud(user) {
  if (!user || !user.email) return
  await setDoc(
    doc(db, 'solicitudes', user.email),
    {
      email: user.email,
      nombre: user.displayName || '',
      fecha: serverTimestamp()
    },
    { merge: true }
  )
}

// --- Funciones de administración (requieren ser admin según las reglas) ---

export async function listarSolicitudes() {
  const snap = await getDocs(collection(db, 'solicitudes'))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function listarAutorizados() {
  const snap = await getDocs(collection(db, 'autorizados'))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

// Aprueba una solicitud: agrega el correo a autorizados y elimina la solicitud.
export async function aprobarSolicitud(email, nombre = '') {
  await setDoc(doc(db, 'autorizados', email), {
    email,
    nombre,
    fecha: serverTimestamp()
  })
  await deleteDoc(doc(db, 'solicitudes', email))
}

// Rechaza (elimina) una solicitud.
export async function rechazarSolicitud(email) {
  await deleteDoc(doc(db, 'solicitudes', email))
}

// Quita a un correo de la lista blanca.
export async function quitarAutorizado(email) {
  await deleteDoc(doc(db, 'autorizados', email))
}
