

<template>
<div class="homepage">
    <div class="bgImage"></div>
    <svg class="blobCont">
            <image xlink:href="https://images.unsplash.com/photo-1588097281266-310cead47879?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2734&q=80" mask="url(#mask)" width="100%" height="100%" style="filter:hue-rotate(20deg);" preserveAspectRatio="xMidYMid slice" />
        <defs>
        <filter id="gooey" height="130%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
                    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
            </filter>
        </defs>
                <mask id="mask" x="0" y="0">
                    <g style="filter: url(#gooey)">
            <circle class="blob" cx="10%" cy="10%" r="80" fill="white" stroke="white"/>
                        <circle class="blob" cx="50%" cy="10%" r="40" fill="white" stroke="white"/>
                        <circle class="blob" cx="17%" cy="15%" r="70" fill="white" stroke="white"/>
                        <circle class="blob" cx="90%" cy="20%" r="120" fill="white" stroke="white"/>
                        <circle class="blob" cx="30%" cy="25%" r="30" fill="white" stroke="white"/>
            <circle class="blob" cx="50%" cy="60%" r="80" fill="white" stroke="white"/>
                        <circle class="blob" cx="70%" cy="90%" r="10" fill="white" stroke="white"/>
                        <circle class="blob" cx="90%" cy="60%" r="90" fill="white" stroke="white"/>
                        <circle class="blob" cx="30%" cy="90%" r="80" fill="white" stroke="white"/>
            <circle class="blob" cx="10%" cy="10%" r="80" fill="white" stroke="white"/>
                        <circle class="blob" cx="50%" cy="10%" r="20" fill="white" stroke="white"/>
                        <circle class="blob" cx="17%" cy="15%" r="70" fill="white" stroke="white"/>
                        <circle class="blob" cx="40%" cy="20%" r="120" fill="white" stroke="white"/>
                        <circle class="blob" cx="30%" cy="25%" r="30" fill="white" stroke="white"/>
            <circle class="blob" cx="80%" cy="60%" r="80" fill="white" stroke="white"/>
                        <circle class="blob" cx="17%" cy="10%" r="100" fill="white" stroke="white"/>
                        <circle class="blob" cx="40%" cy="60%" r="90" fill="white" stroke="white"/>
                        <circle class="blob" cx="10%" cy="50%" r="80" fill="white" stroke="white"/>
                    </g>
                </mask>
    </svg>
    <div style="opacity: 0">hi</div>
    <b-alert :show="isError" variant="danger">Please choose year and company name before submit.</b-alert>
    <div class="form-block">
        <h1 class="text-light product-name hive" style="font-size:65px;">HIVE</h1>
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
</template>

<script>
import shortid from 'shortid';
import * as d3 from 'd3';
// import vSelect from 'vue-select';
import axios from 'axios';

