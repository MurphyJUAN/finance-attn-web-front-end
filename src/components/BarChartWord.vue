/* eslint-disable vue/require-v-for-key */
<template>
  <div :id="`line-chart-${id}`">
    <svg class="chart" id="chart" :width="smallWidth" :height="height" >
        <g v-for="(item, idx) in barChart.data" :transform="`translate(0, ${(idx) * (barChart.barHeight + barChart.barMargin)})`">
            <rect :height="barChart.barHeight" :width="barWidth(item.avgWeight)" rx="2"></rect>
            <!-- <text x="0" y="20">TEXT</text> -->
        </g>
    </svg>
  </div>
</template>

<script>
import shortid from 'shortid';
import * as d3 from 'd3';

export default {
  name: 'BarChartWord',
  data() {
    return {
      id: shortid.generate(),
      width: 200,
      smallWidth: 50,
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
      const svgItem = document.getElementsByClassName('word-block-inner')[0];
      const barItem = document.getElementsByClassName('word-chart-outer')[0];
      if (svgItem) {
        if (svgItem.clientWidth > 0) {
          svgItemWidth = svgItem.clientWidth;
          this.width = svgItemWidth - 5;
        }
        dataListLen = data.length;
        const y1 = dataListLen * this.barChart.barHeight;
        const y2 = (dataListLen - 1) * this.barChart.barMargin;
        svgItemHeight = y1 + y2;
        this.height = svgItemHeight;
      }
      if (barItem) {
        if (barItem.clientWidth > 0) {
          const barItemWidth = barItem.clientWidth;
          this.smallWidth = barItemWidth;
        }
      }
    //   this.width = this.width * 0.6;
    },
    barWidth(value) {
    //   this.smallWidth = this.width * 0.6;
      const a = this.smallWidth / this.dataMax;
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
        if (this.barChart.data[i].avgWeight >= maxValue) {
          maxValue = this.barChart.data[i].avgWeight;
        }
      }
      return maxValue;
    },
  },
  watch: {
    barChart: {
      handler(n, o) {
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
  fill:rgb(245, 161, 66);
}
</style>
