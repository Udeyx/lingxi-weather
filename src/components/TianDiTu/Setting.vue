<script setup>
import { onMounted, ref } from 'vue'
import { NDrawer, NDrawerContent, NCollapse, NCollapseItem, NTag, NButton } from 'naive-ui'
import ControlOptions from '@/components/SettingItems/ControlOptions.vue'
import MapOptions from '@/components/SettingItems/MapOptions.vue'
import MarkerOptions from '@/components/SettingItems/MarkerOptions.vue'
import { version } from '@/config/index.ts'
import { useSettingStore } from '@/stores/setting.ts'
import { useTiandituStore } from '@/stores/tianditu.ts'
import { useWindowSize } from '@vueuse/core'

const { width } = useWindowSize()

// 展示抽屉
const isShowModel = ref(false)
const pinia_useSettingStore = useSettingStore()
const pinia_useTiandituStore = useTiandituStore()

const drawerUpWid = (e) => {
    // console.log(e);
    pinia_useSettingStore.drawerWidth = e
    setTimeout(() => {
        pinia_useTiandituStore.Tmap.checkResize()
    }, 300)
}

const afterEnterDrawer = (e) => {
    drawerUpWid(e.clientWidth)
}
</script>

<template>
    <div
        v-if="!isShowModel"
        @click="isShowModel = true"
        class="fixed right-3 top-1/2 rounded-full cursor-pointer p-2 bg-black text-white"
        style="z-index: 9999"
    >
        设置
    </div>
    <n-drawer
        v-model:show="isShowModel"
        default-width="450"
        resizable
        :show-mask="false"
        :mask-closable="false"
        @update-width="drawerUpWid"
        @after-enter="afterEnterDrawer"
        @after-leave="drawerUpWid(0)"
        :class="width > 768 ? 'mt-16' : 'mb-[72px]'"
    >
        <n-drawer-content title="地图设置" closable>
            <template #header>
                地图设置
                <n-tag size="small"> {{ version }} </n-tag>
            </template>
            <div class="flex flex-col">
                <n-collapse>
                    <n-collapse-item title="地图属性" name="1">
                        <!--            地图选项组件-->
                        <map-options></map-options>
                    </n-collapse-item>
                    <n-collapse-item title="控件相关" name="2">
                        <!--            控件选项组件-->
                        <control-options></control-options>
                    </n-collapse-item>
                    <n-collapse-item title="覆盖物相关" name="3">
                        <!--            覆盖物选项组件-->
                        <marker-options></marker-options>
                    </n-collapse-item>
                </n-collapse>
            </div>
        </n-drawer-content>
    </n-drawer>
    <!--  和风天气混合天气内容展示弹框-->
</template>

<style scoped></style>
