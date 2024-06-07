<script setup lang="ts">
import PredictCard from '@/components/home/PredictCard.vue'
import RecommendCard from '@/components/home/RecommendCard.vue'
import WeatherCard from '@/components/home/WeatherCard.vue'
import SunChart from '@/components/home/SunChart.vue'
import SixCard from '@/components/home/SixCard.vue'
import { useWindowSize } from '@vueuse/core'
import { useToast } from 'primevue/usetoast'
import { getWarning } from '@/api'
import Toast from 'primevue/toast'
import { onMounted } from 'vue'
const { width } = useWindowSize()
const toast = useToast()
onMounted(async () => {
    const res = await getWarning()
    if (res.status === 200) {
        toast.add({
            severity: 'warn',
            summary: res.data.msg,
            life: 2000
        })
    }
    console.log(res.data)
})
</script>

<template>
    <Toast />
    <main
        v-if="width > 768"
        class="bg-[url('@/assets/bg.webp')] h-full flex-grow flex flex-col overflow-y-auto mt-4"
    >
        <div class="flex flex-wrap items-start justify-center gap-4 mb-4">
            <WeatherCard class="h-full" />
            <PredictCard class="h-full" />
            <RecommendCard />
        </div>
        <div class="flex flex-wrap items-start justify-center gap-8">
            <SixCard />
            <SunChart />
        </div>
    </main>
    <main
        v-else
        class="bg-[url('@/assets/bg.webp')] h-full flex-grow flex flex-col overflow-y-auto mt-4"
    >
        <div class="flex flex-wrap items-start justify-center gap-4 mb-4">
            <WeatherCard />
            <PredictCard />
            <RecommendCard />
        </div>
        <div class="flex flex-wrap items-start justify-center gap-8">
            <SixCard />
            <SunChart />
        </div>
    </main>
</template>
