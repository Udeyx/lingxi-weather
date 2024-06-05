<script lang="ts" setup>
import BottomNav from '@/components/layouts/BottomNav.vue'
</script>

<template>
    <div class="flex h-screen flex-col justify-between bg-[url('@/assets/bg.webp')]">
        <slot />
        <BottomNav />
    </div>
</template>
