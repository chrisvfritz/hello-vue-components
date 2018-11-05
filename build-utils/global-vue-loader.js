const { interpolateName } = require('loader-utils')

// Modify the export of every .vue file so that the
// component is automatically installed if a global
// Vue is available (e.g. from dropping Vue in as a
// script tag).
module.exports = function(content) {
  const componentName = interpolateName(this, '[name]', { content })
  return content.replace(
    'export default',
    `if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component('${componentName}', component.exports)
}
export default`
  )
}
