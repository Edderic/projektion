import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './components/app';
import ProjectsList from './components/projects_list';

Vue.use(VueRouter);

export const routes = [
  {
    name: 'projectsList',
    path: '/projects',
    component: ProjectsList
  },
  {
    name: 'savedProject',
    path: '/projects/:project_uuid',
    component: App
  },
];

export default new VueRouter({
  routes,
  mode: 'history'
});
