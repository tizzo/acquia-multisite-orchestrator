'use strict';
const fs = require('fs');

module.exports = {};

const files = fs.readdirSync(__dirname);
for (let file of files) {
  if (__dirname + '/' + file !== __filename && file.substr(-3) === '.js' && file.indexOf('.') !== 0 && !fs.statSync(__dirname + '/' + file).isDirectory()) {
    const name = file.substr(0, file.length - 3);
    module.exports[name] = require('./' + name);
  }
}
