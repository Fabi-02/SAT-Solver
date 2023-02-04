<script lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

export default {
    props: {
        to: { type: String, required: true }
    },
    setup(props) {
        const route = useRoute()
        const isActive = computed(() => route.path === props.to)
        return { isActive }
    }
}
</script>

<template>
    <router-link :to="to" class="link px-3 py-2 rounded-md text-sm font-medium" :class="{ 'active-menu-tab': isActive, 'menu-tab': !isActive }">
        <slot />
    </router-link>
</template>
