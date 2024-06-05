<script setup lang="ts">
import weatherIcon from '@/assets/icons/sidenav/weather.png'
import landformIcon from '@/assets/icons/sidenav/landform.png'
import feedbackIcon from '@/assets/icons/sidenav/feedback.png'
import warnIcon from '@/assets/icons/sidenav/warn.png'
import indicatorIcon from '@/assets/icons/sidenav/indicator.png'
import userIcon from '@/assets/icons/sidenav/user.png'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const links: { index: string; route: string; name: string; icon: string }[] = [
    { index: '1', route: '/weather', name: '气象展示', icon: weatherIcon },
    { index: '2', route: '/landscape', name: '地形展示', icon: landformIcon },
    { index: '3', route: '/recommendation', name: '智能推荐', icon: indicatorIcon },
    { index: '4', route: '/feedback', name: '用户反馈', icon: feedbackIcon },
    { index: '5', route: '/warn', name: '灾害预警', icon: warnIcon },
    { index: '6', route: '/person', name: '个人中心', icon: userIcon }
]
const route = useRoute()
const getActiveIndex = computed(() => {
    return route.fullPath.includes('weather')
        ? '1'
        : route.fullPath.includes('landscape')
          ? '2'
          : route.fullPath.includes('recommendation')
            ? '3'
            : route.fullPath.includes('feedback')
              ? '4'
              : route.fullPath.includes('warn')
                ? '5'
                : route.fullPath.includes('person')
                  ? '6'
                  : '1'
})
</script>

<template>
    <el-menu :default-active="getActiveIndex" router background-color="#EBFDF5">
        <el-menu-item
            v-for="link in links"
            :key="link.index"
            :index="link.index"
            :route="link.route"
            class="mr-8"
        >
            <el-image :src="link.icon" class="w-4 h-4 mr-2" />
            {{ link.name }}
        </el-menu-item>
    </el-menu>
</template>
