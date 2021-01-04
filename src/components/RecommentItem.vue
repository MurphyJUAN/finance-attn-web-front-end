<template>
    <div class="reportContainer">
        <div class="recommendation-container">
            <div class="closeCross" @click="closeRecPage">x</div>
            <div class="select-block">
                <div class="info-text">Mannually Select A Report</div>
                <div class="form-block">
                    <div class="nav-input-block">
                    <b-form-select v-model="selectedYear" :options="yearList" class="year-input">
                    <template v-slot:first>
                        <b-form-select-option :value="selectedYear" >{{selectedYear}}</b-form-select-option>
                    </template>
                    </b-form-select>
                    <v-select :options="companyName" v-model="selectedCompany" class="company-input-home" />

                    <!-- <b-form-group class="file-input">
                        <b-form-file
                        id="file-default"
                        v-model="file"></b-form-file>
                    </b-form-group> -->
                    <b-button @click="submitMeta" type="submit" class="submit-btn" >
                        <div style="text-decoration:none; color:white;">Submit</div>
                    </b-button>
                    </div>
                </div>
            </div>
            <div class="recommendation-block">
                <div class="info-text">Recommended Reports</div>
                <div class="rec-block">
                  <div class="by-sim">
                    <h4 class="rec-title">By Similarity</h4>
                    <div class="recomment-item"
                    @click="clickRecReport(item.id)"
                    v-for="(item, idx) in similarReportList">
                      {{item.name}} / {{item.date}}
                    </div>
                  </div>
                  <div class="by-sector">
                    <h4 class="rec-title">By Sector</h4>
                    <div class="recomment-item">Company Name A</div>
                    <div class="recomment-item">Company Name B</div>
                    <div class="recomment-item">Company Name C</div>
                    <div class="recomment-item">Company Name D</div>
                    <div class="recomment-item">Company Name E</div>
                  </div>
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
import shortid from 'shortid';

const baseURL = 'https://clip.csie.org/HIVEBACK/api';
export default {
  name: 'RecommentItem',
  components: {
    NavBar,
    NewNavBar,
    SelectReport,
  },
  // pageStatus:0->single, 1->compare
  props: ['similarReportList', 'DataInfo', 'metaInfo', 'triangleOffset', 'sentenceAverageWeight', 'pageStatus'],
  data() {
    return {
      isClose: false,
      id: shortid.generate(),
      selectedCompany: 'Company Name',
      selectedYear: 'Year',
      selectedCompanyId: '',
      yearList: ['1996', '1997', '1998', '1999', '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013'],
      reportList: {},
      companyName: [],
      file: null,
      options: ['apple', 'lplp'],
      selected: '',
    };
  },
  methods: {
    clickRecReport(id) {
      this.selectedCompanyId = id;
      this.submitMeta();
    },
    closeRecPage() {
      this.isClose = true;
      this.$emit('closeRecPage');
    },
    submitMeta() {
      if (this.selectedCompanyId) {
        this.isError = false;
        this.$emit('selectComparedReport', this.selectedCompanyId, this.file);
        // this.$router.push({ name: 'SingleReport', params: { reportId: this.selectedCompanyId, file: this.file, flag: 'id' } });
      } else if (this.file) {
        console.log('---Click file---', this.file);
        // this.isError = false;
        // this.$router.push({ name: 'HelloWorld', params: { reportId: this.selectedCompanyId, file: this.file, flag: 'file' } });
      } else {
        this.isError = true;
      }
      console.log(this.isError);
    },
  },
  watch: {
    selectedYear: {
      handler(n, o) {
        console.log('jmurphy');
        console.log(n);
        this.file = null;
        if (n != 'year') {
          const path = `${baseURL}/reportList?year=${this.selectedYear}`;
          axios
            .get(path)
            .then((response) => {
              // console.log(Object.keys(response.data.reportList));
              this.reportList = response.data.reportList;
              this.companyName = Object.keys(response.data.reportList);
              console.log('companyName', this.companyName);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      },
    },
    selectedCompany: {
      handler(n, o) {
        if (n !== 'company') {
          this.selectedCompanyId = this.reportList[n];
        }
      },
    },
    file: {
      handler(n, o) {
        this.selectedYear = 'Year';
        this.selectedCompany = 'Company Name';
        this.selectedCompanyId = '';
      },
    },
  },
  created() {
  },

  mounted() {
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Assistant:wght@400;600&display=swap');
</style>
<style scoped>
.reportContainer {
    position: relative;
    padding: 0.5rem 1rem;
    width: 100%;
    height: 600px;
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
.prLevelSingle {
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
.prLevelCompare {
  width: 6rem;
  height: 6rem;
  border-radius: 100%;
  background: #FA4A4A;
  position: absolute;
  right: 2rem;
  top: 7rem;
  text-align: center;
  color: white;
  line-height: 6rem;
  font-size: 2rem;
}
.contentText {
  padding-right: 0.3rem;
  display: inline-block;
}
.report-text {
  margin-top: 1rem;
}
.closeCross{
  text-align: right;
  font-size: 1rem;
  cursor: pointer;
}
.showPage {
  display: block;
}
.hidePage {
  display: none;
}
.recommendation-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.info-text {
    text-align: center;
    width: 100%;
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
}
.recomment-item {
    text-align: center;
    color: #007BFF;
    cursor: pointer;
}
.recomment-item:hover{
  border-bottom: solid 1px #007BFF;
}
.nav-input-block {
    display: inline-flex;
    flex-direction: row;
    justify-content: center;
}
.year-input {
    width: 5rem;
    margin-right: 1rem;

}
.company-input-home {
    width: 8rem;
}
.select-block {
    margin-bottom: 1rem;
}
.rec-block{
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.rec-title {
  text-align: center;
  border-bottom: solid 1px gray;
  padding: 0.5rem;
  width: 100%;
}
.by-sim, .by-sector {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}
</style>
