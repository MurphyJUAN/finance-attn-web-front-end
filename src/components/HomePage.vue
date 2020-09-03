

<template>
<div class="homepage">
    <div style="opacity: 0">hi</div>
    <div class="form-block">
        <h1 class="text-light product-name">Product Name</h1>
        <div class="nav-input-block">
        <b-form-select v-model="selected" :options="options" class="year-input">
        <template v-slot:first>
            <b-form-select-option :value="year" >year</b-form-select-option>
        </template>
        <b-form-select-option value="C">Option C</b-form-select-option>
        <b-form-select-option value="D">Option D</b-form-select-option>
        </b-form-select>
        <b-form-input class="company-input" v-model="company" placeholder="Company"></b-form-input>
        <b-form-group class="file-input">
            <b-form-file
            id="file-default"
            v-model="file"></b-form-file>
        </b-form-group>
        <b-button type="submit" variant="dark" class="submit-btn">
            <router-link to='/finance-report'>Submit</router-link>
        </b-button>
      </div>
    </div>

</div>
</template>

<script>
import shortid from 'shortid';
import * as d3 from 'd3';

export default {
  name: 'HomePage',
  data() {
    return {
      id: shortid.generate(),
      year: 'year',
      options: [
        { value: null, text: 'year' },
        { value: 'a', text: '2020' },
        { value: 'b', text: '2019' },
        { value: 'd', text: '2018' },
      ],
      selected: null,
      company: '',
      file: null,
    };
  },
  beforeCreate() {
    document.querySelector('body').setAttribute('style', 'background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);background-size: 400% 400%;animation: gradient 15s ease infinite;');
    // document.querySelector('body').animate
    console.log('hi');
    const cssAnimation = document.createElement('style');
    cssAnimation.type = 'text/css';
    const rules = document.createTextNode('@-webkit-keyframes gradient {' +
        '0% { background-position: 0% 50%; }' +
        '50% { background-position: 100% 50%;}' +
        '100% { background-position: 0% 50%; }' +
        '}');
    cssAnimation.appendChild(rules);
    document.getElementsByTagName('head')[0].appendChild(cssAnimation);
  },
  beforeDestroy() {
    document.querySelector('body').setAttribute('style', 'background: white;background-size: 100% 100%;');
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
  },
  watch: {

  },
  props: ['title'],
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
body {
    background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;
    width: 100%;
    height: 100%;
}

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
.company-input {
    width: 8rem;
    margin-right: 1rem;
}
.file-input {
    width: 15rem;
    margin-right: 1rem;
}
.submit-btn {
    height: 2.5rem;
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
</style>

