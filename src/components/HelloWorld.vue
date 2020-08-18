<template>
  <div class="hello">
    <h1 class="title">Finance Report Name</h1>
    <div class="flex-title">
      <h3 class="bar-title">
        <div>Risk Level</div>
        <div v-if="!isSorted" class="sort-btn" v-on:click="sortDiction">sort</div>
        <div v-if="isSorted" class="sort-btn" v-on:click="recoverDiction">unsort</div>
      </h3>
      <h3 class="sentence-title">Sentence</h3>
      <h3 class="word-title">Word</h3>
    </div>
    <div class="flex">
      <div class="bar-block">
        <BarChart :barChart=barChart  :chartMargin=chartMargin />
      </div>
      <div class="sentence-block">
        <div class="text" v-for="(item, idx) in barChart.data">
          {{item.sentence}}
        </div>

      </div>
      <div class="word-block">
        <DependencyGraph :data=dependencyGraphDict :isSorted=isSorted />
        <!-- <div class="text">apple</div>
        <div class="text">apple</div>
        <div class="text">apple</div>
        <div class="text">apple</div>
        <div class="text">apple</div>
        <div class="text">apple</div>
        <div class="text">apple</div>
        <div class="text">apple</div> -->
      </div>
    </div>


  </div>
</template>

<script>
import BarChart from './BarChart';
import DependencyGraph from './DependencyGraph';

