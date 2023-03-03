<script setup lang="ts">
import ContentPage from '@components/ContentPage.vue'
import FormulaInput from '@components/formula/FormulaInput.vue'
import D3Tree from '@/components/d3/D3Tree.vue'
import { ref } from 'vue';
import { DpllResult, TreeNode } from '@/components/d3/types';
import SolverControl from '@/components/control/SolverControl.vue';

const formulaString = ref(`2 3 4 -5
1 5 -6
5 -7
1 6 7
1 2 -5
1 3 -5
1 4 -5
1 -2 -3 -4 -5 6`);

const d3Tree = ref();
const formulaInput = ref();

function update(data: TreeNode, pathId: number, result: DpllResult | undefined) {
    d3Tree.value.update(data, pathId);
    if (result !== undefined) {
        formulaInput.value.updateResult(result.cnf_result.results);
    }
}

</script>

<template>
    <ContentPage name="DPLL-Solver">
        <div class="flex space-x-5 h-full">
            <div class="w-60 flex flex-col shrink-0">
                <SolverControl v-model:formula="formulaString" :update="update" />
                <FormulaInput v-model:formula="formulaString" ref="formulaInput" class="h-full" />
            </div>
            <div class="relative w-full">
                <D3Tree ref="d3Tree" />
            </div>
        </div>
    </ContentPage>
</template>
