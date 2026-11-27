<template>
  <v-main>
    <v-container fluid class="d-flex align-center justify-center fill-height">
      <v-card class="pa-6" elevation="4" width="360" max-width="90vw">
        <h1 class="text-h5 mb-6 text-center">Iniciar sesión</h1>
        <v-form @submit.prevent="handleLogin">
          <v-text-field
            v-model="email"
            label="Correo"
            type="email"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
            density="comfortable"
            autocomplete="username"
            hide-details="auto"
            class="mb-4"
          ></v-text-field>

          <v-text-field
            v-model="password"
            label="Contraseña"
            :type="showPassword ? 'text' : 'password'"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showPassword = !showPassword"
            variant="outlined"
            density="comfortable"
            autocomplete="current-password"
            hide-details="auto"
            class="mb-4"
          ></v-text-field>

          <v-alert
            v-if="error"
            type="error"
            density="compact"
            variant="tonal"
            class="mb-4"
          >
            {{ error }}
          </v-alert>

          <v-btn
            type="submit"
            block
            size="large"
            rounded
            color="var(--custom-orange-accent)"
            variant="flat"
            :loading="loading"
          >
            Entrar
          </v-btn>
        </v-form>
      </v-card>
    </v-container>
  </v-main>
</template>

<script>
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'

export default {
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: '',
      showPassword: false,
      loading: false,
      error: ''
    }
  },
  methods: {
    async handleLogin() {
      this.error = ''
      this.loading = true
      try {
        await signInWithEmailAndPassword(auth, this.email.trim(), this.password)
        const redirect = this.$route.query.redirect || '/'
        this.$router.push(redirect)
      } catch (e) {
        this.error = this.mapError(e.code)
      } finally {
        this.loading = false
      }
    },
    mapError(code) {
      const map = {
        'auth/invalid-email': 'Correo inválido.',
        'auth/missing-password': 'Ingresa tu contraseña.',
        'auth/user-disabled': 'Usuario deshabilitado.',
        'auth/user-not-found': 'Usuario o contraseña incorrectos.',
        'auth/wrong-password': 'Usuario o contraseña incorrectos.',
        'auth/invalid-credential': 'Usuario o contraseña incorrectos.',
        'auth/too-many-requests': 'Demasiados intentos. Espera un momento.',
        'auth/network-request-failed': 'Error de red. Revisa tu conexión.',
        'auth/invalid-api-key': 'Configuración de Firebase pendiente.',
        'auth/api-key-not-valid': 'Configuración de Firebase pendiente.'
      }
      return map[code] || 'No se pudo iniciar sesión.'
    }
  }
}
</script>
