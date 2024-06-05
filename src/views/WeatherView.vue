<template>
    <div id="container" class="h-full w-full">
        <a-float-button-group id="float_button" shape="circle">
            <a-tooltip placement="right">
                <a-float-button @click="showTemperature">
                    <template #icon>
                        <icon-font type="icon-wendu" />
                    </template>
                </a-float-button>
                <template #title>
                    <span>气温</span>
                </template>
            </a-tooltip>
            <a-tooltip placement="right">
                <a-float-button @click="showWeather">
                    <template #icon>
                        <icon-font type="icon-tianqi1" />
                    </template>
                </a-float-button>
                <template #title>
                    <span>天气</span>
                </template>
            </a-tooltip>
            <a-tooltip placement="right">
                <a-float-button @click="showHumidity">
                    <template #icon>
                        <icon-font type="icon-shidu" />
                    </template>
                </a-float-button>
                <template #title>
                    <span>湿度</span>
                </template>
            </a-tooltip>
            <a-tooltip placement="right">
                <a-float-button @click="showWind">
                    <template #icon>
                        <icon-font type="icon-a-Windfenglitianqi" />
                    </template>
                </a-float-button>
                <template #title>
                    <span>风力</span>
                </template>
            </a-tooltip>
        </a-float-button-group>
        <div class="weatherCard" v-if="showMode === 2">
            <div class="nav"></div>
            <div class="city-info">
                <div class="city-name">{{ loc }}</div>
                <p class="weather">{{ weather }}</p>
                <h2 class="temp">
                    <!-- em标签 斜体-->
                    <em>{{ temperature }}</em
                    >℃
                </h2>
                <div class="detail">
                    <span>风力: {{ windScale }}级</span> | <span>风向: {{ windDir }}</span> |
                    <span>空气湿度:{{ humidity }}%</span>
                </div>
            </div>
        </div>
        <div
            v-if="showMode === 1"
            class=""
            id="legend"
            style="
                background: linear-gradient(
                    to top,
                    /* -40 */ rgb(94, 55, 148),
                    /* -30 */ rgb(51, 43, 129),
                    /* -20 */ rgb(43, 66, 147),
                    /* -10 */ rgb(37, 94, 164),
                    /* -5 */ rgb(60, 129, 181),
                    /* 0 */ rgb(59, 151, 93),
                    /* 5 */ rgb(109, 158, 68),
                    /* 10 */ rgb(195, 178, 55),
                    /* 15 */ rgb(224, 124, 38),
                    /* 30 */ rgb(210, 94, 31),
                    /* 35 */ rgb(184, 70, 23),
                    /* 40 */ rgb(184, 70, 23)
                );
            "
        >
            <div class="segments">
                <div>°C</div>
                <div>-20</div>
                <div>-10</div>
                <div>0</div>
                <div>10</div>
                <div>30</div>
                <div>40</div>
            </div>
        </div>
        <div
            v-else-if="showMode === 3"
            class=""
            id="legend"
            style="
                background: linear-gradient(
                    to top,
                    rgb(164, 154, 27),
                    rgb(164, 154, 27),
                    rgb(127, 165, 55),
                    rgb(67, 199, 147),
                    rgb(48, 192, 113),
                    rgb(103, 148, 218),
                    rgb(93, 128, 208),
                    rgb(93, 113, 205),
                    rgb(96, 90, 180),
                    rgb(83, 63, 117),
                    rgb(83, 63, 117)
                );
            "
        >
            <div class="segments">
                <div>%</div>
                <div>30</div>
                <div>50</div>
                <div>80</div>
                <div>90</div>
                <div>100</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import { createFromIconfontCN } from '@ant-design/icons-vue'
import geoJsonData from '@/assets/GeoCity.json'
import { citys } from '@/assets/citys'
import { Scene, LineLayer } from '@antv/l7'
import { GaodeMap } from '@antv/l7-maps'
import { getWeather } from '@/api'

const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/c/font_4511139_4duxindyi5k.js'
})
//地图底图
let map = null
//地图默认图层
let layer = null
//天气图层
let weatherLayer = null
//风力图层
let wind = null
let scene = null
const WindData = ref()
//天气
let weathers = null
//GeoJson组件
let geoJsonTemp = null
let geoJsonHumidity = null
let geoJsonWind = null
//气温提示框
var infoTempWindow
//相对湿度提示框
var infoHumidityWindow
//风力提示框
var infoWindWindow
//天气展示框
const loc = ref()
const weather = ref()
const temperature = ref()
const windScale = ref()
const windDir = ref()
const humidity = ref()

