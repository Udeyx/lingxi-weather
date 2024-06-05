<script lang="ts" setup>
import TopNav from '@/components/layouts/TopNav.vue'
</script>

<template>
    <div class="flex h-screen flex-col bg-[url('@/assets/bg.webp')]">
        <TopNav />
        <slot />
    </div>
</template>
