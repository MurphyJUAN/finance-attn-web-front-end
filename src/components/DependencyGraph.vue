<template>
  <div :id="`line-chart-${id}`">
    </div>
      <!-- <svg :width=width :height=height></svg> -->

</template>

<script>
import * as d3 from 'd3';
import shortid from 'shortid';

export default {
  name: 'DependencyGraph',
  props: ['data'],
  data() {
    return {
      id: shortid.generate(),
      simulation: null,
      link: null,
      node: null,
      text: null,
      width: 360,
      height: 800,

    };
  },
  computed: {
    nodes() { return this.data.nodes; },
    links() { return this.data.links; },
  },
  mounted() {
    this.drawGraph();
  },
  methods: {
    drawGraph() {
      const svgItem = document.getElementsByClassName('word-block')[0];
      if (svgItem) {
        if (svgItem.clientWidth > 0) {
          this.width = svgItem.clientWidth;
        }
        console.log('dw', this.width);
        //   const dataListLen = this.data.nodes.length;
        //   const y1 = dataListLen * 30;
        //   const y2 = (dataListLen - 1) * 50;
        //   this.height = y1 + y2;
      }
      const svg = d3
        .select(`#line-chart-${this.id}`)
        .append('svg')
        .attr('width', this.width)
        .attr('height', this.height);

      //   const svg = d3.select(this.$el.querySelector('svg'));
      const color = d3.scaleLinear()
        .domain([10, 100])
        .range(['green', 'steelblue'])
        .interpolate(d3.interpolateCubehelix.gamma(3));

      this.simulation = d3.forceSimulation()
        .force('link', d3.forceLink())
        .force('charge', d3.forceManyBody())
        .force('center', d3.forceCenter(this.width / 2, this.height / 2));

      this.link = svg.append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(this.data.links)
        .enter()
        .append('line')
        .attr('stroke-width', 1)
        .attr('stroke', 'gray');


      this.node = svg.append('g')
        .attr('class', 'nodes')
        .selectAll('circle')
        .data(this.data.nodes)
        .enter()
        .append('circle')
        .attr('r', 4)
        .attr('cx', d => d.cx)
        .attr('cy', d => d.cy)
        .attr('fill', (d, i) => color(i))
      //   .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .call(d3.drag()
          .on('start', this.dragstarted)
          .on('drag', this.dragged)
          .on('end', this.dragended));

      this.text = svg.selectAll('text')
        .data(this.data.nodes)
        .enter()
        .append('text')
        .style('fill', 'black')
        .attr('font-size', '16px')
        .attr('dx', 12)
        .attr('dy', 5)
        .text(d => d.name);

      this.simulation
        .nodes(this.data.nodes)
        .on('tick', this.ticked);

      this.simulation.force('link')
        .links(this.data.links)
        .distance(50);

      this.simulation.force('charge')
        .strength(-60)
        .distanceMax(20);
    },
    ticked() {
      this.link
        .attr('x1', (d) => {
          if (d.source.fixed) {
            return d.source.cx;
          }
          return d.source.x;
        })
        .attr('y1', (d) => {
          if (d.source.fixed) {
            return d.source.cy;
          }
          return d.source.y;
        })
        .attr('x2', (d) => {
          if (d.target.fixed) {
            return d.target.cx;
          }
          return d.target.x;
        })
        .attr('y2', (d) => {
          if (d.target.fixed) {
            return d.target.cy;
          }
          return d.target.y;
        });

      this.node
        .attr('cx', (d) => {
          if (d.fixed) {
            return d.cx;
          }
          return d.x;
        })
        .attr('cy', (d) => {
          if (d.fixed) {
            return d.cy;
          }
          return d.y;
        },
        );

      this.text
        .attr('x', (d) => {
          if (d.fixed) {
            return d.cx;
          }
          return d.x;
        })
        .attr('y', (d) => {
          if (d.fixed) {
            return d.cy;
          }
          return d.y;
        });
    },
    dragstarted(d) {
      if (!d3.event.active) this.simulation.alphaTarget(0.3).restart();
      console.log('d', d);
      d.fx = d.x;
      d.fy = d.y;
    },

    dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    },

    dragended(d) {
      if (!d3.event.active) this.simulation.alphaTarget(0);
      d.fx = d.cx;
      d.fy = d.cy;
    },
    updateGraph() {
      d3.select(this.$el.querySelector('svg')).remove();
      console.log('-----Updata-----');
      console.log('-----', this.data.links);
      this.drawGraph();
    },


  },
//   watch: {
//     data: {
//       handler(n, o) {
//         console.log('omurphy');
//         this.updateGraph();
//       },
//       deep: true,

//     },
//   },

};
</script>


<style scoped>

</style>
