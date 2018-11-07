import Vue from 'vue'
import App from './App'

if (process.env.VUE_APP_E2E) {
  if (window.__e2e_lib) {
    Vue.use(require('hello-vue-components').default)
  } else if (window.__e2e_components) {
    Vue.component('HelloA', require('hello-vue-components/dist/HelloA'))
    Vue.component('HelloB', require('hello-vue-components/dist/HelloB'))
  } else if (window.__e2e_src_lib) {
    Vue.use(require('hello-vue-components/src').default)
  } else if (window.__e2e_src_components) {
    Vue.component('HelloA', require('hello-vue-components/src/HelloA').default)
    Vue.component('HelloB', require('hello-vue-components/src/HelloB').default)
  }
} else {
  // Install the plugin directly from src in development
  Vue.use(require('../../../../src').default)
}

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
