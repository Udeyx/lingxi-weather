<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import MobileLayout from '@/components/layouts/MobileLayout.vue'
import DesktopLayout from '@/components/layouts/DesktopLayout.vue'
import { useWindowSize } from '@vueuse/core'
const route = useRoute()
const { width } = useWindowSize()
</script>

<template>
    <RouterView v-if="route.name == 'welcome'" />
    <template v-else>
        <template v-if="width <= 768">
            <MobileLayout>
                <RouterView v-slot="{ Component }">
                    <KeepAlive :include="['WeatherView', 'WarnView']">
                        <component :is="Component" />
                    </KeepAlive>
                </RouterView>
            </MobileLayout>
        </template>
        <template v-else>
            <DesktopLayout>
                <RouterView v-slot="{ Component }">
                    <KeepAlive :include="['WeatherView', 'WarnView']">
                        <component :is="Component" />
                    </KeepAlive>
                </RouterView>
            </DesktopLayout>
        </template>
    </template>
</template>
