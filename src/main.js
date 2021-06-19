import Vue from 'vue'
import App from './App.vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import AsyncComputed from 'vue-async-computed'
import { library } from '@fortawesome/fontawesome-svg-core';
// internal icons
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faPlus, faMinus);
Vue.component('vue-fontawesome', FontAwesomeIcon);

Vue.use(Buefy, {
  defaultIconComponent: 'vue-fontawesome',
  defaultIconPack: 'fas',
});
Vue.use(AsyncComputed)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
