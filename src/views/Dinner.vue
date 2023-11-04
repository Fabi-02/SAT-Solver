<script setup lang="ts">
import ContentPage from '@components/ContentPage.vue'
import D3Tree from '@components/d3/D3Tree.vue'
import { ref } from 'vue';
import { DpllResult, Model, TreeNode } from '@components/d3/types';
import SolverControl from '@components/control/SolverControl.vue';
import { formulaToInteractionGraph, graphFormula, stringToGraph } from '@ts/graph';
import D3Dinner from '@components/d3/D3Dinner.vue';
import D3InteractionGraph from '@components/d3/D3InteractionGraph.vue';
import ShowFormula from '@components/formula/ShowFormula.vue';
import { dinnerFormula } from '@ts/dinner';


const formulaString = dinnerFormula();
let interactionGraph = ref(formulaToInteractionGraph(formulaString));

const graphMode = ref('dpll_graph' as 'dpll_graph' | 'interaction_graph');

const d3Tree = ref();
const d3Dinner = ref();
const d3InteractionGraph = ref();

var model: Model;

function update(data: TreeNode, pathId: number, result: DpllResult | undefined): void {
    d3Tree.value?.update(data, pathId);
    if (result !== undefined) {
        model = result.model;
        d3Dinner.value.update(model);
        d3InteractionGraph.value?.update(result.model);
    }
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
    <ContentPage name="Dinner Planing Problem">
        <div class="flex space-x-5 h-full">
            <div class="w-1/2 flex flex-col shrink-0">
                <SolverControl v-model:formula="formulaString" :update="update" />
                <div class="relative w-full h-full">
                    <D3Dinner ref="d3Dinner" />
                </div>
                <ShowFormula v-model:formula="formulaString"></ShowFormula>
            </div>
            <div class="relative w-full">
                <div  v-show="graphMode === 'dpll_graph'">
                    <D3Tree ref="d3Tree" :node-size-x="100" :formula="formulaString" />
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
