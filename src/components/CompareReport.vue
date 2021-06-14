<template>
<div class="single-report">
    <div v-if="overallSimilarity.length > 0" class='similarity-box'>
      <div>Overall Similarity: {{this.overallSimilarity}} % </div>
    </div>
    <NavBar title="Finance Report Name" v-on:companyIdFromNav="companyIdFromNav" />
    <!-- <NewNavBar
    v-on:clickReportTabFromNav="clickReportTabFromNav"
    :whiteTheme="whiteTheme" /> -->
    <div class="pages-container">
        <div class="page">
            <PageItem
            name="ref"
    v-on:closeSingleFinPage="closeSingleFinPage"
    :DataInfo="DataInfo" :metaInfo="metaInfo" :triangleOffset="triangleOffset"
    :sentenceAverageWeight="sentenceAverageWeight"
    :sentenceValueArray="sentenceValueArray"
    v-on:clickBoxPlot="clickBoxPlot"
    :similarity="overallSimilarity"
    :firstTitleStopIndex="firstTitleStopIndex"
    :stockInfo="stockInfo"
    :isStockLoading="isStockLoading"
    :pageStatus=1 />
        </div>
        <div class="page">
            <PageItem
            name="compared"
            v-if="hasComparedReport"
    v-on:closeSingleFinPage="closeSingleFinPageFromComparedPage"
    :DataInfo="comparedDataInfo" :metaInfo="comparedMetaInfo" :triangleOffset="comparedTriangleOffset"
    :sentenceAverageWeight="comparedSentenceAverageWeight"
    :sentenceValueArray="comparedSentenceValueArray"
    v-on:clickBoxPlot="clickBoxPlotCOmpared"
    :similarity="overallSimilarity"
    :firstTitleStopIndex="comparedFirstTitleStopIndex"
    :stockInfo="comparedStockInfo"
    :isStockLoading="isComparedStockLoading"
    :pageStatus=1 />
            <RecommentItem
            v-if="!hasComparedReport"
            :similarReportList="similarReportList"
            :similarSectorReportList="similarSectorReportList"
            v-on:selectComparedReport="selectComparedReport"
            v-on:closeRecPage="closeRecPage"/>
        </div>
    </div>

    </div>

</div>
</template>

<script>

import NavBar from './NavBar';
import NewNavBar from './NewNavBar';
import axios from 'axios';
import SelectReport from './SelectReport';
import PageItem from './PageItem';
import RecommentItem from './RecommentItem';
import * as d3 from 'd3';
import companyList from '../assets/csvjson.json';

