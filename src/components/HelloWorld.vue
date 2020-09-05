<template>
<div class="hello">
    <NavBar title="Finance Report Name" />
    <!-- <h1 class="title">Finance Report Name</h1> -->
    <div class="flex-title">
        <h5 class="bar-title">
            <div>Risk Level</div>
            <svg class="sort-btn" v-on:click="sortDiction" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" /></svg>
            <!-- <img src="./assets/filter.svg"> -->
            <!-- <div v-if="!isSorted" class="sort-btn" v-on:click="sortDiction">sort</div>
        <div v-if="isSorted" class="sort-btn" v-on:click="recoverDiction">unsort</div> -->
        </h5>
        <h5 class="sentence-title">
            {{metaInfo.name}}{{metaInfo.date}}
            <!-- <b-dropdown text="Display">
          <b-dropdown-item href="#">An item</b-dropdown-item>
          <b-dropdown-item href="#">Another item</b-dropdown-item>
        </b-dropdown> -->
        </h5>
        <h5 class="word-title">Word</h5>
        <svg class="sort-btn" v-on:click="sortDiction" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" /></svg>

    </div>
    <div class="flex">
        <div class="bar-block">

            <BarChart :barChart=barChart :chartMargin=chartMargin />
        </div>
        <div class="sentence-block">
            <div v-for="(item, idx) in barChart.data">
                <div class="text" :id="`text-${idx}`">
                    <span :style="{ background: colorFunc(idx, word)}" class="text-span" :id="`text-span-${id}`" v-for="(word, id) in item.sentence">{{word}}</span>

                </div>
                <!-- {{item.sentence}} -->
            </div>
        </div>
        <div class="word-block">
            <!-- <DependencyGraph :data=dependencyGraphDict :isSorted=isSorted /> -->
            <!-- <div class="word-text-block">hi</div> -->
            <div class="word-block-inner">
                <div class="word-text-block">
                    <div class="word-text" v-for="(item, idx) in dependencyGraphDict.data" @click="clickWord(idx, item.word)">{{item.word}}</div>
                </div>
                <div class="word-number-block">
                    <div class="word-number" v-for="(item, idx) in dependencyGraphDict.data">{{item.target.length}}</div>
                </div>
                <div class="word-chart-outer">
                    <BarChartWord :barChart="dependencyGraphDict" :chartMargin=chartMargin />
                </div>

            </div>

        </div>
    </div>

</div>
</template>

<script>
import * as d3 from 'd3';
import BarChart from './BarChart';
import DependencyGraph from './DependencyGraph';
import HeatMap from './HeatMap';
import BarChartWord from './BarChartWord';
import NavBar from './NavBar';
import DataInfo from './data.json';

