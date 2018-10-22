import HelloA from './components/HelloA'
import HelloB from './components/HelloB'

// Export components individually
export {
  HelloA,
  HelloB
}

// What should happen if the user installs the library as a plugin
const install = Vue => {
  Vue.component('HelloA', HelloA)
  Vue.component('HelloB', HelloB)
}

// If a global Vue is available (e.g. from dropping Vue in
// as a script tag), then automatically install.
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

// Export the library as a plugin
export default { install }
