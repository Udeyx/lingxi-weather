<script lang="ts" setup>
import { mockHistoryWeather, type Weather } from '@/types/weather'
import { processForHeat } from '@/utils/chart'
import { useWindowSize } from '@vueuse/core'
import Dropdown from 'primevue/dropdown'
import { onMounted, ref } from 'vue'
const location = ref(101010100)
const dataType = ref<'heat' | 'humidity' | 'windSpeed'>('heat')
const historyData = ref<Weather[]>(mockHistoryWeather)
const pieData = ref()
const radarData = ref()
const comboData = ref()
const { width } = useWindowSize()
onMounted(async () => {
    historyData.value = mockHistoryWeather
    const analyzedData = processForHeat(historyData.value)
    pieData.value = analyzedData.pieData
    comboData.value = analyzedData.comboData
    radarData.value = analyzedData.radarData
})
</script>

<template>
    <main class="flex w-full flex-col items-center gap-4 overflow-y-auto p-2">
        <template class="flex w-full items-center justify-between">
            <h1 class="text-2xl">北京市</h1>
            <div class="flex items-center gap-1">
                <Dropdown v-model="location" placeholder="请选择地区" />
                <Dropdown v-model="dataType" placeholder="请选择气象指标" />
            </div>
        </template>
        <Card class="bg-white/30 backdrop-blur-md">
            <template v-if="width <= 768" #content>
                <template class="flex flex-col items-center gap-2">
                    <Chart type="pie" :data="pieData" />
                    <Chart type="radar" :data="radarData" />
                    <Chart type="bar" :data="comboData" />
                </template>
            </template>
            <template v-else #content>
                <template class="flex flex-col items-center gap-2">
                    <template class="flex flex-wrap items-center">
                        <Chart type="pie" :data="pieData" />
                        <Chart type="radar" :data="radarData" />
                    </template>
                    <Chart class="w-full" type="bar" :data="comboData" />
                </template>
            </template>
        </Card>
    </main>
</template>
