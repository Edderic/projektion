import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './components/app';

Vue.use(VueRouter);

export const routes = [
  {
    name: 'new',
    path: '/',
    component: App
  },
  {
    name: 'savedProject',
    path: '/:project_id',
    component: App
  },
];

export default new VueRouter({
  routes,
  mode: 'history'
});
