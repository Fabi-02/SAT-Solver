<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { RouterView } from 'vue-router'
import MenuBar from './components/menubar/MenuBar.vue'
</script>

<template>
    <div id="root" class="h-full flex flex-col">
        <MenuBar />
        <RouterView class="flex-grow w-full" />
    </div>
</template>
