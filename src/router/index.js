import Vue from 'vue'
import VueRouter from 'vue-router'
import Tool from '../views/Tool.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Tool',
    component: Tool,
    meta: {
      title: "Transaction Tool"
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next)=> {
  document.title = "Transaction Tool";
  next();
})
export default router
