<script setup lang="ts">
const props = defineProps({
    show: Boolean
})

</script>

<template>
    <Transition name="modal">
        <div v-if="show" class="fixed z-50 top-0 left-0 w-full h-full bg-black bg-opacity-50 flex transition-opacity overflow-auto py-10" @click="$emit('close')">
            <div class="modal-container w-1/2 m-auto p-0 bg-white rounded-md shadow-md transition-all" @click="$event.stopPropagation();">
                <div class="p-5 text-xl font-semibold text-blue-600">
                    <slot name="header" />
                </div>

                <div class="p-5 border-t border-gray-200">
                    <slot name="body" />
                </div>
                
                <div class="p-5 border-t border-gray-200">
                    <button class="modal-button px-5 py-1" @click="$emit('close')">Fertig</button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style>

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>