<script lang="ts" setup>
import { oneMockRecommendation } from '@/types/weather'
import { onMounted, ref } from 'vue'

import sport from '@/assets/icons/recommendation/sport.png'
import cloth from '@/assets/icons/recommendation/cloth.png'
import fangshai from '@/assets/icons/recommendation/fangshai.png'
import glasses from '@/assets/icons/recommendation/glasses.png'
import kongtiao from '@/assets/icons/recommendation/kongtiao.png'
import liangshai from '@/assets/icons/recommendation/liangshai.png'
import journey from '@/assets/icons/recommendation/journey.png'
import comfortable from '@/assets/icons/recommendation/comfortable.png'
import xiche from '@/assets/icons/recommendation/xiche.png'
import { getIndicators } from '@/api'

const cards: { name: string; title: string; icon: string }[] = [
    { name: 'sport', title: '运动', icon: sport },
    { name: 'cloth', title: '穿衣', icon: cloth },
    { name: 'fangshai', title: '防晒', icon: fangshai },
    { name: 'glasses', title: '太阳镜', icon: glasses },
    { name: 'kongtiao', title: '空调', icon: kongtiao },
    { name: 'liangshai', title: '晾晒', icon: liangshai },
    { name: 'journey', title: '旅游', icon: journey },
    { name: 'comfortable', title: '舒适', icon: comfortable },
    { name: 'xiche', title: '洗车', icon: xiche }
]

const recommendation = ref<{ [key: string]: string }>({
    sport: '',
    cloth: '',
    fangshai: '',
    glasses: '',
    kongtiao: '',
    liangshai: '',
    journey: '',
    comfortable: '',
    xiche: ''
})
onMounted(async () => {
    const res = await getIndicators()
    if (res.status === 200) {
        recommendation.value = res.data
    } else {
        recommendation.value = oneMockRecommendation
    }
})
</script>

<template>
    <Card class="w-80 bg-white/50 backdrop-blur-md md:w-96">
        <template #content>
            <div class="flex flex-col items-center">
                <h1 class="mb-4 text-3xl">生活推荐</h1>
                <div class="grid grid-cols-3 gap-2">
                    <Card
                        v-for="card in cards"
                        :key="card.name"
                        class="h-28 bg-blue-100/40 backdrop-blur-md"
                    >
                        <template #content>
                            <div class="flex flex-col items-center">
                                <img :src="card.icon" width="28" height="28" />
                                <h2 class="text-nowrap text-xl text-pink-300">
                                    {{ recommendation[card.name] }}
                                </h2>
                            </div>
                            <h4 class="text-nowrap text-center text-sm">{{ card.title }}</h4>
                        </template>
                    </Card>
                </div>
            </div>
        </template>
    </Card>
</template>
