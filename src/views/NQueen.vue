<script setup lang="ts">
import ContentPage from '@components/ContentPage.vue'
import D3Tree from '@components/d3/D3Tree.vue'
import { ref } from 'vue';
import { DpllResult, TreeNode } from '@components/d3/types';
import { nQueensFormula } from '@ts/nqueens';
import D3NQueens from '@components/d3/D3NQueens.vue';
import SolverControl from '@components/control/SolverControl.vue';

const N = ref(4);

var formulaString = ref(nQueensFormula(N.value));

const d3Tree = ref();
const d3NQueens = ref();

function updateN() {
    formulaString.value = nQueensFormula(N.value);
    d3NQueens.value.updateN()
}

function update(data: TreeNode, pathId: number, result: DpllResult | undefined) {
    d3Tree.value.update(data, pathId);
    if (result !== undefined) {
        d3NQueens.value.update(result.model);
    }
}

</script>

<template>
    <ContentPage name="N-Damen Problem">
        <div class="flex space-x-5 h-full">
            <div class="w-1/2 flex flex-col shrink-0">
                <SolverControl v-model:formula="formulaString" :update="update" />
                <input id="default-range" type="range" v-model.number="N" @input="updateN" min="1" max="6" class="w-full h-2 mb-4 bg-gray-200 rounded-lg appearance-none cursor-pointer">
                <div class="relative w-full h-full">
                    <D3NQueens ref="d3NQueens" :N="N" />
                </div>
            </div>
            <div class="relative w-full">
                <D3Tree ref="d3Tree" :node-size-x="80" />
            </div>
        </div>
    </ContentPage>
</template>
