import { createRouter, createWebHistory } from 'vue-router'
import StartPage from '@views/StartPage.vue'
import Solver from '@views/Solver.vue'
import NQueen from '@views/NQueen.vue'
import Sudoku from '@views/Sudoku.vue'

const routes = [
    {
        path: '/',
        component: StartPage
    },
    {
        path: '/solver',
        component: Solver
    },
    {
        path: '/n-queen',
        component: NQueen
    },
    {
        path: '/sudoku',
        component: Sudoku
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
