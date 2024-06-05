<script lang="ts" setup>
import { oneMockWeather, type Weather } from '@/types/weather'
import { onMounted, ref } from 'vue'

const predictions = ref<Weather[]>([])
onMounted(async () => {
    predictions.value = [oneMockWeather, oneMockWeather, oneMockWeather, oneMockWeather]
})
</script>

<template>
    <Card class="w-80 bg-sky-400/30 backdrop-blur-md md:w-96">
        <template #content>
            <div class="flex flex-col items-center gap-2">
                <h1 class="mb-4 text-3xl">今日预测</h1>
                <Timeline :value="predictions">
                    <template #opposite="slotProps">
                        <span class="text-nowrap text-sm">{{
                            slotProps.item.time.split(' ')[1]
                        }}</span>
                    </template>
                    <template #content="slotProps">
                        <div class="flex items-center gap-2">
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
