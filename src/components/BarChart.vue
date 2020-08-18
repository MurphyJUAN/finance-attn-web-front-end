/* eslint-disable vue/require-v-for-key */
<template>
  <div :id="`line-chart-${id}`">
    <svg class="chart" id="chart" :width="width" :height="height">
        <g v-for="(item, idx) in barChart.data" :transform="`translate(0, ${idx * (barChart.barHeight + barChart.barMargin)})`">
            <rect :height="barChart.barHeight" :width="barWidth(item.value)" rx="5" ></rect>
        </g>
    </svg>
  </div>
</template>

<script>
import shortid from 'shortid';
import * as d3 from 'd3';

export default {
  name: 'BarChart',
  data() {
    return {
      id: shortid.generate(),
      width: 212,
      height: 500,
    };
  },
  props: ['barChart', 'chartMargin'],
  mounted() {
    this.drawChart();
  },
  methods: {
    drawChart() {
      const data = this.barChart.data;
      let svgItemWidth = 212;
      let svgItemHeight = 500;
      let dataListLen = 0;
      const svgItem = document.getElementsByClassName('bar-block')[0];
      if (svgItem) {
        if (svgItem.clientWidth > 0) {
          svgItemWidth = svgItem.clientWidth;
          this.width = svgItemWidth;
        }
        dataListLen = data.length;
        const y1 = dataListLen * this.barChart.barHeight;
        const y2 = (dataListLen - 1) * this.barChart.barMargin;
        svgItemHeight = y1 + y2;
        this.height = svgItemHeight;
        console.log(dataListLen);
        console.log('jeje', svgItemWidth);
        console.log('keke', svgItemHeight);
      }
    },
    barWidth(value) {
      const a = this.width / this.dataMax;
      let b = a * value;
      if (b >= this.width - 20) {
        b -= 20;
      }
      return b;
    },
  },
  computed: {
    dataMax() {
      let maxValue = 0;
      for (let i = 0; i < this.barChart.data.length; i++) {
        if (this.barChart.data[i].value >= maxValue) {
          maxValue = this.barChart.data[i].value;
        }
      }
      return maxValue;
    },
  },
  watch: {
    barChart: {
      handler(n, o) {
        console.log('jmurphy');
        this.drawChart();
      },
      deep: true,

    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.chart rect {
  fill:rgb(105,185,180);
}
</style>
