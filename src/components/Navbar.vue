

<template>
  <div>
  <b-navbar >
    <b-navbar-nav class="nav-outer">
      <b-nav-item href="#">
          <img class="logo" src="../assets/lg_black.png">
      </b-nav-item>

      <!-- Navbar dropdowns -->
      <div class="nav-input-block" style="margin-top:2vh;">
        <b-nav-item-dropdown text="year" right class="year-input">
            <b-dropdown-item href="#">2020</b-dropdown-item>
            <b-dropdown-item href="#">2019</b-dropdown-item>
            <b-dropdown-item href="#">2018</b-dropdown-item>
            <b-dropdown-item href="#">2017</b-dropdown-item>
        </b-nav-item-dropdown>
        <b-form-input class="company-input" v-model="company" placeholder="Company"></b-form-input>
        <b-form-group class="file-input">
            <b-form-file
            id="file-default"
            v-model="file"></b-form-file>
        </b-form-group>
        <b-button type="submit" style="background-color:#737373;" class="submit-btn">Submit</b-button>
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

export default {
  name: 'NavBar',
  data() {
    return {
      id: shortid.generate(),
      company: '',
      file: null,
    };
  },
  mounted() {
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
</style>

