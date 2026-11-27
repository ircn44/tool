import { initializeApp } from 'firebase/app'
import {
  getAuth,
  onAuthStateChanged,
  setPersistence,
  browserSessionPersistence
} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Config del proyecto Firebase (authpjud).
// Estos valores NO son secretos: es normal que vayan en el código del cliente.
const firebaseConfig = {
  apiKey: 'AIzaSyBeDfUN7XkQSXgpvPGgyQPuMxCHrwR72_0',
  authDomain: 'authpjud.firebaseapp.com',
  projectId: 'authpjud',
  storageBucket: 'authpjud.firebasestorage.app',
  messagingSenderId: '937031467280',
  appId: '1:937031467280:web:baf4937610613f3e216595',
  measurementId: 'G-LLEXMMT1Y6'
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)

// Persistencia de solo-sesión: la sesión se cierra al cerrar el navegador.
setPersistence(auth, browserSessionPersistence).catch((e) => {
  console.error('No se pudo fijar la persistencia de sesión:', e)
})

// Devuelve el usuario actual (o null) esperando a que Firebase
// termine de restaurar la sesión. Se usa en el guard del router.
export function getCurrentUser() {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe()
        resolve(user)
      },
      reject
    )
  })
}
