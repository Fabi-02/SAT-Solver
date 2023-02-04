import { createRouter, createWebHistory } from 'vue-router'
import StartPage from '../views/StartPage.vue'

const routes = [
  {
    path: '/',
    name: 'Startseite',
    component: StartPage
  },
  {
    path: '/solver',
    name: 'SAT-Solver',
    component: () => import('../views/Solver.vue')
  },
  {
    path: '/n-queen',
    name: 'N-Danem Problem',
    component: () => import('../views/NQueen.vue')
  },
  {
    path: '/sudoku',
    name: 'Sudoku',
    component: () => import('../views/Sudoku.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
