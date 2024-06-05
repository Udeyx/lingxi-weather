<script lang="ts" setup>
import { oneMockWeather, type Weather } from '@/types/weather'
import { onMounted, ref } from 'vue'

const location = localStorage.getItem('location') || '北京市'
const curWeather = ref<Weather>(oneMockWeather)

onMounted(async () => {
    curWeather.value = oneMockWeather
})
</script>

<template>
    <Card class="w-80 bg-sky-400/30 backdrop-blur-md md:w-96">
        <template #content>
            <div class="flex flex-col items-center gap-2">
                <h1 class="text-3xl">当前天气</h1>
                <h6 class="text-sm">{{ location }}</h6>
                <i :class="'qi-' + curWeather.iconId + '-fill mb-4 text-5xl'" />
                <div class="grid grid-cols-2 gap-4">
                    <div class="flex items-center gap-1">
                        <i class="qi-1009" />
                        <span class="text-2xl">{{ curWeather.heat }}</span>
                    </div>
                    <div class="flex items-center gap-1">
                        <i class="qi-2120" />
                        <span class="text-2xl">{{ curWeather.humidity }}</span>
                    </div>
                    <div class="flex items-center gap-1">
                        <i class="qi-2105" />
                        <span class="text-2xl">{{ curWeather.windDirection }}</span>
                    </div>
                    <div class="flex items-center gap-1">
                        <i class="qi-2386" />
                        <span class="text-2xl">{{ curWeather.windSpeed }}</span>
                    </div>
                </div>
            </div>
        </template>
    </Card>
</template>