//显示模式 1气温,2天气,3湿度,4风力
const showMode = ref(0)

function Param2Color(mode, param) {
    if (mode === 1) {
        if (param < -40) {
            return 'rgb(94, 55, 148)'
        } else if (param < -30) {
            return 'rgb(51, 43, 129)'
        } else if (param < -20) {
            return 'rgb(43, 66, 147)'
        } else if (param < -10) {
            return 'rgb(37, 94, 164)'
        } else if (param < -5) {
            return 'rgb(60, 129, 181)'
        } else if (param < 0) {
            return 'rgb(59, 151, 93)'
        } else if (param < 5) {
            return 'rgb(109, 158, 68)'
        } else if (param < 10) {
            return 'rgb(195, 178, 55)'
        } else if (param < 15) {
            return 'rgb(224, 124, 38)'
        } else if (param < 30) {
            return 'rgb(210, 94, 31)'
        } else if (param < 35) {
            return 'rgb(184, 70, 23)'
        } else {
            return 'rgb(184, 70, 23)'
        }
    } else if (mode === 3) {
        if (param > 90) {
            return 'rgb(164, 154, 27)'
        } else if (param > 80) {
            return 'rgb(127, 165, 55)'
        } else if (param > 70) {
            return 'rgb(67, 199, 147)'
        } else if (param > 60) {
            return 'rgb(48, 192, 113)'
        } else if (param > 50) {
            return 'rgb(103, 148, 218)'
        } else if (param > 40) {
            return 'rgb(93, 128, 208)'
        } else if (param > 30) {
            return 'rgb(93, 113, 205)'
        } else if (param > 20) {
            return 'rgb(96, 90, 180)'
        } else if (param >= 0) {
            return 'rgb(83, 63, 117)'
        }
    }
}

