<script setup lang="ts">
import { ref, reactive, nextTick, computed } from 'vue'

const props = defineProps({
    formula: { type: String, required: true }
});

const emit = defineEmits<{
    (e: 'update:formula', value: string): void
}>();

function input(event: Event) {
    let value = (event.target as any).value;
    emit("update:formula", value);   
}

const rows = computed(() => {
    return props.formula.split('\n').length
});
</script>

<template>
    <div>
        <textarea class="w-full border p-2 resize-none leading-5 whitespace-nowrap" :rows="rows" :value="formula" @input="input"></textarea>
    </div>
</template>