'use strict';
var path = require('path');
var fs = require('fs');

if (!/\.json/.test(process.argv[2])) {
  return process.stdout.write('Requires json input file\n');
}

if (!process.argv[3]) {
  return process.stdout.write('Requires output file\n');
}

var configFile = path.resolve(process.argv[2]);
var outputFile = path.resolve(process.argv[3]);

var json = require(configFile);

var stream = fs.createWriteStream(outputFile)

function camelToSnakeCase(str) {
  return str.replace(/[A-Z]/g, '\_$&');
}

for (var key in json) {
  if (typeof json[key] == 'string') {
    var exportString = 'export ' + camelToSnakeCase(key).toUpperCase() + '=' + json[key] + '\n';
    stream.write(exportString);
  }
}

