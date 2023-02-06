<script setup lang="ts">
import ContentPage from '@components/ContentPage.vue'
import FormulaInput from '@components/formula/FormulaInput.vue'
import D3Test from '@components/d3/D3Test.vue'
</script>

<template>
    <ContentPage name="SAT-Solver">
        <!-- <div class="h-full rounded-lg border-4 border-dashed border-gray-200">
            <D3Test />
        </div> -->
        <div class="flex space-x-5 h-full">
            <FormulaInput class="w-60 h-full shrink-0"/>
            <div class="w-full h-full">
                <D3Test />
            </div>
        </div>
    </ContentPage>
</template>
