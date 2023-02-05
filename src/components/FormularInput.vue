<script setup lang="ts">
import { areaRadial } from 'd3-shape';
import { ref } from 'vue'

const text = ref('');
const rawFormular = ref('');

function focusInput(focus: boolean) {
    if (focus) {
        text.value = rawFormular.value;
    } else {
        rawFormular.value = text.value
        text.value = text.value.trim()
                        .replaceAll(/\s\s+/g, ' ')
                        .replaceAll(/-|~/g, '¬')
                        .replaceAll(/\s/g, ' ∧ ');
        console.log(text)
    }
}
</script>

<template>
    <input ref="aaa" type="text" name="text" class="block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
        v-model="text" @focusin="focusInput(true)" @focusout="focusInput(false)"/>
</template>
