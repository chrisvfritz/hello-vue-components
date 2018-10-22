import Vue from 'vue'
import App from './App'
import HelloVueComponents from './lib'

Vue.use(HelloVueComponents)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
