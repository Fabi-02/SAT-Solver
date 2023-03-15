<script setup lang="ts">
import { ref } from 'vue';
import { DpllResult, Model, TreeNode } from '../d3/types';
import { CNF, collator } from '@ts/formula';
import { dpll } from '@ts/dpll';

const props = defineProps({
    formula: { type: String, required: true },
    update: { type: Function, required: true }
});

const useUnitProp = ref(true);

var id = 0;
var pathId = 0;
var data: TreeNode;

const timer: (ms: number) => Promise<null> = ms => new Promise(res => setTimeout(res, ms))

var dpll_gen: Generator<DpllResult> | null = null;

var auto: boolean = false;
var stopAuto: boolean = false;

function resetData() {
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
}

function get_dpll_gen() {
    if (dpll_gen === null) {
        resetData();

        let cnf = new CNF(props.formula);

        dpll_gen = dpll(cnf, useUnitProp.value)
    }
    return dpll_gen;
}

function reset_dpll_gen() {
    dpll_gen = null;
}

async function autoSolve() {
    if (auto) return;
    auto = true;
    let dpll_gen = get_dpll_gen();
    while (auto) {
        if (stopAuto) {
            stopAuto = false;
            auto = false;
            return;
        }
        
        let next = dpll_gen.next();
        if (!next.done) {
            addDataSet(next.value);
        } else {
            stopAuto = false;
            auto = false;
            break;
        }
        await timer(250);
    }
    pathId = 0;
    props.update(data, pathId);
    reset_dpll_gen();
}

function stopAutoSolve() {
    if (!auto) return;
    stopAuto = true;
}

function nextStep() {
    if (auto) return;
    let dpll_gen = get_dpll_gen();
    let next = dpll_gen.next();
    if (next.done) {
        reset_dpll_gen();
        pathId = 0;
        props.update(data, pathId);
    } else {
        addDataSet(next.value);
    }
}

function reset() {
    auto = false;
    stopAuto = false;
    reset_dpll_gen();
    resetData();
    props.update(data, pathId, {cnf_result: {result: "unknown", results: []}, model: {}, unit_prop: false});
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
        if (result.cnf_result.result === "sat") {
            d.sat_path = true;
        }
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
            result: result.cnf_result.result,
            unit_prop: result.unit_prop,
            sat_path: result.cnf_result.result === "sat" ? true : false,
            children: []
        }
        if (model[key]) {
            d.children.push(newChild);
        } else {
            d.children.unshift(newChild);
        }
        d = newChild;
        props.update(data, pathId, result);
    }
}

</script>

<template>
    <label class="relative inline-flex items-center mb-5 ml-2 cursor-pointer">
        <input type="checkbox" class="sr-only peer" v-model="useUnitProp">
        <div class="checkbox-switch"></div>
        <span class="ml-3 text-sm font-medium text-gray-900">Unit Propagation</span>
    </label>
    <div class="w-full flex flex-row">
        <button @click="nextStep" class="w-full border mx-1 mb-3">Step</button>
        <button @click="reset" class="w-full border mx-1 mb-3">Reset</button>
    </div>
    <div class="w-full flex flex-row">
        <button @click="autoSolve" class="w-full border mx-1 mb-3">Auto</button>
        <button @click="stopAutoSolve" class="w-full border mx-1 mb-3">Stop</button>
    </div>
</template>
