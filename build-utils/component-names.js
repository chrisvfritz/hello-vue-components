const fs = require('fs')
const path = require('path')

// Get all the .vue files in the src directory
const componentFileNames = fs
  .readdirSync(path.resolve(__dirname, '../src'))
  .filter(componentFileName => /\.vue$/.test(componentFileName))

// Get the names of the components from the file names
module.exports = componentFileNames.map(componentFileName =>
  componentFileName.replace(/\.\w+$/, '')
)
