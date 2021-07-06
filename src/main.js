import Vue from 'vue'
import Index from './views/index'
import {WoneUI} from 'woneui'
import './assets/css/base.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

Vue.use(WoneUI)

library.add(faBars)

Vue.component('font-awesome-icon', FontAwesomeIcon)


new Vue({
  render: h => h(Index),
}).$mount('#app')
