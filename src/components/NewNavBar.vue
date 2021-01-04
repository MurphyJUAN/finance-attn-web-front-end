<template>
  <div>
  <b-navbar >
    <b-navbar-nav class="nav-outer">
      <b-nav-item href="#" class="nav-logo-block">
          <router-link v-if="!whiteTheme" to='/home' style="display: inline-flex;"><img class="logo" src="../assets/lg_black.png"></router-link>
          <router-link v-if="whiteTheme" to='/home' style="display: inline-flex;"><img class="logo" src="../assets/lg_white.png"></router-link>
          <router-link to='/home' class="hive" style="display: inline-flex; text-decoration:none;">
            <div :class="{white: whiteTheme, black: !whiteTheme}">HIVE</div>
          </router-link>
      </b-nav-item>
      <div v-if="!whiteTheme" class="nav-input-block" style="margin-top:2vh;">
        <div class="icon-block" @click="clickReportTab">
            <img class="icon" src="../assets/report.svg">
            <div :class="{iconText: true, white: whiteTheme, black: !whiteTheme}">Report</div>
        </div>
        <div class="icon-block">
            <img class="icon" src="../assets/wordviz.svg">
            <div :class="{iconText: true, white: whiteTheme, black: !whiteTheme}">Word Viz</div>
        </div>
        <div class="icon-block" @click="clickCompareTab">
            <img class="icon" src="../assets/compare.svg">
            <div :class="{iconText: true, white: whiteTheme, black: !whiteTheme}">Compare</div>
        </div>
      </div>
    </b-navbar-nav>
  </b-navbar>
</div>
</template>

<script>
import shortid from 'shortid';
import * as d3 from 'd3';
import vSelect from 'vue-select';
import axios from 'axios';


const baseURL = 'https://clip.csie.org/HIVEBACK/api';
export default {
  name: 'NavBar',
  components: {
    vSelect,
  },
  data() {
    return {
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
      isClickedCompare: false,
      isClickedReport: false,
    };
  },
  mounted() {
  },
  methods: {
    clickCompareTab() {
      this.isClickedCompare = true;
      this.$emit('clickCompareTabFromNav', this.isClickedCompare);
    },
    clickReportTab() {
      this.isClickedReport = true;
      this.$emit('clickReportTabFromNav', this.isClickedReport);
    },
    setYear(year) {
      this.selectedYear = year;
      this.file = null;
    },
    setCompany(company) {
      this.selectedCompany = company;
      this.selectedCompanyId = this.reportList[company];
      console.log('ID', this.selectedCompanyId);
    },
    submitMeta() {
      this.$emit('companyIdFromNav', this.selectedCompanyId, this.file);
      console.log('change');
    },

  },
  watch: {
    selectedYear: {
      handler(n, o) {
        // console.log('jmurphy');
        if (n != 'year') {
          const path = `${baseURL}/reportList?year=${this.selectedYear}`;
          axios
            .get(path)
            .then((response) => {
              // console.log(Object.keys(response.data.reportList));
              console.log('Year', response);
              this.reportList = response.data.reportList;
              this.companyName = Object.keys(response.data.reportList);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      },

    },
    selectedCompany: {
      handler(n, o) {
        // console.log('jmurphy');
        if (n != 'Company Name') {
          this.setCompany(n);
        }
      },
    },
    file: {
      handler(n, o) {
        // console.log('jmurphy');
        this.selectedCompany = 'Company Name';
        this.selectedYear = 'Year';
        this.selectedCompanyId = '';
      },
    },
  },
  props: ['title', 'whiteTheme'],
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@600&display=swap');
@import 'vue-select/dist/vue-select.css';
.logo {
    width: 2rem;
    height: 2rem;
}
.nav-outer {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
}
.nav-input-block {
    display: flex;
    flex-direction: row;
}
.year-input {
    margin-right: 1rem;
    border: 1px solid #ced4da;
    height: 2.5rem;
    border-radius: 0.25rem;
}
.company-input {
    /* width: 8rem; */
    margin-right: 1rem;
    /* border: 1px solid #ced4da; */
    /* border-radius: 0.25rem; */
    height: 2.5rem;
    min-width: 8rem;
    text-align: center;
}
.vs__dropdown-toggle {
  height: 2.5rem;
}
.company-input .vs__selected-options,
.company-input .vs__search {
  cursor: pointer;
}
.file-input {
    width: 15rem;
    margin-right: 1rem;
}
.submit-btn {
    height: 2.5rem;
}
.hive {
  font-family: 'Oswald', sans-serif;
  color: black;
  font-size: 2rem;
}
.hive:hover {
  color: black;
}
.nav-logo-block {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  display: inline-block;
}
.dropdown-menu {
  max-height: 450px;
  overflow-y: scroll;
}
.vs__selected-options {
  min-width: 300px;
}
.icon {
    width: 1rem;
    height: 1rem;
    display: inline-block;
}
.iconText {
    display: inline-block;
    color: black;
    font-weight: 500;
}
.icon-block {
    padding-right: 1rem;
    cursor: pointer;
}
.white {
    color: white;
}
.black {
    color: black;
}
</style>

