<script setup lang="ts">
import ModernInput from "@components/formula/ModernInput.vue"
import TextFieldInput from "@components/formula/TextFieldInput.vue"
import { ref } from "vue";

const formularString = ref("a b\nc -d\ne f")

const modernInput = ref(true)

function updateFormula(formulaString: string) {
    formularString.value = formulaString;
}
</script>

<template>
    <div class="h-full flex flex-col">
        <button class="border ml-5 my-3" @click="modernInput = !modernInput">{{ modernInput ? "Modern" : "Textfeld" }}</button>
        <ModernInput :formula="formularString" @update:formula="updateFormula" v-if="modernInput"/>
        <TextFieldInput :formula="formularString" @update:formula="updateFormula" v-else/>
    </div>
</template>
