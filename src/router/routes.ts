import { createRouter, createWebHistory } from 'vue-router'
import StartPage from '@views/StartPage.vue'
import Solver from '@views/Solver.vue'
import NQueens from '@views/NQueens.vue'
import Sudoku from '@views/Sudoku.vue'
import GraphColoring from '@views/GraphColoring.vue'

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
        path: '/n-queens',
        component: NQueens
    },
    {
        path: '/sudoku',
        component: Sudoku
    },
    {
        path: '/graph-coloring',
        component: GraphColoring
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
