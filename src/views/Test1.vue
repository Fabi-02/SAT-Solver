<script setup lang="ts">
import ContentPage from '../components/ContentPage.vue'
import D3Test from '../components/d3/D3Test.vue'
</script>

<template>
    <ContentPage name="Test1">
        <div class="h-full rounded-lg border-4 border-dashed border-gray-200">
            <D3Test />
        </div>
    </ContentPage>
</template>
