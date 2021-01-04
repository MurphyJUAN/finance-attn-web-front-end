<template>
    <div class="reportContainer">

        <div class="meta-info">
        <div class="report-name">
          <div>
          <h2 class="bold-class">{{metaInfo.name}} </h2>
          <div class="bold-class" style="width: 100%">{{metaInfo.date}}</div>
          </div>
          <div v-if="name==='compared'" class="closeCross" @click="closeSingleFinPage">x</div>
        </div>


        <div
        :aria-expanded="infoVisible ? 'true' : 'false'"
        :aria-controls="`collapse-1-${this.name}`"
        @click="infoVisible = !infoVisible"
        class="collapse-item">
          <h5 class="bold-class collapse-title">General Information</h5>
          <img class="arrow" src="../assets/arrow.svg" />
        </div>
        <b-collapse :id="`collapse-1-${name}`" v-model="infoVisible" class="mt-2">
          <div class="meta-box">
            <div class="meta-detail">
              <h5>Post Return Volitility: {{metaInfo.volatility}}%</h5>
              <!-- <h5>Word Composition: 50% financial words</h5> -->
              <h5>
                  <h5 class="inline-class">Top 5 High Attention Words: </h5>
                  <h5 v-for="(item, idx) in DataInfo.wordsData" v-if="idx<5" class="inline-class top-5-words"
                  :class="{
                    color0: idx === 0,
                    color1: idx === 1,
                    color2: idx === 2,
                    color3: idx === 3,
                    color4: idx === 4,
                    clickedRiskyWord: idx === clickedWord.idx
                  }"

                  @click="clickedRiskyWords(idx, item['word'])">
                      {{item['word']}}
                  </h5>
              </h5>
            </div>
            <div :class="getPrClass()">{{triangleOffset}}</div>
          </div>

        </b-collapse>


        </div>

        <!-- <div class="stock">
            <div
            :aria-expanded="priceVisible ? 'true' : 'false'"
            :aria-controls="`collapse-2-${name}`"
            @click="priceVisible = !priceVisible"
            class="collapse-item">
              <h5 class="bold-class collapse-title">Price Changes</h5>
              <img class="arrow" src="../assets/arrow.svg" />
            </div>
            <b-collapse :id="`collapse-2-${name}`"  v-model="priceVisible" class="mt-2">
              <div class="stock-block"></div>
            </b-collapse>
        </div> -->

        <div class="report-text">
          <div
            class="collapse-item"
            :aria-expanded="reportVisible ? 'true' : 'false'"
            :aria-controls="`collapse-3-${name}`"
            @click="reportVisible = !reportVisible"
        >
          <h5 class="bold-class collapse-title">Financial Statement</h5>
          <img class="arrow" src="../assets/arrow.svg" />
        </div>
          <b-collapse :id="`collapse-3-${name}`"  v-model="reportVisible" class="mt-2">
              <div class="viz-block">
                <div :class="`viz__box-plot-${name}`"></div>
                <div class="viz-title">Sentence Weight Box Plot:&nbsp(Highlight sentences by their sentence attention weight)</div>
              </div>
              <span  v-for="(sentences, idxS) in DataInfo.sentencesData">
                <!-- checkHighlight(sentences.value, word, idxS), -->
                <!-- number: {{firstTitleStopIndex}} -->
                <div
                :class="{
                  contentText: true,
                  highlight: checkHighlight(sentences.value, word, idxS),
                  breakWord: word==='FredSam',
                  color0: clickedWord.idx === 0 && word.toLowerCase().indexOf(clickedWord.target)>=0,
                  color1: clickedWord.idx === 1 && word.toLowerCase().indexOf(clickedWord.target)>=0,
                  color2: clickedWord.idx === 2 && word.toLowerCase().indexOf(clickedWord.target)>=0,
                  color3: clickedWord.idx === 3 && word.toLowerCase().indexOf(clickedWord.target)>=0,
                  color4: clickedWord.idx === 4 && word.toLowerCase().indexOf(clickedWord.target)>=0,
                  fontBold: idxS===0 && idxW<firstTitleStopIndex
                  }"
                  v-for="(word, idxW) in sentences.sentence">
                  <span v-if="idxS==0&&idxW==0&&word!=='ITEM 7.'">Item7.</span>{{word}}
                </div>
              </span>
          </b-collapse>

        </div>

    </div>

</template>

<script>

import NavBar from './NavBar';
import NewNavBar from './NewNavBar';
import axios from 'axios';
import SelectReport from './SelectReport';
import * as d3 from 'd3';