const baseURL = 'https://clip.csie.org/HIVEBACK/api';
export default {
  name: 'HomePage',
  components: {
    // vSelect,
  },
  data() {
    return {
      id: shortid.generate(),
      selectedCompany: 'Company Name',
      selectedYear: 'Year',
      isError: false,
      selectedCompanyId: '',
      yearList: ['1996', '1997', '1998', '1999', '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013'],
      reportList: {},
      companyName: [],
      file: null,
    };
  },
  beforeCreate() {
    // document.querySelector('body').setAttribute('style', 'background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);background-size: 400% 400%;animation: gradient 15s ease infinite;');
    // // document.querySelector('body').animate
    // console.log('hi');
    // const cssAnimation = document.createElement('style');
    // cssAnimation.type = 'text/css';
    // const rules = document.createTextNode('@-webkit-keyframes gradient {' +
    //     '0% { background-position: 0% 50%; }' +
    //     '50% { background-position: 100% 50%;}' +
    //     '100% { background-position: 0% 50%; }' +
    //     '}');
    // cssAnimation.appendChild(rules);
    // document.getElementsByTagName('head')[0].appendChild(cssAnimation);
  },
  beforeDestroy() {
    // document.querySelector('body').setAttribute('style', 'background: white;background-size: 100% 100%;');
  },
  mounted() {
    // document.querySelector('body').setAttribute('style', 'background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);background-size: 400% 400%;animation: gradient 15s ease infinite;');
    // // document.querySelector('body').animate
    // const cssAnimation = document.createElement('style');
    // cssAnimation.type = 'text/css';
    // const rules = document.createTextNode('@-webkit-keyframes gradient {' +
    //     '0% { background-position: 0% 50%; }' +
    //     '50% { background-position: 100% 50%;}' +
    //     '100% { background-position: 0% 50%; }' +
    //     '}');
    // cssAnimation.appendChild(rules);
    // document.getElementsByTagName('head')[0].appendChild(cssAnimation);
  },
  methods: {
    submitMeta() {
    //   this.$router.push({ name: 'HelloWorld', params: { reportId: '87160G107-10-K-19991229' } });
      if (this.selectedCompanyId) {
        this.isError = false;
        this.$router.push({ name: 'HelloWorld', params: { reportId: this.selectedCompanyId, file: this.file, flag: 'id' } });
      } else if (this.file) {
        console.log('---Click file---', this.file);
        this.isError = false;
        this.$router.push({ name: 'HelloWorld', params: { reportId: this.selectedCompanyId, file: this.file, flag: 'file' } });
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
  props: ['title'],
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@600&display=swap');
@import 'vue-select/dist/vue-select.css';

body {
    background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;
    width: 100%;
    height: 100%;
}

/* .company-input .vs__search::placeholder,
.company-input .vs__dropdown-toggle,
.company-input .vs__dropdown-menu {
    background: white;
} */

@keyframes gradient {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
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
.product-name {
    text-align : center;
}
body,
.bgImage {
  margin: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.bgImage {
  position: absolute;
  background-image: url(https://images.unsplash.com/photo-1588097281266-310cead47879?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2734&q=80);
  background-size: cover;
  background-position: top;
  -webkit-filter: grayscale(70%);
  /* Safari 6.0 - 9.0 */
  filter: grayscale(70%);
  z-index: -1;
}

.blobCont {
  position: absolute;
  width: 100vw;
  height: 100vh;
}

.blob:nth-child(1) {
  animation: move1 20s infinite linear;
}

@keyframes move1 {
  from {
    transform: rotate(90deg) translate(200px, 0.1px) rotate(-90deg);
  }
  to {
    transform: rotate(450deg) translate(200px, 0.1px) rotate(-450deg);
  }
}
.blob:nth-child(2) {
  animation: move2 20s infinite linear;
}

@keyframes move2 {
  from {
    transform: rotate(180deg) translate(200px, 0.1px) rotate(-180deg);
  }
  to {
    transform: rotate(540deg) translate(200px, 0.1px) rotate(-540deg);
  }
}
.blob:nth-child(3) {
  animation: move3 20s infinite linear;
}

@keyframes move3 {
  from {
    transform: rotate(270deg) translate(200px, 0.1px) rotate(-270deg);
  }
  to {
    transform: rotate(630deg) translate(200px, 0.1px) rotate(-630deg);
  }
}
.blob:nth-child(4) {
  animation: move4 20s infinite linear;
}

@keyframes move4 {
  from {
    transform: rotate(360deg) translate(200px, 0.1px) rotate(-360deg);
  }
  to {
    transform: rotate(720deg) translate(200px, 0.1px) rotate(-720deg);
  }
}
.blob:nth-child(5) {
  animation: move5 20s infinite linear;
}

@keyframes move5 {
  from {
    transform: rotate(450deg) translate(200px, 0.1px) rotate(-450deg);
  }
  to {
    transform: rotate(810deg) translate(200px, 0.1px) rotate(-810deg);
  }
}
.blob:nth-child(6) {
  animation: move6 20s infinite linear;
}

@keyframes move6 {
  from {
    transform: rotate(540deg) translate(200px, 0.1px) rotate(-540deg);
  }
  to {
    transform: rotate(900deg) translate(200px, 0.1px) rotate(-900deg);
  }
}
.blob:nth-child(7) {
  animation: move7 20s infinite linear;
}

@keyframes move7 {
  from {
    transform: rotate(630deg) translate(200px, 0.1px) rotate(-630deg);
  }
  to {
    transform: rotate(990deg) translate(200px, 0.1px) rotate(-990deg);
  }
}
.blob:nth-child(8) {
  animation: move8 20s infinite linear;
}

@keyframes move8 {
  from {
    transform: rotate(720deg) translate(200px, 0.1px) rotate(-720deg);
  }
  to {
    transform: rotate(1080deg) translate(200px, 0.1px) rotate(-1080deg);
  }
}
.blob:nth-child(9) {
  animation: move9 20s infinite linear;
}

@keyframes move9 {
  from {
    transform: rotate(810deg) translate(200px, 0.1px) rotate(-810deg);
  }
  to {
    transform: rotate(1170deg) translate(200px, 0.1px) rotate(-1170deg);
  }
}
.blob:nth-child(10) {
  animation: move10 20s infinite linear;
}

@keyframes move10 {
  from {
    transform: rotate(900deg) translate(200px, 0.1px) rotate(-900deg);
  }
  to {
    transform: rotate(1260deg) translate(200px, 0.1px) rotate(-1260deg);
  }
}
.blob:nth-child(11) {
  animation: move11 20s infinite linear;
}

@keyframes move11 {
  from {
    transform: rotate(990deg) translate(200px, 0.1px) rotate(-990deg);
  }
  to {
    transform: rotate(1350deg) translate(200px, 0.1px) rotate(-1350deg);
  }
}
.blob:nth-child(12) {
  animation: move12 20s infinite linear;
}

@keyframes move12 {
  from {
    transform: rotate(1080deg) translate(200px, 0.1px) rotate(-1080deg);
  }
  to {
    transform: rotate(1440deg) translate(200px, 0.1px) rotate(-1440deg);
  }
}
.blob:nth-child(13) {
  animation: move13 20s infinite linear;
}

@keyframes move13 {
  from {
    transform: rotate(1170deg) translate(200px, 0.1px) rotate(-1170deg);
  }
  to {
    transform: rotate(1530deg) translate(200px, 0.1px) rotate(-1530deg);
  }
}
.blob:nth-child(14) {
  animation: move14 20s infinite linear;
}

@keyframes move14 {
  from {
    transform: rotate(1260deg) translate(200px, 0.1px) rotate(-1260deg);
  }
  to {
    transform: rotate(1620deg) translate(200px, 0.1px) rotate(-1620deg);
  }
}
.blob:nth-child(15) {
  animation: move15 20s infinite linear;
}

@keyframes move15 {
  from {
    transform: rotate(1350deg) translate(200px, 0.1px) rotate(-1350deg);
  }
  to {
    transform: rotate(1710deg) translate(200px, 0.1px) rotate(-1710deg);
  }
}
.blob:nth-child(16) {
  animation: move16 20s infinite linear;
}

@keyframes move16 {
  from {
    transform: rotate(1440deg) translate(200px, 0.1px) rotate(-1440deg);
  }
  to {
    transform: rotate(1800deg) translate(200px, 0.1px) rotate(-1800deg);
  }
}
.blob:nth-child(17) {
  animation: move17 20s infinite linear;
}

@keyframes move17 {
  from {
    transform: rotate(1530deg) translate(200px, 0.1px) rotate(-1530deg);
  }
  to {
    transform: rotate(1890deg) translate(200px, 0.1px) rotate(-1890deg);
  }
}
.blob:nth-child(18) {
  animation: move18 20s infinite linear;
}

@keyframes move18 {
  from {
    transform: rotate(1620deg) translate(200px, 0.1px) rotate(-1620deg);
  }
  to {
    transform: rotate(1980deg) translate(200px, 0.1px) rotate(-1980deg);
  }
}

.hive {
  font-family: 'Oswald', sans-serif;
  color: black;
  font-size: 2rem;
}

</style>

