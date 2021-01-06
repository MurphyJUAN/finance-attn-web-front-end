<template>
<div class="single-report">
    <NavBar title="Finance Report Name" v-on:companyIdFromNav="companyIdFromNav" />
    <!-- <NewNavBar
    v-on:clickCompareTabFromNav="clickCompareTabFromNav"
    :whiteTheme="whiteTheme" /> -->
    <PageItem
    name="ref"
    v-on:closeSingleFinPage="closeSingleFinPage"
    :DataInfo="DataInfo" :metaInfo="metaInfo" :triangleOffset="triangleOffset"
    :sentenceAverageWeight="sentenceAverageWeight"
    :sentenceValueArray="sentenceValueArray"
    :firstTitleStopIndex="firstTitleStopIndex"
    :stockInfo="stockInfo"
    :isStockLoading="isStockLoading"
    :pageStatus=0 />

    <div class="compareBtn" @click="switch2Compare">
      <img class="add-icon" src="../assets/add.svg"/>
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
import * as d3 from 'd3';
import companyList from '../assets/csvjson.json';

const baseURL = 'https://clip.csie.org/HIVEBACK/api';
export default {
  name: 'SingleReport',
  components: {
    NavBar,
    NewNavBar,
    SelectReport,
    PageItem,
  },
  data() {
    return {
      whiteTheme: false,
      selectedCompanyIdFromNav: '',
      routeFlag: 'id',
      file: null,
      isSelectorError: false,
      isError: false,
      isLoading: true,
      isStockLoading: false,
      metaInfo: {},
      DataInfo: {
        sentencesData: [],
        wordsData: [],
      },
      triangleOffset: 0,
      sentenceAverageWeight: 100,
      sentenceValueArray: [],
      firstTitleStopIndex: -1,
      similarReportList: [],
      stockInfo: {
        name: '',
        price: [],
        volume: [],
      },
    };
  },
  methods: {
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
        console.log('!!---Get CompanyID from NavBar-----!!');
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
    getDataInfo() {
      this.isLoading = true;
      this.isError = false;
      this.DataInfo = {
        sentencesData: [],
        wordsData: [],
      };
      this.metaInfo = {};
      this.sentenceValueArray = [];
      this.sentenceAverageWeight = 100;
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
                d2.setFullYear(d2.getFullYear() - 1);
                const t = new Date(d2).getTime();

                const options = {
                  method: 'GET',
                  url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/get-histories',
                  params: {
                    symbol,
                    from: t,
                    to: '1562086800',
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
                  this.DataInfo.sentencesData = responseSentence.data.sentencesData;
                  if (responseSentence.data.sentencesData) {
                    this.DataInfo.sentencesData = responseSentence.data.sentencesData.filter(
                      item => item.sentence.indexOf('<TABLE>') === -1,
                    );
                  }
                  console.log('-------Test----', this.DataInfo.sentencesData[0].sentence.indexOf('FredSam'));
                  this.firstTitleStopIndex = this.DataInfo.sentencesData[0].sentence.indexOf('FredSam');
                  // this.firstTitleStopIndex = this.DataInfo.sentencesData[0].sentence.indexof('FredSam');
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
                  console.log('---q3 from single page---', this.sentenceAverageWeight, this.sentenceValueArray.length);
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
    closeSingleFinPage(isClose, pageStatus) {
      if (isClose) {
        if (!pageStatus) { this.$router.push({ name: 'SelectReport', params: { status: 'single' } }); }
      } else {
        this.$router.push({ name: 'SelectReport', params: { status: 'compare' } });
      }
    },

    switch2Compare() {
      if (this.DataInfo && this.metaInfo) {
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
            console.log('---similar---', this.similarReportList);
            this.$router.push(
              { name: 'CompareReport',
                params: {
                  companyId: this.selectedCompanyId,
                  metaInfo: this.metaInfo,
                  dataInfo: this.DataInfo,
                  triangleOffset: this.triangleOffset,
                  sentenceAverageWeight: this.sentenceAverageWeight,
                  sentenceValueArray: this.sentenceValueArray,
                  firstTitleStopIndex: this.firstTitleStopIndex,
                  similarReportList: this.similarReportList,
                  stockInfo: this.stockInfo,
                },
              });
          });
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
    if (this.$route.params.dataInfo) {
      console.log('---hu----');
      this.selectedCompanyId = this.$route.params.companyId;
      this.metaInfo = this.$route.params.metaInfo;
      this.DataInfo = this.$route.params.dataInfo;
      this.triangleOffset = this.$route.params.triangleOffset;
      this.sentenceAverageWeight = this.$route.params.sentenceAverageWeight;
      this.sentenceValueArray = this.$route.params.sentenceValueArray;
      this.firstTitleStopIndex = this.$route.params.firstTitleStopIndex;
      this.similarReportList = this.$route.params.similarReportList;
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
.compareBtn {
  width: 6rem;
  height: 6rem;
  background: rgb(202, 201, 201);
  border-radius: 100%;
  position: fixed;
  bottom: 1rem;
  right: 1rem;
}
.add-icon {
  width: 2rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
}
</style>
