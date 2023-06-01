<script setup lang="ts">
import ContentPage from '@components/ContentPage.vue'
import FormulaInput from '@components/formula/FormulaInput.vue'
import D3Tree from '@components/d3/D3Tree.vue'
import { ref, watch } from 'vue';
import { DpllResult, TreeNode } from '@components/d3/types';
import SolverControl from '@components/control/SolverControl.vue';
import D3InteractionGraph from '@components/d3/D3InteractionGraph.vue';
import { formulaToInteractionGraph } from '@ts/graph';

const formulaString = ref(`2 3 4 -5
1 5 -6
5 -7
1 6 7
1 2 -5
1 3 -5
1 4 -5
1 -2 -3 -4 -5 6`);

const graphMode = ref('dpll_graph' as 'dpll_graph' | 'interaction_graph');

const solverControl = ref();
const d3Tree = ref();
const d3InteractionGraph = ref();
const formulaInput = ref();

function update(data: TreeNode, pathId: number, result: DpllResult | undefined) {
    d3Tree.value?.update(data, pathId);

    if (result !== undefined) {
        formulaInput.value.updateResult(result.cnf_result.results);
        d3InteractionGraph.value?.update(result.model);
    }
}

let interactionGraph = ref(formulaToInteractionGraph(formulaString.value));

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

watch(formulaString, updateInteractionGraph);

</script>

<template>
    <ContentPage name="DPLL-Solver">
        <div class="flex space-x-5 h-full">
            <div class="w-96 flex flex-col shrink-0">
                <SolverControl ref="solverControl" v-model:formula="formulaString" :update="update" />
                <FormulaInput v-model:formula="formulaString" ref="formulaInput" class="h-full formula-input" :disabled="solverControl !== undefined && (solverControl.started || solverControl.finished)" />
            </div>
            <div class="relative w-full">
                <div  v-show="graphMode === 'dpll_graph'">
                    <D3Tree ref="d3Tree" />
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

<style>
.formula-input[disabled=true] input,
.formula-input[disabled=true] textarea {
  pointer-events:none;
}
</style>
