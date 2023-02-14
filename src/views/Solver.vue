<script setup lang="ts">
import ContentPage from '@components/ContentPage.vue'
import FormulaInput from '@components/formula/FormulaInput.vue'
import D3Test from '@components/d3/D3Test.vue'
import { ref } from 'vue';
import { CNF, Model } from '@ts/formula';
import { DpllResult, dpll } from '@/ts/dpll';
import { TreeNode } from '@/components/d3/types';

const formulaString = ref("-a b\nc -d\ne f");

const d3Test = ref();

var id = 0;
var data: TreeNode;

const timer: (ms: number) => Promise<null> = ms => new Promise(res => setTimeout(res, ms))

async function test() {
    id = 0;
    data = {
        id: ++id,
        name: "root",
        children: []
    };

    let cnf = new CNF(formulaString.value);
    console.log(cnf);

    let dpll_gen = dpll(cnf);
    dpll_gen.next();
    for (let result of dpll_gen) {
        console.log(result.model);
        addDataSet(result);
        await timer(500);
    }
    console.log(data);
}

function addDataSet(result: DpllResult) {
    let keys = Object.keys(result.model);
    let d = data;
    for (let key of keys) {
        let name = key;
        if (result.model[name] === false) {
            name = "-" + name;
        }
        let found = false;
        for (let child of d.children!) {
            if (child.name === name) {
                d = child;
                found = true;
                break;
            }
        }
        if (!found) {
            console.log(id);
            let newChild = {
                id: ++id,
                name: name,
                children: []
            }
            d.children!.push(newChild);
            d = newChild;
        }
    }
    d3Test.value.update(data);
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
