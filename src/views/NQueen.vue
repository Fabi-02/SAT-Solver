<script setup lang="ts">
import ContentPage from '@components/ContentPage.vue'
import D3Tree from '@/components/d3/D3Tree.vue'
import { ref } from 'vue';
import { CNF, collator } from '@ts/formula';
import { DpllResult, dpll } from '@/ts/dpll';
import { Model, TreeNode } from '@/components/d3/types';
import { nQueensFormula } from '@/ts/nqueens';
import D3NQueens from '@/components/d3/D3NQueens.vue';

const N = ref(4);

const formulaString = nQueensFormula(N.value);

const useUnitProp = ref(true);

const d3Tree = ref();
const d3NQueens = ref();

var id = 0;
var pathId = 0;
var data: TreeNode;

const timer: (ms: number) => Promise<null> = ms => new Promise(res => setTimeout(res, ms))

var dpll_gen: Generator<DpllResult> | null = null;

function get_dpll_gen() {
    if (dpll_gen === null) {
        id = 0;
        pathId = 0;
        data = {
            id: id++,
            pathId: pathId,
            name: "",
            key: "",
            neg: false,
            result: "unknown",
            unit_prop: false,
            sat_path: false,
            children: []
        };

        let cnf = new CNF(formulaString);

        dpll_gen = dpll(cnf, useUnitProp.value)
    }
    return dpll_gen;
}

function reset_dpll_gen() {
    dpll_gen = null;
}

async function autoSolve() {
    let dpll_gen = get_dpll_gen();
    for (let result of dpll_gen) {
        // console.log(result);
        addDataSet(result);
        await timer(250);
    }
    pathId = 0;
    d3Tree.value.update(data, pathId);
    console.log(data);
    reset_dpll_gen();
}

function nextStep() {
    let dpll_gen = get_dpll_gen();
    let next = dpll_gen.next()
    if (next.done) {
        reset_dpll_gen();
        pathId = 0;
        d3Tree.value.update(data, pathId);
    } else {
        addDataSet(next.value);
    }
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
        if (result.result === "sat") {
            d.sat_path = true;
        }
    }

    let keys = Object.keys(model).sort(collator.compare);
    for (let key of keys) {
        let name = `(${key.replace("_", ", ")})`;
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
            sat_path: result.result === "sat" ? true : false,
            children: []
        }
        if (model[key]) {
            d.children.push(newChild);
        } else {
            d.children.unshift(newChild);
        }
        d = newChild;
        d3Tree.value.update(data, pathId);
        d3NQueens.value.update(result.model);
    }
}
</script>

<template>
    <ContentPage name="N-Damen Problem">
        <div class="flex space-x-5 h-full">
            <div class="w-1/2 flex flex-col shrink-0">
                <label class="relative inline-flex items-center mb-5 ml-2 cursor-pointer">
                    <input type="checkbox" value="" class="sr-only peer" v-model="useUnitProp">
                    <div class="w-9 h-5 bg-gray-200 rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    <span class="ml-3 text-sm font-medium text-gray-900">Unit Propagation</span>
                </label>
                <div class="w-full flex flex-row">
                    <button @click="autoSolve" class="w-full border mx-1 mb-3">Auto</button>
                    <button @click="nextStep" class="w-full border mx-1 mb-3">Step</button>
                </div>
                <div class="relative w-full h-full">
                    <D3NQueens ref="d3NQueens" :N="N"/>
                </div>
            </div>
            <div class="relative w-full">
                <D3Tree ref="d3Tree" :node-size-x="80"/>
            </div>
        </div>
    </ContentPage>
</template>
