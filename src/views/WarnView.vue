<script lang="ts" setup>
import DisasterTable from '@/components/disaster/DisasterTable.vue'
import historyDisasters from '@/assets/disasters.json'
import { ref } from 'vue'
const disasters = ref(historyDisasters)
</script>

<template>
    <main class="flex h-full flex-col items-center">
        <h1 class="my-4 text-4xl">灾害预警</h1>
        <DisasterTable :disasters="disasters" class="w-4/5" />
    </main>
</template>
