import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'

import './common/stylus/index.styl'

Vue.config.productionTip = false;
/* 使用axios */
Vue.prototype.axios = axios;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});
