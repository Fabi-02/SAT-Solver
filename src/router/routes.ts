import { createRouter, createWebHistory } from 'vue-router'
import StartPage from '@views/StartPage.vue'

const routes = [
  {
    path: '/',
    name: 'Startseite',
    component: StartPage
  },
  {
    path: '/dpll-solver',
    name: 'DPLL-Solver',
    component: () => import('@/views/DPLLSolver.vue')
  },
  {
    path: '/cdcl-solver',
    name: 'CDCL-Solver',
    component: () => import('@/views/CDCLSolver.vue')
  },
  {
    path: '/n-queen',
    name: 'N-Danem Problem',
    component: () => import('@views/NQueen.vue')
  },
  {
    path: '/sudoku',
    name: 'Sudoku',
    component: () => import('@views/Sudoku.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
