<template>
  <div class="hello">
    <h1 class="title">Finance Report Name</h1>
    <div class="flex-title">
      <h5 class="bar-title">
        <div>Risk Level</div>
        <svg class="sort-btn" v-on:click="sortDiction" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/></svg>
        <!-- <img src="./assets/filter.svg"> -->
        <!-- <div v-if="!isSorted" class="sort-btn" v-on:click="sortDiction">sort</div>
        <div v-if="isSorted" class="sort-btn" v-on:click="recoverDiction">unsort</div> -->
      </h5>
      <h5 class="sentence-title">Sentence</h5>
      <h5 class="word-title">Word</h5>
    </div>
    <div class="flex">
      <div class="bar-block">
        <BarChart :barChart=barChart  :chartMargin=chartMargin />
      </div>
      <div class="sentence-block">
        <!-- <b-button v-b-modal.modal-xl variant="primary">xl modal</b-button> -->
        <div class="text" v-for="(item, idx) in barChart.data">
          <div style="outline: none" v-b-modal.modal-lg @click="setHeatMapData(idx)">{{item.sentence}}</div>
          <!-- {{item.sentence}} -->
        </div>
      </div>
      <b-modal id="modal-lg" size="lg" title="Detail">
        <h6>Original Sentence:</h6>
        <div class="modal-sentence">{{this.selectedHeatMapSentenceData}}</div>
        <hr>
        <h6>HeatMap:</h6>
        <HeatMap :data="selectedHeatMapGridData"/>
      </b-modal>
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
import HeatMap from './HeatMap';

