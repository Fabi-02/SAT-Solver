<script setup lang="ts">
import { modalData } from '@ts/modal';

const props = defineProps({
    show: Boolean
})

</script>

<template>
    <Transition name="modal">
        <div v-if="show"
             class="fixed z-50 top-0 left-0 w-full h-full bg-black bg-opacity-50 flex transition-opacity overflow-auto py-10"
             @click="$emit('close')">
            <div class="modal-container w-1/2 m-auto p-0 bg-white rounded-md shadow-md transition-all"
                 @click="$event.stopPropagation();">
                <div class="p-5 text-xl font-semibold text-blue-600">
                    <p v-if="modalData.modalType == 'NodeInfo'">Node Info</p>
                    <p v-if="modalData.modalType == 'Formula'">KNF-Formel</p>
                    <p v-if="modalData.modalType == 'FormulaModel'">KNF-Formel (mit Knoten Info)</p>
                </div>

                <div class="p-5 border-t border-gray-200">
                    <div v-if="modalData.modalType == 'NodeInfo'">
                        <p v-for="item in modalData.data">{{ item.key }} <span class="text-gray-400">=</span> <span
                                  :class="{ 'text-red-500': item.neg, 'text-green-500': !item.neg }">{{ item.neg ? "False" :
                                      "True" }}</span></p>
                    </div>
                    <div v-if="modalData.modalType == 'Formula'">
                        <p v-for="(clause, index) in modalData.data.clauses" class="flex">
                            <span class="w-5" v-if="index !== 0">∧</span>
                            <span class="w-5" v-else></span>
                            ( {{ clause }} )
                        </p>
                    </div>
                    <div v-if="modalData.modalType == 'FormulaModel'">
                        <p v-for="(clause, index) in modalData.data.formula.clauses" class="flex" :class="{
                            'bg-green-100': clause.evaluate(modalData.data.model) === 'sat',
                            'bg-red-100': clause.evaluate(modalData.data.model) === 'unsat'
                        }">
                            <span class="w-5" v-if="index !== 0">∧</span>
                            <span class="w-5" v-else></span>
                            (
                            <span v-for="(literal, index) in clause.literals" class="flex">
                                <span v-if="index !== 0">&nbsp;∨&nbsp;</span>
                                <span :class="{
                                    'text-green-700': literal.identifier in modalData.data.model && (modalData.data.model[literal.identifier] ^ literal.neg),
                                    'text-red-700': literal.identifier in modalData.data.model && !(modalData.data.model[literal.identifier] ^ literal.neg)
                                }">
                                    <span v-if="literal.neg">¬</span>
                                    {{ literal.identifier }}
                                </span>
                            </span>
                            )
                        </p>
                    </div>
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
}</style>