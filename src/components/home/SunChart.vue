<template>
  <Card class="bg-sky-400/30 backdrop-blur-md">
    <template #content>
    <div class="sun-chart">
      <img
        v-if="sunPositionX !== null"
        class="sun"
        src="http://211.159.168.136:4000/files/100.png"
        :style="{left: `${sunPositionX}%`,top: `${sunPositionY}%`}"
        alt="Sun Icon"
      />
      <canvas ref="sunChart" width="400" height="200">
      </canvas>
      <div class="time-label sunrise-time" :style="{ left: '5px' }">日出时间: {{ formattedSunrise }}</div>
      <div class="time-label sunset-time" :style="{ right: '5px' }">日落时间: {{ formattedSunset }}</div>
    </div>
  </template>
  </Card>
</template>

<script>
export default {
  data() {
    return {
      sunrise: 0,
      sunset: 24,
      sunPositionX: null,
      sunPositionY: null,
      intervalId: null,
    };
  },
  mounted() {
    this.updateSunPosition();
    this.drawSunChart();
    this.startSunPositionUpdater();
  },
  beforeDestroy() {
    this.stopSunPositionUpdater();
  },
  computed: {
    formattedSunrise() {
      return this.formatTime(this.sunrise);
    },
    formattedSunset() {
      return this.formatTime(this.sunset);
    },
  },
  methods: {
    drawSunChart() {
      const canvas = this.$refs.sunChart;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height;
      const radius = canvas.width / 2;

      // Draw the arc
      ctx.beginPath();
      ctx.setLineDash([5, 5]); // 设置虚线样式，这里的数组表示5像素实线和5像素空白
      ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI);
      ctx.strokeStyle = '#cccccc';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw the sunrise and sunset icons
      const sunriseX = centerX-radius
      const sunsetX = centerX+radius

      ctx.beginPath();
      ctx.arc(sunriseX+10, centerY-10, 5, 0, 2 * Math.PI);
      ctx.fillStyle = 'orange';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(sunsetX-10, centerY-10, 5, 0, 2 * Math.PI);
      ctx.fillStyle = 'red';
      ctx.fill();
    },
    updateSunPosition() {
      const apiKey = 'f79724a6ea3d41a5b6c345c4736a3d08'; // 替换为你的实际API密钥
      const location = '101010100'; // 替换为你的实际位置
      const date = '20240606';

      fetch(`https://devapi.qweather.com/v7/astronomy/sun?location=${location}&date=${date}&key=${apiKey}`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
              const currentTime = new Date().getHours() + new Date().getMinutes() / 60;
              // 解析API响应，获取日出日落时间
              const sunriseTime = new Date(data.sunrise).getHours(); // 提取小时部分作为日出时间
              const sunsetTime = new Date(data.sunset).getHours(); // 提取小时部分作为日落时间

              // 更新组件中的日出日落时间数据
              this.sunrise = sunriseTime;
              this.sunset = sunsetTime;

              if (currentTime >= this.sunrise && currentTime <= this.sunset) {
              const canvas = this.$refs.sunChart;
              const centerX = canvas.width / 2;
              const centerY = canvas.height;
              const radius = canvas.width / 2;
              const totalDaylight = this.sunset - this.sunrise;
              const timeSinceSunrise = currentTime - this.sunrise;
              const angle = (timeSinceSunrise / totalDaylight) * Math.PI; // 将时间转换为弧度

              // 计算太阳在圆弧上的坐标
              const sunX = (centerX - radius * Math.cos(angle))/4-3;
              const sunY = (centerY - radius * Math.sin(angle))/2-8;
              // 设置太阳的位置
              this.sunPositionX = sunX;
              this.sunPositionY = sunY;
            } else {
              this.sunPositionX = null;
              this.sunPositionY = null;
            }
          })
          .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
          });
    },
    startSunPositionUpdater() {
      this.intervalId = setInterval(this.updateSunPosition, 600000); // Update 10 minute
    },
    stopSunPositionUpdater() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    },
    formatTime(time) {
      const hours = Math.floor(time);
      const minutes = Math.floor((time % 1) * 60);
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    },
  },
  watch: {
    sunrise() {
      this.drawSunChart();
    },
    sunset() {
      this.drawSunChart();
    },
  },
};
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
  margin: 10px 0;
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
  transition: left 0.5s ease;
}
</style>