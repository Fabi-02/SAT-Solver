<script lang="ts">
import MenuItem from './MenuItem.vue'

export default {
    components: { MenuItem }
}
</script>

<template>
    <nav class="bg-gray-800">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="flex h-16 items-center justify-between">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <img class="h-8 w-8" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                            alt="Your Company">
                    </div>
                    <h1 class="font-bold text-xl px-3 py-2 text-white">SAT-Solver</h1>
                    <div class="ml-10 flex items-baseline space-x-4">
                        <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
                        <MenuItem to="/">Startseite</MenuItem>
                        <MenuItem to="/test1">Test1</MenuItem>
                        <MenuItem to="/test2">Test2</MenuItem>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>
