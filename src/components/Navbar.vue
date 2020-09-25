

<template>
  <div>
  <b-navbar >
    <b-navbar-nav class="nav-outer">
      <b-nav-item href="#" class="nav-logo-block">
          <router-link to='/home' style="display: inline-flex;"><img class="logo" src="../assets/lg_black.png"></router-link>
          <router-link to='/home' class="hive" style="display: inline-flex; text-decoration:none;">
            <div>HIVE</div>
          </router-link>
      </b-nav-item>

      <!-- Navbar dropdowns -->
      <div class="nav-input-block" style="margin-top:2vh;">
        <b-nav-item-dropdown :text="selectedYear" right class="year-input">
            <b-dropdown-item v-for="(year) in yearList" @click="setYear(year)">{{year}}</b-dropdown-item>
        </b-nav-item-dropdown>
        <!-- <b-nav-item-dropdown :text="selectedCompany" right class="company-input">
            <b-dropdown-item v-for="(company_) in companyName" @click="setCompany(company_)" >{{company_}}</b-dropdown-item>
        </b-nav-item-dropdown> -->
        <!-- <b-form-input class="company-input" v-model="company" placeholder="Company"></b-form-input> -->
        <vSelect :options="companyName" v-model="selectedCompany" class="company-input" />
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
    };
  },
  mounted() {
  },
  methods: {
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
  props: ['title'],
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
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
</style>

