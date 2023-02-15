<script setup lang="ts">
import ContentPage from '@components/ContentPage.vue'
import FormulaInput from '@components/formula/FormulaInput.vue'
import D3Tree from '@/components/d3/D3Tree.vue'
import { ref } from 'vue';
import { CNF, Model, collator } from '@ts/formula';
import { DpllResult, dpll } from '@/ts/dpll';
import { TreeNode } from '@/components/d3/types';

const formulaString = ref(`2 3 4 -5
1 5 -6
5 -7
1 6 7
1 2 -5
1 3 -5
1 4 -5
1 -2 -3 -4 -5 6`);

const d3Tree = ref();

var id = 0;
var pathId = 0;
var data: TreeNode;

const timer: (ms: number) => Promise<null> = ms => new Promise(res => setTimeout(res, ms))

async function test() {
    id = 0;
    data = {
        id: id++,
        pathId: pathId,
        name: "",
        key: "",
        neg: false,
        result: "unknown",
        unit_prop: false,
        children: []
    };

    let cnf = new CNF(formulaString.value);
    console.log(cnf);

    let dpll_gen = dpll(cnf);
    for (let result of dpll_gen) {
        // console.log(result);
        addDataSet(result);
        await timer(500);
    }
    console.log(data);
}

function nextLiteral(data: TreeNode, model: Model): TreeNode | null {
    let keys = Object.keys(model);
    if (data.children.length === 0) {
        return null;
    }
    for (let child of data.children) {
        if (keys.includes(child.key) && child.neg !== model[child.key]) {
            delete model[child.key];
            return child;
        }
    }
    return null;
}

function addDataSet(result: DpllResult) {
    pathId++;
    let model = {...result.model};
    let d = data;
    d.pathId = pathId;

    let next: TreeNode | null = null;
    while (next = nextLiteral(d, model)) {
        d = next;
        d.pathId = pathId;
    }

    let keys = Object.keys(model).sort(collator.compare);
    for (let key of keys) {
        let name = key;
        if (model[key]) {
            name = name + "=T";
        } else {
            name = name + "=F";
        }
        let newChild = {
            id: id++,
            pathId: pathId,
            name: name,
            key: key,
            neg: !model[key],
            result: result.result,
            unit_prop: result.unit_prop,
            children: []
        }
        if (model[key]) {
            d.children.push(newChild);
        } else {
            d.children.unshift(newChild);
        }
        d = newChild;
    }
    d3Tree.value.update(data, pathId);
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
                <D3Tree ref="d3Tree"/>
            </div>
        </div>
    </ContentPage>
</template>
