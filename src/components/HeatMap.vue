/* eslint-disable vue/require-v-for-key */
<template>
  <div :id="`map-chart-${id}`">
      <svg :width=width :height=height></svg>
    <!-- <svg class="map" id="map" :width="width" :height="height">
        <g v-for="(item, idx) in data" :transform="`translate(${(idx%maxGridPerLine) * (gridHeight + gridMargin)},
                                        ${Math.floor((idx / maxGridPerLine)) * (gridHeight + gridMargin)})`">
            <rect :height="gridHeight" :width="gridHeight"></rect>
        </g>
    </svg> -->
  </div>
</template>

<script>
import shortid from 'shortid';
import * as d3 from 'd3';

export default {
  name: 'HeatMap',
  data() {
    return {
      id: shortid.generate(),
      width: 800,
      height: 300,
      gridWidth: 80,
      gridHeight: 30,
      gridMargin: 5,
      maxGridPerLine: 5,
      wordPerWidth: 7,
      gridPadding: 5,
    };
  },
  mounted() {
    this.drawMap();
  },
  methods: {
    drawMap() {
      const margin = {
        top: 20,
        bottom: 20,
        left: 5,
        right: 5,
      };

      let svgItemWidth = 500;
      const svgItemHeight = 300;
      let dataListLen = 0;
      const svgItem = document.getElementsByClassName('modal-body')[0];
      if (svgItem) {
        if (svgItem.clientWidth > 0) {
          svgItemWidth = svgItem.clientWidth;
          this.width = svgItemWidth;
        }
        dataListLen = this.data.length;
        this.maxGridPerLine = Math.floor(this.width / (this.gridWidth + this.gridMargin));
        console.log('this.maxGridPerLine', this.maxGridPerLine);
        const linesCount = Math.ceil(dataListLen / this.maxGridPerLine);
        this.height = (this.gridHeight + this.gridMargin) * linesCount;
        console.log('jeje', this.width);
        console.log('grid Height', this.height);
        // console.log('keke', svgItemHeight);
      }


      const mapWidth = svgItemWidth - margin.left - margin.right; // 235是整個svg的寬
      // 選取div並加入svg
      //   const svg = d3
      //     .select(`#line-chart-${this.id}`)
      //     .append('svg')
      //     .attr('width', svgItemWidth)
      //     .attr('height', svgItemHeight);
      const svg = d3.select(this.$el.querySelector('svg'));


      //   const x = d3.scaleLinear()
      //     .domain([0, d3.max(data.map(e => e.value))])
      //     .range([0, chartWidth]);

      // 在svg中加入一個g並移到svg中間
      //   const g = svg.append('g').attr('transform', `translate(${margin.right}, ${margin.top})`);
      // 在g畫上柱體

      // (Math.floor((i / this.maxGridPerLine)) * (this.gridHeight + this.gridMargin))

      const myColor = d3.scaleLinear()
        .domain([1, 100])
        .range(['#FFFFF5', '#FF0001']);
      // .interpolate(d3.interpolateHcl);
      //   .range(['#fff', '#00f']);

      console.log(this.data);

      const g = svg.selectAll('.gridClass')
        .data(this.data)
        .enter()
        .append('g')
        .attr('class', 'gridClass')
        .attr('transform', (d, i) => `translate(${(i % this.maxGridPerLine) * (this.gridWidth + this.gridMargin)},
                                        ${Math.floor((i / this.maxGridPerLine)) * (this.gridHeight + this.gridMargin)})`);
      g.append('rect')
        .attr('width', this.gridWidth)
        .attr('height', this.gridHeight)
        .style('fill', (d, i) => myColor(d.weight))
        .attr('rx', 3);


      g.append('text')
        .style('fill', 'black')
        // .attr('text-anchor', 'middle')
        // .attr('dominant-baseline', 'central')
        .attr('font-size', '14px')
        .attr('dy', d => (this.gridHeight / 2) + (this.gridPadding / 2))
        .attr('dx', (d) => {
          const wordLength = this.wordPerWidth * this.ruleOne(d.word);
          let x = this.gridPadding / 2;
          console.log('wordLength', wordLength);
          console.log('this.gridWidth - this.gridPadding', this.gridWidth - this.gridPadding);
          if (wordLength <= this.gridWidth - this.gridPadding) {
            x = (this.gridWidth - this.gridPadding - wordLength) / 2;
            console.log('d-woed', d.word);
            console.log('x', x);
          } else {
            const maxWordLength = Math.floor((this.gridWidth - this.gridPadding) / this.wordPerWidth);
            d.word = d.word.slice(0, maxWordLength + 1);
          }
          return x;
        })
        // .attr('transform', 'translate(10, 1rem)')
        .text(d => d.word);


    //   g.selectAll('text')
    //     .each(function () {
    //       console.log('text', d3.select(this).node().getComputedTextLength());
    //     });
    },
    ruleOne(value) {
      let chinese = 0;
      if (value.match(/[\u4e00-\u9fa5]/g) != null) {
        chinese = value.match(/[\u4e00-\u9fa5]/g).length;
      }
      const valueLength = chinese + value.length;
      return valueLength;
    },
  },

  props: ['data'],
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
