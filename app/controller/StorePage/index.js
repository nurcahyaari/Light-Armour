'use strict'

let allModules = {};
require('fs').readdirSync(__dirname + '/').forEach(function(file) {
  if (file.match(/\.js$/) !== null && file !== 'index.js') {
    let name = file.replace('.js', '');
    allModules[name] = require('../StorePage/' + file);
  }
});

module.exports = allModules;