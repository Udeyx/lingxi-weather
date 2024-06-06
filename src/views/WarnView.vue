<script lang="ts" setup>
import DisasterTable from '@/components/disaster/DisasterTable.vue'
import historyDisasters from '@/assets/disasters.json'
import { ref } from 'vue'
const disasters = ref(historyDisasters)
</script>

<template>
    <main class="flex h-full w-full flex-col items-center overflow-y-auto">
        <DisasterTable :disasters="disasters" />
        <div class="flex-1 h-full w-full bg-white/50 backdrop-blur-md"></div>
    </main>
</template>