//初始化地图
onMounted(async () => {
    const res = await getWeather()
    if (res.status === 200) {
        weathers = res.data
        //初始化卡片
        initWeatherCard()
    }
    AMapLoader.load({
        key: '649482c0582e18c52dc137d9c58ce18f', // 申请好的Web端开发者Key，首次调用 load 时必填
        version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ['AMap.ToolBar', 'AMap.Scale', 'AMap.GeoJson'] //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
    })
        .then(async (AMap) => {
            //必须要有下面这一坨,否则scene样式无法正常显示
            layer = new AMap.createDefaultLayer({
                zooms: [3, 20], //可见级别
                visible: true, //是否可见
                opacity: 0.5, //透明度
                zIndex: 2 //叠加层级
            })

            //创建地图，并将色块地图加入到地图图层中
            map = new AMap.Map('container', {
                zooms: [3, 12.5], //可见级别
                resizeEnable: true,
                viewMode: '2D', //使用 2D 模式减少负担
                zoom: 4.82, //地图级别
                center: [105.403119, 38.028658], // 中国地理中心点
                layers: [layer] //layer为创建的默认图层,创建省份图层
            })
            //=======================================
            scene = new Scene({
                id: 'container',
                map: new GaodeMap({
                    style: 'fresh',
                    center: [105.403119, 38.028658],
                    zoom: 3.5,
                    zooms: [3, 9], //限制一下缩放，只能显示地级市
                    token: '649482c0582e18c52dc137d9c58ce18f'
                })
            })

            scene.on('loaded', () => {
                window.AMap.plugin(['AMap.ToolBar', 'AMap.LineSearch'], () => {
                    scene.map.addControl(new AMap.ToolBar())
                    scene.map.addControl(new AMap.Scale())
                })
                fetch(
                    'https://gw.alipayobjects.com/os/bmw-prod/7455fead-1dc0-458d-b91a-fb4cf99e701e.txt'
                )
                    .then((res) => res.text())
                    .then((data) => {
                        WindData.value = data
                    })
                AMap.plugin('AMap.GeoJSON', function () {
                    //创建 geoJSON 实例，传入 GeoJSON 数据和其他选项
                    geoJsonTemp = new AMap.GeoJSON({
                        //将字符串形式的 GeoJSON 数据解析为对象
                        geoJSON: geoJsonData,
                        // geoJSON: JSON.parse(geoJsonData),
                        //定义一个回调函数来创建多边形对象，该函数接收一个 geojson 对象和一个 lnglats 数组作为参数
                        getPolygon: function (geojson, lnglats) {
                            // 返回一个新的 AMap.Polygon 对象，传入路径、填充透明度、边框颜色和填充颜色等选项
                            //还可以自定义 getMarker 和 getPolyline，用于创建标记和折线对象
                            // console.log(geojson)
                            //设置温度
                            let temp = null
                            try {
                                temp = weathers[geojson.properties.localid].temp
                            } catch (e) {
                                temp = weathers[101010100].temp
                            }
                            var polygan = new AMap.Polygon({
                                path: lnglats,
                                strokeWeight: 0,
                                fillOpacity: 0.3,
                                strokeColor: 'white',
                                fillColor: Param2Color(1, temp)
                            })

                            function ShowTempInfo(e) {
                                infoTempWindow = new AMap.InfoWindow({
                                    anchor: 'bottom-left',
                                    content:
                                        '<div style="width: 135px;" >' +
                                        '<div style="font-size: 14px;padding: 0 5px;">' +
                                        parseFloat(e.lnglat.getLat()).toFixed(2) +
                                        '°N, ' +
                                        parseFloat(e.lnglat.getLng()).toFixed(2) +
                                        '°&nbsp;E</div>\n' +
                                        '<div style="padding: 0 4px;font-size: 22px;font-weight: bold;line-height: 30px;">' +
                                        temp +
                                        '°C</div>\n' +
                                        '<div style="padding: 0 5px;font-size: 14px;">气温</div>' +
                                        '</div>'
                                })
                                infoTempWindow.open(scene.map, [
                                    e.lnglat.getLng(),
                                    e.lnglat.getLat()
                                ])
                            }

                            function ShowTempOut(e) {
                                if (infoTempWindow) {
                                    infoTempWindow.close()
                                }
                            }

                            polygan.on('click', ShowTempInfo)
                            // polygan.on('mouseover', ShowTempInfo)
                            polygan.on('mouseout', ShowTempOut)
                            return polygan
                        }
                    })
                })
                AMap.plugin('AMap.GeoJSON', function () {
                    //创建 geoJSON 实例，传入 GeoJSON 数据和其他选项
                    geoJsonHumidity = new AMap.GeoJSON({
                        //将字符串形式的 GeoJSON 数据解析为对象
                        geoJSON: geoJsonData,
                        // geoJSON: JSON.parse(geoJsonData),
                        //定义一个回调函数来创建多边形对象，该函数接收一个 geojson 对象和一个 lnglats 数组作为参数
                        getPolygon: function (geojson, lnglats) {
                            // 返回一个新的 AMap.Polygon 对象，传入路径、填充透明度、边框颜色和填充颜色等选项
                            //还可以自定义 getMarker 和 getPolyline，用于创建标记和折线对象
                            // console.log(geojson.properties.localid)
                            //设置湿度
                            let humi = null
                            try {
                                humi = weathers[geojson.properties.localid].humidity
                            } catch (e) {
                                humi = weathers[101010100].humidity
                            }
                            var polygan = new AMap.Polygon({
                                path: lnglats,
                                strokeWeight: 0,
                                fillOpacity: 0.3,
                                strokeColor: 'white',
                                fillColor: Param2Color(3, humi)
                            })

                            function ShowHumidityInfo(e) {
                                infoHumidityWindow = new AMap.InfoWindow({
                                    anchor: 'bottom-left',
                                    content:
                                        '<div style="width: 135px;" >' +
                                        '<div style="font-size: 14px;padding: 0 5px;">' +
                                        parseFloat(e.lnglat.getLat()).toFixed(2) +
                                        '°N, ' +
                                        parseFloat(e.lnglat.getLng()).toFixed(2) +
                                        '°&nbsp;E</div>\n' +
                                        '<div style="padding: 0 4px;font-size: 22px;font-weight: bold;line-height: 30px;">' +
                                        humi +
                                        '%</div>\n' +
                                        '<div style="padding: 0 5px;font-size: 14px;">相对湿度</div>' +
                                        '</div>'
                                })
                                infoHumidityWindow.open(scene.map, [
                                    e.lnglat.getLng(),
                                    e.lnglat.getLat()
                                ])
                            }

                            function ShowHumidityOut(e) {
                                if (infoHumidityWindow) {
                                    infoHumidityWindow.close()
                                }
                            }

                            polygan.on('click', ShowHumidityInfo)
                            polygan.on('mouseout', ShowHumidityOut)
                            return polygan
                        }
                    })
                })
                AMap.plugin('AMap.GeoJSON', function () {
                    //创建 geoJSON 实例，传入 GeoJSON 数据和其他选项
                    geoJsonWind = new AMap.GeoJSON({
                        //将字符串形式的 GeoJSON 数据解析为对象
                        geoJSON: geoJsonData,
                        // geoJSON: JSON.parse(geoJsonData),
                        //定义一个回调函数来创建多边形对象，该函数接收一个 geojson 对象和一个 lnglats 数组作为参数
                        getPolygon: function (geojson, lnglats) {
                            // 返回一个新的 AMap.Polygon 对象，传入路径、填充透明度、边框颜色和填充颜色等选项
                            //设置风力
                            let wind = null
                            try {
                                wind = weathers[geojson.properties.localid].windSpeed
                            } catch (e) {
                                wind = weathers[101010100].windSpeed
                            }
                            var polygan = new AMap.Polygon({
                                path: lnglats,
                                strokeWeight: 0,
                                fillOpacity: 0,
                                strokeColor: 'white'
                            })

                            function ShowWindInfo(e) {
                                infoWindWindow = new AMap.InfoWindow({
                                    anchor: 'bottom-left',
                                    content:
                                        '<div style="width: 135px;" >' +
                                        '<div style="font-size: 14px;padding: 0 5px;">' +
                                        parseFloat(e.lnglat.getLat()).toFixed(2) +
                                        '°N, ' +
                                        parseFloat(e.lnglat.getLng()).toFixed(2) +
                                        '°&nbsp;E</div>\n' +
                                        '<div style="padding: 0 4px;font-size: 22px;font-weight: bold;line-height: 30px;">' +
                                        wind +
                                        'm/s</div>\n' +
                                        '<div style="padding: 0 5px;font-size: 14px;">风力</div>' +
                                        '</div>'
                                })
                                infoWindWindow.open(scene.map, [
                                    e.lnglat.getLng(),
                                    e.lnglat.getLat()
                                ])
                            }

                            function ShowWindOut(e) {
                                if (infoWindWindow) {
                                    infoWindWindow.close()
                                }
                            }

                            polygan.on('click', ShowWindInfo)
                            polygan.on('mouseout', ShowWindOut)
                            return polygan
                        }
                    })
                })

                const markers = []
                weatherLayer = new AMap.LabelsLayer({
                    zooms: [3, 20],
                    zIndex: 1000,
                    zoom: 4.5
                })
                weatherLayer.add(markers)
                // 图层添加到地图
                scene.map.add(weatherLayer)
                weatherLayer.hide()
                // 初始化 labelMarker
                for (let i = 0; i < citys.length; i++) {
                    let path = null
                    try {
                        path =
                            'http://211.159.168.136:4000/files/' +
                            weathers[citys[i].localid].icon +
                            '.png'
                    } catch (e) {
                        path =
                            'http://211.159.168.136:4000/files/' + weathers[101010100].icon + '.png'
                    }
                    let icon = {
                        // 图标类型，现阶段只支持 image 类型
                        type: 'image',
                        // 图片 url
                        image: path,
                        // 图片尺寸
                        size: [30, 30],
                        // 图片相对 position 的锚点，默认为 bottom-center
                        anchor: 'bottom-center'
                    }
                    let city = {
                        position: citys[i].lnglat,
                        zooms: citys[i].zoom,
                        icon: icon,
                        fold: true,
                        opacity: 0.7,
                        extData: i //放置当前标号
                    }
                    //根据不同城市等级设置图表缩放
                    if (citys[i].style === 0) {
                        city.zooms = [4.82, 15]
                    } else if (citys[i].style === 1) {
                        city.zooms = [5.82, 15]
                    } else {
                        city.zooms = [8.9, 15]
                    }
                    let curData = city

                    let labelMarker = new AMap.LabelMarker(curData)
                    markers.push(labelMarker)
                    //绑定城市和天气面板
                    labelMarker.on('click', function (e) {
                        var i = labelMarker.getExtData()
                        var localid = citys[i].localid
                        loc.value = citys[i].name //地区名
                        weather.value = weathers[localid].text //天气
                        temperature.value = weathers[localid].temp //气温
                        windScale.value = weathers[localid].windScale //风力等级
                        windDir.value = weathers[localid].windDir //风向
                        humidity.value = weathers[localid].humidity //湿度
                    })
                }
                // 将 marker 添加到图层
                weatherLayer.add(markers)
            })
        })
        .catch((e) => {
            console.log(e)
        })
})
onUnmounted(() => {
    scene?.destroy()
    wind?.destroy()
})

