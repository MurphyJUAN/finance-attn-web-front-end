<template>
<div class="hello">
    <NavBar title="Finance Report Name" v-on:companyIdFromNav="companyIdFromNav" />
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
            <div class="meta-info" v-if="(!barChart.data.length||isLoading)&&!isError"><Loading /></div>
            <!-- <div class="meta-info" v-if="!barChart.data.length&&isError"> -->
              <b-alert :show="isError" variant="danger">Oops!Error! Please search the financial report again or choose another one.</b-alert>
            <!-- </div> -->
            <div v-if="!isLoading" class="meta-info">{{metaInfo.name}} &nbsp {{metaInfo.date}} &nbsp
                <h5 style="display: inline-block" class="df-small-title" v-b-popover.hover.top="'Post-event return volatility is a widely used financial risk proxy; by following the definition in (Loughran and McDonald 2011), it is defined as the root-mean-square error from a Fama and French three-factor model for days 162 [6, 252] after the report filing date.'" title="Annual volatility">
                    Annual volatility: {{metaInfo.volatility}}%
                </h5>
                </div>
            <div>
              <img v-if="isHeatMap" class="invisible-img" @click="hideHeatMap" src="../assets/invisible.svg">
              <img v-if="!isHeatMap" class="invisible-img" @click="showHeatMap" src="../assets/eye.svg">
              <img class="invisible-img" @click="setScroll" src="../assets/quote.svg">
            </div>
        </h5>
        <div class="word-title">
          <h5 class="word-small-title">Word</h5>
          <h5 class="df-small-title" v-b-popover.hover.top="'Every word listed is accompanied with a number on its right indicating the number of sentences that the word has been used.'" title="Sentence Frequency">SF</h5>
          <h5 class="aw-small-title" v-b-popover.hover.top="'The average of normalized attention weights for this word in the report.'" title="Attention Weight">AW</h5>
        </div>


    </div>
    <div class="flex" v-if="!isLoading">
        <div class="bar-block">
            <BarChart v-if="barChart.data.length" :barChart=barChart :chartMargin=chartMargin :clickedNumber=clickedWordNumber />
        </div>
        <div class="sentence-block">
            <div class="color-axis-block" @mouseover="mouseOver" @mouseleave="mouseLeave">
              <div class="triangle" :style="{marginLeft: this.triangleOffset}">
                  <div class="pred" v-if="isShowPredText">Predicted relative risk level</div>
              </div>
              <div class="color-axis-inner">
                <div class="color-axis color-axis-0"></div>
                <div class="color-axis color-axis-25"></div>
                <div class="color-axis color-axis-50"></div>
                <div class="color-axis color-axis-75"></div>
              </div>
              <div class="color-text-inner">
                <div class="color-text color-text-0">0</div>
                <div class="color-text color-text-25">25</div>
                <div class="color-text color-text-50">50</div>
                <div class="color-text color-text-75">75</div>
                <div class="color-text">100</div>
              </div>

            </div>
            <!-- <div > -->
              <!-- <div class="text-outer"> -->
                <div class="text text-outer" :ref="`ref-text-${item.name}`" :id="`text-${idx}`"
                :style="{opacity: item.opacity}"
                v-for="(item, idx) in barChart.data"
                >
                    <span
                    v-if="isHeatMap"
                    :style="{ background: colorFunc(idx, word, id, true),
                    fontWeight:  checkSelected(item.name, id)? 900: 10}"
                    class="text-span"
                    :ref="`ref-text-${item.name}-text-span-${id}`"
                    :id="`text-${item.name}-text-span-${id}`"
                    v-for="(word, id) in item.sentence">
                    {{word}}
                    <span v-if="id === item.sentence.length - 1">.</span>
                    </span>

                    <span
                    v-if="!isHeatMap"
                    :style="{ background: colorFunc(idx, word,id,  false),
                    fontWeight:  checkSelected(item.name, id)? 900: 10}"
                    class="text-span"
                    :ref="`ref-text-${item.name}-text-span-${id}`"
                    :id="`text-${item.name}-text-span-${id}`"
                    v-for="(word, id) in item.sentence">
                    {{word}}
                    <span v-if="id === item.sentence.length - 1">.</span>
                    </span>
                </div>
              <!-- </div> -->
            <!-- </div> -->
        </div>
        <div class="word-block">
            <!-- <DependencyGraph :data=dependencyGraphDict :isSorted=isSorted /> -->
            <!-- <div class="word-text-block">hi</div> -->
            <div class="word-block-inner">
                <div class="word-text-block">
                    <div class="word-text" :class="{wordRed: clickedWordNumber===idx , wordBlack:  clickedWordNumber!==idx}" v-for="(item, idx) in dependencyGraphDict.data" @click="clickWord(idx, item.word)">{{item.word}}</div>
                </div>
                <div class="word-number-block">
                    <div class="word-number" v-for="(item, idx) in dependencyGraphDict.data">{{item.target.length}}</div>
                </div>
                <div class="word-chart-outer">
                    <BarChartWord v-if="barChart.data.length" :barChart="dependencyGraphDict" :chartMargin=chartMargin />
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
import Loading from './Loading';

