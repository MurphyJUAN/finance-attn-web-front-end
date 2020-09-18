// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
// import VueAxios from 'vue-axios';
// import axios from 'axios';
import App from './App';
import router from './router';
import vSelect from 'vue-select';

Vue.component('v-select', vSelect);


// Vue.use(VueAxios, axios);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});
