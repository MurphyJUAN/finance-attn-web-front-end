<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'App',
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Assistant:wght@400;600&display=swap" rel="stylesheet');
@import 'vue-select/dist/vue-select.css';
* {
  box-sizing: border-box;
}
html, body {
  margin: 0px;
  padding: 0px;
}
#app {
  font-family: 'Assistant', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  /* background: rgb(249,247,235); */
  /* margin-top: 10px; */
  overflow-x: hidden;
}
.company-input-home {
    /* width: 8rem; */
    margin-right: 1rem;
    /* border: 1px solid #ced4da; */
    /* border-radius: 0.25rem; */
    height: 2.5rem;
    min-width: 350px;
    text-align: center;
    cursor: pointer;
}
.company-input-home .vs__dropdown-toggle {
  height: 2.5rem;
  cursor: pointer;
}
.company-input-home .vs__dropdown-toggle,
.company-input-home .vs__dropdown-menu {
  background: white;
  min-width: 350px;
  cursor: pointer;
}
.company-input-home .vs__selected-options,
.company-input-home .vs__search {
  cursor: pointer;
}
.company-input-home .vs__dropdown-menu {
  min-width: 350px;
}
</style>
