<script setup lang="ts">
import HeadBar from '@/components/layout/HeadBar.vue'
import SideNav from '@/components/layout/SideNav.vue'
import { ref } from 'vue'

const showSideNav = ref(true)
const toggleSideNav = () => {
    showSideNav.value = !showSideNav.value
}
</script>

<template>
    <div class="flex h-screen w-screen flex-col">
        <HeadBar :toggleSideNav="toggleSideNav" />
        <hr class="bg-slate-300 h-[1px]" />
        <div class="flex h-full">
            <SideNav v-if="showSideNav" class="w-64 h-full pt-8" />
            <router-view />
        </div>
    </div>
</template>
