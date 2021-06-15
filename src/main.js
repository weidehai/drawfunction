import Vue from 'vue'
import Index from './views/index'
import WoneUI from './components/index'
import './assets/css/base.css'


Vue.use(WoneUI)

new Vue({
  render: h => h(Index),
}).$mount('#app')
