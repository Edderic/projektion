// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
/*jshint esversion: 6 */
// require("@rails/ujs").start();
// require("turbolinks").start();
require("@rails/activestorage").start();

import Vue from 'vue';
import AppBase from '../components/app_base.vue';
import ProjectStore from '../project_store.js';
import router from '../router';

document.addEventListener('DOMContentLoaded', () => {
  const app = new Vue({
    router,
    el: '#app',
    render: h => h(AppBase),
    store: ProjectStore,
  });
});

//
// Uncomment to copy all static images under ../images to the output folder and reference
// them with the image_pack_tag helper in views (e.g <%= image_pack_tag 'rails.png' %>)
// or the `imagePath` JavaScript helper below.
//
// const images = require.context('../images', true)
// const imagePath = (name) => images(name, true)
