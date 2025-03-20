<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as echarts from 'echarts'
import GardenSearch from "@/components/GardenSearch.vue"

// 图表引用
const chart1 = ref(null)
const chart2 = ref(null)
const chart3 = ref(null)
const chart4 = ref(null)

let charts = []

// 基础图表配置
const baseOptions = {
  tooltip: { show: true },
  grid: { containLabel: true }
}

// 初始化图表
const initChart = (dom, option) => {
  const chart = echarts.init(dom)
  chart.setOption({ ...baseOptions, ...option })
  return chart
}

// 窗口resize处理
const handleResize = () => {
  charts.forEach(chart => chart.resize())
}

onMounted(() => {
  // 初始化各个图表
  charts = [
    initChart(chart1.value, {
      title: { text: '-', left: 'center' },
      xAxis: { data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
      yAxis: {},
      series: [{ type: 'bar', data: [120, 200, 150, 80, 70] }]
    }),
    initChart(chart2.value, {
      title: { text: '-', left: 'center' },
      xAxis: { type: 'category', data: ['A', 'B', 'C', 'D'] },
      yAxis: { type: 'value' },
      series: [{ type: 'line', data: [820, 932, 901, 934] }]
    }),
    initChart(chart3.value, {
      title: { text: '-', left: 'center' },
      series: [{
        type: 'pie',
        data: [
          { value: 1048, name: 'Search Engine' },
          { value: 735, name: 'Direct' },
          { value: 580, name: 'Email' }
        ]
      }]
    }),
    initChart(chart4.value, {
      title: { text: '-', left: 'center' },
      xAxis: {},
      yAxis: {},
      series: [{
        type: 'scatter',
        data: [[10, 25], [15, 30], [20, 35], [25, 40], [30, 45]]
      }]
    })
  ]

  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  charts.forEach(chart => chart.dispose())
})
</script>

<template>
  <div class="chart-container">
    <!-- 预留的左上角区域 -->
    <div class="reserved-area">
      <GardenSearch/>
    </div>
    
    <!-- 图表容器 -->
    <div class="charts-wrapper">
      <div ref="chart1" class="chart-item"></div>
      <div ref="chart2" class="chart-item"></div>
      <div ref="chart3" class="chart-item"></div>
      <div ref="chart4" class="chart-item"></div>
    </div>
  </div>
</template>


<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: 100vh; /* 根据实际需要调整高度 */
  overflow: hidden;
}

.reserved-area {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 215px;
  height: 121px;
  border: 2px dashed #666;
  z-index: 2;
  background: rgba(240, 240, 240, 0.9);
}

.charts-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 15px;
  padding: 20px;
  box-sizing: border-box;
}

.chart-item {
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 15px;
  box-sizing: border-box;
}
</style>