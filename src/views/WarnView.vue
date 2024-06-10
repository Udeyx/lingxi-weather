<script lang="ts" setup>
import DisasterTable from '@/components/disaster/DisasterTable.vue'
import { onMounted, ref } from 'vue'
import { getAllWarning } from '@/api'
const disasters = ref()
onMounted(async () => {
    const res = await getAllWarning()
    if (res.status === 200) {
        disasters.value = res.data.map((dt: { startTime: string; endTime: string }) => {
            return { ...dt, time: dt.startTime + '-' + dt.endTime }
        })
    }
})
</script>

<template>
    <main class="flex h-full w-full flex-col items-center overflow-y-auto">
        <DisasterTable :disasters="disasters" />
        <div class="flex-1 h-full w-full bg-white/50 backdrop-blur-md"></div>
    </main>
</template>
