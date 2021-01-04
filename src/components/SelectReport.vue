<template>
  <div>
      <!-- <NavBar title="Finance Report Name" v-on:companyIdFromNav="companyIdFromNav" /> -->
      <NewNavBar :whiteTheme="whiteTheme" />
      <div class="reportContainer">
          <div class="form-block">
            <div class="info-text">Select a report!</div>
            <!-- <h1 class="text-light product-name hive" style="font-size:65px;">HIVE</h1> -->
            <div class="nav-input-block">
            <b-form-select v-model="selectedYear" :options="yearList" class="year-input">
            <template v-slot:first>
                <b-form-select-option :value="selectedYear" >{{selectedYear}}</b-form-select-option>
            </template>
            </b-form-select>

            <!-- <b-form-select v-model="selectedCompany" :options="companyName" class="company-input">
            <template v-slot:first>
                <b-form-select-option :value="selectedCompany" >{{selectedCompany}}</b-form-select-option>
            </template>
            </b-form-select> -->
            <v-select :options="companyName" v-model="selectedCompany" class="company-input-home" />

            <!-- <b-form-input class="company-input" v-model="company" placeholder="Company"></b-form-input> -->
            <b-form-group class="file-input">
                <b-form-file
                id="file-default"
                v-model="file"></b-form-file>
            </b-form-group>
            <b-button @click="submitMeta" type="submit" class="submit-btn" style="background-color:#737373;" >
                <div style="text-decoration:none; color:white;">Submit</div>
            </b-button>
            </div>
        </div>

      </div>
</div>
</template>

<script>
import shortid from 'shortid';
import * as d3 from 'd3';
import vSelect from 'vue-select';
import axios from 'axios';
import NewNavBar from './NewNavBar';

const baseURL = 'https://clip.csie.org/HIVEBACK/api';
export default {
  name: 'SelectReport',
  components: {
    vSelect,
    NewNavBar,
  },
  data() {
    return {
      whiteTheme: false,
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
      pageStatus: '',
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
      // this.$emit('companyIdFromSelectPage', this.selectedCompanyId, this.file);

      if (this.pageStatus === 'single') {
        console.log('---single---');
        this.$router.push({ name: 'SingleReport',
          params: { reportId: this.selectedCompanyId, file: this.file, flag: 'id' } });
      } else if (this.pageStatus === 'compare') {
        console.log('---compare---');
        this.$router.push({ name: 'CompareReport',
          params: { reportId: this.selectedCompanyId, file: this.file, flag: 'id' } });
      }

      this.selectedCompany = 'Company Name';
      this.selectedYear = 'Year';
      this.selectedCompanyId = '';
      this.reportList = {};
      this.companyName = [];
      this.file = null;
    },

  },
  created() {
    this.pageStatus = this.$route.params.status;
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
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@600&display=swap');
@import 'vue-select/dist/vue-select.css';

.reportContainer {
    padding: 0.5rem 1rem;
}
.nav-input-block {
    display: flex;
    flex-direction:  row;
}
.year-input {
    width: 8rem;
    margin-right: 1rem;
}
/* .company-input {
    margin-right: 1rem;
    height: 2.5rem;
    min-width: 8rem;
    text-align: center;
}
.vs__dropdown-toggle {
  height: 2.5rem;
} */
.file-input {
    width: 15rem;
    margin-right: 1rem;
}
.submit-btn {
    height: 2.5rem;
}
.company-input-home {
  cursor: pointer;
}
.form-block {
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
    margin-bottom: 1rem;
}
</style>

