import { createRouter, createWebHistory } from 'vue-router'
import Solver from '@views/Solver.vue'
import NQueens from '@views/NQueens.vue'
import Sudoku from '@views/Sudoku.vue'
import GraphColoring from '@views/GraphColoring.vue'
import Dinner from '@views/Dinner.vue'

const routes = [
    {
        path: '/',
        // component: StartPage
        redirect: '/solver'
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
    },
    {
        path: '/dinner',
        component: Dinner
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