const baseURL = 'https://clip.csie.org/HIVEBACK/api';
export default {
  name: 'CompareReport',
  components: {
    NavBar,
    NewNavBar,
    SelectReport,
    PageItem,
    RecommentItem,
  },
  data() {
    return {
      whiteTheme: false,
      selectedCompanyId: '',
      selectedCompanyIdFromNav: '',
      routeFlag: 'id',
      file: null,
      isSelectorError: false,
      isError: false,
      isLoading: true,
      isStockLoading: false,
      isComparedStockLoading: false,
      selectedComparedCompanyId: '',
      comparedMetaInfo: {},
      comparedDataInfo: {
        sentencesData: [],
        wordsData: [],
      },
      comparedTriangleOffset: 0,
      comparedSentenceAverageWeight: 0,
      comparedSentenceValueArray: [],
      metaInfo: {},
      DataInfo: {
        sentencesData: [],
        wordsData: [],
      },
      triangleOffset: 0,
      sentenceAverageWeight: 0,
      hasComparedReport: false,
      sentenceValueArray: [],
      overallSimilarity: '',
      comparedFirstTitleStopIndex: -1,
      firstTitleStopIndex: -1,
      similarReportList: [],
      similarSectorReportList: [],
      stockInfo: {
        name: '',
        price: [],
        volume: [],
      },
      comparedStockInfo: {
        name: '',
        price: [],
        volume: [],
      },
    };
  },
  methods: {
    clickBoxPlot(value) {
      console.log('---value---', value);
      this.sentenceAverageWeight = value;
      console.log('---valu2---', this.sentenceAverageWeight);
    },
    clickBoxPlotCOmpared(value) {
      console.log('---value---', value);
      this.omparedSentenceAverageWeight = value;
      console.log('---valu2---', this.sentenceAverageWeight);
    },
    companyIdFromNav(selectedCompanyId, navFile) {
      // childValue就是子组件传过来的值
      this.selectedCompanyId = selectedCompanyId;
      console.log(navFile);
      if (navFile) {
        this.routeFlag = 'file';
        this.file = navFile;
        this.isSelectorError = false;
        console.log('---Get file from NavBar-----');
        this.getDataInfo();
      } else if (this.selectedCompanyId) {
        this.routeFlag = 'id';
        this.isSelectorError = false;
        this.getDataInfo();
      } else {
        this.isSelectorError = true;
        this.isError = true;
      }
    },
    compareWeight(a, b) {
      if (a.avgWeight > b.avgWeight) {
        return -1;
      }
      if (a.avgWeight < b.avgWeight) {
        return 1;
      }
      return 0;
    },
    getComparedDataInfo() {
      this.isLoading = true;
      this.isError = false;
      this.comparedDataInfo = {
        sentencesData: [],
        wordsData: [],
      };
      this.comparedMetaInfo = {};
      this.comparedSentenceValueArray = [];
      this.comparedSentenceAverageWeight = 0;
      this.comparedStockInfo = {
        name: '',
        price: [],
        volume: [],
      };
      if (this.routeFlag === 'id') {
        if (this.selectedComparedCompanyId) {
          let path = `${baseURL}/metaInfo?filename=${this.selectedComparedCompanyId}`;
          axios
            .get(path)
            .then((response) => {
              const a = response.data.metaInfo;
              a.volatility = Math.round(Math.exp(parseFloat(response.data.volatility)) * 100);
              a.pr = response.data.PR;
              this.comparedTriangleOffset = Math.floor(a.pr);
              this.comparedMetaInfo = a;
              // fins stock symbol
              const company = this.comparedMetaInfo.name.trim().split(' ')[0];
              this.comparedStockInfo.name = this.comparedMetaInfo.name;
              let symbol = '';
              for (let i = 0; i < companyList.length; i += 1) {
                if (companyList[i].Name.toLowerCase().indexOf(company.toLowerCase()) !== -1) {
                  symbol = companyList[i].Symbol;
                  break;
                }
              }
              // Get stock data
              if (symbol.length > 0) {
                this.isStockLoading = true;
                const d1 = new Date(this.metaInfo.date);
                const d2 = new Date(d1);
                const d4 = new Date(d1);
                d4.setFullYear(d4.getFullYear() + 1);
                console.log('---date---', d4);
                d2.setFullYear(d2.getFullYear() - 1);
                console.log('---date---', d2);
                const t = new Date(d2).getTime() / 1000;
                const t2 = new Date(d4).getTime() / 1000;
                console.log('---date---', t, t2);

                const options = {
                  method: 'GET',
                  url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/get-histories',
                  params: {
                    symbol,
                    from: t,
                    to: t2,
                    events: 'div',
                    interval: '1d',
                    region: 'US',
                  },
                  headers: {
                    'x-rapidapi-key': '849af88f92mshab85a4adc3b97e2p13cc69jsn6ae5bed9ae55',
                    'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com',
                  },
                };

                // Yahoo Financial API
                axios.request(options).then((stockResponse) => {
                  const ohlc2 = [];
                  const volume2 = [];
                  const quote = stockResponse.data.chart.result[0].indicators.quote[0];
                  const myTimestamp = stockResponse.data.chart.result[0].timestamp;
                  console.log('---time len---', myTimestamp.length);
                  for (let i = 0; i < myTimestamp.length; i += 1) {
                    ohlc2.push([
                      myTimestamp[i] * 1000, // the date
                      quote.open[i],
                      quote.high[i],
                      quote.low[i],
                      quote.close[i],
                    ]);

                    volume2.push([
                      myTimestamp[i] * 1000, // the date
                      quote.volume[i], // the volume
                    ]);
                  }
                  this.comparedStockInfo.price = ohlc2;
                  this.comparedStockInfo.volume = volume2;
                  this.isComparedStockLoading = false;
                }).catch((error) => {
                  this.isComparedStockLoading = false;
                  console.error(error);
                });
              }


              axios
                .get(`${baseURL}/sentencesData?filename=${this.selectedComparedCompanyId}`)
                .then((responseSentence) => {
                  this.comparedDataInfo.sentencesData = responseSentence.data.sentencesData;
                  if (responseSentence.data.sentencesData) {
                    this.comparedDataInfo.sentencesData = responseSentence.data.sentencesData.filter(
                      item => item.sentence.indexOf('<TABLE>') === -1,
                    );
                  }
                  console.log('-------Test----', this.DataInfo.sentencesData[0].sentence.indexOf('FredSam'));
                  this.comparedFirstTitleStopIndex = this.comparedDataInfo.sentencesData[0].sentence.indexOf('FredSam');

                  console.log('---test---', this.comparedDataInfo.sentencesData);
                  if (this.comparedDataInfo.sentencesData) {
                    for (let y = 0; y < this.comparedDataInfo.sentencesData.length; y += 1) {
                      this.comparedSentenceValueArray.push(this.comparedDataInfo.sentencesData[y].value);
                      // this.comparedSentenceAverageWeight += this.comparedDataInfo.sentencesData[y].value;
                      const sentenceLen = this.comparedDataInfo.sentencesData[y].sentence.length;
                      this.comparedDataInfo.sentencesData[y].sentence[sentenceLen - 1] = `${this.comparedDataInfo.sentencesData[y].sentence[sentenceLen - 1]}.`;
                      // this.DataInfo.sentencesData[y].sentence.push('.');
                    }
                  }
                  console.log('----this.DataInfo.sentencesData----', this.DataInfo.sentencesData);
                  const sortedData = [...this.comparedSentenceValueArray].sort((a, b) => d3.ascending(a, b));
                  this.comparedSentenceAverageWeight = d3.quantile(sortedData, 0.75);
                  axios
                    .get(`${baseURL}/wordsData?filename=${this.selectedComparedCompanyId}`)
                    .then((responseWord) => {
                      this.comparedDataInfo.wordsData = responseWord.data.wordsData;
                      this.comparedDataInfo.wordsData.sort(this.compareWeight);
                      console.log('---this.DataInfo.wordsData---', this.comparedDataInfo.wordsData);
                      if (this.comparedDataInfo) {
                        this.isError = false;
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
          path = `${baseURL}/docs_similarity?filename1=${this.selectedCompanyId}&filename2=${this.selectedComparedCompanyId}`;
          axios
            .get(path)
            .then((response) => {
              console.log('----response----', response);
              const sim = (response.data.similarity * 100).toFixed(2);
              this.overallSimilarity = sim;
            })
            .catch((error) => {
              console.log(error);
            });
        }
      } else if (this.file) {
        this.isLoading = true;
        const path = 'https://clip.csie.org/HIVETEST/api/uploadFile';
        this.filedata.append('file', this.file);
        axios
          .post(path, this.filedata)
          .then((response) => {
            this.comparedDataInfo.sentencesData = response.data.sentencesData;
            this.comparedDataInfo.wordsData = response.data.wordsData;
            if (this.comparedDataInfo) {
              this.isError = false;
              this.isLoading = false;
            } else {
              this.loadingMessage = 'Error! No this Financial Report!';
            }
          })
          .catch((error) => {
            console.log(error);
            this.isError = true;
          });
      }
    },
    getDataInfo() {
      this.isLoading = true;
      this.isError = false;
      this.DataInfo = {
        sentencesData: [],
        wordsData: [],
      };
      this.metaInfo = {};
      this.sentenceAverageWeight = 0;
      this.sentenceValueArray = [];
      this.stockInfo = {
        name: '',
        price: [],
        volume: [],
      };
      if (this.routeFlag === 'id') {
        if (this.selectedCompanyId) {
          const path = `${baseURL}/metaInfo?filename=${this.selectedCompanyId}`;
          axios
            .get(path)
            .then((response) => {
              const a = response.data.metaInfo;
              a.volatility = Math.round(Math.exp(parseFloat(response.data.volatility)) * 100);
              a.pr = response.data.PR;
              this.triangleOffset = Math.floor(a.pr);
              this.metaInfo = a;
              // fins stock symbol
              const company = this.metaInfo.name.trim().split(' ')[0];
              this.stockInfo.name = this.metaInfo.name;
              let symbol = '';
              for (let i = 0; i < companyList.length; i += 1) {
                if (companyList[i].Name.toLowerCase().indexOf(company.toLowerCase()) !== -1) {
                  symbol = companyList[i].Symbol;
                  break;
                }
              }
              // Get stock data
              if (symbol.length > 0) {
                this.isStockLoading = true;
                const d1 = new Date(this.metaInfo.date);
                const d2 = new Date(d1);
                const d4 = new Date(d1);
                d4.setFullYear(d4.getFullYear() + 1);
                console.log('---date---', d4);
                d2.setFullYear(d2.getFullYear() - 1);
                console.log('---date---', d2);
                const t = new Date(d2).getTime() / 1000;
                const t2 = new Date(d4).getTime() / 1000;
                console.log('---date---', t, t2);

                const options = {
                  method: 'GET',
                  url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/get-histories',
                  params: {
                    symbol,
                    from: t,
                    to: t2,
                    events: 'div',
                    interval: '1d',
                    region: 'US',
                  },
                  headers: {
                    'x-rapidapi-key': '849af88f92mshab85a4adc3b97e2p13cc69jsn6ae5bed9ae55',
                    'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com',
                  },
                };


                axios.request(options).then((stockResponse) => {
                  const ohlc2 = [];
                  const volume2 = [];
                  const quote = stockResponse.data.chart.result[0].indicators.quote[0];
                  const myTimestamp = stockResponse.data.chart.result[0].timestamp;
                  console.log('---time len---', myTimestamp.length);
                  for (let i = 0; i < myTimestamp.length; i += 1) {
                    ohlc2.push([
                      myTimestamp[i] * 1000, // the date
                      quote.open[i],
                      quote.high[i],
                      quote.low[i],
                      quote.close[i],
                    ]);

                    volume2.push([
                      myTimestamp[i] * 1000, // the date
                      quote.volume[i], // the volume
                    ]);
                  }
                  this.stockInfo.price = ohlc2;
                  this.stockInfo.volume = volume2;
                  this.isStockLoading = false;
                }).catch((error) => {
                  this.isStockLoading = false;
                  console.error(error);
                });
              }
              axios
                .get(`${baseURL}/sentencesData?filename=${this.selectedCompanyId}`)
                .then((responseSentence) => {
                  if (responseSentence.data.sentencesData) {
                    this.DataInfo.sentencesData = responseSentence.data.sentencesData.filter(
                      item => item.sentence.indexOf('<TABLE>') === -1,
                    );
                  }
                  console.log('-------Test----', this.DataInfo.sentencesData[0].sentence.indexOf('FredSam'));
                  this.firstTitleStopIndex = this.DataInfo.sentencesData[0].sentence.indexOf('FredSam');
                  if (this.DataInfo.sentencesData) {
                    for (let y = 0; y < this.DataInfo.sentencesData.length; y += 1) {
                      this.sentenceValueArray.push(this.DataInfo.sentencesData[y].value);
                      // this.sentenceAverageWeight += this.DataInfo.sentencesData[y].value;
                      const sentenceLen = this.DataInfo.sentencesData[y].sentence.length;
                      this.DataInfo.sentencesData[y].sentence[sentenceLen - 1] = `${this.DataInfo.sentencesData[y].sentence[sentenceLen - 1]}.`;
                      // this.DataInfo.sentencesData[y].sentence.push('.');
                    }
                  }
                  console.log('----this.DataInfo.sentencesData----', this.DataInfo.sentencesData);
                  const sortedData = [...this.sentenceValueArray].sort((a, b) => d3.ascending(a, b));
                  this.sentenceAverageWeight = d3.quantile(sortedData, 0.75);
                  axios
                    .get(`${baseURL}/wordsData?filename=${this.selectedCompanyId}`)
                    .then((responseWord) => {
                      this.DataInfo.wordsData = responseWord.data.wordsData;
                      this.DataInfo.wordsData.sort(this.compareWeight);
                      console.log('---this.DataInfo.wordsData---', this.DataInfo.wordsData);
                      if (this.DataInfo) {
                        this.isError = false;
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
      } else if (this.file) {
        this.isLoading = true;
        const path = 'https://clip.csie.org/HIVETEST/api/uploadFile';
        this.filedata.append('file', this.file);
        axios
          .post(path, this.filedata)
          .then((response) => {
            this.DataInfo.sentencesData = response.data.sentencesData;
            this.DataInfo.wordsData = response.data.wordsData;
            if (this.DataInfo) {
              this.isError = false;
              this.isLoading = false;
            } else {
              this.loadingMessage = 'Error! No this Financial Report!';
            }
          })
          .catch((error) => {
            console.log(error);
            this.isError = true;
          });
      }
    },
    clickReportTabFromNav(isClickedReport) {
      if (isClickedReport) {
        this.$router.push({ name: 'SelectReport', params: { status: 'single' } });
      }
    },
    companyIdFromSelectPage(selectedCompanyId, navFile) {
    // childValue就是子组件传过来的值
      this.selectedCompanyId = selectedCompanyId;
      console.log(navFile);
      console.log('---Get new Value---');
      if (navFile) {
        this.routeFlag = 'file';
        this.file = navFile;
        this.isSelectorError = false;
        console.log('---Get file from NavBar-----');
        this.getDataInfo();
      } else if (this.selectedCompanyId) {
        this.routeFlag = 'id';
        this.isSelectorError = false;
        this.getDataInfo();
      } else {
        this.isSelectorError = true;
        this.isError = true;
      }
    },
    selectComparedReport(selectedCompanyId, navFile) {
      this.selectedComparedCompanyId = selectedCompanyId;
      console.log(navFile);
      console.log('---Get new Value---');
      this.hasComparedReport = true;
      if (navFile) {
        this.routeFlag = 'file';
        this.file = navFile;
        this.isSelectorError = false;
        console.log('---Get file from NavBar-----');
        this.getComparedDataInfo();
      } else if (this.selectedComparedCompanyId) {
        this.routeFlag = 'id';
        this.isSelectorError = false;
        this.getComparedDataInfo();
      } else {
        this.isSelectorError = true;
        this.isError = true;
      }
    },
    closeSingleFinPage(isClose) {
      if (isClose) {
        this.$router.push({ name: 'SelectReport', params: { status: 'compare' } });
      }
    },
    closeRecPage() {
      this.$router.push({
        name: 'SingleReport',
        params: {
          companyId: this.selectedCompanyId,
          metaInfo: this.metaInfo,
          dataInfo: this.DataInfo,
          triangleOffset: this.triangleOffset,
          sentenceAverageWeight: this.sentenceAverageWeight,
          sentenceValueArray: this.sentenceValueArray,
          firstTitleStopIndex: this.firstTitleStopIndex,
          similarReportList: this.similarReportList,
          similarSectorReportList: this.similarSectorReportList,
          stockInfo: this.stockInfo } });
    },
    closeSingleFinPageFromComparedPage(isClose) {
      if (isClose) {
        this.hasComparedReport = false;
        this.overallSimilarity = '';
        this.comparedSentenceAverageWeight = 0;
        this.comparedMetaInfo = {};
        this.comparedDataInfo = {
          sentencesData: [],
          wordsData: [],
        };
        this.comparedStockInfo = {
          name: '',
          price: [],
          volume: [],
        };
        this.comparedTriangleOffset = '0%';
      }
    },
    clickCompareTabFromNav(isClickedCompare) {
      if (isClickedCompare) {
        if (this.DataInfo && this.metaInfo) {
          this.$router.push(
            { name: 'CompareReport',
              params: {
                metaInfo: this.metaInfo,
                dataInfo: this.DataInfo,
                triangleOffset: this.triangleOffset,
                sentenceAverageWeight: this.sentenceAverageWeight,
              },
            });
        }
      }
    },
  },
  created() {
    if (this.$route.params.metaInfo && this.$route.params.dataInfo) {
      this.selectedCompanyId = this.$route.params.companyId;
      this.metaInfo = this.$route.params.metaInfo;
      this.DataInfo = this.$route.params.dataInfo;
      this.triangleOffset = this.$route.params.triangleOffset;
      this.sentenceAverageWeight = this.$route.params.sentenceAverageWeight;
      this.sentenceValueArray = this.$route.params.sentenceValueArray;
      this.firstTitleStopIndex = this.$route.params.firstTitleStopIndex;
      this.similarReportList = this.$route.params.similarReportList;
      this.similarSectorReportList = this.$route.params.similarSectorReportList;
      this.stockInfo = this.$route.params.stockInfo;
    } else {
      this.selectedCompanyId = this.$route.params.reportId;
      this.file = this.$route.params.file;
      this.routeFlag = this.$route.params.flag;
      this.getDataInfo();
    }
  },

  mounted() {
  },
  watch: {
    selectedCompanyId: {
      handler(n, o) {
        this.similarReportList = [];
        this.similarSectorReportList = [];
        let path = `${baseURL}/similarReport?filename=${this.selectedCompanyId}`;
        axios
          .get(path)
          .then((response) => {
            const reportIdList = response.data.similar_report;
            for (let i = 0; i < reportIdList.length; i += 1) {
              path = `${baseURL}/metaInfo?filename=${reportIdList[i]}`;
              axios
                .get(path)
                .then((res) => {
                  const m = res.data.metaInfo;
                  this.similarReportList.push(
                    {
                      id: `${reportIdList[i]}`,
                      name: m.name,
                      date: m.date,
                    },
                  );
                });
            }
            path = `${baseURL}/similarSector?filename=${this.selectedCompanyId}`;
            axios
              .get(path)
              .then((response) => {
                const reportIdList = response.data.similar_sector;
                for (let i = 0; i < reportIdList.length; i += 1) {
                  path = `${baseURL}/metaInfo?filename=${reportIdList[i]}`;
                  axios
                    .get(path)
                    .then((res) => {
                      const m = res.data.metaInfo;
                      this.similarSectorReportList.push(
                        {
                          id: `${reportIdList[i]}`,
                          name: m.name,
                          date: m.date,
                        },
                      );
                    });
                }
              });
          });
        console.log('---similar---', this.similarReportList);
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
    padding: 0rem 0.5rem;
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
.pr-level {
  width: 6rem;
  height: 6rem;
  border-radius: 100%;
  background: #FA4A4A;
  position: absolute;
  right: 2rem;
  top: 10rem;
  text-align: center;
  color: white;
  line-height: 6rem;
  font-size: 2rem;
}
.content-text {
  padding-right: 0.3rem;
  display: inline-block;
}
.report-text {
  margin-top: 1rem;
}
.close-cross {
  width: 6rem;
  height: 6rem;
  position: absolute;
  right: 2rem;
  top: 5rem;
  text-align: center;
  line-height: 6rem;
  font-size: 2rem;
  color: #737373;
  cursor: pointer;
}
.showPage {
  display: block;
}
.hidePage {
  display: none;
}
.pages-container {
    display: inline-flex;
    flex-direction: row;
    justify-content: center;
    position: relative;
    width: 100%;
}
.page {
    flex: 0 0 50%;
    position: relative;
    height: 800px;
    overflow-y: scroll;
}
.similarity-box {
  position: fixed;
  bottom: 0;
  background: rgb(200, 200, 200);
  font-weight: 800;
  padding: 10px;
  width: 100%;
  text-align: center;
  z-index: 100;
  opacity: 0.85;
  font-size: 40px;
}
</style>
