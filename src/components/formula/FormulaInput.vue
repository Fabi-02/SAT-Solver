<script setup lang="ts">
import ModernInput from "@components/formula/ModernInput.vue"
import TextFieldInput from "@components/formula/TextFieldInput.vue"
import { ref } from "vue";

const props = defineProps({
    formula: { type: String, required: true }
});

const emit = defineEmits<{
    (e: 'update:formula', value: string): void
}>();

const modernInput = ref(true)

function updateFormula(formulaString: string) {
    emit("update:formula", formulaString);
}
</script>

<template>
    <div class="flex flex-col">
        <button class="border ml-5 mb-3 w-10 bg-gray-100 hover:bg-gray-50 rounded-full" @click="modernInput = !modernInput">
            <font-awesome-icon icon="fa-solid fa-align-justify" v-if="modernInput" />
            <font-awesome-icon icon="fa-regular fa-square" v-else />
        </button>
        <ModernInput :formula="formula" @update:formula="updateFormula" v-if="modernInput"/>
        <TextFieldInput :formula="formula" @update:formula="updateFormula" v-else/>
    </div>
</template>
