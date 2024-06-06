<script lang="ts" setup>
import { getCurWeather } from '@/api'
import { oneMockWeather, type Weather } from '@/types/weather'
import { onMounted, ref } from 'vue'

const location = localStorage.getItem('location') || '北京市'
const curWeather = ref<Weather>(oneMockWeather)
function getNowFormatDate() {
    let date = new Date(),
        year = date.getFullYear(), //获取完整的年份(4位)
        month = date.getMonth() + 1, //获取当前月份(0-11,0代表1月)
        strDate = date.getDate() // 获取当前日(1-31)
    if (month < 10) month = +`0${month}` // 如果月份是个位数，在前面补0
    if (strDate < 10) strDate = +`0${strDate}` // 如果日是个位数，在前面补0

    return `${year}年${month}月${strDate}日`
}

onMounted(async () => {
    const res = await getCurWeather()
    console.log(res.data)
    if (res.status === 200) {
        curWeather.value = {
            ...curWeather.value,
            heat: res.data.temp,
            humidity: res.data.humidity,
            windSpeed: res.data.windSpeed,
            windDirection: res.data.wind360
        }
    }
})
</script>

<template>
    <Card class="w-80 bg-white/50 backdrop-blur-md md:w-96">
        <template #content>
            <div class="flex flex-col items-center gap-2">
                <h1 class="text-3xl">当前天气</h1>
                <h6 class="text-xl">{{ location }}</h6>
                <h6 class="text-xl">{{ getNowFormatDate() }}</h6>
                <i :class="'qi-' + curWeather.iconId + '-fill mb-4 text-[100px] '" />
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
                        <i class="qi-2386" />
                        <span class="text-2xl">{{ curWeather.windDirection }}</span>
                    </div>
                    <div class="flex items-center gap-1">
                        <i class="qi-2105" />
                        <span class="text-2xl">{{ curWeather.windSpeed }}</span>
                    </div>
                </div>
            </div>
        </template>
    </Card>
</template>
