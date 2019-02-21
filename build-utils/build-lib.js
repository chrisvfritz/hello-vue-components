/* eslint-disable no-console */
const fs = require('fs-extra')
const path = require('path')
const { execSync } = require('child_process')
const libConfig = require('../lib')
const _ = require('lodash')
const parseComponent = require('@vue/component-compiler-utils').parse

console.info("🚀 Let's build this thing!")

// Update the index file
console.info('📝 Updating index file')
require('./update-index-file')

// Get the names of all components in the src directory
const componentNames = require('./component-names')

// Get the binary for vue-cli-service
const vueCliServicePath = getPath('../node_modules/.bin/vue-cli-service')

fs.emptyDirSync(getPath('../packages'))

// Build the main lib, with all components packaged into a plugin
console.info('🏗 Building main library')
execSync(
  `${vueCliServicePath} build src/index.js --target lib --name index --dest dist/`
)
// Rename the CommonJS build so that it can be imported with
// ${libConfig}/dist
renameIndex()

// For each component in the src directory...
for (const componentName of componentNames) {
  // Build the component individually
  console.info(`🏗 Building ${componentName}`)
  execSync(
    `${vueCliServicePath} build src/${componentName}.vue --target lib --name index --dest dist/${componentName}/`
  )

  // Rename the CommonJS build so that it can be imported with
  // ${libConfig}/dist/ComponentName
  renameIndex(componentName)
}

if (process.env.VUE_APP_E2E) {
  const packagesDir = getPath('../packages')
  fs.copySync(packagesDir, getPath('../tests/e2e/fixtures/public/packages'))
  fs.readdirSync(packagesDir).forEach(packageDirName => {
    fs.copySync(
      path.resolve(packagesDir, packageDirName),
      getPath(`../node_modules/${packageDirName}`)
    )
  })
}

function renameIndex(componentName) {
  const builds = [
    {
      type: 'common',
      dest: 'cjs'
    },
    {
      type: 'umd'
    },
    {
      type: 'umd.min'
    }
  ]

  const packageName = _.compact([
    libConfig.name,
    _.kebabCase(componentName)
  ]).join('.')
  const destPackageFolder = path.resolve(
    __dirname,
    `../packages/${packageName}`
  )

  for (const build of builds) {
    const oldIndexPath = path.resolve(
      __dirname,
      `../dist/${componentName || ''}/index.${build.type}.js`
    )
    const [buildTypeBase, buildModifier] = build.type.split('.')
    const destFolder = path.resolve(
      destPackageFolder,
      build.dest != null ? build.dest : buildTypeBase
    )
    const newIndexPath = path.resolve(
      destFolder,
      `index${buildModifier ? '.' + buildModifier : ''}.js`
    )
    if (!fs.existsSync(destPackageFolder)) {
      fs.mkdirSync(destPackageFolder)
    }
    if (!fs.existsSync(destFolder)) {
      fs.mkdirSync(destFolder)
    }
    const oldMapPath = oldIndexPath + '.map'
    const newMapPath = newIndexPath + '.map'

    fs.renameSync(oldIndexPath, newIndexPath)
    fs.renameSync(oldMapPath, newMapPath)
    fs.writeFileSync(
      newIndexPath,
      fs
        .readFileSync(newIndexPath, { encoding: 'utf8' })
        .replace(path.basename(oldMapPath), path.basename(newMapPath))
    )
  }

  fs.copySync(getPath('../src'), path.resolve(destPackageFolder, 'src'), {
    filter: filePath => {
      return !/\.unit\.js$/.test(filePath)
    }
  })
  fs.writeFileSync(
    path.resolve(destPackageFolder, 'index.js'),
    `\
export * from './src${componentName ? '/' + componentName + '.vue' : ''}'
`
  )

  let description = libConfig.description
  let example
  if (componentName) {
    const srcFilePath = getPath(`../src/${componentName}.vue`)
    const result = parseComponent({
      source: fs.readFileSync(srcFilePath, { encoding: 'utf8' }),
      filename: srcFilePath,
      compiler: require('vue-template-compiler')
    })
    description = JSON.parse(
      result.customBlocks.find(block => block.type === 'meta').content
    ).description
    example = result.customBlocks
      .find(block => block.type === 'example')
      .content.trim()
  }
  const packageConfig = {
    name: packageName,
    moduleName: componentName || _.upperFirst(_.camelCase(packageName)),
    description,
    example
  }
  console.info(`📝 Writing package.json for ${packageConfig.moduleName}`)
  fs.writeFileSync(
    path.resolve(destPackageFolder, 'package.json'),
    generatePackageJson(packageConfig)
  )
  console.info(`🤓 Writing readme file for ${packageConfig.moduleName}`)
  fs.writeFileSync(
    path.resolve(destPackageFolder, 'README.md'),
    generateReadme(packageConfig)
  )
  console.info(`☝️ Adding license for ${packageConfig.moduleName}`)
  fs.writeFileSync(
    path.resolve(destPackageFolder, 'LICENSE'),
    `\
The MIT License (MIT)

Copyright (c) 2018-present, ${libConfig.author.name}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
`
  )

  if (componentName) {
    const componentPackageFolder = path.resolve(
      __dirname,
      `../packages/${libConfig.name}/${componentName}`
    )
    fs.copySync(destPackageFolder, componentPackageFolder, {
      filter: filePath => {
        return !/(LICENSE|README\.md|src)$/.test(filePath)
      }
    })
    fs.writeFileSync(
      path.resolve(componentPackageFolder, 'index.js'),
      `\
export * from '${path.join('../src', componentName || '')}'
`
    )
  }
}

