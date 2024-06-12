<template>
    <Card class="bg-white/50 backdrop-blur-md">
        <template #content>
            <div class="sun-chart">
                <img
                    class="sun"
                    src="http://101.126.87.200:4000/files/100.png"
                    :style="{ left: `${sunPositionX}%`, top: `${sunPositionY}%` }"
                    alt="Sun Icon"
                />
                <canvas ref="sunChart" width="400" height="200"></canvas>
                <div class="time-label sunrise-time" :style="{ left: '5px' }">
                    日出时间: {{ formattedSunrise }}
                </div>
                <div class="time-label sunset-time" :style="{ right: '5px' }">
                    日落时间: {{ formattedSunset }}
                </div>
            </div>
        </template>
    </Card>
</template>

<script>
import { getSun, staticHostUrl } from '@/api'
export default {
    data() {
        return {
            sunrise: 6,
            sunset: 18,
            sunPositionX: -4,
            sunPositionY: 90,
            targetSunPositionX: null,
            targetSunPositionY: null,
            intervalId: null,
            animationFrameId: null,
            animationDuration: 6000, // 动画持续时间
            progress: 0
        }
    },
    mounted() {
        this.updateSunPosition()
        this.drawSunChart()
        this.startSunPositionUpdater()
    },
    beforeUnmount() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId)
        }
        if (this.intervalId) {
            clearInterval(this.intervalId)
            this.intervalId = null
        }
    },
    computed: {
        formattedSunrise() {
            return this.formatTime(this.sunrise)
        },
        formattedSunset() {
            return this.formatTime(this.sunset)
        }
    },
    methods: {
        drawSunChart() {
            const canvas = this.$refs.sunChart
            const ctx = canvas.getContext('2d')
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            const centerX = canvas.width / 2
            const centerY = canvas.height
            const radius = canvas.width / 2

            // Draw the arc
            ctx.beginPath()
            ctx.setLineDash([5, 5])
            ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI)
            ctx.strokeStyle = '#114514'
            ctx.lineWidth = 2
            ctx.stroke()
            ctx.setLineDash([])

            // Draw the sunrise and sunset icons
            const sunriseX = centerX - radius
            const sunsetX = centerX + radius

            ctx.beginPath()
            ctx.arc(sunriseX + 10, centerY - 10, 5, 0, 2 * Math.PI)
            ctx.fillStyle = 'orange'
            ctx.fill()

            ctx.beginPath()
            ctx.arc(sunsetX - 10, centerY - 10, 5, 0, 2 * Math.PI)
            ctx.fillStyle = 'red'
            ctx.fill()
        },
        getCurrentDateString() {
            const date = new Date() // 获取当前日期
            const year = date.getFullYear() // 获取年份
            const month = String(date.getMonth() + 1).padStart(2, '0') // 获取月份，并确保两位数
            const day = String(date.getDate()).padStart(2, '0') // 获取日期，并确保两位数
            return `${year}${month}${day}` // 返回格式化后的字符串
        },
        async updateSunPosition() {
            const data = await getSun(localStorage.getItem('locId'))
            const currentTime = new Date().getHours() + new Date().getMinutes() / 60
            const sunriseTime = new Date(data.data.sunrise).getHours() + new Date(data.data.sunrise).getMinutes() / 60
            const sunsetTime = new Date(data.data.sundown).getHours() + new Date(data.data.sundown).getMinutes() / 60

            this.sunrise = sunriseTime
            this.sunset = sunsetTime
            if (currentTime >= this.sunrise && currentTime <= this.sunset) {
                const canvas = this.$refs.sunChart
                const centerX = canvas.width / 2
                const centerY = canvas.height
                const radius = canvas.width / 2
                const totalDaylight = this.sunset - this.sunrise
                const timeSinceSunrise = currentTime - this.sunrise
                const angle = (timeSinceSunrise / totalDaylight) * Math.PI

                const sunX = (centerX - radius * Math.cos(angle)) / 4 - 3
                const sunY = (centerY - radius * Math.sin(angle)) / 2 - 8

                this.targetSunPositionX = sunX
                this.targetSunPositionY = sunY

                this.animateSun()
            } else {
                this.sunPositionX = -4
                this.sunPositionY = 90
            }
        },
        animateSun() {
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId)
            }

            const startTime = performance.now()
            const duration = this.animationDuration
            const startX = this.sunPositionX
            const startY = this.sunPositionY
            const endX = this.targetSunPositionX
            const endY = this.targetSunPositionY

            const step = (timestamp) => {
                const elapsed = timestamp - startTime
                this.progress = Math.min(elapsed / duration, 1)

                const angle = Math.PI * this.progress
                const canvas = this.$refs.sunChart
                const centerX = canvas.width / 2
                const centerY = canvas.height
                const radius = canvas.width / 2

                this.sunPositionX = (centerX - radius * Math.cos(angle)) / 4 - 3
                this.sunPositionY = (centerY - radius * Math.sin(angle)) / 2 - 8

                if (this.sunPositionX <= this.targetSunPositionX) {
                    this.animationFrameId = requestAnimationFrame(step)
                } else {
                    // 动画完成后停止，不再重新开始
                    this.sunPositionX = this.targetSunPositionX
                    this.sunPositionY = this.targetSunPositionY
                }
            }

            this.animationFrameId = requestAnimationFrame(step)
        },
        formatTime(time) {
            const hours = Math.floor(time)
            const minutes = Math.floor((time % 1) * 60)
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
        },
        startSunPositionUpdater() {
            this.intervalId = setInterval(this.updateSunPosition, 300000) // Update 10 minute
        },
        stopSunPositionUpdater() {
            if (this.intervalId) {
                clearInterval(this.intervalId)
                this.intervalId = null
            }
        }
    },
    watch: {
        sunrise() {
            this.drawSunChart()
        },
        sunset() {
            this.drawSunChart()
        }
    }
}
</script>

<style scoped>
.sun-chart-container {
    text-align: center;
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.sun-chart {
    position: relative;
    margin: -1px 0;
}

.time-label {
    position: absolute;
    bottom: -20px;
    font-size: 14px;
    color: #111111;
}

.sunrise-time {
    left: 0;
}

.sunset-time {
    right: 0;
}

canvas {
    display: block;
    margin: 0 auto;
    border-bottom: 2px solid #ccc;
}

.sun {
    position: absolute;
    width: 30px;
    height: 30px;
    transition:
        left 0.1s ease,
        top 0.1s ease;
}
</style>
