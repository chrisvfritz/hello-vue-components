import HelloA from './HelloA'
import HelloB from './HelloB'

// Export components individually
export { HelloA, HelloB }

// What should happen if the user installs the library as a plugin
const install = Vue => {
  Vue.component('HelloA', HelloA)
  Vue.component('HelloB', HelloB)
}

// Export the library as a plugin
export default { install }
