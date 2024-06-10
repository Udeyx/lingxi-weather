<script lang="ts" setup>
import { getTodayPrediction } from '@/api'
import { oneMockWeather, type Weather } from '@/types/weather'
import { onMounted, ref } from 'vue'

const predictions = ref<Weather[]>([])
onMounted(async () => {
    predictions.value = [oneMockWeather, oneMockWeather, oneMockWeather, oneMockWeather]
    const res = await getTodayPrediction()
    if (res.status === 200) {
        predictions.value = res.data.map((dt: { time: string; temp: string; humidity: string }) => {
            return {
                time: dt.time,
                heat: dt.temp,
                humidity: dt.humidity
            }
        })
    }
})
</script>

<template>
    <Card class="w-80 bg-white/50 backdrop-blur-md md:w-96">
        <template #content>
            <div class="flex flex-col items-center gap-2">
                <h1 class="mb-12 text-3xl">未来24h天气</h1>
                <Timeline :value="predictions">
                    <template #opposite="slotProps">
                        <span class="text-nowrap text-[18px]">{{ slotProps.item.time }}</span>
                    </template>
                    <template #content="slotProps">
                        <div class="flex items-center gap-2 text-xl">
                            <div class="flex items-center gap-1">
                                <i class="qi-1009" />
                                <span>{{ slotProps.item.heat }}</span>
                            </div>
                            <div class="flex items-center gap-1">
                                <i class="qi-2120" />
                                <span>{{ slotProps.item.humidity }}</span>
                            </div>
                        </div>
                    </template>
                </Timeline>
            </div>
        </template>
    </Card>
</template>
