

<template>
  <div>
  <b-navbar >
    <b-navbar-nav class="nav-outer">
      <b-nav-item href="#" class="nav-logo-block">
          <router-link to='/' style="display: inline-flex;"><img class="logo" src="../assets/lg_black.png"></router-link>
          <router-link to='/' class="hive" style="display: inline-flex;">
            <div>HIVE</div>
          </router-link>
      </b-nav-item>

      <!-- Navbar dropdowns -->
      <div class="nav-input-block" style="margin-top:2vh;">
        <b-nav-item-dropdown :text="selectedYear" right class="year-input">
            <b-dropdown-item v-for="(year) in yearList" @click="setYear(year)">{{year}}</b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item-dropdown :text="selectedCompany" right class="company-input">
            <b-dropdown-item v-for="(company_) in companyName" @click="setCompany(company_)" >{{company_}}</b-dropdown-item>
        </b-nav-item-dropdown>
        <!-- <b-form-input class="company-input" v-model="company" placeholder="Company"></b-form-input> -->
        <b-form-group class="file-input">
            <b-form-file
            id="file-default"
            v-model="file"></b-form-file>
        </b-form-group>
        <b-button @click="submitMeta" type="submit" style="background-color:#737373;" class="submit-btn">Submit</b-button>
      </div>


      <!-- <b-nav-item-dropdown text="User" right>
        <b-dropdown-item href="#">Account</b-dropdown-item>
        <b-dropdown-item href="#">Settings</b-dropdown-item>
      </b-nav-item-dropdown> -->
    </b-navbar-nav>
  </b-navbar>
</div>
</template>

<script>
import shortid from 'shortid';
import * as d3 from 'd3';
import axios from 'axios';

const baseURL = 'https://clip.csie.org/HIVEBACK/api';
export default {
  name: 'NavBar',
  data() {
    return {
      id: shortid.generate(),
      selectedCompany: 'Company',
      selectedYear: 'Year',
      selectedCompanyId: '',
      yearList: ['1996', '1997', '1998', '1999', '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013'],
      reportList: {},
      companyName: [],
      file: null,
    };
  },
  mounted() {
  },
  methods: {
    setYear(year) {
      this.selectedYear = year;
    },
    setCompany(company) {
      this.selectedCompany = company;
      this.selectedCompanyId = this.reportList[company];
      console.log(this.selectedCompanyId);
    },
    submitMeta() {
      this.$emit('companyIdFromNav', this.selectedCompanyId);
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
              this.reportList = response.data.reportList;
              this.companyName = Object.keys(response.data.reportList);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      },

    },
  },
  props: ['title'],
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@600&display=swap');
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
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    height: 2.5rem;
    text-align: center;
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
.nav-logo-block {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  display: inline-block;
}
</style>

