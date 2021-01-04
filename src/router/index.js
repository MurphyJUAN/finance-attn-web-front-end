import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
import HomePage from '@/components/HomePage';
import BarChart from '@/components/BarChart';
import DependencyGraph from '@/components/DependencyGraph';
import HeatMap from '@/components/HeatMap';
import SingleReport from '@/components/SingleReport';
import SelectReport from '@/components/SelectReport';
import NewNavBar from '@/components/NewNavBar';
import NewHomePage from '@/components/NewHomePage';
import CompareReport from '@/components/CompareReport';
import Demo from '@/components/Demo';
import Loading from '@/components/Loading';
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
      path: '/home',
      name: 'NewHomePage',
      component: NewHomePage,
    },
    {
      path: '/finance-report',
      name: 'HelloWorld',
      component: HelloWorld,
    },
    {
      path: '/test',
      name: 'Loading',
      component: Loading,
    },
    {
      path: '/demo',
      name: 'Demo',
      component: Demo,
    },
    {
      path: '/single-report',
      name: 'SingleReport',
      component: SingleReport,
    },
    {
      path: '/select-report',
      name: 'SelectReport',
      component: SelectReport,
    },
    {
      path: '/new-nav',
      name: 'NewNavBar',
      component: NewNavBar,
    },
    {
      path: '/compare-report',
      name: 'CompareReport',
      component: CompareReport,
    },
    {
      path: '/new-home',
      name: 'NewHomePage',
      component: NewHomePage,
    },
  ],
});