const baseURL = 'https://clip.csie.org/HIVEBACK/api';
export default {
  name: 'PageItem',
  components: {
    NavBar,
    NewNavBar,
    SelectReport,
  },
  // pageStatus:0->single, 1->compare
  props: ['similarity', 'name', 'DataInfo', 'metaInfo', 'triangleOffset', 'sentenceAverageWeight', 'sentenceValueArray', 'pageStatus', 'firstTitleStopIndex'],
  data() {
    return {
      infoVisible: true,
      priceVisible: true,
      isClose: false,
      reportVisible: true,
      clickedCircleItem: 'q3',
      mutableAverageWeight: JSON.parse(this.sentenceAverageWeight),
      clickedWord: {
        idx: -1,
        target: 'none',
      },

    };
  },
  methods: {
    checkHighlight(sv, word, idxS) {
      if (idxS > 0 && sv >= this.mutableAverageWeight && word !== this.clickedWord[1]) {
        return true;
      }
      return false;
    },
    clickedRiskyWords(idx, word) {
      if (this.clickedWord.idx !== idx) {
        this.clickedWord.idx = idx;
        this.clickedWord.target = word;
      } else {
        this.clickedWord = {
          idx: -1,
          target: 'none',
        };
      }
    },
    getPrClass() {
      const pr = parseFloat(this.triangleOffset);
      if (pr <= 25) {
        return {
          prLevel: true,
          prLevelLow: true,
          prLevelMid: false,
          prLevelHigh: false,
        };
      } else if (pr > 25 && pr <= 50) {
        return {
          prLevel: true,
          prLevelLow: false,
          prLevelMid: true,
          prLevelHigh: false,
        };
      }
      return {
        prLevel: true,
        prLevelLow: false,
        prLevelMid: false,
        prLevelHigh: true,
      };
    },
    buildBoxPlot() {
      let data = this.sentenceValueArray;
      let sortedData = [...data].sort((a, b) => d3.ascending(a, b));

      // statistics
      let min = d3.min(data);
      let q1 = d3.quantile(sortedData, 0.25);
      let median = d3.median(data);
      let q3 = d3.quantile(sortedData, 0.75);
      let max = d3.max(data);
      // create a formatting function to show only three digits after the decimal point
      // let format = d3.format('.3f');

      let IQR = q3 - q1;
      // the line is drawn from (q1 - IQR *1.5) to (q3 + IQR *1.5)
      // cap the values to the minimum/maximum data points
      let minBoxPlot = Math.max(q1 - IQR * 1.5, min);
      let maxBoxPlot = Math.min(q3 + IQR * 1.5, max);

      console.log('--data length', data.length);

      data = data.filter(dataPoint => dataPoint <= maxBoxPlot || dataPoint >= minBoxPlot);

      console.log('--data length', data.length);
      console.log(data);

      sortedData = [...data].sort((a, b) => d3.ascending(a, b));
      // statistics
      min = d3.min(data);
      q1 = d3.quantile(sortedData, 0.25);
      median = d3.median(data);
      q3 = d3.quantile(sortedData, 0.75);
      max = d3.max(data);
      // create a formatting function to show only three digits after the decimal point
      // format = d3.format('.3f');

      IQR = q3 - q1;
      // the line is drawn from (q1 - IQR *1.5) to (q3 + IQR *1.5)
      // cap the values to the minimum/maximum data points
      minBoxPlot = Math.max(q1 - IQR * 1.5, min);
      maxBoxPlot = Math.min(q3 + IQR * 1.5, max);

      const verticalMargin = 15;
      const margin = {
        top: verticalMargin,
        right: 100,
        bottom: verticalMargin,
        left: 100,
      };

      const width = 500 + (margin.left + margin.right);
      const height = 25 + (margin.top + margin.bottom);

      // base the horizontal scale on the minimum and maximum data points
      // ! the vertical scale is defined for the histogram once the bins are created, since it's based on the bins' sizes
      const xScale = d3
        .scaleLinear()
        .domain([minBoxPlot, maxBoxPlot])
        .range([0, width]);
        // .nice();

      console.log('1: minBox, q1, median, q3, maxBoxPlot', xScale(minBoxPlot), xScale(q1), xScale(median), xScale(q3), xScale(maxBoxPlot));
      console.log('1: minBox, q1, median, q3, maxBoxPlot', (minBoxPlot), (q1), (median), (q3), (maxBoxPlot));
      console.log(d3.extent(data));


      const vizBoxPlot = d3
        .select(`.viz__box-plot-${this.name}`);

      // describe the size of the box plot to be at most half the height of the visualization
      const boxHeight = 10;

      const blueColor = 'rgb(56, 33, 167)';
      const yellowColor = 'rgb(255, 248, 138)';

      // //////Control Clicked Circle Style

      const clickedCircleWidth = 3;

      const clickedCircleRadius = 7;

      const clickedSmallCircleRadius = 4;

      const clickedCircleColor = 'white';

      const clickedCircleStrokeColor = 'rgb(56,33,167)';

      const vizBlockWidth = document.getElementsByClassName('viz-block')[0].clientWidth;

      // ////////////////////

      const svgBoxPlot = vizBoxPlot
        .append('svg')
        .attr('width', `${vizBlockWidth}`)
        .attr('height', `${height + (margin.top + margin.bottom)}`)
        .attr('viewBox', `0 0 ${width + (margin.left + margin.right)} ${height + (margin.top + margin.bottom)}`);

      // translate the group to vertically center the box plot elements
      const groupBoxPlot = svgBoxPlot
        .append('g')
        .attr('transform', `translate(${margin.left} ${margin.top + height / 2})`);

      // draw a line considering the interquartile range (q1 - iqr*1.5, q3 + iqr *1.5)
      // where the interquartile range is (q3 - q1)


      // Normalize
      const offsetRange = [q1 - minBoxPlot, median - q1, q3 - median, maxBoxPlot - q3];
      // const maxRange = d3.maxIndex(offsetRange);
      if (xScale(q1 - minBoxPlot) < 40) {
        const offset = 40 - xScale(q1 - minBoxPlot);
        q1 += xScale.invert(offset);
      }
      if (xScale(median - q1) < 40) {
        const offset = 40 - xScale(median - q1);
        median += xScale.invert(offset);
      }
      if (xScale(q3 - median) < 40) {
        const offset = 40 - xScale(q3 - median);
        q3 += xScale.invert(offset);
      }
      if (xScale(maxBoxPlot - q3) < 40) {
        const offset = 40 - xScale(maxBoxPlot - q3);
        maxBoxPlot += xScale.invert(offset);
      }


      // --- min rect---
      groupBoxPlot
        .append('rect')
        .attr('x', xScale(minBoxPlot))
        .attr('width', xScale(q1) - xScale(minBoxPlot))
        .attr('y', -boxHeight / 2)
        .attr('height', boxHeight)
        .attr('fill', 'rgb(56,33,167)')
        .attr('class', `rectMin-${this.name}`);
      // ---max rec---
      groupBoxPlot
        .append('rect')
        .attr('x', xScale(q3))
        .attr('width', xScale(maxBoxPlot) - xScale(q3))
        .attr('y', -boxHeight / 2)
        .attr('height', boxHeight)
        .attr('fill', `${yellowColor}`)
        .attr('class', `rectMax-${this.name}`);

      // ---min path---
      // groupBoxPlot
      //   .append('path')
      //   .attr('fill', 'none')
      //   .attr('stroke', 'currentColor')
      //   .attr('stroke-width', '1')
      //   .attr('class', 'path1')
      //   .attr('d', `M ${xScale(minBoxPlot)} 0 H ${xScale(q1)}`);

      // ---max path---
      // groupBoxPlot
      //   .append('path')
      //   .attr('fill', 'none')
      //   .attr('stroke', 'rgb(211, 188, 41)')
      //   .attr('stroke-width', '1')
      //   .attr('class', 'path2')
      //   .attr('d', `M ${xScale(q3)} 0 H ${xScale(maxBoxPlot)}`);

      groupBoxPlot
        .append('path')
        .attr('fill', 'none')
        .attr('stroke', 'currentColor')
        .attr('stroke-width', '1')
        .attr('d', `M ${xScale(minBoxPlot)} ${-verticalMargin} V ${verticalMargin}`);

      groupBoxPlot
        .append('path')
        .attr('fill', 'none')
        .attr('stroke', 'currentColor')
        .attr('stroke-width', '1')
        .attr('d', `M ${xScale(maxBoxPlot)} ${-verticalMargin} V ${verticalMargin}`);

      // ---min circle---
      groupBoxPlot
        .append('circle')
        .attr('cx', `${xScale(minBoxPlot)}`)
        .attr('cy', 0)
        .attr('r', `${clickedSmallCircleRadius}`)
        .attr('fill', `${clickedCircleColor}`)
        .attr('stroke', `${blueColor}`)
        .attr('stroke-width', `${clickedCircleWidth}`)
        .attr('class', `minCircle-${this.name}`)
        .on('click', (d) => {
          if (this.clickedCircleItem !== 'min') {
            this.clickedCircleItem = 'min';
            this.mutableAverageWeight = minBoxPlot;
            // 激活中
            d3.selectAll(`.minCircle-${this.name}`)
              .transition()
              .duration(500)
              .attr('r', `${clickedSmallCircleRadius + 2}`)
              .attr('stroke-width', `${clickedCircleWidth + 2}`)
              .attr('stroke', `${yellowColor}`);

            d3.selectAll(`.q1Circle-${this.name}, .q2Circle-${this.name}, .q3Circle-${this.name}`)
              .transition()
              .duration(500)
              .attr('r', `${clickedCircleRadius}`)
              .attr('stroke-width', `${clickedCircleWidth}`)
              .attr('stroke', `${yellowColor}`);

            d3.selectAll(`.maxCircle-${this.name}`)
              .transition()
              .duration(500)
              .attr('r', `${clickedSmallCircleRadius}`)
              .attr('stroke-width', `${clickedCircleWidth}`)
              .attr('stroke', `${yellowColor}`);
            d3.selectAll(`.rectMin-${this.name}, .rect1-${this.name}, .rect2-${this.name}, .rectMax-${this.name}`)
              .transition()
              .duration(500)
              .attr('stroke', `${yellowColor}`)
              .attr('fill', `${yellowColor}`);
            d3.selectAll(`.q1Text-${this.name}, .q2Text-${this.name}, .q3Text-${this.name}`)
              .transition()
              .duration(500)
              .attr('font-weight', 400);
          } else {
            this.clickedCircleItem = '';
            this.mutableAverageWeight = 100;
            d3.selectAll(`.q1Circle-${this.name}, .q2Circle-${this.name}, .q3Circle-${this.name}`)
              .transition()
              .duration(500)
              .attr('r', `${clickedCircleRadius}`)
              .attr('stroke-width', `${clickedCircleWidth}`)
              .attr('stroke', `${blueColor}`);
            d3.selectAll(`.minCircle-${this.name}, .maxCircle-${this.name}`)
              .transition()
              .duration(500)
              .attr('r', `${clickedSmallCircleRadius}`)
              .attr('stroke-width', `${clickedCircleWidth}`)
              .attr('stroke', `${blueColor}`);
            d3.selectAll(`.q1Text-${this.name}, .q2Text-${this.name}, .q3Text-${this.name}`)
              .transition()
              .duration(500)
              .attr('font-weight', 400);
            d3.selectAll(`.rect1-${this.name}, .rect2-${this.name}`)
              .transition()
              .duration(500)
              .attr('fill', `${blueColor}`);
            d3.selectAll(`.rectMin-${this.name}, .rectMax-${this.name}`)
              .transition()
              .duration(500)
              .attr('fill', `${blueColor}`);
          }
        })
        .on('mouseover', (d) => {
          if (this.clickedCircleItem !== 'min') {
            d3.select(`.minCircle-${this.name}`)
              .transition()
              .duration(500)
              .attr('r', `${clickedSmallCircleRadius + 2}`)
              .attr('stroke-width', `${clickedCircleWidth + 2}`);
          }
        })
        .on('mouseout', (d) => {
          if (this.clickedCircleItem !== 'min') {
            d3.select(`.minCircle-${this.name}`)
              .transition()
              .duration(500)
              .attr('r', `${clickedSmallCircleRadius}`)
              .attr('stroke-width', `${clickedCircleWidth}`);
          }
        });
      // ---max circle---
      groupBoxPlot
        .append('circle')
        .attr('cx', `${xScale(maxBoxPlot)}`)
        .attr('cy', 0)
        .attr('r', `${clickedSmallCircleRadius}`)
        .attr('fill', `${clickedCircleColor}`)
        .attr('stroke', `${yellowColor}`)
        .attr('stroke-width', `${clickedCircleWidth}`)
        .attr('class', `maxCircle-${this.name}`)
        .on('click', (d) => {
          if (this.clickedCircleItem !== 'max') {
            this.clickedCircleItem = 'max';
            this.mutableAverageWeight = maxBoxPlot;
            // 激活中
            d3.selectAll(`.maxCircle-${this.name}`)
              .transition()
              .duration(500)
              .attr('r', `${clickedSmallCircleRadius + 2}`)
              .attr('stroke-width', `${clickedCircleWidth + 2}`)
              .attr('stroke', `${yellowColor}`);

            d3.selectAll(`.q1Circle-${this.name}, .q2Circle-${this.name}, .q3Circle-${this.name}`)
              .transition()
              .duration(500)
              .attr('r', `${clickedCircleRadius}`)
              .attr('stroke-width', `${clickedCircleWidth}`)
              .attr('stroke', `${blueColor}`);

            d3.selectAll(`.minCircle-${this.name}`)
              .transition()
              .duration(500)
              .attr('r', `${clickedSmallCircleRadius}`)
              .attr('stroke-width', `${clickedCircleWidth}`)
              .attr('stroke', `${blueColor}`);
            d3.selectAll(`.rectMin-${this.name}, .rect1-${this.name}, .rect2-${this.name}, .rectMax-${this.name}`)
              .transition()
              .duration(500)
              .attr('fill', `${blueColor}`);
            d3.selectAll(`.q1Text-${this.name}, .q2Text-${this.name}, .q3Text-${this.name}`)
              .transition()
              .duration(500)
              .attr('font-weight', 400);
          } else {
            this.clickedCircleItem = '';
            this.mutableAverageWeight = 100;
            d3.selectAll(`.q1Circle-${this.name}, .q2Circle-${this.name}, .q3Circle-${this.name}`)
              .transition()
              .duration(500)
              .attr('r', `${clickedCircleRadius}`)
              .attr('stroke-width', `${clickedCircleWidth}`)
              .attr('stroke', `${blueColor}`);
            d3.selectAll(`.minCircle-${this.name}, .maxCircle-${this.name}`)
              .transition()
              .duration(500)
              .attr('r', `${clickedSmallCircleRadius}`)
              .attr('stroke-width', `${clickedCircleWidth}`)
              .attr('stroke', `${blueColor}`);
            d3.selectAll(`.q1Text-${this.name}, .q2Text-${this.name}, .q3Text-${this.name}`)
              .transition()
              .duration(500)
              .attr('font-weight', 400);
            d3.selectAll(`.rect1-${this.name}, .rect2-${this.name}`)
              .transition()
              .duration(500)
              .attr('fill', `${blueColor}`);
            d3.selectAll(`.rectMin-${this.name}, .rectMax-${this.name}`)
              .transition()
              .duration(500)
              .attr('fill', `${blueColor}`);
          }
        })
        .on('mouseover', (d) => {
          if (this.clickedCircleItem !== 'max') {
            d3.select(`.maxCircle-${this.name}`)
              .transition()
              .duration(500)
              .attr('r', `${clickedSmallCircleRadius + 2}`)
              .attr('stroke-width', `${clickedCircleWidth + 2}`);
          }
        })
        .on('mouseout', (d) => {
          if (this.clickedCircleItem !== 'max') {
            d3.select(`.maxCircle-${this.name}`)
              .transition()
              .duration(500)
              .attr('r', `${clickedSmallCircleRadius}`)
              .attr('stroke-width', `${clickedCircleWidth}`);
          }
        });

      // draw a rectangle from q1 to q2
      groupBoxPlot
        .append('rect')
        .attr('x', xScale(q1))
        .attr('width', xScale(median) - xScale(q1))
        .attr('y', -boxHeight / 2)
        .attr('height', boxHeight)
        .attr('fill', 'rgb(56,33,167)')
        .attr('class', `rect1-${this.name}`);

      // draw a rectangle from q2 to q3
      groupBoxPlot
        .append('rect')
        .attr('x', xScale(median))
        .attr('width', xScale(q3) - xScale(median))
        .attr('y', -boxHeight / 2)
        .attr('height', boxHeight)
        .attr('fill', `${blueColor}`)
        .attr('class', `rect2-${this.name}`);

      // for the details of the boxplot, include a group to translate the elements at the desired coordinates
      // this to include connected elements in the same group

      // median: draw the line in the rectangle, a text element describing the purpose and a line connecting the two
      const medianBoxPlot = groupBoxPlot
        .append('g')
        .attr('transform', `translate(${xScale(median)} ${-(boxHeight / 2)})`);

      medianBoxPlot
        .append('path')
        .attr('fill', 'none')
        .attr('stroke', 'rgb(63,219,173)')
        .attr('stroke-width', 1)
        .attr('d', `M 0 0 v ${boxHeight}`);

      medianBoxPlot.on('click', () => {
        console.log('clickMedianBoxPlot');
        this.$emit('clickBoxPlot', median);
      });

      medianBoxPlot
        .append('text')
        .text('q2')
        .attr('x', 0)
        .attr('y', -verticalMargin + 5 - 2)
        .attr('text-anchor', 'middle')
        .attr('font-family', 'Georgia')
        .attr('font-weight', 400)
        .attr('font-size', '1.5rem')
        .attr('class', `q2Text-${this.name}`);

      const medianCircle = groupBoxPlot
        .append('g')
        .attr('transform', `translate(${xScale(median)} ${-(boxHeight / 2)})`);

      medianCircle
        .append('circle')
        .attr('cx', 0)
        .attr('cy', `${(boxHeight / 2)}`)
        .attr('r', `${clickedCircleRadius}`)
        .attr('fill', `${clickedCircleColor}`)
        .attr('stroke', `${blueColor}`)
        .attr('stroke-width', `${clickedCircleWidth}`)
        .attr('class', `q2Circle-${this.name}`)
        .on('click', (d) => {
          if (this.clickedCircleItem !== 'q2') {
            this.clickedCircleItem = 'q2';
            this.mutableAverageWeight = median;
            // 激活中
            d3.selectAll(`.q2Circle-${this.name}`)
              .transition()
              .duration(500)
              .attr('r', `${clickedCircleRadius + 2}`)
              .attr('stroke-width', `${clickedCircleWidth + 2}`)
              .attr('stroke', `${yellowColor}`);

            d3.selectAll(`.q3Circle-${this.name}`)
              .transition()
              .duration(500)
              .attr('r', `${clickedCircleRadius}`)
              .attr('stroke-width', `${clickedCircleWidth}`)
              .attr('stroke', `${yellowColor}`);

            d3.selectAll(`.maxCircle-${this.name}`)
              .transition()
              .duration(500)
              .attr('r', `${clickedSmallCircleRadius}`)
              .attr('stroke-width', `${clickedCircleWidth}`)
              .attr('stroke', `${yellowColor}`);

            d3.select(`.q2Text-${this.name}`)
              .transition()
              .duration(500)
              .attr('font-weight', 800);
            d3.selectAll(`.rect2-${this.name}, .rectMax-${this.name}`)
              .transition()
              .duration(500)
              .attr('fill', `${yellowColor}`);
            // 未被激活
            d3.select(`.q1Circle-${this.name}`)
              .transition()
              .duration(500)
              .attr('r', `${clickedCircleRadius}`)
              .attr('stroke-width', `${clickedCircleWidth}`)
              .attr('stroke', `${blueColor}`);
            d3.selectAll(`.q1Text-${this.name},.q3Text-${this.name}`)
              .transition()
              .duration(500)
              .attr('font-weight', 400);
            d3.selectAll(`.rect1-${this.name}, .rectMin-${this.name}`)
              .transition()
              .duration(500)
              .attr('fill', `${blueColor}`);
            d3.selectAll(`.minCircle-${this.name}`)
              .transition()
              .duration(500)
              .attr('r', `${clickedSmallCircleRadius}`)
              .attr('stroke-width', `${clickedCircleWidth}`)
              .attr('stroke', `${blueColor}`);
          } else {
            this.clickedCircleItem = '';
            this.mutableAverageWeight = 100;
            d3.selectAll(`.q1Circle-${this.name}, .q2Circle-${this.name}, .q3Circle-${this.name}`)
              .transition()
              .duration(500)
              .attr('r', `${clickedCircleRadius}`)
              .attr('stroke-width', `${clickedCircleWidth}`)
              .attr('stroke', `${blueColor}`);
            d3.selectAll(`.minCircle-${this.name}, .maxCircle-${this.name}`)
              .transition()
              .duration(500)
              .attr('r', `${clickedSmallCircleRadius}`)
              .attr('stroke-width', `${clickedCircleWidth}`)
              .attr('stroke', `${blueColor}`);
            d3.selectAll(`.q1Text-${this.name}, .q2Text-${this.name}, .q3Text-${this.name}`)
              .transition()
              .duration(500)
              .attr('font-weight', 400);
            d3.selectAll(`.rect1-${this.name}, .rect2-${this.name}`)
              .transition()
              .duration(500)
              .attr('fill', `${blueColor}`);
            d3.selectAll(`.rectMin-${this.name}, .rectMax-${this.name}`)
              .transition()
              .duration(500)
              .attr('fill', `${blueColor}`);
          }
        })
        .on('mouseover', (d) => {
          if (this.clickedCircleItem !== 'q2') {
            d3.select(`.q2Circle-${this.name}`)
              .transition()
              .duration(500)
              .attr('r', `${clickedCircleRadius + 2}`)
              .attr('stroke-width', `${clickedCircleWidth + 2}`);
          }
        })
        .on('mouseout', (d) => {
          if (this.clickedCircleItem !== 'q2') {
            d3.select(`.q2Circle-${this.name}`)
              .transition()
              .duration(500)
              .attr('r', `${clickedCircleRadius}`)
              .attr('stroke-width', `${clickedCircleWidth}`);
          }
        });

      // q1 and q3: include text elements and lines connecting the text to the matching values
      const q1BoxPlot = groupBoxPlot
        .append('g')
        .attr('transform', `translate(${xScale(q1)} 0)`);

      q1BoxPlot
        .append('text')
        .text('q1')
        .attr('x', 0)
        .attr('y', -verticalMargin - 2)
        .attr('text-anchor', 'middle')
        .attr('font-family', 'Georgia')
        .attr('font-size', '1.5rem')
        .attr('class', `q1Text-${this.name}`);

      const q1Circle = groupBoxPlot
        .append('g')
        .attr('transform', `translate(${xScale(q1)} 0)`);

      q1Circle
        .append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', `${clickedCircleRadius}`)
        .attr('fill', `${clickedCircleColor}`)
        .attr('stroke', `${clickedCircleStrokeColor}`)
        .attr('stroke-width', `${clickedCircleWidth}`)
        .attr('class', `q1Circle-${this.name}`)
        .on('click', (d) => {
          if (this.clickedCircleItem !== 'q1') {
            this.clickedCircleItem = 'q1';
            this.mutableAverageWeight = q1;
            // ---激活中---
            // 控制自己的按鈕與字的顏色
            d3.selectAll(`.q1Circle-${this.name}`)
              .transition()
              .duration(500)
              .attr('r', `${clickedCircleRadius + 2}`)
              .attr('stroke-width', `${clickedCircleWidth + 2}`)
              .attr('stroke', `${yellowColor}`);

            d3.selectAll(`.q2Circle-${this.name}, .q3Circle-${this.name}`)
              .transition()
              .duration(500)
              .attr('r', `${clickedCircleRadius}`)
              .attr('stroke-width', `${clickedCircleWidth}`)
              .attr('stroke', `${yellowColor}`);

            d3.selectAll(`.maxCircle-${this.name}`)
              .transition()
              .duration(500)
              .attr('stroke', `${yellowColor}`);

            d3.select(`.q1Text-${this.name}`)
              .transition()
              .duration(500)
              .attr('font-weight', 800);
            // 控制 q2, q3 的字的狀態
            d3.selectAll(`.q2Text-${this.name}, .q3Text-${this.name}`)
              .transition()
              .duration(500)
              .attr('font-weight', 400);
            // 控制 rect1, rect2 的狀態
            d3.selectAll(`.rect1-${this.name}, .rect2-${this.name}, .rectMax-${this.name}`)
              .transition()
              .duration(500)
              .attr('fill', `${yellowColor}`);
            // ---未被激活---
            d3.selectAll(`.rectMin-${this.name}`)
              .transition()
              .duration(500)
              .attr('fill', `${blueColor}`);
            d3.selectAll(`.minCircle-${this.name}`)
              .transition()
              .duration(500)
              .attr('r', `${clickedSmallCircleRadius}`)
              .attr('stroke-width', `${clickedCircleWidth}`)
              .attr('stroke', `${blueColor}`);
          } else {
            this.clickedCircleItem = '';
            this.mutableAverageWeight = 100;

            d3.selectAll(`.q1Circle-${this.name}, .q2Circle-${this.name}, .q3Circle-${this.name}`)
              .transition()
              .duration(500)
              .attr('r', `${clickedCircleRadius}`)
              .attr('stroke-width', `${clickedCircleWidth}`)
              .attr('stroke', `${blueColor}`);
            d3.selectAll(`.minCircle-${this.name}, .maxCircle-${this.name}`)
              .transition()
              .duration(500)
              .attr('r', `${clickedSmallCircleRadius}`)
              .attr('stroke-width', `${clickedCircleWidth}`)
              .attr('stroke', `${blueColor}`);
            d3.selectAll(`.q1Text-${this.name}, .q2Text-${this.name}, .q3Text-${this.name}`)
              .transition()
              .duration(500)
              .attr('font-weight', 400);
            d3.selectAll(`.rect1-${this.name}, .rect2-${this.name}`)
              .transition()
              .duration(500)
              .attr('fill', `${blueColor}`);
            d3.selectAll(`.rectMin-${this.name}, .rectMax-${this.name}`)
              .transition()
              .duration(500)
              .attr('fill', `${blueColor}`);
          }
        })
        .on('mouseover', (d) => {
          if (this.clickedCircleItem !== 'q1') {
            d3.select(`.q1Circle-${this.name}`)
              .transition()
              .duration(500)
              .attr('r', `${clickedCircleRadius + 2}`)
              .attr('stroke-width', `${clickedCircleWidth + 2}`);
          }
        })
        .on('mouseout', (d) => {
          if (this.clickedCircleItem !== 'q1') {
            d3.select(`.q1Circle-${this.name}`)
              .transition()
              .duration(500)
              .attr('r', `${clickedCircleRadius}`)
              .attr('stroke-width', `${clickedCircleWidth}`);
          }
        });


      // q1BoxPlot.on('click', () => {
      //   console.log('clickq1BoxPlot');
      //   this.$emit('clickBoxPlot', q1);
      // });

      const q3BoxPlot = groupBoxPlot
        .append('g')
        .attr('transform', `translate(${xScale(q3)} 0)`);

      q3BoxPlot
        .append('text')
        .text('q3')
        .attr('x', 0)
        .attr('y', -verticalMargin - 2)
        .attr('text-anchor', 'middle')
        .attr('font-family', 'Georgia')
        .attr('font-size', '1.5rem')
        .attr('font-weight', 800)
        .attr('class', `q3Text-${this.name}`);

      const q3Circle = groupBoxPlot
        .append('g')
        .attr('transform', `translate(${xScale(q3)} 0)`);

      q3Circle
        .append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', `${clickedCircleRadius + 2}`)
        .attr('fill', `${clickedCircleColor}`)
        .attr('stroke', `${yellowColor}`)
        .attr('stroke-width', `${clickedCircleWidth + 2}`)
        .attr('class', `q3Circle-${this.name}`)
        .on('click', (d) => {
          if (this.clickedCircleItem !== 'q3') {
            this.clickedCircleItem = 'q3';
            this.mutableAverageWeight = q3;
            console.log('---q3---', q3);
            console.log('----this.mutableAverageWeight----', this.mutableAverageWeight);
            // ---激活中 ---
            d3.select(`.q3Circle-${this.name}`)
              .transition()
              .duration(500)
              .attr('r', `${clickedCircleRadius + 2}`)
              .attr('stroke-width', `${clickedCircleWidth + 2}`)
              .attr('stroke', `${yellowColor}`);

            d3.select(`.maxCircle-${this.name}`)
              .transition()
              .duration(500)
              .attr('stroke', `${yellowColor}`);
            d3.select(`.q3Text-${this.name}`)
              .transition()
              .duration(500)
              .attr('font-weight', 800);
            d3.select(`.rectMax-${this.name}`)
              .transition()
              .duration(500)
              .attr('fill', `${yellowColor}`);

            // 未被激活
            d3.selectAll(`.q1Circle-${this.name}, .q2Circle-${this.name}`)
              .transition()
              .duration(500)
              .attr('r', `${clickedCircleRadius}`)
              .attr('stroke-width', `${clickedCircleWidth}`)
              .attr('stroke', `${blueColor}`);
            d3.selectAll(`.q1Text-${this.name}, .q2Text-${this.name}`)
              .transition()
              .duration(500)
              .attr('font-weight', 400);
            d3.selectAll(`.rect1-${this.name}, .rect2-${this.name}`)
              .transition()
              .duration(500)
              .attr('fill', `${blueColor}`);
            d3.select(`.rectMin-${this.name}`)
              .transition()
              .duration(500)
              .attr('fill', `${blueColor}`);
            d3.selectAll(`.minCircle-${this.name}`)
              .transition()
              .duration(500)
              .attr('r', `${clickedSmallCircleRadius}`)
              .attr('stroke-width', `${clickedCircleWidth}`)
              .attr('stroke', `${blueColor}`);
          } else {
            this.clickedCircleItem = '';
            this.mutableAverageWeight = 100;

            d3.selectAll(`.q1Circle-${this.name}, .q2Circle-${this.name}, .q3Circle-${this.name}`)
              .transition()
              .duration(500)
              .attr('r', `${clickedCircleRadius}`)
              .attr('stroke-width', `${clickedCircleWidth}`)
              .attr('stroke', `${blueColor}`);
            d3.selectAll(`.minCircle-${this.name}, .maxCircle-${this.name}`)
              .transition()
              .duration(500)
              .attr('r', `${clickedSmallCircleRadius}`)
              .attr('stroke-width', `${clickedCircleWidth}`)
              .attr('stroke', `${blueColor}`);
            d3.selectAll(`.q1Text-${this.name}, .q2Text-${this.name}, .q3Text-${this.name}`)
              .transition()
              .duration(500)
              .attr('font-weight', 400);
            d3.selectAll(`.rect1-${this.name}, .rect2-${this.name}`)
              .transition()
              .duration(500)
              .attr('fill', `${blueColor}`);
            d3.selectAll(`.rectMin-${this.name}, .rectMax-${this.name}`)
              .transition()
              .duration(500)
              .attr('fill', `${blueColor}`);
          }
        })
        .on('mouseover', (d) => {
          if (this.clickedCircleItem !== 'q3') {
            d3.select(`.q3Circle-${this.name}`)
              .transition()
              .duration(500)
              .attr('r', `${clickedCircleRadius + 2}`)
              .attr('stroke-width', `${clickedCircleWidth + 2}`);
          }
        })
        .on('mouseout', (d) => {
          if (this.clickedCircleItem !== 'q3') {
            d3.select(`.q3Circle-${this.name}`)
              .transition()
              .duration(500)
              .attr('r', `${clickedCircleRadius}`)
              .attr('stroke-width', `${clickedCircleWidth}`);
          }
        });

      // outliers (if any): draw a circle, add a text element describing the point and a path connecting the two
      // values outside of the interquartile range
      // console.log('----data---', data.length);
      // const outliers = data.filter(dataPoint => dataPoint < minBoxPlot || (dataPoint > maxBoxPlot && dataPoint < breakPoint));
      // console.log('---outlier---', outliers.length, outliers);
      // // group to position the outliers
      // const outliersBoxPlot = groupBoxPlot
      //   .selectAll('g.outlier')
      //   .data(outliers)
      //   .enter()
      //   .append('g')
      //   .attr('class', 'outlier')
      //   .attr('transform', d => `translate(${xScale(d)} 0)`);

      // // circle, text and connecting line
      // outliersBoxPlot
      //   .append('circle')
      //   .attr('cx', 0)
      //   .attr('cy', 0)
      //   .attr('fill', 'transparent')
      //   .attr('stroke', 'gray')
      //   .attr('stroke-width', '1')
      //   .attr('class', 'outlier')
      //   .attr('r', 3);
    },
    closeSingleFinPage() {
      this.isClose = true;
      this.$emit('closeSingleFinPage', this.isClose, this.pageStatus);
    },
    colorPick(idx) {
      if (idx === 0) {
        return {
          color0: true,
        };
      } else if (idx === 1) {
        return {
          color1: true,
        };
      } else if (idx === 2) {
        return {
          color2: true,
        };
      } else if (idx === 3) {
        return {
          color3: true,
        };
      }
      return {
        color4: true,
      };
    },

  },
  created() {
    this.mutableAverageWeight = JSON.parse(this.sentenceAverageWeight);
  },
  computed: {
  },

  mounted() {
    console.log('---SentenceAverageArray---', this.sentenceValueArray);
    if (this.sentenceValueArray.length > 0) {
      d3.select(`.viz__box-plot-${this.name}`).select('svg').remove();
      this.buildBoxPlot();
    }
  },
  watch: {
    sentenceAverageWeight: {
      handler(n, o) {
        console.log('---!!!---', this.sentenceAverageWeight);
        this.mutableAverageWeight = JSON.parse(n);
      },
      deep: true,
    },
    sentenceValueArray: {
      handler(n, o) {
        console.log('===Got Data===');
        d3.select(`.viz__box-plot-${this.name}`).select('svg').remove();
        this.buildBoxPlot();
      },
      deep: true,
    },
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Assistant:wght@400;600&display=swap');
</style>
<style scoped>
* {
  transition: all 0.2s ease-out 0.2s;
}
.fontBold {
  font-weight: 800;
}
.reportContainer {
    padding: 0.5rem 1rem;
}
.bold-class {
    font-weight: 800;
}
.inline-class {
    display: inline-block;
}
.top-5-words {
    margin: 0rem 0.5rem;
    padding: 0rem 0.5rem;
    background: red;
    border-radius: 20px;
    cursor: pointer;
    box-shadow: 2px 3px rgb(167, 166, 166);
}
.top-5-words:hover {
  /* opacity: 0.8; */
  box-shadow: inset 0 0 10px rgb(85, 85, 85);
}
.clickedRiskyWord {
  box-shadow: inset 0 0 10px rgb(85, 85, 85);
}
.stock-block {
  height: 10rem;
  width: 100％;
  background: grey;
  opacity: 0.6;
}
.highlight {
  background: #FFF98A;
}
.prLevel {
  width: 6rem;
  height: 6rem;
  border-radius: 100%;
  /* position: absolute;
  right: 2rem;
  top: 10rem; */
  text-align: center;
  color: white;
  line-height: 6rem;
  font-size: 2rem;
}
.prLevelLow {
  background: #FA4A4A;
}
.prLevelMid {
  background: rgb(246, 171, 9);
}
.prLevelHigh {
  background: #4FC83C;
}
.contentText {
  padding-right: 0.3rem;
  display: inline-block;
}
.report-text {
  margin-top: 1rem;
}
.report-name{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.closeCross {
  width: 6rem;
  /* height: 6rem; */
  /* position: absolute;
  right: 2rem;
  top: 5rem; */
  text-align: center;
  /* line-height: 6rem; */
  font-size: 1.5rem;
  color: #737373;
  cursor: pointer;
}
.showPage {
  display: block;
}
.hidePage {
  display: none;
}
.arrow {
  width: 1rem;
  height: 1rem;
}
.collapse-item {
  display: inline-block;
  cursor: pointer;
}
.collapse-title {
  display: inline-block;
  padding-right: 1rem;
}
.collapse-item:focus,
.collapse-item:active:focus,
.collapse-item.active:focus,
.collapse-item.focus,
.collapse-item:active.focus,
.collapse-item.active.focus {
  outline: none;
  border-color: transparent;
  box-shadow:none;
}

.color4 {
  background: #FFC107;
}
.color3 {
  background: #FFB300;
}
.color2 {
  background: #FFA000;
}
.color1 {
  background: #FF8F00;
}
.color0 {
  background: #FF6F00;
}
.meta-box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.breakWord {
  opacity: 0;
  display: block;
  /* line-height: 0;
  height: 0; */
  width: 100%;
}
.viz-title{
  border-bottom: solid 1px gray;
}
/* g.outlier circle {
    fill: #fff;
    stroke: #aaa;
    fill-opacity: 0.2;
} */
.viz-block {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
}
</style>
