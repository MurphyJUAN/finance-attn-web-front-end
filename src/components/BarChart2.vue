

<template>
  <div :id="`line-chart-${id}`">
      <svg :width=width :height=height></svg>
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
  props: ['barChart', 'isSorted'],
  mounted() {
    this.drawChart();
  },
  methods: {
    drawChart() {
      const data = this.barChart.data;
      console.log(data, 'banaba');
      const margin = {
        top: 20,
        bottom: 20,
        left: 5,
        right: 5,
      };

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


      const chartWidth = svgItemWidth - margin.left - margin.right; // 235是整個svg的寬
      // 選取div並加入svg
      //   const svg = d3
      //     .select(`#line-chart-${this.id}`)
      //     .append('svg')
      //     .attr('width', svgItemWidth)
      //     .attr('height', svgItemHeight);
      const svg = d3.select(this.$el.querySelector('svg'));


      const x = d3.scaleLinear()
        .domain([0, d3.max(data.map(e => e.value))])
        .range([0, chartWidth]);

      // 在svg中加入一個g並移到svg中間
      const g = svg.append('g').attr('transform', `translate(${margin.right}, ${margin.top})`);
      // 在g畫上柱體
      console.log('start drawing');
      g
        .selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', 0)
        .attr('y', (d, i) => i * this.barChart.barMargin)
        .attr('width', d => x(d.value))
        .attr('height', this.barChart.barHeight)
        .attr('fill', '#f5a142')
        .attr('rx', 3);
    },
  },
  watch: {
    barChart: {
      handler(n, o) {
        // console.log('jmurphy');
        this.drawChart();
      },
      deep: true,

    },
    isSorted: {
      handler(n, o) {
        // console.log('amurphy');
        this.drawChart();
      },
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

