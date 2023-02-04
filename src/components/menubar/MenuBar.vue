<script setup lang="ts">
import MenuItem from './MenuItem.vue'
</script>

<template>
    <nav class="flex px-6 h-20 items-center bg-gray-800">
        <img class="h-8 w-8" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500" alt="Logo">
        <h1 class="font-bold text-xl px-3 py-2 text-white whitespace-nowrap">SAT-Solver</h1>
        <div class="ml-5 flex items-baseline space-x-4">
            <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
            <MenuItem to="/">Startseite</MenuItem>
            <MenuItem to="/test1">Test1</MenuItem>
            <MenuItem to="/test2">Test2</MenuItem>
        </div>
    </nav>
</template>
