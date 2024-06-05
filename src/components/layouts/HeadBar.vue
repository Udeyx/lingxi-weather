<script setup lang="ts">
import logo from '@/assets/logo.png'

const props = defineProps<{ toggleSideNav: () => void }>()
</script>

<template>
    <header class="flex p-2 bg-green-50 items-center">
        <el-avatar @click="props.toggleSideNav" :src="logo" class="hover:cursor-pointer" />
        <h1 class="ml-4 pt-2">灵犀气象</h1>
    </header>
</template>
