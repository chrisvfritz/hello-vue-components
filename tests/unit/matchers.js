// See these docs for details on Jest's matcher utils:
// https://facebook.github.io/jest/docs/en/expect.html#thisutils

const _ = require('lodash')
const customMatchers = {}

customMatchers.toBeAComponent = function(options) {
  if (isAComponent()) {
    return {
      message: () =>
        `expected ${this.utils.printReceived(
          options
        )} not to be a Vue component`,
      pass: true
    }
  } else {
    return {
      message: () =>
        `expected ${this.utils.printReceived(
          options
        )} to be a valid Vue component, exported from a .vue file`,
      pass: false
    }
  }

  function isAComponent() {
    return _.isPlainObject(options) && typeof options.render === 'function'
  }
}

// https://facebook.github.io/jest/docs/en/expect.html#expectextendmatchers
global.expect.extend(customMatchers)
