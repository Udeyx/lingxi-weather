import { defineStore } from 'pinia'
import { useTiandituStore } from '@/stores/tianditu'
// import { localNationalKindergarten, nationalKindergarten } from '@/api/mapDataAPi'
// import { isShowErrorMessage } from '@/config/index'
import * as POI from '@/assets/POI-Air-Monitoring-Station-List-latest.json'
import L from 'leaflet'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster'
import ZAIHAI from '@/assets/disasters.json'
import Hot from '@/assets/hott.json'


export const useMarkerStore = defineStore('markerOptions', {
    state: () => ({
        // 存储播放幼儿园数据的 Interval
        //kindergartenInterval: null,
        isShowTmapWind: false,
        isShowPOI: false,
        isShowHeat: false
    }),
    actions: {
        /*
         * 初始化海量幼儿园数据*/
        // async initKindergarten(
        //     isUseLocalMapData = true,
        //     kindergartenDataSlider = 1000,
        //     kindergartenDataSliderStart = 0
        // ) {
        //     let mapData
        //     // 判断是否使用本地数据
        //     if (isUseLocalMapData) {
        //         // const { data } = await localNationalKindergarten()
        //         mapData = data
        //     } else {
        //         const { data } = await nationalKindergarten()
        //         mapData = data
        //     }
        //
        //     let lnglats = []
        //     mapData.results
        //         .slice(kindergartenDataSliderStart, kindergartenDataSlider)
        //         .map((item) => {
        //             const co = item.geojson.geometry.coordinates[0]
        //             const lng = new window.T.LngLat(co[0], co[1])
        //             lng.custom_data = item
        //             lnglats.push(lng)
        //         })
        //     const _CloudCollection = new window.T.CloudMarkerCollection(lnglats, {
        //         color: 'blue',
        //         SizeType: window.TDT_POINT_SIZE_NORMAL
        //     })
        //     const { addOverLay, Tmap } = useTiandituStore()
        //     addOverLay('kindergarten', _CloudCollection)
        //     // 为海量点注册点击事件
        //     _CloudCollection.addEventListener('click', this.onClickKindergarten)
        //     Tmap.setViewport(lnglats)
        // },
        /*
         * 销毁海量幼儿园数据*/
        // removeKindergarten() {
        //     const { removeOverLay } = useTiandituStore()
        //     removeOverLay('kindergarten')
        // },
        // /*
        //  * 幼儿园海量点的点击事件
        //  * */
        // onClickKindergarten(e) {
        //     console.log(e)
        //     const { custom_data } = e.lnglat
        //     window.$notification.info({
        //         content: custom_data.name,
        //         meta: `地址：${custom_data.address}，code：${custom_data.gbcode}，坐标：${e.lnglat.lng},${e.lnglat.lat}`,
        //         duration: 3000,
        //         keepAliveOnHover: true
        //     })
        // },
        // /*
        //  * 动态播放幼儿园数据*/
        // playKindergartenData() {
        //     const { mapOverLay } = useTiandituStore()
        //     // 判断是否已经生成视图
        //     if (!mapOverLay['kindergarten']) {
        //         isShowErrorMessage && window.$message.error('请生成视图之后再播放数据！')
        //         throw new Error('请生成视图之后再播放数据')
        //     }
        //     clearInterval(this.kindergartenInterval)
        //     this.kindergartenInterval = setInterval(async () => {
        //         let mapData
        //         const { data } = await localNationalKindergarten()
        //         mapData = data
        //         // 存放生成的点数据
        //         let lnglats = []
        //         //  设置一个开始分割点  [10 - 180000]
        //         const start = parseInt(Math.random() * (180000 - 10) + 10)
        //         // 设置一个步长值 [1000 - 3000]
        //         const step = parseInt(Math.random() * (3000 - 1000) + 1000)
        //         mapData.results.slice(start, start + step).map((item) => {
        //             const co = item.geojson.geometry.coordinates[0]
        //             const lng = new window.T.LngLat(co[0], co[1])
        //             lnglats.push(lng)
        //         })
        //         mapOverLay['kindergarten'].setLnglats(lnglats)
        //     }, 3000)
        // },
        // /*
        //  * 停止播放幼儿园数据*/
        // stopKindergartenData() {
        //     clearInterval(this.kindergartenInterval)
        // },
        initTmapWind() {
            import('tmap-wind').then(({ WindLayer }) => {
                fetch(
                    'https://sakitam.oss-cn-beijing.aliyuncs.com/codepen/wind-layer/json/wind.json'
                )
                    .then((res) => res.json())
                    .then((res) => {
                        const pdefinedOverlay = new WindLayer(res)
                        console.log(pdefinedOverlay)
                        const { addOverLay } = useTiandituStore()
                        addOverLay('TmapWind', pdefinedOverlay)
                        this.isShowTmapWind = true
                    })
            })
        },
        /*
         * 风场可视化开关*/
        switchTmapWind(flag) {
            const { mapOverLay } = useTiandituStore()
            if (flag == null) {
                this.isShowTmapWind = !this.isShowTmapWind
            } else {
                this.isShowTmapWind = flag
            }
            if (this.isShowTmapWind) {
                mapOverLay['TmapWind'].show()
                mapOverLay['TmapWind'].start()
            } else {
                mapOverLay['TmapWind'].hide()
                mapOverLay['TmapWind'].stop()
            }
        },
        removeTmapWind() {
            const { removeOverLay } = useTiandituStore()
            removeOverLay('TmapWind')
            this.isShowTmapWind = false
        },
        initPOI() {
            // 判断是否使用本地数据
            const data = ZAIHAI
            console.log(data)
            // const markers = L.markerClusterGroup();
            // for (let i = 0; i < data['default'].length; i++) {
            //     const marker = L.marker([data['default'][i].POI_Longitude,data['default'][i].POI_Latitude]);
            //     markers.addLayer(marker);
            // }
            //
            // const { addOverLay, Tmap } = useTiandituStore()
            // addOverLay('POI',  markers)
            // for (let i = 0; i < data['default'].length; i++) {
            //     const marker = new window.T.Marker(new window.T.LngLat(data['default'][i].POI_Longitude,data['default'][i].POI_Latitude),{icon: icon});
            //     addOverLay('POI'+ i, marker)
            // }
            // data['default'].forEach((item) => {
            //     const marker = new window.T.Marker(new window.T.LngLat(item.POI_Longitude,item.POI_Latitude),{icon: icon});
            //     addOverLay('POI', _CloudCollection)
            // })
            const lnglats = []
            data.forEach((item) => {
                const lng = new window.T.LngLat(item.longitude, item.latitude)
                lng.custom_data = item
                lnglats.push(lng)
            })
            const _CloudCollection = new window.T.CloudMarkerCollection(lnglats, {
                color: 'red',
                SizeType: window.TDT_POINT_SIZE_NORMAL
            })
            const { addOverLay, Tmap } = useTiandituStore()
            addOverLay('ZAIHAI', _CloudCollection)
            // 为海量点注册点击事件
            _CloudCollection.addEventListener('click', this.onClickPOI)
            Tmap.setViewport(lnglats)
            this.isShowPOI = true
        },
        removePOI() {
            const { removeOverLay, mapOverLay } = useTiandituStore()
            mapOverLay['ZAIHAI'].destroy
            removeOverLay('ZAIHAI')
            this.isShowPOI = false
        },
        // switchPOI(flag) {
        //     const { mapOverLay } = useTiandituStore()
        //     if (flag == null) {
        //         this.isShowPOI = !this.isShowPOI
        //     } else {
        //         this.isShowPOI = flag
        //     }
        //     if (this.isShowPOI) {
        //         mapOverLay['ZAIHAI'].show()
        //         mapOverLay['ZAIHAI'].start()
        //     } else {
        //         mapOverLay['ZAIHAI'].hide()
        //         mapOverLay['ZAIHAI'].stop()
        //     }
        // },
        onClickPOI(e) {
            console.log(e)
            const data = e.lnglat
            const marker = new window.T.Marker(data) // 创建标注
            const markerInfoWin = new window.T.InfoWindow(data.custom_data.text, {
                offset: new window.T.Point(0, -30)
            })
            const { Tmap } = useTiandituStore()
            Tmap.openInfoWindow(markerInfoWin, data) //开启信息窗口
            // window.$notification.info({
            //   content: custom_data.POI_Name,
            //   //meta: `地址：${custom_data.address}，code：${custom_data.gbcode}，坐标：${e.lnglat.lng},${e.lnglat.lat}`,
            //   duration: 3000,
            //   keepAliveOnHover: true,
            // });
        },
        initHeat() {
            const tt = Hot
            console.log(tt)
            const res = []
            for (let i = 0; i < tt.length; i++) {
                res.push({
                    name: tt[i].name,
                    lat: tt[i].latitude,
                    lng: tt[i].longitude,
                    count: tt[i].count
                });
            }
            const heatmapOverlay = new window.T.HeatmapOverlay({
                "radius": 30,
            });
            console.log(heatmapOverlay);
            const { addOverLay } = useTiandituStore()
            addOverLay('HEAT', heatmapOverlay);
            heatmapOverlay.setDataSet({data: res, max: 100});
            this.isShowHeat = true
        },
        removeHeat() {
            const { removeOverLay, mapOverLay } = useTiandituStore()
            removeOverLay('HEAT')
            this.isShowHeat = false
        },
    }
})