//初始化天气面板
function initWeatherCard() {
    var localid = 101010100
    loc.value = '北京市' //地区名
    weather.value = weathers[localid].text //天气
    temperature.value = weathers[localid].temp //气温
    windScale.value = weathers[localid].windScale //风力等级
    windDir.value = weathers[localid].windDir //风向
    humidity.value = weathers[localid].humidity //湿度
}

//显示气温
function showTemperature() {
    if (showMode.value === 4) {
        scene.removeLayer(wind)
    }
    //删除湿度图层
    scene.map.remove(geoJsonHumidity)
    //隐藏天气图层
    weatherLayer.hide()
    //删除风力图层
    scene.map.remove(geoJsonWind)
    //设置缩放和中心
    scene.map.setZoom(4.5)
    scene.map.setCenter([105.403119, 38.028658])
    //展示温度图层
    scene.map.add(geoJsonTemp)
    showMode.value = 1
}

//显示天气
function showWeather() {
    if (showMode.value === 4) {
        scene.removeLayer(wind)
    }
    //删除温度、湿度、风力图层
    scene.map.remove(geoJsonTemp)
    scene.map.remove(geoJsonHumidity)
    scene.map.remove(geoJsonWind)
    //设置缩放和中心
    scene.map.setZoom(4.5)
    scene.map.setCenter([105.403119, 38.028658])
    //展示天气图层
    initWeatherCard()
    weatherLayer.show()
    showMode.value = 2
}

