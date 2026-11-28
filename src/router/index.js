import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { getCurrentUser } from '../firebase'
import { esAdmin } from '../auth'

const routes = [
  {
    path: '/login',
    name: 'login',
    meta: { public: true },
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/oficios',
    name: 'oficios',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/OficiosView.vue')
  },
  {
    path: '/causaaprueba',
    name: 'causaaprueba',
    component: () => import(/* webpackChunkName: "about" */ '../views/CausaAPrueba.vue')
  },
  {
    path: '/causaapruebanormal',
    name: 'causaapruebanormal',
    component: () => import(/* webpackChunkName: "about" */ '../views/CausaAPruebaNormal.vue')
  },
  {
    path: '/demandanueva',
    name: 'demandanueva',
    component: () => import(/* webpackChunkName: "about" */ '../views/DemandaNuevaView.vue')
  },
  {
    path: '/notificaexpresamente',
    name: 'notificaexpresamente',
    component: () => import(/* webpackChunkName: "about" */ '../views/NotificacionExpresaView.vue')
  },
  {
    path: '/citese',
    name: 'citese',
    component: () => import('../views/Citese.vue')
  },
  {
    path: '/previos',
    name: 'previos',
    component: () => import('../views/PreviosView.vue')
  },
  {
    path: '/basesremate',
    name: 'basesremate',
    component: () => import('../views/BasesRemateView.vue')
  },
  {
    path: '/modelos',
    name: 'modelos',
    component: () => import('../views/ModelosView.vue')
  },
  {
    path: '/admin',
    name: 'admin',
    meta: { requiresAdmin: true },
    component: () => import('../views/AdminView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// Guard de autenticación: todo requiere sesión, salvo las rutas marcadas public.
router.beforeEach(async (to) => {
  const user = await getCurrentUser().catch(() => null)

  // Sin sesión y la ruta no es pública -> al login (recordando a dónde iba).
  if (!to.meta.public && !user) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  // Con sesión e intentando ir al login -> al inicio.
  if (to.name === 'login' && user) {
    return { name: 'home' }
  }

  // Rutas solo para administradores.
  if (to.meta.requiresAdmin && !(await esAdmin(user).catch(() => false))) {
    return { name: 'home' }
  }

  return true
})

export default router
