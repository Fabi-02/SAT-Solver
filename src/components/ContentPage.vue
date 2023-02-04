<script setup lang="ts">
const props = defineProps({
    name: { type: String, required: true }
})
</script>

<template>
    <div class="h-full flex flex-col">
        <header class="bg-white shadow">
            <div class="py-6 px-6">
                <h1 class="text-3xl font-bold tracking-tight text-gray-900">{{ name }}</h1>
            </div>
        </header>
        <main class="flex-grow w-full">
            <div class="h-full py-6 px-6">
                <slot />
            </div>
        </main>
    </div>
</template>
