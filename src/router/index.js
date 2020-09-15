import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
import HomePage from '@/components/HomePage';
import BarChart from '@/components/BarChart';
import DependencyGraph from '@/components/DependencyGraph';
import HeatMap from '@/components/HeatMap';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(Router);
Vue.config.devtools = true;

Vue.use(BootstrapVue);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HonePage',
      component: HomePage,
    },
    {
      path: '/finance-report',
      name: 'HelloWorld',
      component: HelloWorld,
    },
    // {
    //   path: '/',
    //   name: 'BarChart',
    //   component: BarChart,
    // },
    // {
    //   path: '/',
    //   name: 'DependencyGraph',
    //   component: DependencyGraph,
    // },
    // {
    //   path: '/',
    //   name: 'HeatMap',
    //   component: HeatMap,
    // },
  ],
});
