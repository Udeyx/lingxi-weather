<script lang="ts" setup>
import { mockHistoryWeather, type Weather } from '@/types/weather'
import { processForHeat } from '@/utils/chart'
import { useWindowSize } from '@vueuse/core'
import Dropdown from 'primevue/dropdown'
import { onMounted, ref, watch } from 'vue'
import { Mix } from '@antv/g2plot'
import { groupBy, get } from '@antv/util'
import { getWeatherHistory } from '@/api'
import cities from '@/assets/cities.json'
import cityMap from '@/assets/cityMap.json'

const location = ref(101010100)
const locName = ref("北京")
const dataType = ref<'heat' | 'humidity' | 'windSpeed'>('heat')
const historyData = ref<Weather[]>(mockHistoryWeather)
const pieData = ref()
const radarData = ref()
const comboData = ref()
const { width } = useWindowSize()
const plot = ref()
onMounted(async () => {
    const res = await getWeatherHistory(101010100)

    function getDataByType(type) {
        return get(groupBy(res.data.line, 'type'), type, []).map((d) => ({
            time: d.time,
            value: d.value,
            type
        }))
    }
    historyData.value = getDataByType('温度').map((dt) => {
        return { time: dt.time, heat: dt.value }
    })
    const analyzedData = processForHeat(historyData.value)
    pieData.value = analyzedData.pieData
    comboData.value = analyzedData.comboData
    radarData.value = analyzedData.radarData

    if (res.status === 200) {
        plot.value = new Mix('container', {
            // 关闭 chart 上的 tooltip，子 view 开启 tooltip
            tooltip: false,
            legend: {
                layout: 'horizontal',
                position: 'top'
            },
            autoFit: true,
            plots: [
                {
                    type: 'line',
                    region: { start: { x: 0, y: 0 }, end: { x: 1, y: 0.3 } },
                    options: {
                        data: res.data.line,
                        xField: 'time',
                        yField: 'value',
                        seriesField: 'type',
                        point: { style: { r: 2.5 } },

                        meta: {
                            time: { range: [0, 1] }
                        },
                        tooltip: {
                            showCrosshairs: true,
                            shared: true
                        },
                        interactions: [
                            { type: 'association-active' },
                            { type: 'association-highlight' }
                        ]
                    }
                },
                {
                    type: 'line',
                    region: { start: { x: 0, y: 0.32 }, end: { x: 0.5, y: 0.65 } },
                    options: {
                        data: getDataByType('温度'),
                        xField: 'time',
                        yField: 'value',
                        seriesField: 'type',
                        interactions: [{ type: 'association-highlight' }],
                        point: {
                            style: { r: 2.5 },
                            state: {
                                active: {
                                    style: {
                                        lineWidth: 1,
                                        r: 3
                                    }
                                }
                            }
                        },
                        meta: {
                            time: { range: [0, 1] }
                        },
                        smooth: true,
                        tooltip: {
                            showCrosshairs: true,
                            shared: true
                        },
                        state: {
                            active: {
                                style: {
                                    lineWidth: 3
                                }
                            }
                        }
                    }
                },
                {
                    type: 'line',
                    region: { start: { x: 0.5, y: 0.32 }, end: { x: 1, y: 0.65 } },
                    options: {
                        data: getDataByType('体感温度'),
                        xField: 'time',
                        yField: 'value',
                        seriesField: 'type',
                        interactions: [{ type: 'association-highlight' }],
                        point: { style: { r: 2.5 } },
                        meta: {
                            time: { range: [0, 1] }
                        },
                        smooth: true,
                        tooltip: {
                            showCrosshairs: true,
                            shared: true
                        }
                    }
                },
                {
                    type: 'line',
                    region: { start: { x: 0, y: 0.67 }, end: { x: 0.5, y: 1 } },
                    options: {
                        data: getDataByType('湿度'),
                        xField: 'time',
                        yField: 'value',
                        seriesField: 'type',
                        interactions: [{ type: 'association-highlight' }],
                        point: { style: { r: 2.5 } },
                        meta: {
                            time: { range: [0, 1] }
                        },
                        smooth: true,
                        tooltip: {
                            showCrosshairs: true,
                            shared: true
                        }
                    }
                },
                {
                    type: 'line',
                    region: { start: { x: 0.5, y: 0.67 }, end: { x: 1, y: 1 } },
                    options: {
                        data: getDataByType('风速'),
                        xField: 'time',
                        yField: 'value',
                        seriesField: 'type',
                        interactions: [{ type: 'association-highlight' }],
                        point: { style: { r: 2.5 } },
                        meta: {
                            time: { range: [0, 1] }
                        },
                        smooth: true,
                        tooltip: {
                            showCrosshairs: true,
                            shared: true
                        }
                    }
                }
            ]
        })
        plot.value.render()
    }
})
watch(location, async (newValue, oldValue) => {
    if (typeof newValue !== 'number') {
        return
    }
    locName.value = cityMap[newValue.toString()]
    const res = await getWeatherHistory(newValue)
    function getDataByType(type) {
        return get(groupBy(res.data.line, 'type'), type, []).map((d) => ({
            time: d.time,
            value: d.value,
            type
        }))
    }
    historyData.value = getDataByType('温度').map((dt) => {
        return { time: dt.time, heat: dt.value }
    })
    const analyzedData = processForHeat(historyData.value)
    pieData.value = analyzedData.pieData
    comboData.value = analyzedData.comboData
    radarData.value = analyzedData.radarData
    if (plot.value) {
        plot.value.destroy()
    }

    if (res.status === 200) {
        plot.value = new Mix('container', {
            // 关闭 chart 上的 tooltip，子 view 开启 tooltip
            tooltip: false,
            legend: {
                layout: 'horizontal',
                position: 'top'
            },
            autoFit: true,
            plots: [
                {
                    type: 'line',
                    region: { start: { x: 0, y: 0 }, end: { x: 1, y: 0.3 } },
                    options: {
                        data: res.data.line,
                        xField: 'time',
                        yField: 'value',
                        seriesField: 'type',
                        point: { style: { r: 2.5 } },

                        meta: {
                            time: { range: [0, 1] }
                        },
                        tooltip: {
                            showCrosshairs: true,
                            shared: true
                        },
                        interactions: [
                            { type: 'association-active' },
                            { type: 'association-highlight' }
                        ]
                    }
                },
                {
                    type: 'line',
                    region: { start: { x: 0, y: 0.32 }, end: { x: 0.5, y: 0.65 } },
                    options: {
                        data: getDataByType('温度'),
                        xField: 'time',
                        yField: 'value',
                        seriesField: 'type',
                        interactions: [{ type: 'association-highlight' }],
                        point: {
                            style: { r: 2.5 },
                            state: {
                                active: {
                                    style: {
                                        lineWidth: 1,
                                        r: 3
                                    }
                                }
                            }
                        },
                        meta: {
                            time: { range: [0, 1] }
                        },
                        smooth: true,
                        tooltip: {
                            showCrosshairs: true,
                            shared: true
                        },
                        state: {
                            active: {
                                style: {
                                    lineWidth: 3
                                }
                            }
                        }
                    }
                },
                {
                    type: 'line',
                    region: { start: { x: 0.5, y: 0.32 }, end: { x: 1, y: 0.65 } },
                    options: {
                        data: getDataByType('体感温度'),
                        xField: 'time',
                        yField: 'value',
                        seriesField: 'type',
                        interactions: [{ type: 'association-highlight' }],
                        point: { style: { r: 2.5 } },
                        meta: {
                            time: { range: [0, 1] }
                        },
                        smooth: true,
                        tooltip: {
                            showCrosshairs: true,
                            shared: true
                        }
                    }
                },
                {
                    type: 'line',
                    region: { start: { x: 0, y: 0.67 }, end: { x: 0.5, y: 1 } },
                    options: {
                        data: getDataByType('湿度'),
                        xField: 'time',
                        yField: 'value',
                        seriesField: 'type',
                        interactions: [{ type: 'association-highlight' }],
                        point: { style: { r: 2.5 } },
                        meta: {
                            time: { range: [0, 1] }
                        },
                        smooth: true,
                        tooltip: {
                            showCrosshairs: true,
                            shared: true
                        }
                    }
                },
                {
                    type: 'line',
                    region: { start: { x: 0.5, y: 0.67 }, end: { x: 1, y: 1 } },
                    options: {
                        data: getDataByType('风速'),
                        xField: 'time',
                        yField: 'value',
                        seriesField: 'type',
                        interactions: [{ type: 'association-highlight' }],
                        point: { style: { r: 2.5 } },
                        meta: {
                            time: { range: [0, 1] }
                        },
                        smooth: true,
                        tooltip: {
                            showCrosshairs: true,
                            shared: true
                        }
                    }
                }
            ]
        })
        plot.value.render()
    }
})
</script>

<template>
    <main class="flex h-full w-full flex-col items-center gap-4 overflow-y-auto p-2">
        <template class="flex w-full items-center justify-between">
            <h1 class="text-2xl">{{ locName }}</h1>
            <div class="flex items-center gap-1">
                <Dropdown
                    v-model="location"
                    :options="cities"
                    option-label="name"
                    option-value="locId"
                    placeholder="请选择地区"
                    editable
                />
            </div>
        </template>
        <Card class="flex-1 w-full bg-white/70">
            <template v-if="width <= 768" #content>
                <template class="flex flex-col items-center gap-2">
                    <div id="container" class="flex-1" />
                    <Chart type="pie" :data="pieData" />
                    <Chart type="radar" :data="radarData" />
                </template>
            </template>
            <template v-else #content>
                <div class="flex w-full gap-4">
                    <div id="container" class="flex-1" />
                    <template class="flex flex-col items-center">
                        <Chart type="pie" :data="pieData" />
                        <Chart type="radar" :data="radarData" />
                    </template>
                </div>
            </template>
        </Card>
    </main>
</template>
