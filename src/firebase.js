import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

// ⚠️ REEMPLAZAR con la config real de tu proyecto Firebase
// (Firebase console → Project settings ⚙️ → tus apps → Web → firebaseConfig)
// Estos valores NO son secretos: es normal que vayan en el código del cliente.
const firebaseConfig = {
  apiKey: 'REEMPLAZAR_API_KEY',
  authDomain: 'REEMPLAZAR.firebaseapp.com',
  projectId: 'REEMPLAZAR',
  storageBucket: 'REEMPLAZAR.appspot.com',
  messagingSenderId: 'REEMPLAZAR_SENDER_ID',
  appId: 'REEMPLAZAR_APP_ID'
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)

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
