<script setup lang="ts">
import ContentPage from '@components/ContentPage.vue'
import D3Tree from '@components/d3/D3Tree.vue'
import { ref } from 'vue';
import { DpllResult, TreeNode } from '@components/d3/types';
import { nQueensFormula } from '@ts/nqueens';
import D3NQueens from '@components/d3/D3NQueens.vue';
import SolverControl from '@components/control/SolverControl.vue';
import { formulaToInteractionGraph } from '@ts/graph';
import D3InteractionGraph from '@components/d3/D3InteractionGraph.vue';
import ShowFormula from '@components/formula/ShowFormula.vue';

const N = ref(4);

var formulaString = ref(nQueensFormula(N.value));
let interactionGraph = ref(formulaToInteractionGraph(formulaString.value));

const graphMode = ref('dpll_graph' as 'dpll_graph' | 'interaction_graph');

const solverControl = ref();
const d3Tree = ref();
const d3NQueens = ref();
const d3InteractionGraph = ref();

function updateN() {
    formulaString.value = nQueensFormula(N.value);
    d3NQueens.value.updateN()
    updateInteractionGraph();
}

function update(data: TreeNode, pathId: number, result: DpllResult | undefined) {
    d3Tree.value?.update(data, pathId);
    if (result !== undefined) {
        d3NQueens.value.update(result.model);
        d3InteractionGraph.value?.update(result.model);
    }
}

function updateInteractionGraph() {
    interactionGraph.value = formulaToInteractionGraph(formulaString.value);
    d3InteractionGraph.value?.updateGraph(interactionGraph.value);
}


function changeGraphMode() {
    if (graphMode.value === 'dpll_graph') {
        graphMode.value = 'interaction_graph';
    } else {
        graphMode.value = 'dpll_graph';
    }
}

</script>

<template>
    <ContentPage name="N-Damen Problem">
        <div class="flex space-x-5 h-full">
            <div class="w-1/2 flex flex-col shrink-0">
                <SolverControl ref="solverControl" v-model:formula="formulaString" :update="update" />
                <p>N: {{ N }}</p>
                <input id="default-range" type="range" v-model.number="N" @input="updateN" min="1" max="6" class="w-full h-2 mb-4 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50" :disabled="solverControl !== undefined && (solverControl.started || solverControl.finished)" />
                <div class="relative w-full h-full">
                    <D3NQueens ref="d3NQueens" :N="N" />
                </div>
                <ShowFormula v-model:formula="formulaString"></ShowFormula>
            </div>
            <div class="relative w-full">
                <div  v-show="graphMode === 'dpll_graph'">
                    <D3Tree ref="d3Tree" :node-size-x="80" :formula="formulaString" />
                </div>
                <div  v-show="graphMode === 'interaction_graph'">
                    <D3InteractionGraph :graph="interactionGraph" ref="d3InteractionGraph"/>
                </div>
                <button class="absolute right-3 top-3 control-button px-3" @click="changeGraphMode">
                    {{ graphMode === 'dpll_graph' ? 'DPLL Baum' : 'Interaktionsgraph' }}
                </button>
            </div>
        </div>
    </ContentPage>
</template>