function generatePackageJson(package) {
  const repoName = libConfig.author.github + '/' + libConfig.name
  return JSON.stringify(
    {
      name: package.name,
      description: package.description,
      author: libConfig.author,
      license: 'MIT',
      homepage: `https://www.npmjs.com/package/${package.name}`,
      repository: {
        type: 'git',
        url: `git+https://github.com/${repoName}.git`
      },
      bugs: {
        url: `https://github.com/${repoName}/issues`
      },
      module: 'index.js',
      main: 'cjs/index.js',
      unpkg: 'umd/index.min.js',
      jsdelivr: 'umd/index.min.js',
      peerDependencies: libConfig.peerDependencies
    },
    null,
    2
  )
}

function generateReadme(package) {
  if (!package.example)
    return `
# ${package.name}

> ${package.description}

## Installation

### Directly in the browser

Drop the library in with a \`<script>\` tag alongside Vue:

\`\`\`html
<div id="app">
<!-- ... use components here ... -->
</div>

<script src="https://unpkg.com/vue"></script>
<script src="https://unpkg.com/${package.name}"></script>
<script>
new Vue({ el: '#app' })
</script>
\`\`\`

Or, if you only want to use a small subset of components, drop them in individually:

\`\`\`html
<div id="app">
<!-- ... use component here ... -->
</div>

<script src="https://unpkg.com/vue"></script>
<script src="https://unpkg.com/${package.name}/HelloA"></script>
<script>
new Vue({ el: '#app' })
</script>
\`\`\`

### In a module system

Install the library with NPM:

\`\`\`bash
npm install ${package.name}
\`\`\`

Then either import the library and either globally register all components with:

\`\`\`js
import ${package.moduleName} from '${package.name}'

Vue.use(${package.moduleName})
\`\`\`

or import and locally register a single component with:

\`\`\`js
import { HelloA } from '${package.name}'

export default {
components: { ${package.moduleName} }
}
\`\`\`

#### Individually packaged components

If you only want to use a small subset of components, import only individually packaged components to reduce the size of your application:

\`\`\`js
import HelloA from 'hello-vue-components/HelloA'
import HelloB from 'hello-vue-components/HelloB'
\`\`\`
`

  return `\
# ${package.name}

> ${package.description}

## Installation

### Directly in the browser

Drop the component in with a \`<script>\` tag alongside Vue:

\`\`\`html
<div id="app">
<!-- ... use component here ... -->
</div>

<script src="https://unpkg.com/vue"></script>
<script src="https://unpkg.com/${package.name}"></script>
<script>
new Vue({ el: '#app' })
</script>
\`\`\`

### In a module system

Install the component with NPM:

\`\`\`bash
npm install ${package.name}
\`\`\`

Then import the component:

\`\`\`js
import ${package.moduleName} from '${package.name}'
\`\`\`

And either globally register it for use in all components:

\`\`\`js
Vue.component(${package.moduleName}, '${package.name}')
\`\`\`

or locally register it for use in an individual component:

\`\`\`js
export default {
components: { ${package.moduleName} }
}
\`\`\`

## Usage

\`\`\`html
${package.example}
\`\`\`
`
}

function getPath(...args) {
  return path.resolve(__dirname, ...args)
}
