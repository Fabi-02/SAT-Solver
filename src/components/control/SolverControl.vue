<script setup lang="ts">
import { ref } from 'vue';
import { DpllResult, Model, TreeNode } from '../d3/types';
import { CNF, collator } from '@ts/formula';
import { dpll } from '@ts/dpll';

const props = defineProps({
    formula: { type: String, required: true },
    update: { type: Function, required: true }
});

const usePureLiteral = ref(false);
const useUnitProp = ref(true);

var id = 0;
var pathId = 0;
var data: TreeNode;

const timer: (ms: number) => Promise<null> = ms => new Promise(res => setTimeout(res, ms))

var dpll_gen: Generator<DpllResult> | null = null;

var finished = ref(false);
var started = ref(false);
var auto = ref(false);
var pauseAuto: boolean = false;

var defaultModel: Model = {};

function resetData() {
    finished.value = false;
    started.value = false;
    id = 0;
    pathId = 0;

    data = {
        id: id++,
        pathId: pathId,
        name: "",
        key: "",
        neg: false,
        result: "unknown",
        heuristic: false,
        sat_path: false,
        children: []
    };
}

function getDpllGen() {
    if (dpll_gen === null) {
        resetData();

        let cnf = new CNF(props.formula);

        dpll_gen = dpll(cnf, { pure_literal: usePureLiteral.value, unit_prop: useUnitProp.value }, {... defaultModel} );
    }
    return dpll_gen;
}

function resetDpllGen() {
    dpll_gen = null;
}

function setDefaultModel(model: Model) {
    defaultModel = model;
}

async function autoSolve() {
    if (auto.value) return;
    let dpll_gen = getDpllGen();
    auto.value = true;
    started.value = true;
    while (auto.value) {
        if (pauseAuto) {
            pauseAuto = false;
            auto.value = false;
            return;
        }
        
        let next = dpll_gen.next();
        if (!next.done) {
            addDataSet(next.value);
        } else {
            finished.value = true;
            pauseAuto = false;
            auto.value = false;
            break;
        }
        await timer(250);
    }
    pathId = 0;
    props.update(data, pathId);
    resetDpllGen();
}

function pauseAutoSolve() {
    if (!auto.value) return;
    pauseAuto = true;
}

function nextStep() {
    if (auto.value) return;
    let dpll_gen = getDpllGen();
    started.value = true;
    let next = dpll_gen.next();
    if (next.done) {
        finished.value = true;
        resetDpllGen();
        pathId = 0;
        props.update(data, pathId);
    } else {
        addDataSet(next.value);
    }
}

function reset() {
    auto.value = false;
    pauseAuto = false;
    resetDpllGen();
    resetData();
    props.update(data, pathId, {cnf_result: {result: "unknown", results: []}, model: defaultModel, heuristic: false});
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
            heuristic: result.heuristic,
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

defineExpose({
    started,
    finished,
    setDefaultModel
});

</script>

<template>
    <div class="w-full flex flex-row">
        <button @click="nextStep" class="control-button w-full mx-1 mb-3" :disabled="auto || finished">Step</button>
        <button @click="reset" class="control-button w-full mx-1 mb-3" :disabled="!started">Reset</button>
    </div>
    <div class="w-full flex flex-row">
        <button @click="autoSolve" class="control-button w-full mx-1 mb-3" :disabled="auto || finished">Auto</button>
        <button @click="pauseAutoSolve" class="control-button w-full mx-1 mb-3" :disabled="!auto || finished">Pause</button>
    </div>
    <div class="w-full flex flex-row">
        <label class="relative w-full inline-flex items-center mb-5 ml-2 cursor-pointer" :class="{'cursor-not-allowed': started || finished}">
            <input type="checkbox" class="sr-only peer" v-model="usePureLiteral" :disabled="started || finished">
            <div class="checkbox-switch" :class="{'opacity-50': started || finished}"></div>
            <span class="ml-3 text-sm font-medium text-gray-900" :class="{'opacity-50': started || finished}">Pure Literal</span>
        </label>
        <label class="relative w-full inline-flex items-center mb-5 ml-2 cursor-pointer" :class="{'cursor-not-allowed': started || finished}">
            <input type="checkbox" class="sr-only peer" v-model="useUnitProp" :disabled="started || finished">
            <div class="checkbox-switch" :class="{'opacity-50': started || finished}"></div>
            <span class="ml-3 text-sm font-medium text-gray-900" :class="{'opacity-50': started || finished}">Unit Propagation</span>
        </label>
    </div>
</template>
