<script lang="ts" setup>
import { staticHostUrl } from '@/api'
import logo from '@/assets/logo.png'
import { useLocalStorage } from '@vueuse/core'
import Avatar from 'primevue/avatar'
import { RouterLink } from 'vue-router'
const menuItems: { label: string; icon: string; href: string }[] = [
    {
        label: '主页',
        icon: 'pi pi-home',
        href: '/home'
    },
    {
        label: '气象展示',
        icon: 'pi pi-sun',
        href: '/weather'
    },
    {
        label: '地形展示',
        icon: 'pi pi-map',
        href: '/landscape'
    },
    {
        label: '数据分析',
        icon: 'pi pi-chart-scatter',
        href: '/analysis'
    },
    {
        label: '灾害预警',
        icon: 'pi pi-exclamation-circle',
        href: '/warn'
    },
    {
        label: '用户反馈',
        icon: 'pi pi-comments',
        href: '/feedback'
    }
]
const avatar = useLocalStorage('avatar', localStorage.getItem('avatar') || '')
</script>

<template>
    <Menubar :model="menuItems" class="backdrop-blur-md">
        <template #start>
            <div class="flex items-center gap-2">
                <Avatar :image="logo" />
                <h1 class="mr-4 text-xl">灵犀气象</h1>
            </div>
        </template>
        <template #item="{ item, props }">
            <RouterLink :to="item.href" v-bind="props.action" activeClass="text-green-400">
                <i :class="item.icon" />
                <span class="ml-1">{{ item.label }}</span>
            </RouterLink>
        </template>
        <template #end>
            <RouterLink to="/person">
                <Avatar :image="staticHostUrl + avatar" />
            </RouterLink>
        </template>
    </Menubar>
</template>
