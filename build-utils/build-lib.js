const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const ncp = require('ncp').ncp

// Update the index file
require('./update-index-file')

// Get the names of all components in the src directory
const componentNames = require('./component-names')

// Get the binary for vue-cli-service
const vueCliServicePath = path.resolve(
  __dirname,
  '../node_modules/.bin/vue-cli-service'
)

// Build the main lib, with all components packaged into a plugin
execSync(
  `${vueCliServicePath} build src/index.js --target lib --name index --dest dist/`
)
// Rename the CommonJS build so that it can be imported with
// hello-vue-components/dist
renameIndex('dist')

// For each component in the src directory...
for (const componentName of componentNames) {
  // Build the component individually
  execSync(
    `${vueCliServicePath} build src/${componentName}.vue --target lib --name index --dest dist/${componentName}/`
  )

  // Rename the CommonJS build so that it can be imported with
  // hello-vue-components/dist/ComponentName
  renameIndex(`dist/${componentName}`)
}

if (process.env.E2E) {
  ncp(
    path.resolve(__dirname, '../dist'),
    path.resolve(__dirname, '../tests/e2e/demo/public/browser/dist'),
    error => {
      if (error) console.error(error)
    }
  )
  const nodeModulesDir = path.resolve(
    __dirname,
    '../node_modules/hello-vue-components'
  )
  if (!fs.existsSync(nodeModulesDir)) {
    fs.mkdirSync(nodeModulesDir)
  }
  ncp(
    path.resolve(__dirname, '../dist'),
    path.resolve(__dirname, '../node_modules/hello-vue-components/dist'),
    error => {
      if (error) console.error(error)
    }
  )
  ncp(
    path.resolve(__dirname, '../src'),
    path.resolve(__dirname, '../node_modules/hello-vue-components/src'),
    error => {
      if (error) console.error(error)
    }
  )
  ncp(
    path.resolve(__dirname, '../package.json'),
    path.resolve(
      __dirname,
      '../node_modules/hello-vue-components/package.json'
    ),
    error => {
      if (error) console.error(error)
    }
  )
}

function renameIndex(directory) {
  fs.renameSync(
    path.resolve(__dirname, `../${directory}/index.common.js`),
    path.resolve(__dirname, `../${directory}/index.js`)
  )
  fs.renameSync(
    path.resolve(__dirname, `../${directory}/index.common.js.map`),
    path.resolve(__dirname, `../${directory}/index.js.map`)
  )
}