export default {
    name: 'HelloWorld',
    components: {
        BarChart,
        DependencyGraph,
        HeatMap,
        BarChartWord,
        NavBar,
    },
    data() {
        return {
            isSorted: false,
            isChanged: false,
            isHeatMapClick: false,
            selectedHeatMapSentenceData: '',
            selectedHeatMapGridData: [],
            sentenceHeatMapGridData: [],
            heatMapLabel: 'text',
            color: {},
            metaInfo: {},
            barChart: {
                data: [],
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
            dependencyGraphDict: {
                data: [],
                width: 540,
                height: 500,
                barHeight: 30,
                barMargin: 20,
            },
        };
    },
    methods: {
        clickWord(idx, word) {
            const targetId = this.dependencyGraphDict.data[idx].target;
            const tmp = this.barChart.data[0];
            let tmpA = {};
            for (let i = 0; i < this.barChart.data.length; i += 1) {
                if (this.barChart.data[i].name === targetId) {
                    tmpA = this.barChart.data[i];
                    break;
                }
            }
            this.barChart.data[0] = tmpA;
            this.barChart.data[targetId] = tmp;
            this.isChanged = !this.isChanged;

            const x = document.getElementById('text-0');
            for (let i = 0; i < this.barChart.data[0].words.length; i += 1) {
                if (this.barChart.data[0].words[i].word === word && i > 5) {
                    const offset = (i - 5) * 85;
                    x.scrollLeft = offset;
                }
            }
        },
        compareValue(a, b) {
            if (a.value < b.value) {
                return -1;
            }
            if (a.vlue > b.value) {
                return 1;
            }
            return 0;
        },
        compareName(a, b) {
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }
            return 0;
        },
        // recoverDiction() {
        //   this.barChart = JSON.parse(JSON.stringify(this.copyData));
        //   this.isSorted = !this.isSorted;
        //   for (let j = 0; j < this.dependencyGraphDict.links.length; j += 1) {
        //     this.dependencyGraphDict.links[j].target = JSON.parse(JSON.stringify(this.dependencyLinkOrder[j].target));
        //   }
        // },
        sortDiction() {
            console.log('isSorted', this.isSorted);
            // console.log(this.barChart);
            if (!this.isSorted) {
                this.barChart.data.sort(this.compareValue);
            } else {
                this.barChart.data.sort(this.compareName);
            }
            this.isSorted = !this.isSorted;
            // console.log('----', this.dependencyGraphDict.links);
            // // console.log('----', this.dependencyGraph.links);
            // const tmp = [];
            // for (let j = 0; j < this.dependencyGraphDict.links.length; j += 1) {
            //   tmp.push(JSON.parse(JSON.stringify(this.dependencyGraphDict.links[j])));
            // }
            // // console.log('before:', this.dependencyGraph.links);
            // for (let i = 0; i < this.barChart.data.length; i += 1) {
            //   const newTarget = this.barChart.data[i].name;
            //   console.log('newTarget', newTarget);
            //   for (let j = 0; j < this.dependencyGraphDict.links.length; j += 1) {
            //     console.log('=====', this.dependencyGraphDict.links[j].target, newTarget);
            //     console.log(typeof (this.dependencyGraphDict.links[j].target), typeof (newTarget));
            //     if (parseInt(this.dependencyGraphDict.links[j].target, 10) === parseInt(newTarget, 10)) {
            //       console.log('opop');
            //       tmp[j].target = i;
            //       console.log(j, tmp[j].target);
            //     }
            //   }
            // }
            // console.log('tmp', tmp);
            // this.dependencyGraphDict.links = tmp;
        },
        setHeatMapData(idx) {
            this.heatMapLabel = 'modal';
            this.selectedHeatMapGridData = this.barChart.data[idx].words;
            this.selectedHeatMapSentenceData = this.barChart.data[idx].sentence;
        },
        colorFunc(idx, word) {
            let a = this.color(1);
            for (let j = 0; j < this.barChart.data[idx].words.length; j += 1) {
                const targetItem = this.barChart.data[idx].words[j];
                if (word.indexOf(targetItem.word) != -1) {
                    a = this.color(targetItem.weight * 100);
                    break;
                }
            }
            console.log('a', a);
            // if (a === 'rgb(247,255,255)') {
            //   a = '#F9F7EB';
            // }
            return a;
        },
    },
    mounted() {
        if (DataInfo) {
            this.barChart.data = DataInfo.sentencesData;
            this.dependencyGraphDict.data = DataInfo.wordsData;
            this.metaInfo = DataInfo.metaInfo;
        }
        let min_ = 1;
        let max_ = 1;
        for (let i = 0; i < this.barChart.data.length; i++) {
            if (this.barChart.data[i].value < min_) {
                min_ = this.barChart.data[i].value;
            }
            if (this.barChart.data[i].value > max_) {
                max_ = this.barChart.data[i].value;
            }
        }
        this.color = d3.scaleLinear()
            .domain([min_ * 100, max_ * 100])
            .range(['#F9F7EB', '#FF0001']);
        console.log('min', min_, 'max', max_);
    },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Assistant:wght@400;600&display=swap');
</style><style scoped>
 < !-- Add "scoped"attribute to limit CSS to this component only -->.title {
     padding: 15px;
     margin: 0px;
 }

 .bar-title {
     /*flex: 0 0 10%;*/
     width: 12vw;
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
     flex: 0 0 16%;
     /* background-color: #f08bc3; */
     /* margin: 2px; */
     display: flex;
     /* justify-content: center; */
     /* align-items: center; */
     color: black;
     /* font-size: 2rem; */
 }

 .sentence-title {
     /*flex: 0 0 61%;*/
     width: 60vw;
     /* background-color: #f08bc3; */
     /* margin: 2px; */
     /* display: flex; */
     /* justify-content: center; */
     /* align-items: center; */
     color: black;
     padding: 0 2vw 0 2vw;
     justify-content: space-between;
     /* font-size: 2rem; */
     /* padding-top: 20px; */
 }

 .flex-title {
     display: flex;
     height: 100%;
     padding-top: 5px;
     margin-left: 3vw;
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
     margin-left: 3vw;
     /* background-color: #61a0f8; */
     flex-wrap: wrap;
     /* justify-content: space-between; */
 }

 .bar-block {
     /*flex: 0 0 10%;*/
     width: 12vw;
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
     /* display: inline-block; */
     /* justify-content: center; */
     /* align-items: center; */
     color: black;
     font-size: 2rem;
     padding-right: 15px;
     /* padding: 0px 5px 20px 15px; */
 }

 .sentence-block {
     /*flex: 0 0 61%;*/
     width: 60vw;
     /* background-color: #f08bc3; */
     /* margin: 2px; */
     /* margin-top: 2px;
  margin-bottom: 2px; */
     /* display: flex; */
     /* justify-content: center; */
     align-items: center;
     color: black;
     font-size: 20px;
     /* padding-top: 20px; */
     overflow: hidden;
     padding: 0 2vw 0 2vw;
 }

 .text {
     text-align: left;
     /*height: 30px;*/
     width: 100%;
     /* background: rgb(249,247,235);; */
     /* margin-top: 20px; */
     font-size: 18px;
     /* padding-top: 15px; */
     margin-bottom: 6px;
     /* background: black; */
     overflow-x: scroll;
     overflow-x: hidden;
     /* overflow-y: hidden; */
     /* text-overflow : ellipsis; */
     cursor: pointer;
     font-family: 'Assistant', sans-serif;
 }

 .sort-btn {
     color: #61a0f8;
     cursor: pointer;
     font-size: 16px;
     /* margin-right: 20px; */
 }

 .sentence-inner {
     position: relative;
     overflow-x: hidden;
     overflow-x: scroll;
 }

 .text-outer {
     padding: 0 2vw 0 2vw;
     position: relative;
     overflow-x: hidden;
 }

 .word-chart-outer {
     flex: 0 0 50%;
     /* width: 100%; */
     /* width: 50px; */
 }

 .word-block-inner {
     display: flex;
     justify-content: space-between;
     width: 100%;
     flex-wrap: wrap;
 }

 .word-number-block {
     flex: 0 0 10%;
     font-size: 18px;
     font-family: 'Assistant', sans-serif;
 }

 .word-text-block {
     flex: 0 0 26%;
     overflow: hidden;
     font-size: 18px;
     font-family: 'Assistant', sans-serif;

 }

 .word-text {
     height: 30px;
     margin-bottom: 10px;
     cursor: pointer;
 }

 .word-text:hover {
     color: #FF5C59;
 }

 .text-span {
     padding-right: 0.5rem;
     text-align: center;
 }

 .word-number {
     background: #f5a142;
     text-align: center;
     margin-bottom: 20px;
     border-radius: 100%;
 }
</style>
