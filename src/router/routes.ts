import { createRouter, createWebHistory } from 'vue-router'
import StartPage from '../views/StartPage.vue'

const routes = [
  {
    path: '/',
    name: 'Start-Page',
    component: StartPage
  },
  {
    path: '/test1',
    name: 'Test1',
    component: () => import('../views/Test1.vue')
  },
  {
    path: '/test2',
    name: 'Test2',
    component: () => import('../views/Test2.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
