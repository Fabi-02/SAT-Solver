<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { RouterView } from 'vue-router'
import MenuBar from '@components/menubar/MenuBar.vue'
import Modal from '@components/modal/Modal.vue';
import { modalData } from '@ts/modal';

</script>

<template>
    <div id="root" class="h-screen flex flex-col">
        <MenuBar class="fixed h-14" />
        <RouterView class="mt-14 overflow-auto" />
    </div>
    <Teleport to="body">
        <Modal :show="modalData.show" @close="modalData.show = false"></Modal>
    </Teleport>
</template>
