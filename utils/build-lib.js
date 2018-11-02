const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const ncp = require('ncp').ncp

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

// Get all the files in the src directory
const componentFileNames = fs.readdirSync(path.resolve(__dirname, '../src'))

// For each component in the src directory...
for (const componentFileName of componentFileNames) {
  // Skip the file if it's not an SFC
  if (!/\.vue$/.test(componentFileName)) continue

  // Get the name of the component from the file name
  const componentName = componentFileName.replace(/\.\w+$/, '')

  // Build the component individually
  execSync(
    `${vueCliServicePath} build src/${componentName}.vue --target lib --name index --dest dist/${componentName}/`
  )

  // Rename the CommonJS build so that it can be imported with
  // hello-vue-components/dist/ComponentName
  renameIndex(`dist/${componentName}`)
}

ncp(
  path.resolve(__dirname, '../dist'),
  path.resolve(__dirname, '../public/browser/dist'),
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
  path.resolve(__dirname, '../node_modules/hello-vue-components/package.json'),
  error => {
    if (error) console.error(error)
  }
)

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
