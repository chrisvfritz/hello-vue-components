const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const vueCliServicePath = path.resolve(__dirname, '../node_modules/.bin/vue-cli-service')

execSync(`${vueCliServicePath} build src/lib.js --target lib --name hello-vue-components --dest dist/`)

const componentFileNames = fs.readdirSync(path.resolve(__dirname, '../src/components'))

for (const componentFileName of componentFileNames) {
  const componentName = componentFileName.replace(/^\.\//, '').replace(/\.\w+$/, '')
  execSync(`${vueCliServicePath} build src/components/${componentName}.vue --target lib --name index --dest dist/${componentName}/`)
  renameIndex(`dist/${componentName}`)
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
