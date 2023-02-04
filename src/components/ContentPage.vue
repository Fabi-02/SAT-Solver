<script lang="ts">
export default {
    props: {
        name: { type: String, required: true }
    }
}
</script>

<template>
    <div class="h-full flex flex-col">
       <header class="bg-white shadow">
           <div class="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
               <h1 class="text-3xl font-bold tracking-tight text-gray-900">{{ name }}</h1>
           </div>
       </header>
       <main class="flex-grow w-full">
           <div class="h-full mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
               <slot />
           </div>
       </main>
   </div>
</template>