import DataInfo from './data.json';
import axios from 'axios';

const baseURL = 'https://clip.csie.org/HIVEBACK/api';
export default {
  name: 'Demo',
  components: {
    BarChart,
    DependencyGraph,
    HeatMap,
    BarChartWord,
    NavBar,
    Loading,
  },
  data() {
    return {
      isSorted: false,
      isHeatMap: true,
      isScroll: false,
      isLoading: true,
      isError: false,
      isShowPredText: false,
      clickedWordNumber: -1,
      isHeatMapClick: false,
      targetIdList: [],
      loadingMessage: 'Loading...',
      selectedHeatMapSentenceData: '',
      selectedHeatMapGridData: [],
      sentenceHeatMapGridData: [],
      clickedSentenceansWord: {},
      heatMapLabel: 'text',
      selectedCompanyIdFromNav: '',
      color: {},
      metaInfo: {},
      DataInfo: {},
      triangleOffset: '30%',
      barChart: {
        data: [],
        width: 540,
        height: 500,
        barHeight: 25,
        barMargin: 7,
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
        barHeight: 25,
        barMargin: 7,
      },
    };
  },
  methods: {
    mouseOver() {
      this.isShowPredText = true;
    },
    mouseLeave() {
      this.isShowPredText = false;
    },
    // 點擊的單字變色(ok)
    // 點擊的句子往上跑(ok)
    // 關鍵字跑到中間（ok)
    // 字變成粗體、變色(ok)
    // 點擊別的字、別的按鈕，字的底線會變回來(ok)
    // 其他句子飽和度降低(ok)
    // 不要讓字跑到下面 (ok)
    // 點擊別的按鈕，整個句子的 opacity, 關鍵字的底線會消失
    // initFunc(){

    // },
    checkSelected(textId, wordId) {
      const a = Object.keys(this.clickedSentenceansWord);
      // console.log('a', a);
      for (let i = 0; i < a.length; i++) {
        if (parseInt(a[i]) === textId && this.clickedSentenceansWord[a[i].toString()] === wordId) {
          return true;
        }
      }
      return false;
    },
    clickWord(idx, word) {
      if (this.clickedWordNumber !== idx) {
        this.clickedSentenceansWord = {};
        this.clickedWordNumber = idx;
        this.targetIdList = this.dependencyGraphDict.data[idx].target;
        console.log(this.targetIdList.length, this.targetIdList);
        let tmpA = {};
        let tmpB = {};

        for (let j = 0; j < this.targetIdList.length; j += 1) {
          for (let i = 0; i < this.barChart.data.length; i += 1) {
            if (this.barChart.data[i].name === this.targetIdList[j]) {
              console.log('sentnece', this.barChart.data[i].sentence);
              tmpA = this.barChart.data[i]; // name6的實體，i是name6的位置
              tmpB = this.barChart.data[j];
              console.log('tmpA(目標) name is', tmpA.name, '在第', i, '個位置');
              console.log('tmpB(原本在上面的) name is ', tmpB.name, '在第', j, '個位置');
              this.barChart.data[j] = tmpA;// 0->name6的實體
              this.barChart.data[i] = tmpB;
              console.log('j', j, this.barChart.data[j].name, this.barChart.data[j].sentence);
              console.log('i', i, this.barChart.data[i].name, this.barChart.data[i].sentence);

              console.log('_-----', document.getElementById(`text-${j}-text-span-0`), document.getElementById(`text-${j}-text-span-0`).offsetLeft);
              for (let k = 0; k < this.barChart.data[j].sentence.length; k += 1) {
                // console.log('a', this.barChart.data[j].sentence[k].toLowerCase());
                if (this.barChart.data[j].sentence[k].toLowerCase().indexOf(word) !== -1) {
                  console.log('----Debug Click Word---');
                  console.log(word, this.barChart.data[j].sentence[k].toLowerCase());
                  const centerWordOffset = this.$refs[`ref-text-${this.barChart.data[j].name}-text-span-6`][0].offsetLeft;
                  const wordTarget = this.$refs[`ref-text-${this.barChart.data[j].name}-text-span-${k}`][0];
                  // const moveX = this.$refs[`ref-text-${this.barChart.data[j].name}`];
                  // const targetX = moveX[0];
                  // console.log('x', moveX, targetX, moveX.scrollLeft, moveX[0], this.barChart.data[j].name);
                  const moveX = document.getElementById(`text-${j}`);
                  console.log('moveX', moveX, moveX.scrollLeft);
                  console.log('---wordTarget---', wordTarget);
                  if (wordTarget) {
                    console.log(`text-${this.barChart.data[j].name}-text-span-${k}`);
                    console.log('word', wordTarget);
                    if (k > 5) {
                      this.isScroll = true;
                      const offset = wordTarget.offsetLeft - centerWordOffset;
                      moveX.scrollLeft = offset;
                      if (moveX.scrollLeft !== offset) {
                        console.log('strange!');
                        const timeoutID = window.setTimeout((() => moveX.scrollLeft = offset), 300);
                      }
                      console.log(wordTarget.offsetLeft, centerWordOffset, offset);
                      console.log('new movex', moveX.scrollLeft);
                    } else {
                      moveX.scrollLeft = 0;
                    }
                    // console.log('l', l);

                    this.clickedSentenceansWord[this.barChart.data[j].name.toString()] = k;
                    console.log('===', this.clickedSentenceansWord);
                    // console.log('ko', this.clickedSentenceansWord, Object.keys(this.clickedSentenceansWord).length);
                    // const y = document.getElementById(`text-${j}-text-span-${k}`);
                    // y.style.styleWeight = 900;
                    // y.style.borderBottom = 'solid 1px black';
                    // y.setAttribute('style', 'font-weight:900;border-bottom:solid 1px black;');
                    break;
                  }
                }
              }
              break;
            }
          }
        }
        this.barChart.data = JSON.parse(JSON.stringify(this.barChart.data));

        for (let i = 0; i < this.barChart.data.length; i += 1) {
          this.barChart.data[i].opacity = 0.2;
        }
        for (let j = 0; j < this.targetIdList.length; j += 1) {
          for (let i = 0; i < this.barChart.data.length; i += 1) {
            if (this.barChart.data[i].name === this.targetIdList[j]) {
              this.barChart.data[i].opacity = 1.0;
            }
          }
        }
      } else {
        this.clickedWordNumber = -1;
        this.clickedSentenceansWord = {};
        for (let i = 0; i < this.barChart.data.length; i += 1) {
          this.barChart.data[i].opacity = 1;
        }
      }
    },
    compareValue(a, b) {
      if (a.value > b.value) {
        return -1;
      }
      if (a.vlue < b.value) {
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
      // console.log('isSorted', this.isSorted);
      // console.log(this.barChart);
      if (!this.isSorted) {
        this.barChart.data.sort(this.compareValue);
      } else {
        this.barChart.data.sort(this.compareName);
      }
      this.isSorted = !this.isSorted;
    },
    setHeatMapData(idx) {
      this.heatMapLabel = 'modal';
      this.selectedHeatMapGridData = this.barChart.data[idx].words;
      this.selectedHeatMapSentenceData = this.barChart.data[idx].sentence;
    },
    colorFunc(idx, word, id, flag) {
      let a = this.color(0);
      if (flag) {
        a = this.barChart.data[idx].wordDetail[id];
        // for (let j = 0; j < this.barChart.data[idx].words.length; j += 1) {
        //   const targetItem = this.barChart.data[idx].words[j];
        //   if (word.indexOf(targetItem.word) != -1) {
        //     a = this.color(targetItem.weight);
        //     break;
        //   }
        // }
      } else {
        a = this.color(0);
      }
      return a;
    },
    hideHeatMap() {
      this.isHeatMap = false;
    },
    showHeatMap() {
      console.log('showHeatMap');
      this.isHeatMap = true;
    },
    setScroll() {
      console.log(scroll, this.isScroll);
      if (this.isScroll) {
        for (let i = 0; i < this.barChart.data.length; i += 1) {
          const targetStr = `text-${this.barChart.data[i].name}`;
          // targetStr = targetStr;
          // console.log('d', targetStr);
          const item = document.getElementById(targetStr);
          item.scrollLeft = 0;
        }
      } else {
        console.log('START');
        for (let i = 0; i < this.barChart.data.length; i += 1) {
          let maxCount = 0;
          let maxWord = '';

          for (let j = 0; j < this.barChart.data[i].words.length; j += 1) {
            if (this.barChart.data[i].words[j].weight > maxCount) {
              maxCount = this.barChart.data[i].words[j].weight;
              maxWord = this.barChart.data[i].words[j].word;
            }
          }
          console.log('maxWord', maxWord);
          let wordIndex = 0;
          for (let k = 0; k < this.barChart.data[i].sentence.length; k += 1) {
            if (this.barChart.data[i].sentence[k].indexOf(maxWord) !== -1) {
              wordIndex = k;
              const targetStr = `text-${this.barChart.data[i].name}-text-span-${wordIndex}`;
              const item = document.getElementById(targetStr);
              const x = document.getElementById(`text-${this.barChart.data[i].name}`);
              console.log('item', item);
              let a = 0;
              if (this.barChart.data[i].sentence.length > 6) {
                a = 6;
              } else {
                a = Math.floor(this.barChart.data[i].sentence.length / 2);
              }
              console.log('a', a);
              const centerWord = document.getElementById(`text-${this.barChart.data[i].name}-text-span-${a}`);
              console.log('centerWord', centerWord);
              const offset = item.offsetLeft - centerWord.offsetLeft;
              console.log('offset', item.offsetLeft, centerWord.offsetLeft, offset);
              x.scrollLeft = offset;
              break;
            }
          }
        }
      }
      this.isScroll = !this.isScroll;
    },
    getDataInfo() {
      this.isLoading = true;
      this.isError = false;
      if (this.selectedCompanyId) {
        const path = `${baseURL}/metaInfo?filename=${this.selectedCompanyId}`;
        axios
          .get(path)
          .then((response) => {
            const a = response.data.metaInfo;
            a.volatility = Math.round(Math.exp(parseFloat(response.data.volatility)) * 100);
            a.pr = response.data.PR;
            this.triangleOffset = `${a.pr.toString()}%`;
            console.log('----this.triangleOffset---', this.triangleOffset);
            this.DataInfo.metaInfo = a;
            axios
              .get(`${baseURL}/sentencesData?filename=${this.selectedCompanyId}`)
              .then((responseSentence) => {
                this.DataInfo.sentencesData = responseSentence.data.sentencesData;
                axios
                  .get(`${baseURL}/wordsData?filename=${this.selectedCompanyId}`)
                  .then((responseWord) => {
                    this.DataInfo.wordsData = responseWord.data.wordsData;
                    console.log('----this.DataInfo---', this.DataInfo);

                    if (this.DataInfo) {
                      console.log('--Before1---', this.barChart.data);
                      this.isError = false;
                      console.log(this.DataInfo, this.DataInfo.sentencesData, 'opp');
                      // for (let k = 0; k < this.DataInfo.sentencesData.length; k += 1) {
                      //   this.barChart.data.push(this.DataInfo.sentencesData[k]);
                      // }
                      this.barChart.data = this.DataInfo.sentencesData;
                      console.log('--a--');
                      console.log('--Before---', this.barChart.data);
                      let a = this.color(0);
                      if (this.barChart.data.length > 0) {
                        for (let i = 0; i < this.barChart.data.length; i += 1) {
                          this.barChart.data[i].wordDetail = [];
                          for (let j = 0; j < this.barChart.data[i].sentence.length; j += 1) {
                            let flag = 0;
                            for (let k = 0; k < this.barChart.data[i].words.length; k += 1) {
                              const targetItem = this.barChart.data[i].words[k];
                              if (this.barChart.data[i].sentence[j].indexOf(targetItem.word) != -1) {
                                a = this.color(targetItem.weight);
                                this.barChart.data[i].wordDetail.push(a);
                                flag = 1;
                                break;
                              }
                            }
                            if (!flag) {
                              this.barChart.data[i].wordDetail.push(a);
                            }
                          }
                        }
                      } else {
                        this.isError = true;
                      }

                      this.dependencyGraphDict.data = [];
                      for (let i = 0; i < 20; i += 1) {
                        this.dependencyGraphDict.data.push(this.DataInfo.wordsData[i]);
                      }
                      this.metaInfo = this.DataInfo.metaInfo;
                      console.log(this.metaInfo, 'meta');
                      console.log(this.barChart.data, 'barchart');
                      this.isLoading = false;
                    } else {
                      this.loadingMessage = 'Error! No this Financial Report!';
                    }
                  })
                  .catch((error) => {
                    console.log(error);
                    this.isError = true;
                  });
              })
              .catch((error) => {
                console.log(error);
                this.isError = true;
              });
          })
          .catch((error) => {
            console.log(error);
            this.isError = true;
          });
      }
    },
    companyIdFromNav(selectedCompanyId) {
      // childValue就是子组件传过来的值
      this.selectedCompanyId = selectedCompanyId;
      this.getDataInfo();
    },
  },
  created() {
    // this.color = d3.scaleLinear()
    //   .domain([0, 100])
    //   .range(['rgb(255, 255, 255)', 'rgb(245, 91, 91)']);
    // this.selectedCompanyId = this.$route.params.reportId;
    // console.log('-----', this.selectedCompanyId);
    // this.getDataInfo();
  },

  mounted() {
    this.isLoading = true;
    this.color = d3.scaleLinear()
      .domain([0, 100])
      .range(['rgb(255, 255, 255)', 'rgb(245, 91, 91)']);
    let a = this.color(0);
    if (DataInfo) {
      this.barChart.data = DataInfo.sentencesData;
      for (let i = 0; i < this.barChart.data.length; i += 1) {
        this.barChart.data[i].opacity = 1;
        this.barChart.data[i].wordDetail = [];
        for (let j = 0; j < this.barChart.data[i].sentence.length; j += 1) {
          let flag = 0;
          for (let k = 0; k < this.barChart.data[i].words.length; k += 1) {
            const targetItem = this.barChart.data[i].words[k];
            if (this.barChart.data[i].sentence[j].indexOf(targetItem.word) != -1) {
              a = this.color(targetItem.weight);
              this.barChart.data[i].wordDetail.push(a);
              flag = 1;
              break;
            }
          }
          if (!flag) {
            this.barChart.data[i].wordDetail.push(a);
          }
        }
      }
      this.dependencyGraphDict.data = [];
      for (let i = 0; i < 20; i += 1) {
        this.dependencyGraphDict.data.push(DataInfo.wordsData[i]);
      }
      const info = DataInfo.metaInfo;
      info.volatility = Math.round(Math.exp(parseFloat(DataInfo.metaInfo.volatility)) * 100);
      this.triangleOffset = `${info.PR.toString()}%`;
      this.DataInfo.metaInfo = info;

      this.metaInfo = DataInfo.metaInfo;
      this.isLoading = false;
      this.isError = false;
      console.log('---DataInfo---', this.barChart.data);
    } else {
      this.isError = true;
    }

    // console.log('min', min_, 'max', max_);
    console.log('===', this.color(25), this.color(50), this.color(75));
  },
  watch: {
    selectedCompanyId: {
      handler(n, o) {
        console.log('========DatInfo===========');
      },
      deep: true,

    },
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Assistant:wght@400;600&display=swap');
</style><style scoped>
.show {
  display: block;
}
.hide {
  display: none;
}
.title {
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
     flex: 0 0 22%;
     /* background-color: #f08bc3; */
     /* margin: 2px; */
     display: flex;
     /* justify-content: center; */
     /* align-items: center; */
     color: black;
     padding-right: 15px;
     justify-content: space-between;
     /* font-size: 2rem; */
 }

 .sentence-title {
     /*flex: 0 0 61%;*/
     width: 60vw;
     /* background-color: #f08bc3; */
     /* margin: 2px; */
     display: flex;
     justify-content: space-between;
     /* align-items: center; */
     color: black;
     padding: 0 2vw 0 2vw;
     justify-content: space-between;
     /* font-size: 2rem; */
     /* padding-top: 20px; */
 }
 .invisible-img {
   width: 20px;
   height: 20px;
   cursor: pointer;
   margin-right: 5px;
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
     margin-top: 36px;
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
     margin-top: 36px;
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
     /* overflow: hidden; */
     padding: 0 2vw 0 1.745vw;
 }

 .text {
     text-align: left;
     max-height: 25px;
     width: 100%;
     /* background: rgb(249,247,235);; */
     /* margin-top: 20px; */
     font-size: 18px;
     /* padding-top: 15px; */
     margin-bottom: 7px;
     /* background: black; */
     /* overflow-x: scroll; */
     overflow-x: hidden;
     /* overflow-y: hidden; */
     /* text-overflow : ellipsis; */
     cursor: pointer;
     font-family: 'Assistant', sans-serif;
     transition: all 0.3s linear;

 }
.text:hover {
  overflow-x: scroll;
  scrollbar-width: thin;

}
.text::-webkit-scrollbar-track-piece {
  background-color:transparent;
}
.text-outer {
  white-space:nowrap;
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
     font-size: 18px;
     height: 25px;
     margin-bottom: 7px;
     cursor: pointer;
 }

 .word-text:hover {
     color: #FF5C59;
 }

 .wordRed {
   color: #FF5C59;
 }
 .wordBlack {
   color: black;
 }

 .text-span {
     padding-right: 0.255vw;
     padding-left: 0.255vw;
     text-align: center;
 }

 .word-number {
     background: #c4c4c4;
     font-size: 18px;
     height: 25px;
     text-align: center;
     margin-bottom: 7px;
     border-radius: 100%;
     color: white;
 }
 .word-small-title {
   flex: 0 0 26%;
 }
 .df-small-title {
   flex: 0 0 10%;
 }
 .aw-small-title {
   flex: 0 0 50%;
 }
 .color-axis-block {
   height: 36px;
   width: 100%;

 }
 .triangle {
   width: 0;
   height: 0;
   border-width: 5px;
   border-style: solid;
   border-color: #fa39aa transparent transparent transparent;
   position: relative;
   }
.pred {
    color: #fa39aa;
    font-size: 15px;
    position: absolute;
    top: -11px;
    left: 10px;
    cursor: hover;
    width: 500px;
    z-index: 100;
  }
 .color-axis-inner {
   display: flex;
   justify-content: space-around;
 }
 .color-text-inner {
   display: flex;
   justify-content: space-between;
 }
 .color-text {
   height: 10px;
   font-size: 5px;
   color: #6D6D6D;
   /* margin-right: 2px; */
   padding-left: 5px;
 }
 /* .color-text-0 {
   margin-right: 2px;
 }
 .color-text-25 {
   margin-right: 6px;
 }
 .color-text-50 {
   margin-right: 10px;
 } */
 /* .color-text-75 {
   width: calc(25% - 1px);
 } */
 .color-axis {
   height: 10px;
   width: calc(25% - 2px);
   margin-right: 2px;
 }
 .color-axis-0 {
   background-color: rgb(255, 255, 255); /* For browsers that do not support gradients */
   background-image: linear-gradient(to right, rgb(255, 255, 255) , rgb(238, 204, 252));
 }
 .color-axis-25 {
   background-color: rgb(238, 204, 252); /* For browsers that do not support gradients */
   background-image: linear-gradient(to right, rgb(238, 204, 252) , rgb(220, 153, 249));
 }
  .color-axis-50 {
   background-color: rgb(220, 153, 249); /* For browsers that do not support gradients */
   background-image: linear-gradient(to right, rgb(220, 153, 249) , rgb(203, 102, 245));
 }
 .color-axis-75 {
   background-color: rgb(255, 155, 125); /* For browsers that do not support gradients */
   background-image: linear-gradient(to right, rgb(203, 102, 245) , rgb(185, 51, 242));
 }
</style>
