<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
    to: { type: String, required: true }
});

const route = useRoute()
const isActive = computed(() => route.path === props.to)
</script>

<template>
    <router-link :to="to" class="link px-3 py-2 rounded-md text-sm font-medium"
        :class="{ 'active-menu-tab': isActive, 'menu-tab': !isActive }">
        <slot />
    </router-link>
</template>
