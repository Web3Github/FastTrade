import Vue from 'vue'
import App from './App.vue'
import AsyncComputed from 'vue-async-computed'
import { library } from '@fortawesome/fontawesome-svg-core';
// Buefy
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
// internal icons
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import router from './router'

library.add(faPlus, faMinus);
Vue.component('vue-fontawesome', FontAwesomeIcon);

Vue.use(Buefy, {
  defaultIconComponent: 'vue-fontawesome',
  defaultIconPack: 'fas',
});
Vue.use(AsyncComputed)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
