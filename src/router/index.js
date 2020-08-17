import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
import BarChart from '@/components/BarChart';
import DependencyGraph from '@/components/DependencyGraph';

Vue.use(Router);
Vue.config.devtools = true;

export default new Router({
  routes: [
    {
      path: '/',
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
  ],
});
