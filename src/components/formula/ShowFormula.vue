<script setup lang="ts">
import { showModal } from '@ts/modal';

const props = defineProps({
    formula: { type: String, required: true },
});

function formatFormula(formula: string): string {
    return formula.trim()
        .replaceAll(/\s\s+/g, ' ')
        .replaceAll(/-/g, '¬')
        .replaceAll(/\s/g, ' ∨ ');
}

function showFormula() {
    
    let clauses = props.formula.split("\n").map(formatFormula);

    showModal("Formula", {
        clauses: clauses
    });
}

</script>

<template>
    <button @click="showFormula" class="control-button w-40 mx-1 mt-3">Formel anzeigen</button>
</template>
