<script lang="ts" setup>
import DisasterTable from '@/components/disaster/DisasterTable.vue'
import historyDisasters from '@/assets/disasters.json'
import { ref } from 'vue'
const disasters = ref(historyDisasters)
</script>

<template>
    <main class="flex h-full w-full flex-col items-center overflow-y-auto">
        <DisasterTable :disasters="disasters" />
    </main>
</template>