//显示湿度
function showHumidity() {
    if (showMode.value === 4) {
        scene.removeLayer(wind)
    }
    //删除温度图层
    scene.map.remove(geoJsonTemp)
    //隐藏天气图层
    weatherLayer.hide()
    //删除风力图层
    scene.map.remove(geoJsonWind)
    //设置缩放和中心
    scene.map.setZoom(4.5)
    scene.map.setCenter([105.403119, 38.028658])
    //展示湿度图层
    scene.map.add(geoJsonHumidity)
    showMode.value = 3
}

//显示风力
function showWind() {
    if (showMode.value !== 4) {
        //删除温度图层
        scene.map.remove(geoJsonTemp)
        //隐藏天气图层
        weatherLayer.hide()
        //删除湿度图层
        scene.map.remove(geoJsonHumidity)
        //初始化风力图层
        wind = new LineLayer({ blend: 'normal' })
            .source(WindData.value, {
                parser: {
                    type: 'csv',
                    x: 'lng1',
                    y: 'lat1',
                    x1: 'lng2',
                    y1: 'lat2'
                }
            })
            .size(0.5)
            .shape('arc')
            .color('#6495ED')
            .animate({
                duration: 4,
                interval: 0.2,
                trailLength: 0.6
            })
            .style({
                opacity: 0.7,
                segmentNumber: 2
            })
        scene.addLayer(wind)
        scene.map.add(geoJsonWind)
    }
    //设置缩放和中心
    scene.map.setZoom(4.5)
    scene.map.setCenter([105.403119, 38.028658])
    showMode.value = 4
}
</script>

<style scoped>
#float_button {
    position: absolute;
    left: 15px;
    top: 3%;
}

#legend {
    position: absolute;
    margin-left: 15px;
    bottom: 10%;
    left: 0;
    z-index: 3000;
    height: 200px;
    width: 14px;
    border-radius: 7px;
    box-shadow: 2px 4px 4px 0 rgba(0, 0, 0, 0.12);
    border-left: 1px solid rgba(0, 0, 0, 0.06);
    border-right: 1px solid rgba(0, 0, 0, 0.06);
    text-align: center;
    color: #000000;
    font-size: 12px;
}

#legend .segments {
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    justify-content: left;
    height: 100%;
    position: absolute;
    top: 0;
    left: 16px;
}

#legend .segments > div {
    flex: 1;
    display: flex;
    align-items: center;
}

.weatherCard {
    background-color: #000;
    opacity: 0.6;
    color: #fff;
    position: absolute;
    height: 180px;
    width: 300px;
    right: 0;
    z-index: 3000;
}

.nav {
    overflow: auto;
    padding: 10px;
}

.city-info {
    text-align: center;
}

.temp {
    font-size: 26px;
}

.temp em {
    font-style: normal;
    font-size: 34px;
}
</style>
