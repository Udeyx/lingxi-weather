<script lang="ts" setup>
import { RouterLink } from 'vue-router'
const menuItems: { label: string; icon: string; href: string }[] = [
    {
        label: '主页',
        icon: 'pi pi-home',
        href: '/home'
    },
    {
        label: '气象',
        icon: 'pi pi-sun',
        href: '/weather'
    },
    {
        label: '地形',
        icon: 'pi pi-map',
        href: '/landscape'
    },
    {
        label: '分析',
        icon: 'pi pi-chart-scatter',
        href: '/analysis'
    },
    {
        label: '预警',
        icon: 'pi pi-exclamation-circle',
        href: '/warn'
    },
    {
        label: '反馈',
        icon: 'pi pi-comments',
        href: '/feedback'
    },
    {
        label: '个人',
        icon: 'pi pi-user',
        href: '/person'
    }
]
</script>

<template>
    <Menubar :model="menuItems" breakpoint="128px" class="flex justify-center">
        <template #item="{ item, props }">
            <RouterLink :to="item.href" v-bind="props.action" activeClass="text-green-400">
                <div class="flex flex-col items-center">
                    <i :class="item.icon" />
                    <h1 class="text-sm">{{ item.label }}</h1>
                </div>
            </RouterLink>
        </template>
    </Menubar>
</template>
