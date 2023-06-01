<script setup lang="ts">
import ContentPage from '@components/ContentPage.vue'
import D3Tree from '@components/d3/D3Tree.vue'
import { ref } from 'vue';
import { DpllResult, Model, TreeNode } from '@components/d3/types';
import D3Sudoku from '@components/d3/D3Sudoku.vue';
import { sudokuFormula } from '@ts/sudoku';
import SolverControl from '@components/control/SolverControl.vue';
import { formulaToInteractionGraph } from '@ts/graph';
import D3InteractionGraph from '@components/d3/D3InteractionGraph.vue';
import ShowFormula from '@components/formula/ShowFormula.vue';

const N = ref(2);

const verbose = ref(true);

const formulaString = sudokuFormula(N.value);
let interactionGraph = ref(formulaToInteractionGraph(formulaString));

const graphMode = ref('dpll_graph' as 'dpll_graph' | 'interaction_graph');

const solverControl = ref();
const d3Tree = ref();
const d3Sudoku = ref();
const d3InteractionGraph = ref();


var defaultModel: Model = {};

var cacheModel: Model;

function update(data: TreeNode, pathId: number, result: DpllResult | undefined): void {
    d3Tree.value?.update(data, pathId);
    if (result !== undefined) {
        cacheModel = result.model;
        d3Sudoku.value.update(cacheModel);
        d3InteractionGraph.value?.update(result.model);
    }
}

function updateVerbose() {
    if (cacheModel !== undefined) {
        d3Sudoku.value.update(cacheModel);
    }
}

function setNumber(cellX: number, cellY: number, number: number) {
    for (let n = 1; n <= N.value * N.value; n++) {
        defaultModel[`${cellY}_${cellX}_${n}`] = false;
    }
    defaultModel[`${cellY}_${cellX}_${number}`] = true;
    cacheModel = defaultModel;

    solverControl.value.setDefaultModel(defaultModel);
    d3Sudoku.value.update(defaultModel);
}

function resetNumber(cellX: number, cellY: number) {
    for (let n = 1; n <= N.value * N.value; n++) {
        delete defaultModel[`${cellY}_${cellX}_${n}`];
    }
    cacheModel = defaultModel;

    solverControl.value.setDefaultModel(defaultModel);
    d3Sudoku.value.update(defaultModel);
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
    <ContentPage name="Sudoku">
        <div class="flex space-x-5 h-full">
            <div class="w-1/2 flex flex-col shrink-0">
                <SolverControl ref="solverControl" v-model:formula="formulaString" :update="update" />
                <label class="relative inline-flex items-center mb-5 ml-2 cursor-pointer">
                    <input type="checkbox" class="sr-only peer" v-model="verbose" @change="updateVerbose">
                    <div class="checkbox-switch"></div>
                    <span class="ml-3 text-sm font-medium text-gray-900">Verbose Modus</span>
                </label>
                <div class="relative w-full h-full">
                    <D3Sudoku ref="d3Sudoku" :N="N" :setNumber="setNumber" :resetNumber="resetNumber" v-model:verbose="verbose" :inputDisabled="solverControl !== undefined && (solverControl.started || solverControl.finished)" />
                </div>
                <ShowFormula v-model:formula="formulaString"></ShowFormula>
            </div>
            <div class="relative w-full">
                <div  v-show="graphMode === 'dpll_graph'">
                    <D3Tree ref="d3Tree" :node-size-x="100" />
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
