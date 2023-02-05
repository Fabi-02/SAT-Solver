<script setup lang="ts">
import { ref, nextTick } from 'vue'

const formulas = ref([{ text: '', raw: '' }])
const refs = ref<HTMLElement[]>([])

function focusInput(index: number, focus: boolean) {
    if (index >= formulas.value.length) return;
    let formula = formulas.value[index];
    if (focus) {
        formula.text = formula.raw;
    } else {
        formula.raw = formula.text;
        formula.text = formula.text.trim()
            .replaceAll(/\s\s+/g, ' ')
            .replaceAll(/-|~/g, '¬')
            .replaceAll(/\s/g, ' ∨ ');
    }
}

function enter(index: number) {
    formulas.value.splice(index + 1, 0, { text: '', raw: '' })
    nextTick(() => {
        refs.value[index + 1].focus()
    });
}

function backspace(event: Event, index: number) {
    let formula = formulas.value[index];
    if (formula.text.length == 0 && formulas.value.length > 1) {
        event.preventDefault()
        formulas.value.splice(index, 1);
        if (index > 0) {
            nextTick(() => {
                refs.value[index - 1].focus()
            });
        }
    }
}

</script>

<template>
    <input type="text" :name="'formula-' + index"
        class="block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-1 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
        v-model="item.text" @focusin="focusInput(index, true)" @focusout="focusInput(index, false)"
        @keydown.enter="enter(index)" @keydown.backspace="backspace($event, index)" ref="refs"
        v-for="(item, index) in formulas" />
</template>
