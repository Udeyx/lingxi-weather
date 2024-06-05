<script setup lang="ts">
import PredictCard from '@/components/home/PredictCard.vue'
import RecommendCard from '@/components/home/RecommendCard.vue'
import WeatherCard from '@/components/home/WeatherCard.vue'
</script>

<template>
    <main
        class="flex h-full flex-grow flex-wrap items-start justify-center gap-4 overflow-y-auto bg-[url('@/assets/bg.webp')]"
    >
        <WeatherCard />
        <PredictCard />
        <RecommendCard />
    </main>
</template>