export default {
  name: 'HelloWorld',
  components: {
    BarChart,
    DependencyGraph,
    HeatMap,
  },
  data() {
    return {
      isSorted: false,
      selectedHeatMapSentenceData: '',
      selectedHeatMapGridData: [],
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
            words:
              [{ word: 'I', weight: 98 },
                { word: 'have', weight: 60 }, { word: 'also', weight: 34 }, { word: 'tried', weight: 45 }, { word: 'to', weight: 64 }, { word: 'manually', weight: 16 }, { word: 'set', weight: 6 }, { word: 'the', weight: 54 }, { word: "node's", weight: 27 }, { word: 'x', weight: 69 }, { word: 'and', weight: 64 }, { word: 'y', weight: 67 }, { word: 'attributes', weight: 89 }, { word: 'each', weight: 73 }, { word: 'tick,', weight: 4 }, { word: 'but', weight: 41 }, { word: 'then', weight: 56 }, { word: 'the', weight: 73 }, { word: 'links', weight: 96 }, { word: 'continue', weight: 68 }, { word: 'to', weight: 68 }, { word: 'float', weight: 18 }, { word: 'out', weight: 86 }, { word: 'to', weight: 54 }, { word: 'where', weight: 36 }, { word: 'the', weight: 2 }, { word: 'node', weight: 14 }, { word: 'would', weight: 80 }, { word: 'be', weight: 87 }, { word: 'if', weight: 5 }, { word: 'it', weight: 90 }, { word: 'was', weight: 23 }, { word: 'affected', weight: 62 }, { word: 'by', weight: 45 }, { word: 'the', weight: 93 }, { word: 'force.Obviously', weight: 91 }, { word: 'I', weight: 4 }, { word: 'have', weight: 38 }, { word: 'a', weight: 64 }, { word: 'basic', weight: 49 }, { word: 'misunderstanding', weight: 13 }, { word: 'of', weight: 91 }, { word: 'how', weight: 93 }, { word: 'this', weight: 77 }, { word: 'is', weight: 33 }, { word: 'supposed', weight: 92 }, { word: 'to', weight: 44 }, { word: 'work.', weight: 94 }, { word: 'How', weight: 54 }, { word: 'can', weight: 28 }, { word: 'I', weight: 13 }, { word: 'fix', weight: 50 }, { word: 'nodes', weight: 30 }, { word: 'in', weight: 52 }, { word: 'a', weight: 90 }, { word: 'position,', weight: 54 }, { word: 'while', weight: 6 }, { word: 'keeping', weight: 14 }, { word: 'links', weight: 95 }, { word: 'and', weight: 44 }, { word: 'still', weight: 63 }, { word: 'allowing', weight: 60 }, { word: 'for', weight: 12 }, { word: 'them', weight: 36 }, { word: 'to', weight: 57 }, { word: 'be', weight: 16 }, { word: 'draggable?', weight: 78 }]
            ,
          },
          {
            value: 15,
            name: 1,
            sentence: 'I want some of the nodes in my force-directed layout to ignore all forces and stay in fixed positions based on an attribute of the node',
            words: [
              { word: 'asd', weight: 50 },
              { word: 'ba', weight: 10 },
              { word: 'orangeasd', weight: 5 },
              { word: 'textasd', weight: 1 },
              { word: 'hellosds', weight: 4 },
              { word: 'hiasd', weight: 5 },
              { word: 'conversationaaa', weight: 15 },
            ],
          },
          {
            value: 50,
            name: 2,
            sentence: 'while still being able to be dragged and exert repulsion on other nodes and maintain their link lines.',
            words: [
              { word: 'asd', weight: 50 },
              { word: 'ba', weight: 10 },
              { word: 'orangeasd', weight: 5 },
              { word: 'textasd', weight: 1 },
              { word: 'hellosds', weight: 4 },
              { word: 'hiasd', weight: 5 },
              { word: 'conversationaaa', weight: 15 },
            ],
          },
          {
            value: 15,
            name: 3,
            sentence: 'Set d.fixed on the desired nodes to true, and initialize d.x and d.y to the desired position. These nodes will then still be part of the simulation,',
            words: [
              { word: 'asd', weight: 50 },
              { word: 'ba', weight: 10 },
              { word: 'orangeasd', weight: 5 },
              { word: 'textasd', weight: 1 },
              { word: 'hellosds', weight: 4 },
              { word: 'hiasd', weight: 5 },
              { word: 'conversationaaa', weight: 15 },
            ],
          },
          {
            value: 10,
            name: 4,
            sentence: 'and you can use the normal display code (e.g., setting a transform attribute);',
            words: [
              { word: 'asd', weight: 50 },
              { word: 'ba', weight: 10 },
              { word: 'orangeasd', weight: 5 },
              { word: 'textasd', weight: 1 },
              { word: 'hellosds', weight: 4 },
              { word: 'hiasd', weight: 5 },
              { word: 'conversationaaa', weight: 15 },
            ],
          },
          {
            value: 5,
            name: 5,
            sentence: 'however, because they are marked as fixed, they can only be moved by dragging and not by the simulation.',
            words: [
              { word: 'asd', weight: 50 },
              { word: 'ba', weight: 10 },
              { word: 'orangeasd', weight: 5 },
              { word: 'textasd', weight: 1 },
              { word: 'hellosds', weight: 4 },
              { word: 'hiasd', weight: 5 },
              { word: 'conversationaaa', weight: 15 },
            ],
          },
          {
            value: 3,
            name: 6,
            sentence: 'See the force layout documentation for more details (v3 docs, current docs), and also see how the root node is positioned in this example.',
            words: [
              { word: 'asd', weight: 50 },
              { word: 'ba', weight: 10 },
              { word: 'orangeasd', weight: 5 },
              { word: 'textasd', weight: 1 },
              { word: 'hellosds', weight: 4 },
              { word: 'hiasd', weight: 5 },
              { word: 'conversationaaa', weight: 15 },
            ],
          },
          {
            value: 1,
            name: 7,
            sentence: 'At the end of each tick, after the application of any forces, a node with a defined node.fx has node.x',
            words: [
              { word: 'asd', weight: 50 },
              { word: 'ba', weight: 10 },
              { word: 'orangeasd', weight: 5 },
              { word: 'textasd', weight: 1 },
              { word: 'hellosds', weight: 4 },
              { word: 'hiasd', weight: 5 },
              { word: 'conversationaaa', weight: 15 },
            ],
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
          { name: '', fixed: true, cx: 10, cy: 65, weight: 1 },
          { name: '', fixed: true, cx: 10, cy: 115, weight: 1 },
          { name: '', fixed: true, cx: 10, cy: 165, weight: 1 },
          { name: '', fixed: true, cx: 10, cy: 215, weight: 1 },
          { name: '', fixed: true, cx: 10, cy: 265, weight: 1 },
          { name: '', fixed: true, cx: 10, cy: 315, weight: 1 },
          { name: '', fixed: true, cx: 10, cy: 365, weight: 1 },
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
      if (!this.isSorted) {
        this.barChart.data.sort(this.compare);
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
      } else {
        this.barChart = JSON.parse(JSON.stringify(this.copyData));
        for (let j = 0; j < this.dependencyGraphDict.links.length; j += 1) {
          this.dependencyGraphDict.links[j].target = JSON.parse(JSON.stringify(this.dependencyLinkOrder[j].target));
        }
      }
      this.isSorted = !this.isSorted;
    },
    setHeatMapData(idx) {
      this.selectedHeatMapGridData = this.barChart.data[idx].words;
      this.selectedHeatMapSentenceData = this.barChart.data[idx].sentence;
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
  flex: 0 0 10%;
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
  flex: 0 0 22%;
  /* background-color: #f08bc3; */
  /* margin: 2px; */
  display: flex;
  /* justify-content: center; */
  /* align-items: center; */
  color: black;
  /* font-size: 2rem; */
}
.sentence-title {
  flex: 0 0 68%;
  /* background-color: #f08bc3; */
  /* margin: 2px; */
  /* display: flex; */
  /* justify-content: center; */
  /* align-items: center; */
  color: black;
  padding: 0 2vw 0 2vw;
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
  flex: 0 0 10%;
  /* background-color: #f08bc3; */
  /* margin: 2px; */
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
  flex: 0 0 22%;
  /* background-color: #f08bc3; */
  /* margin-top: 2px; */
  /* margin-bottom: 2px; */
  /* display: flex; */
  /* justify-content: center; */
  /* align-items: center; */
  color: black;
  font-size: 2rem;
}
.sentence-block {
  flex: 0 0 68%;
  /* background-color: #f08bc3; */
  /* margin: 2px; */
  /* margin-top: 2px;
  margin-bottom: 2px; */
  /* display: flex; */
  /* justify-content: center; */
  align-items: center;
  color: black;
  font-size: 2rem;
  /* padding-top: 20px; */
  overflow: hidden;
  padding: 0 2vw 0 2vw;
}
.text {
  text-align: left;
  height: 30px;

  /* margin-top: 20px; */
  font-size: 20px;
  /* padding-top: 15px; */
  margin-bottom: 20px;
  /* background: black; */
  overflow : hidden;
  text-overflow : ellipsis;
  cursor: pointer;
}
.text:hover{
  color:#FF5C59;
}
.sort-btn {
  color: #61a0f8;
  cursor: pointer;
  font-size: 16px;
  /* margin-right: 20px; */
}
</style>
