<template>
  <div class="container">
    <h1>MyTestDemo</h1>
    <div class="sun-chart">
      <div class="sunrise-time">日出时间: {{ sunrise }}</div>
      <div class="sunset-time">日落时间: {{ sunset }}</div>
      <canvas ref="sunChart" width="400" height="200"></canvas>
    </div>
    <button @click="setTime">设置时间</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sunrise: 6,
      sunset: 18
    };
  },
  mounted() {
    this.drawSunChart();
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
      ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI);
      ctx.stroke();

      // Draw the sunrise and sunset icons
      const sunriseX = (this.sunrise / 24) * canvas.width;
      const sunsetX = (this.sunset / 24) * canvas.width;

      ctx.beginPath();
      ctx.arc(sunriseX, centerY, 5, 0, 2 * Math.PI);
      ctx.fillStyle = 'orange';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(sunsetX, centerY, 5, 0, 2 * Math.PI);
      ctx.fillStyle = 'red';
      ctx.fill();
    },
    setTime() {
      const sunrise = prompt('请输入日出时间（0-24）');
      const sunset = prompt('请输入日落时间（0-24）');

      if (sunrise !== null && sunset !== null) {
        this.sunrise = parseFloat(sunrise);
        this.sunset = parseFloat(sunset);
        this.drawSunChart();
      }
    }
  },
  watch: {
    sunrise() {
      this.drawSunChart();
    },
    sunset() {
      this.drawSunChart();
    }
  }
};
</script>

<style scoped>
.container {
  text-align: center;
  background: #fff;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.sun-chart {
  position: relative;
  margin-bottom: 20px;
}

.sunrise-time,
.sunset-time {
  position: absolute;
  top: 0;
}

.sunrise-time {
  left: 0;
}

.sunset-time {
  right: 0;
}

canvas {
  border: 1px solid #ccc;
}
</style>
