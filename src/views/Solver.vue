<script setup lang="ts">
import ContentPage from '@components/ContentPage.vue'
import FormulaInput from '@components/formula/FormulaInput.vue'
import D3Test from '@components/d3/D3Test.vue'
import { ref } from 'vue';
import { CNF } from '@ts/formula';
import { dpll } from '@/ts/dpll';

const formulaString = ref("a b\nc -d\ne f");

const d3Test = ref();

function test() {
    let cnf = new CNF(formulaString.value);
    console.log(cnf);
    for (let result of dpll(cnf)) {
        console.log(result.model);
        console.log(result.result);
    }
}
</script>

<template>
    <ContentPage name="SAT-Solver">
        <div class="flex space-x-5 h-full">
            <div class="w-60 flex flex-col shrink-0">
                <button @click="test" class="w-full">Test</button>
                <FormulaInput v-model:formula="formulaString" class="h-full"/>
            </div>
            <div class="relative w-full">
                <D3Test ref="d3Test"/>
            </div>
        </div>
    </ContentPage>
</template>
