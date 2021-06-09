import Vue from 'vue'
import Index from './views/index'
import './assets/css/base.css'

new Vue({
  render: h => h(Index),
}).$mount('#app')
