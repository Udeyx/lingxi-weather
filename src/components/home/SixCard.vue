<script lang="ts" setup>
import { getSixWeather } from '@/api'
import { useWindowSize } from '@vueuse/core'
import { onMounted, ref } from 'vue'

interface PredictWeather {
    time: string
    temp: number
    humidity: number
    iconId: number
}
function toweek(date: string) {
    let datelist = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    return datelist[new Date(date).getDay()]
}
const { width } = useWindowSize()
const mockSixWeather: PredictWeather[] = [
    {
        time: '周一',
        temp: 10,
        humidity: 30,
        iconId: 100
    },
    {
        time: '周二',
        temp: 10,
        humidity: 30,
        iconId: 100
    },
    {
        time: '周三',
        temp: 10,
        humidity: 30,
        iconId: 100
    },
    {
        time: '周四',
        temp: 10,
        humidity: 30,
        iconId: 100
    },
    {
        time: '周五',
        temp: 10,
        humidity: 30,
        iconId: 100
    },
    {
        time: '周六',
        temp: 10,
        humidity: 30,
        iconId: 100
    }
]
const sixWeather = ref<PredictWeather[]>(mockSixWeather)
onMounted(async () => {
    const res = await getSixWeather()
    sixWeather.value = res.data.map(
        (dt: { time: string; iconId: string; temp: number; humidity: string }) => {
            return {
                time: toweek(dt.time),
                iconId: +dt.iconId,
                temp: dt.temp,
                humidity: +dt.humidity
            }
        }
    )
})
</script>

<template>
    <Card class="bg-white/50 backdrop-blur-md">
        <template #content>
            <template v-if="width <= 768">
                <div class="grid grid-cols-3 gap-2">
                    <Card
                        v-for="weather in sixWeather"
                        :key="weather.time"
                        class="bg-white/80 backdrop-blur-md h-[200px]"
                    >
                        <template #content>
                            <div class="flex flex-col items-center gap-2">
                                <h1 class="text-2xl">{{ weather.time }}</h1>
                                <i :class="'text-4xl  qi-' + weather.iconId" />
                                <div class="flex items-center gap-1 text-2xl">
                                    <i class="qi-1009" />
                                    <span>{{ weather.temp }}</span>
                                </div>
                                <div class="flex items-center gap-1 text-2xl">
                                    <i class="qi-2120" />
                                    <span>{{ weather.humidity }}</span>
                                </div>
                            </div>
                        </template>
                    </Card>
                </div>
            </template>
            <template v-else>
                <div class="flex gap-2">
                    <Card
                        v-for="weather in sixWeather"
                        :key="weather.time"
                        class="bg-white/80 backdrop-blur-md h-[200px]"
                    >
                        <template #content>
                            <div class="flex flex-col items-center gap-2">
                                <h1 class="text-2xl">{{ weather.time }}</h1>
                                <i :class="'text-5xl  qi-' + weather.iconId" />
                                <div class="flex items-center gap-1 text-2xl">
                                    <i class="qi-1009" />
                                    <span>{{ weather.temp }}</span>
                                </div>
                                <div class="flex items-center gap-1 text-xl">
                                    <i class="qi-2120" />
                                    <span>{{ weather.humidity }}</span>
                                </div>
                            </div>
                        </template>
                    </Card>
                </div>
            </template>
        </template>
    </Card>
</template>