export default {
  name: 'HelloWorld',
  components: {
    BarChart,
    DependencyGraph,
  },
  data() {
    return {
      isSorted: false,
      copyData: {
        data: [
          {
            value: 10,
            name: '0',
            sentence: "I have also tried to manually set the node's x and y attributes each tick, but then the links continue to float out to where the node would be if it was affected by the force.Obviously I have a basic misunderstanding of how this is supposed to work. How can I fix nodes in a position, while keeping links and still allowing for them to be draggable?",
          },
          {
            value: 15,
            name: '1',
            sentence: 'I want some of the nodes in my force-directed layout to ignore all forces and stay in fixed positions based on an attribute of the node',
          },
          {
            value: 50,
            name: '2',
            sentence: 'while still being able to be dragged and exert repulsion on other nodes and maintain their link lines.',
          },
          {
            value: 15,
            name: '3',
            sentence: 'Set d.fixed on the desired nodes to true, and initialize d.x and d.y to the desired position. These nodes will then still be part of the simulation,',
          },
          {
            value: 10,
            name: '4',
            sentence: 'and you can use the normal display code (e.g., setting a transform attribute);',
          },
          {
            value: 5,
            name: '5',
            sentence: 'however, because they are marked as fixed, they can only be moved by dragging and not by the simulation.',
          },
          {
            value: 3,
            name: '6',
            sentence: 'See the force layout documentation for more details (v3 docs, current docs), and also see how the root node is positioned in this example.',
          },
          {
            value: 1,
            name: '7',
            sentence: 'At the end of each tick, after the application of any forces, a node with a defined node.fx has node.x',
          },
        ],
        width: 540,
        height: 500,
        barHeight: 30,
        barMargin: 20,
      },
      barChart: {
        data: [
          {
            value: 10,
            name: 0,
            sentence: "I have also tried to manually set the node's x and y attributes each tick, but then the links continue to float out to where the node would be if it was affected by the force.Obviously I have a basic misunderstanding of how this is supposed to work. How can I fix nodes in a position, while keeping links and still allowing for them to be draggable?",
          },
          {
            value: 15,
            name: 1,
            sentence: 'I want some of the nodes in my force-directed layout to ignore all forces and stay in fixed positions based on an attribute of the node',
          },
          {
            value: 50,
            name: 2,
            sentence: 'while still being able to be dragged and exert repulsion on other nodes and maintain their link lines.',
          },
          {
            value: 15,
            name: 3,
            sentence: 'Set d.fixed on the desired nodes to true, and initialize d.x and d.y to the desired position. These nodes will then still be part of the simulation,',
          },
          {
            value: 10,
            name: 4,
            sentence: 'and you can use the normal display code (e.g., setting a transform attribute);',
          },
          {
            value: 5,
            name: 5,
            sentence: 'however, because they are marked as fixed, they can only be moved by dragging and not by the simulation.',
          },
          {
            value: 3,
            name: 6,
            sentence: 'See the force layout documentation for more details (v3 docs, current docs), and also see how the root node is positioned in this example.',
          },
          {
            value: 1,
            name: 7,
            sentence: 'At the end of each tick, after the application of any forces, a node with a defined node.fx has node.x',
          },
        ],
        width: 540,
        height: 500,
        barHeight: 30,
        barMargin: 20,
      },
      chartMargin: {
        top: 20,
        bottom: 20,
        left: 5,
        right: 5,
      },
      dependencyLinkOrder: [
        { source: 8, target: 0 },
        { source: 9, target: 0 },
        { source: 9, target: 1 },
        { source: 9, target: 2 },
        { source: 9, target: 3 },
        { source: 10, target: 4 },
        { source: 10, target: 5 },
        { source: 10, target: 6 },
        { source: 10, target: 7 },

      ],
      dependencyGraphDict: {
        nodes: [
          { name: '', fixed: true, cx: 10, cy: 15, weight: 1 },
          { name: '', fixed: true, cx: 10, cy: 60, weight: 1 },
          { name: '', fixed: true, cx: 10, cy: 110, weight: 1 },
          { name: '', fixed: true, cx: 10, cy: 160, weight: 1 },
          { name: '', fixed: true, cx: 10, cy: 210, weight: 1 },
          { name: '', fixed: true, cx: 10, cy: 260, weight: 1 },
          { name: '', fixed: true, cx: 10, cy: 310, weight: 1 },
          { name: '', fixed: true, cx: 10, cy: 360, weight: 1 },
          // cx定位需要計算
          { name: 'apple', fixed: false, cx: 310, cy: 30, weight: 10 },
          { name: 'anna', fixed: false, cx: 280, cy: 80, weight: 30 },
          { name: 'hi', fixed: false, cx: 320, cy: 130, weight: 100 },

        ],
        links: [
          { source: 8, target: 0 },
          { source: 9, target: 0 },
          { source: 9, target: 1 },
          { source: 9, target: 2 },
          { source: 9, target: 3 },
          { source: 10, target: 4 },
          { source: 10, target: 5 },
          { source: 10, target: 6 },
          { source: 10, target: 7 },
        ],
      },
    };
  },
  methods: {
    compare(a, b) {
      if (a.value < b.value) {
        return -1;
      }
      if (a.vlue > b.value) {
        return 1;
      }
      return 0;
    },
    recoverDiction() {
      this.barChart = JSON.parse(JSON.stringify(this.copyData));
      this.isSorted = !this.isSorted;
      for (let j = 0; j < this.dependencyGraphDict.links.length; j += 1) {
        this.dependencyGraphDict.links[j].target = JSON.parse(JSON.stringify(this.dependencyLinkOrder[j].target));
      }
    },
    sortDiction() {
      // console.log(this.barChart);
      this.barChart.data.sort(this.compare);
      this.isSorted = !this.isSorted;
      console.log('----', this.dependencyGraphDict.links);
      // console.log('----', this.dependencyGraph.links);
      const tmp = [];
      for (let j = 0; j < this.dependencyGraphDict.links.length; j += 1) {
        tmp.push(JSON.parse(JSON.stringify(this.dependencyGraphDict.links[j])));
      }
      // console.log('before:', this.dependencyGraph.links);
      for (let i = 0; i < this.barChart.data.length; i += 1) {
        const newTarget = this.barChart.data[i].name;
        console.log('newTarget', newTarget);
        for (let j = 0; j < this.dependencyGraphDict.links.length; j += 1) {
          console.log('=====', this.dependencyGraphDict.links[j].target, newTarget);
          console.log(typeof (this.dependencyGraphDict.links[j].target), typeof (newTarget));
          if (parseInt(this.dependencyGraphDict.links[j].target, 10) === parseInt(newTarget, 10)) {
            console.log('opop');
            tmp[j].target = i;
            console.log(j, tmp[j].target);
          }
        }
      }
      console.log('tmp', tmp);
      this.dependencyGraphDict.links = tmp;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.title {
  padding : 15px;
  margin: 0px;
}
.bar-title{
  flex: 0 0 18%;
  /* background-color: #f08bc3; */
  margin-top: 2px;
  display: flex;
  padding: 0px 5px 0px 15px;
  /* justify-content: center; */
  /* align-items: center; */
  color: black;
  flex-wrap: wrap;
  justify-content: space-between;
  /* font-size: 2rem; */
}
.word-title {
  flex: 0 0 25%;
  /* background-color: #f08bc3; */
  margin: 2px;
  display: flex;
  /* justify-content: center; */
  /* align-items: center; */
  color: black;
  /* font-size: 2rem; */
}
.sentence-title {
  flex: 0 0 55%;
  /* background-color: #f08bc3; */
  margin: 2px;
  /* display: flex; */
  /* justify-content: center; */
  /* align-items: center; */
  color: black;
  /* font-size: 2rem; */
  /* padding-top: 20px; */
}
.flex-title {
  display: flex;
  height: 100%;
  padding-top: 15px;
  /* padding-bottom: 15px; */
  /* padding-right: 15px;
  padding-left: 15px; */
  /* background-color: #61a0f8; */
  flex-wrap: wrap;
  /* justify-content: space-between; */
}
.flex {
  display: flex;
  height: 100%;
  /* padding-top: 15px; */
  padding-bottom: 15px;
  /* background-color: #61a0f8; */
  flex-wrap: wrap;
  /* justify-content: space-between; */
}
.bar-block {
  flex: 0 0 18%;
  /* background-color: #f08bc3; */
  margin: 2px;
  display: flex;
  padding: 0px 5px 20px 15px;
  overflow: hidden;
  /* justify-content: center; */
  /* align-items: center; */
  color: black;
  font-size: 2rem;
  /* margin-right: 30px; */
}
.word-block {
  flex: 0 0 25%;
  /* background-color: #f08bc3; */
  /* margin-top: 2px; */
  margin-bottom: 2px;
  /* display: flex; */
  /* justify-content: center; */
  /* align-items: center; */
  color: black;
  font-size: 2rem;
}
.sentence-block {
  flex: 0 0 55%;
  /* background-color: #f08bc3; */
  margin: 2px;
  /* margin-top: 2px;
  margin-bottom: 2px; */
  /* display: flex; */
  /* justify-content: center; */
  align-items: center;
  color: black;
  font-size: 2rem;
  /* padding-top: 20px; */
  overflow: hidden;
}
.text {
  text-align: left;
  height: 30px;

  /* margin-top: 20px; */
  font-size: 12px;
  /* padding-top: 15px; */
  margin-bottom: 20px;
  /* background: black; */
  overflow : hidden;
  text-overflow : ellipsis;
  cursor: pointer;
}
.sort-btn {
  color: #61a0f8;
  cursor: pointer;
  font-size: 16px;
  margin-right: 20px;
}
</style>
